const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

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
        required: false,
        default: false
    },
    email:{
        type: String,
        required: true,
        unique:true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }

    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength: 7,
        validate(value){
            if(validator.isEmpty(value)){
                throw new Error('Please enter your password!')
            }else if(validator.equals(value.toLowerCase(),"password")){
                throw new Error('Password is invalid!')
            }else if(validator.contains(value.toLowerCase(), "password")){
                throw new Error('Password should not contain password!')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }],
})

UserSchema.methods.newAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_VERIFY , { expiresIn: "7 days" })
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

UserSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

module.exports = mongoose.model('User', UserSchema)