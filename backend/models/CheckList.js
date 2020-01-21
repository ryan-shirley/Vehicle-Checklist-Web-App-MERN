const mongoose = require('mongoose')

const Checks = new mongoose.Schema({
    check_group_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'CheckGroup'
    }
})

const CheckListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    required_checks: [Checks]
})

module.exports = mongoose.model('CheckList', CheckListSchema)