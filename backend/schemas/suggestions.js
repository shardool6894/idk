const mongoose = require('mongoose')
const validator = require('validator')
const suggestionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    suggestion : {
        type : String,
        required : true
    }
}, { timestamps: true })
const suggestionModel = mongoose.model('suggestions', suggestionSchema)
module.exports = {suggestionModel};