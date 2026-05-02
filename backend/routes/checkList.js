const router = require("express").Router()

// Models
const CheckList = require("../models/CheckList")
const CheckGroup = require("../models/CheckGroup")

// Middleware
const checkIfAuthenticated = require("../middleware/auth-middleware")

function slugify(s) {
    return String(s)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

/**
 * route('/').get() Return all checklists; ?active=true excludes archived
 */
router.route("/").get(checkIfAuthenticated, (req, res) => {
    const filter = req.query.active === "true" ? { archived: { $ne: true } } : {}
    CheckList.find(filter)
        .populate("required_checks.check_group_id")
        .then((list) => res.json(list))
        .catch((err) =>
            res.status(400).json({
                code: 400,
                message: err.message
            })
        )
})

/**
 * route('/').post() Create a new checklist
 * Body: { name, sections: [{ name, checks: [{ title }] }] }
 */
router.route("/").post(checkIfAuthenticated, async (req, res) => {
    const { name, sections } = req.body

    if (!name || !sections) {
        return res.status(400).json({ code: 400, message: "name and sections are required" })
    }

    try {
        const groups = await Promise.all(
            sections.map((section) =>
                CheckGroup.create({
                    name: section.name,
                    checks: section.checks.map((c) => ({ title: c.title, code: slugify(c.title) }))
                })
            )
        )

        const checklist = await new CheckList({
            name,
            required_checks: groups.map((g) => ({ check_group_id: g._id }))
        }).save()

        const populated = await CheckList.findById(checklist._id).populate("required_checks.check_group_id")
        res.json(populated)
    } catch (err) {
        res.status(400).json({ code: 400, message: err.message })
    }
})

/**
 * route('/:id').put() Update a checklist
 * Always creates NEW CheckGroups to preserve historical record integrity.
 * Body: { name, sections: [{ name, checks: [{ title }] }] }
 */
router.route("/:id").put(checkIfAuthenticated, async (req, res) => {
    const { name, sections } = req.body
    const { id } = req.params

    if (!name || !sections) {
        return res.status(400).json({ code: 400, message: "name and sections are required" })
    }

    try {
        const existing = await CheckList.findById(id)
        if (!existing) return res.status(404).json({ code: 404, message: "Checklist not found" })

        const groups = await Promise.all(
            sections.map((section) =>
                CheckGroup.create({
                    name: section.name,
                    checks: section.checks.map((c) => ({ title: c.title, code: slugify(c.title) }))
                })
            )
        )

        const updated = await CheckList.findByIdAndUpdate(
            id,
            {
                name,
                required_checks: groups.map((g) => ({ check_group_id: g._id }))
            },
            { new: true }
        ).populate("required_checks.check_group_id")

        res.json(updated)
    } catch (err) {
        res.status(400).json({ code: 400, message: err.message })
    }
})

/**
 * route('/:id/archive').patch() Archive a checklist (soft delete)
 */
router.route("/:id/archive").patch(checkIfAuthenticated, async (req, res) => {
    const { id } = req.params

    try {
        const updated = await CheckList.findByIdAndUpdate(id, { archived: true }, { new: true })
        if (!updated) return res.status(404).json({ code: 404, message: "Checklist not found" })
        res.json(updated)
    } catch (err) {
        res.status(400).json({ code: 400, message: err.message })
    }
})

module.exports = router
