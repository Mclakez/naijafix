import express from 'express'
import { signup, login } from '../controllers/authControllers.js'
import { requireAuth } from '../middleware/auth.js'

export const authRouter = express.Router()

authRouter.post('/signup', signup)
authRouter.post('/login', login)

authRouter.get('/profile', requireAuth, (req, res) => {
    res.json({message: "Protected route", user: req.user})
})