const router = require('express').Router()

const User = require('../models/User')
const Plant = require('../models/Plant')
const CheckList = require('../models/CheckList')

router.route('/').get((req, res) => {

    User.find()
        .select('-vehicle.check_list_id')
        .populate('plant_id')
        .then(user => res.json(user))
        .catch(err => res.status(400).json({
            code: 400,
            message: err.message
        }))

})

router.route('/:id').get((req, res) => {
    const user_id = req.params.id

    User.findOne({ _id: user_id })
        .populate('plant_id vehicle.check_list_id')
        .then(user => res.json(user))
        .catch(err => res.status(400).json({
            code: 400,
            message: err.message
        }))

})

router.route('/').post(async (req,res) => {
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
