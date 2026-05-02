const functions = require("firebase-functions")
const jwt = require("jsonwebtoken")

const checkIfAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization")
        if (!authHeader) {
            return res.status(401).json({ error: "You are not authenticated!" })
        }
        const token = authHeader.replace("Bearer", "").trim()
        const decoded = jwt.verify(token, functions.config().jwt.verify)

        req.decoded = decoded
    } catch (_error) {
        return res.status(401).json({ error: "You are not authenticated!" })
    }

    return next()
}

module.exports = checkIfAuthenticated
