const mongoose = require('mongoose')

const PlantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Plant', PlantSchema)