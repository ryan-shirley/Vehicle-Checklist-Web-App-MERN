const mongoose = require('mongoose')

const CheckSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

const CheckGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    checks: [CheckSchema]
})

module.exports = mongoose.model('CheckGroup', CheckGroupSchema)