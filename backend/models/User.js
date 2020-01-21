const mongoose = require('mongoose')

const VehicleSchema = new mongoose.Schema({
    registration_number: {
        type: String,
        required: true,
        unique: true
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    check_list_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'CheckList'
    }
})

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    vehicle: {
        type: VehicleSchema,
        required: false
    },
    plant_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Plant'
    },
    is_admin: {
        type: Boolean,
        required: false
    }
})

module.exports = mongoose.model('User', UserSchema)