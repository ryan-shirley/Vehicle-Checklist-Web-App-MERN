const router = require("express").Router()

// AWS File Uplaod
const multer = require("multer")
const AWS = require("aws-sdk")
const fs = require("fs")

// Models
const User = require("../models/User")

// Middleware
const checkIfAuthenticated = require("../middleware/auth-middleware")

// Configure Disk Storage
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

// Setup AWS S3
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION
})
const s3 = new AWS.S3()

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

/**
 * route('/upload').post() Uploads a file to AWS
 */
router.route("/upload").post([checkIfAuthenticated, upload.single("image")], (req, res) => {
    const user_id = req.decoded._id
    const source = req.file.path
    const targetName = req.file.filename

    let now = new Date();
    let y = now.getFullYear();
    let m = now.getMonth() + 1;
    let d = now.getDate();
    let date = '' + y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;

    // Prepare file to be uploaded
    fs.readFile(source, (err, filedata) => {
        if (!err) {
            const filePath = `${user_id}/${date}/${targetName}`
            const putParams = {
                Bucket: process.env.AWS_BUCKET,
                Key: filePath,
                Body: filedata
            }

            // Uploade file
            s3.putObject(putParams, (err, data) => {
                if (err) {
                    return res.status(500).json({
                        code: 500,
                        message: err
                    })
                } else {
                    // Remove file from local server
                    fs.unlink(source, fsErr => {
                        if (fsErr) return console.log(fsErr)
                    })

                    return res.status(201).json({
                        code: 201,
                        path: process.env.AWS_URL + filePath
                    })
                }
            })
        } else {
            console.log({ err: err })
            return res.status(500).json({
                code: 500,
                message: err.message
            })
        }
    })
})

module.exports = router
