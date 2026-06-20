const express = require('express')
const router = express.Router();
const loginLimiter = require('../middleware/loginLimiter')
const {login,register} = require('../controllers/authLogic')
router.post('/login',loginLimiter,login)
router.post('/register',register)
module.exports = router;