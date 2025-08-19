import express from 'express'
import { signup, login } from '../controllers/authControllers.js'
import { requireAuth } from '../middleware/auth.js'

export const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.get('/profile', requireAuth, (req, res) => {
    res.json({message: "Protected route", user: req.user})
})