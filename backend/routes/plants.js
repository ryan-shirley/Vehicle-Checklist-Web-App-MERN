const router = require("express").Router()

// Models
const Plant = require("../models/Plant")

/**
 * route('/').get() Return all plants
 */
router.route("/").get((req, res) => {
    Plant.find()
        .then(plant => res.json(plant))
        .catch(err => res.status(400).json(`Error: ${err}`))
})

module.exports = router
