const mongoose = require('mongoose')
const validator = require('validator')
const questionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    question : {
        type : String,
        required : true
    }
}, { timestamps: true })
const questionModel = mongoose.model('questions', questionSchema)
module.exports = {questionModel};