const userModel = require('../schemas/users')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Email and password are required')
        }
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format')
        }
        const user = await userModel.findOne({ email: email })
        if (!user) {
            throw new Error('invalid email or password')
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            throw new Error('invalid email or password')
        }
        const token = await jwt.sign({ _id: user._id, email: user.email }, process.env.SIGN_IN_KEY, { expiresIn: '7d' })
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            success: true,
            message: 'Login successful'
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Email and password are required')
        }
        const existingUser = await userModel.findOne({ email: email })
        if (existingUser) {
            throw new Error('User with this email already exists')
        }
        //hashing 
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = {
            email: email,
            password: hashedPassword
        }
        await userModel.create(user)
        return res.status(200).json({
            success: true,
            message: 'User registered successfully'
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

const logout = (req, res) => {
    try {
        const user = req.user
        //add password authentication baadme abhi aalas aa rha
        if (user) {
            res.cookie('token', '', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                expires: new Date(0)
            });
        }
        return res.status(200).json({ message: 'Logged out successfully.' });
    } 
    catch (error) {
        return res.status(400).json({ error: 'Internal server error.' });
    }
}

module.exports = { login, register, logout }