const jwt = require("jsonwebtoken")

const checkIfAuthenticated = async (req, res, next) => {
    try {
        const token = req
            .header("Authorization")
            .replace("Bearer", "")
            .trim()
        const decoded = jwt.verify(token, process.env.JWT_VERIFY)

        req.decoded = decoded
    } catch (error) {
        return res.status(401).json({ error: "You are not authenticated!" })
    }

    return next()
}

module.exports = checkIfAuthenticated
