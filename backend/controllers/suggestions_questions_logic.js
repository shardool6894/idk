const {suggestionModel}=require('../schemas/suggestions')
const {questionModel}=require('../schemas/questions')
const suggestions = (req,res)=>{
    const user = req.user;
    const suggestion = req.body
    const newObject = {
        email : user.email,
        suggestion : suggestion
    }

}
const questions = (req,res) =>{
    const user = req.user;
    const question = req.body
    const newObject = {
        email : user.email,
        question : question
    }
}
module.exports = {suggestions,questions}