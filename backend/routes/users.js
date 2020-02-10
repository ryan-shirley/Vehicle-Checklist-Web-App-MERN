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

    // ********* TODO: Validate user is same as id or is admin *********

    User.findOne({ _id: user_id })
        .populate("plant_id vehicle.check_list_id")
        .then(user => res.json(user))
        .catch(err =>
            res.status(400).json({
                code: 400,
                message: err.message
            })
        )
})

/**
 * route('/:id/checklist').get() returns the checklist for a single user
 */
router.route("/:id/checklist").get(checkIfAuthenticated, async (req, res) => {
    const user_id = req.params.id

    // ********* TODO: Validate user is same as id or is admin *********

    let userChecklist = await User.findOne({ _id: user_id }).select(
        "vehicle.check_list_id"
    )
    let checkListId = userChecklist.vehicle.check_list_id

    let checkList = await CheckList.findOne({ _id: checkListId }).populate(
        "required_checks.check_group_id"
    )

    res.json({ checkList })
})

/**
 * route('/').post() create a new user
 */
router.route("/").post(async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.newAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).json({ error: e.message })
    }
})

module.exports = router
