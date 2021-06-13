const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
config = require('config')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post('/register',
    [
        check('email', 'Email is not correct').isEmail(),
        check('password', 'Minimal password lenght is 6 characters').isLength({
            min: 6
        })
    ],
    async (req, res) => {
    try {
       const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Registration data not correct'
            })
        }

        const {email, password} = req.body

        const candidate = await User.findOne({ email: email })

        if (candidate) {
            return res.status(400).json({
                message: "Such user is already exists"
            })
        }

        // хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 12)
        // создаем польззователя
        const user = new User({
            email: email,
            password: hashedPassword
        })

        await user.save()

        return res.status(201).json({
            message: "User was created"
        })

    } catch (e) {
        res.status(500).json({message: "Something wrong, try again"})
    }
})

// /api/auth/login
router.post('/login',
    [
        check('email', 'Enter correct email address').normalizeEmail().isEmail(),
        check('password', 'MEnter password').exists()
    ],
    async (req, res) => {
        try {
           const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Login data not correct'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({
                    message: 'User was not found'
                })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({
                    message: 'Password is wrong. Try again'
                })
            }

            // создаем токен
            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            res.json({token, userId: user.id})


        } catch (e) {
            res.status(500).json({message: "Something wrong, try again"})
        }

})


module.exports = router