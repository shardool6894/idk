const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Weak password')
            }
        }
    }
}, { timestamps: true })
const userModel = mongoose.model('users', userSchema)
module.exports = userModel;