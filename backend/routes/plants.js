const router = require('express').Router()
const checkIfAuthenticated = require('../middleware/auth-middleware')

const Plant = require('../models/Plant')

router.route('/').get(checkIfAuthenticated, (req, res) => {

    Plant.find()
        .then(plant => res.json(plant))
        .catch(err => res.status(400).json(`Error: ${err}`))

})

module.exports = router;
