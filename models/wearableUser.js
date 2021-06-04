const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const wearableUserSchema = new mongoose.Schema({
    deviceId:{
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        },
        unique:true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
})

// On individual wearableUser
wearableUserSchema.methods.generateAuthToken = async function () {
    const wearableUser = this
    const token = jwt.sign({ _id: wearableUser._id.toString()}, process.env.JWT_SECRET)
    wearableUser.tokens = wearableUser.tokens.concat({token})
    await wearableUser.save()
    return token
}
wearableUserSchema.methods.toJSON = function () {
    const wearableUser = this
    const wearableUserObject = wearableUser.toObject()
    delete wearableUserObject.tokens
    delete wearableUserObject.password
    return wearableUserObject
}

// creating new find method
wearableUserSchema.statics.findByCredentials = async(email, password) =>{
    const wearableUser = await WearableUser.findOne({email})
    if (!wearableUser) throw new Error('Unable to Login')
    const isMatch = await bcrypt.compare(password, wearableUser.password)
    if (!isMatch) throw new Error('Unable to Login')
    return wearableUser
}

// Hash plain text password
wearableUserSchema.pre('save',async function (next) {
    const wearableUser = this
    if (wearableUser.isModified('password')) {
        wearableUser.password = await bcrypt.hash(wearableUser.password, 8)
    }
    next()
})

const WearableUser = mongoose.model('WearableUser', wearableUserSchema);
module.exports = WearableUser