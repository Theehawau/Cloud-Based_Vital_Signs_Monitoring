const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const wardUserSchema = new mongoose.Schema({
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

// On individual wardUser
wardUserSchema.methods.generateAuthToken = async function () {
    const wardUser = this
    const token = jwt.sign({ _id: wardUser._id.toString()}, process.env.JWT_SECRET)
    wardUser.tokens = wardUser.tokens.concat({token})
    await wardUser.save()
    return token
}
wardUserSchema.methods.toJSON = function () {
    const wardUser = this
    const wardUserObject = wardUser.toObject()
    delete wardUserObject.tokens
    delete wardUserObject.password
    return wardUserObject
}

// creating new find method
wardUserSchema.statics.findByCredentials = async(email, password) =>{
    const wardUser = await WardUser.findOne({email})
    if (!wardUser) throw new Error('Unable to Login')
    const isMatch = await bcrypt.compare(password, wardUser.password)
    if (!isMatch) throw new Error('Unable to Login')
    return wardUser
}

// Hash plain text password
wardUserSchema.pre('save',async function (next) {
    const wardUser = this
    if (wardUser.isModified('password')) {
        wardUser.password = await bcrypt.hash(wardUser.password, 8)
    }
    next()
})

const WardUser = mongoose.model('WardUser', wardUserSchema);
module.exports = WardUser