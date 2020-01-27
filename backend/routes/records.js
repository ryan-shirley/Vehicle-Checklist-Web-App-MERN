const router = require('express').Router()

const Record = require('../models/Record')
const User = require('../models/User')

const checkIfAuthenticated = require('../middleware/auth-middleware')

/**
 * route('/').get() returns all records
 * for one user
 */
router.route('/').get(checkIfAuthenticated, (req, res) => {
    // Change this for auth user when implemented
    const user_id = req.decoded._id

    console.log('Getting user records');

    Record.find({ user_id: user_id})
        .select('-user_id')
        .populate('checked_groups.group_id')
        .then(records => res.json(records))
        .catch(err => res.status(400).json({
            code: 400,
            message: err.message
        }))
})

/**
 * route('/:id').get() returns single record
 */
router.route('/:id').get(checkIfAuthenticated, (req, res) => {
    // Change this for auth user when implemented
    const user_id = req.decoded._id
    const id = req.params.id

    Record.findOne({ _id: id})
        .select('-user_id')
        .populate('checked_groups.group_id')
        .then(records => res.json(records))
        .catch(err => res.status(400).json({
            code: 400,
            message: err.message
        }))
})

/**
 * route('/').post() creates new record
 * for user
 */
router.route('/').post(checkIfAuthenticated, async (req, res) => {
    // Change this for auth user when implemented
    const user_id = req.decoded._id
    const record = req.body

    try {
        let user = await User.findOne({ _id: user_id }).select('vehicle.registration_number').populate('plant_id').exec()
        const registration_number = user.vehicle.registration_number
        const plant_name = user.plant_id.name

        // ********* TODO: Validate user trying to add to is same as logged in *********
        
        // Add user, vehicle and plant information (String as if driver plant or vehicle changes in future)
        record.user_id = user._id
        record.plant_name = plant_name
        record.registration_number = registration_number

        const newRecord = new Record(record)
        const savedRecord = await newRecord.save()
        res.json(savedRecord)
    }
    catch (err) {
        res.status(400).json({
            code: 400,
            message: err.message
        })
    }
})

/**
 * route('/:id').put() updates record
 * for user
 */
router.route('/:id').put(checkIfAuthenticated, async (req, res) => {
    // Change this for auth user when implemented
    const user_id = req.decoded._id
    const id = req.params.id
    const record = req.body

    // ********* TODO: Validate user trying to add to is same as logged in *********

    Record.findOneAndUpdate({ _id: id }, record, (err, newRecord) => {
        if (err) return res.status(500).json({
            code: 500,
            message: err.message
        })

        return res.send(newRecord);
    })
})

/**
 * route('/:id').delete() deletes record
 * for user
 */
router.route('/:id').delete(checkIfAuthenticated, async (req, res) => {
    // Change this for auth user when implemented
    const user_id = req.decoded._id
    const id = req.params.id
    const record = req.body

    // ********* TODO: Validate user trying to add to is same as logged in *********

    Record.deleteOne({ _id: id }, (err, doc) => {
        if (err) return res.status(500).json({
            code: 500,
            message: err.message
        })

        return res.json({
            code: 200,
            message: `Record with ID ${id} has been successfully deleted.`
        })
    });
})

module.exports = router;