const express = require('express')
const router = express.Router();
const loginLimiter = require('../middleware/loginLimiter')
const middlewareFn = require('../middleware/authMiddleware')
const {login,register,logout} = require('../controllers/authLogic')
const {viewProfile} = require('../controllers/profileLogic')
const {suggestions,questions} = require('../controllers/suggestions_questions_logic')
router.post('/login',loginLimiter,login)
router.post('/register',register)
router.get('/profile',middlewareFn,viewProfile)
router.post('/questions',middlewareFn,questions)
router.post('/suggestions',middlewareFn,suggestions)
router.post('/logout',middlewareFn,logout)
module.exports = router;