const { suggestionModel } = require('../schemas/suggestions')
const { questionModel } = require('../schemas/questions')
const suggestions = async (req, res) => {
    try {
        const user = req.user;
        const { suggestion } = req.body
        const newObject = {
            email: user.email,
            suggestion: suggestion
        }
        await suggestionModel.create(newObject)
        res.status(200).json({suggestion : suggestion})
    }
    catch (err) {
        res.status(400).json({
            success : false,
            message : err.message
        })
    }
}
const questions = async (req, res) => {
    try {
        const user = req.user;
        const { question } = req.body
        const newObject = {
            email: user.email,
            question: question
        }
        await questionModel.create(newObject)
        res.status(200).json({question : question})
    }
    catch (err) {
        res.status(400).json({
            success : false,
            message : err.message
        })
    }
}
module.exports = { suggestions, questions }