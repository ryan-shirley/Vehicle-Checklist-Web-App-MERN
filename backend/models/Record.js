const mongoose = require("mongoose")

const CheckSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    passed: {
        type: Boolean,
        required: true
    },
    note: {
        type: String,
        required: false
    },
})

const GroupsSchema = new mongoose.Schema({
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "CheckGroup"
    },
    checks: {
        type: [CheckSchema],
        required: true
    }
})

const RecordSchema = new mongoose.Schema({
    checked_groups: {
        type: [GroupsSchema],
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    registration_number: {
        type: String,
        required: true
    },
    plant_name: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    passed: {
        type: Boolean,
        required: true
    },
    check_list_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "CheckList"
    }
})

module.exports = mongoose.model("Record", RecordSchema)
