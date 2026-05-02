const router = require("express").Router()

// Models
const User = require("../models/User")
const Plant = require("../models/Plant")
const CheckList = require("../models/CheckList")

// Middleware
const checkIfAuthenticated = require("../middleware/auth-middleware")

/**
 * route('/:id').get() return single user
 */
router.route("/:id").get(checkIfAuthenticated, (req, res) => {
    const user_id = req.params.id
    const user_id_token = req.decoded._id

    if (user_id !== user_id_token) {
        return res.status(401).json({
            code: 401,
            message: "Unauthorised! You are not able to access other users data."
        })
    } else {
        User.findOne({
            _id: user_id
        })
            .populate("plant_id vehicle.check_list_id")
            .then((user) => res.json(user))
            .catch((err) =>
                res.status(400).json({
                    code: 400,
                    message: err.message
                })
            )
    }
})

/**
 * route('/:id').put() update a single user's vehicle and/or plant
 */
router.route("/:id").put(checkIfAuthenticated, async (req, res) => {
    try {
        if (req.params.id !== req.decoded._id) {
            return res.status(401).json({ code: "UNAUTHORIZED", message: "Unauthorized" });
        }

        const { vehicle, plant_id } = req.body;

        // Build explicit $set whitelist — never touch check_list_id, password, email, is_admin, tokens
        const $set = {};

        if (vehicle) {
            const reg = typeof vehicle.registration_number === "string" ? vehicle.registration_number.trim() : null;
            const make = typeof vehicle.make === "string" ? vehicle.make.trim() : null;
            const model = typeof vehicle.model === "string" ? vehicle.model.trim() : null;

            if (reg !== null) {
                if (!reg) return res.status(400).json({ code: "VALIDATION", message: "Registration number cannot be empty" });
                $set["vehicle.registration_number"] = reg;
            }
            if (make !== null) {
                if (!make) return res.status(400).json({ code: "VALIDATION", message: "Make cannot be empty" });
                $set["vehicle.make"] = make;
            }
            if (model !== null) {
                if (!model) return res.status(400).json({ code: "VALIDATION", message: "Model cannot be empty" });
                $set["vehicle.model"] = model;
            }
        }

        if (plant_id !== undefined) {
            if (!plant_id) return res.status(400).json({ code: "VALIDATION", message: "Plant is required" });
            const mongoose = require("mongoose");
            if (!mongoose.Types.ObjectId.isValid(plant_id)) {
                return res.status(400).json({ code: "VALIDATION", message: "Invalid plant" });
            }
            const Plant = require("../models/Plant");
            const plantExists = await Plant.exists({ _id: plant_id });
            if (!plantExists) return res.status(400).json({ code: "VALIDATION", message: "Plant not found" });
            $set.plant_id = plant_id;
        }

        if (Object.keys($set).length === 0) {
            return res.status(400).json({ code: "VALIDATION", message: "No valid fields to update" });
        }

        // Check if user has a vehicle subdoc before partial $set — if not, require all vehicle fields
        const existing = await User.findById(req.params.id).lean();
        if (!existing) return res.status(404).json({ code: "NOT_FOUND", message: "User not found" });

        if (!existing.vehicle && Object.keys($set).some(k => k.startsWith("vehicle."))) {
            const required = ["vehicle.registration_number", "vehicle.make", "vehicle.model"];
            const missing = required.filter(f => !$set[f]);
            if (missing.length > 0) {
                return res.status(400).json({ code: "VALIDATION", message: "Vehicle registration, make and model are all required when setting vehicle for the first time" });
            }
        }

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { $set },
            { new: true, runValidators: true }
        ).populate("plant_id").populate("vehicle.check_list_id");

        return res.status(200).json(updated);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ code: "DUPLICATE", message: "Registration number already in use" });
        }
        return res.status(400).json({ code: "ERROR", message: err.message });
    }
});

/**
 * route('/:id/checklist').get() returns the checklist for a single user
 */
router.route("/:id/checklist").get(checkIfAuthenticated, async (req, res) => {
    const user_id = req.params.id
    const user_id_token = req.decoded._id

    if (user_id !== user_id_token) {
        return res.status(401).json({
            code: 401,
            message: "Unauthorised! You are not able to access other users data."
        })
    } else {
        let userChecklist = await User.findOne({
            _id: user_id
        }).select("vehicle.check_list_id")
        let checkListId = userChecklist.vehicle.check_list_id

        let checkList = await CheckList.findOne({
            _id: checkListId
        }).populate("required_checks.check_group_id")

        res.json({
            checkList
        })
    }
})

/**
 * route('/').post() create a new user
 */
router.route("/").post(async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.newAuthToken()
        res.status(201).send({
            user,
            token
        })
    } catch (e) {
        res.status(400).json({
            error: e.message
        })
    }
})

module.exports = router
