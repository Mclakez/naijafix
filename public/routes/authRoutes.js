import express from 'express'
import { signup, login } from '../controllers/authControllers.js'
import { requireAuth } from '../middleware/auth.js'
import { handleValidation } from "../middleware/validationMiddleWare.js";
import { signupValidation, logInValidation } from "../validators/authValidators.js";

export const authRouter = express.Router()

authRouter.post('/signup',signupValidation, handleValidation, signup)
authRouter.post('/login', logInValidation, handleValidation, login)

authRouter.get('/profile', requireAuth, (req, res) => {
    res.json({message: "Protected route", user: req.user})
})