const userModel = require('../schemas/users')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config();
const middlewareFn = async (req,res,next) => { 
    try{
    const cookies = req.cookies;
    const {token} = cookies;
    if(!token){
        throw new Error('invalid token')
    }
    const decodedMessage = await jwt.verify(token,process.env.SIGN_IN_KEY)
    const {_id} = decodedMessage;
    const user = await userModel.findById(_id)
    if(!user){
        throw new Error('user does not exist')
    }
    req.user = user;
    next();
    }
    catch(err){
        return res.status(400).json({
        success: false,
        message: err.message
    });
    }
}
module.exports = middlewareFn;