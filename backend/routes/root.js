const router = require("express").Router()
const User = require("../models/User")

/**
 * route('/').get() return message in root route
 */
// router.route("/").get((req, res) => {
//     res.json({ message: "You are in the root route." })
// })

/**
 * route('/login').post() login a user
 */
router.route("/login").post(async (req, res) => {
    const { email, password } = req.body

    try {
        // Validation
        if (!email) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "Email cannot be blank."
            })
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                code: 400,
                message: "Password cannot be blank."
            })
        }

        // email = email.toLowerCase().trim()
        const user = await User.findOne({ email })

        // No user found in DB
        if (!user) {
            res.status(400).json({
                success: false,
                code: 400,
                message: "No user found with this email!"
            })
        }

        // Validate password
        if (!user.validPassword(password)) {
            // Wrong password
            return res.status(401).json({
                code: 401,
                success: false,
                message: "Authentication failed. Wrong password."
            })
        }

        const token = await user.newAuthToken()
        
        return res.status(200).json({
            code: 200,
            success: true,
            user,
            token
        })
    } catch (error) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: error.message
        })
    }
})

module.exports = router
