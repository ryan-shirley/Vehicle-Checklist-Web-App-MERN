const router = require('express').Router()
const checkIfAuthenticated = require('../middleware/auth-middleware')

const User = require('../models/User')
const Plant = require('../models/Plant')
const CheckList = require('../models/CheckList')

router.route('/').get(checkIfAuthenticated, (req, res) => {

    // ********* TODO: Validate user is admin *********

    User.find()
        .select('-vehicle.check_list_id')
        .populate('plant_id')
        .then(user => res.json(user))
        .catch(err => res.status(400).json({
            code: 400,
            message: err.message
        }))

})

router.route('/:id').get(checkIfAuthenticated, (req, res) => {
    const user_id = req.params.id

    // ********* TODO: Validate user is same as id or is admin *********

    User.findOne({ _id: user_id })
        .populate('plant_id vehicle.check_list_id')
        .then(user => res.json(user))
        .catch(err => res.status(400).json({
            code: 400,
            message: err.message
        }))

})

router.route('/:id/checklist').get(checkIfAuthenticated, async (req, res) => {
    const user_id = req.params.id

    // ********* TODO: Validate user is same as id or is admin *********

    let userChecklist = await User.findOne({ _id: user_id }).select('vehicle.check_list_id')
    let checkListId = userChecklist.vehicle.check_list_id

    let checkList = await CheckList.findOne({ _id: checkListId }).populate('required_checks.check_group_id')

    res.json({checkList})

})

router.route('/').post(checkIfAuthenticated, async (req,res) => {
    const user = new User(req.body);
    try {
        const token = await user.newAuthToken()
        res.status(201).send({user, token})
    } catch(e){
        console.log(e)
        res.status(400).json(e.message)
    }
})

module.exports = router;
