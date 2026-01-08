import express from 'express'
import passport from 'passport'
import { generateToken } from '../config/jwt.js'
import { signup, login, refreshToken } from '../controllers/authControllers.js'
import { requireAuth} from '../middleware/auth.js'
import { handleValidation } from "../middleware/validationMiddleware.js";
import { signupValidation, logInValidation } from "../validators/authValidators.js";

export const authRouter = express.Router()

authRouter.post('/signup',signupValidation, handleValidation, signup)
authRouter.post('/login', logInValidation, handleValidation, login)
authRouter.get('/refresh', refreshToken)
authRouter.get('/google', 
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session:false
    })
)

authRouter.get('/google/callback', 
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/login.html'
    }),
    async (req, res) => {
        try {
            const user = req.user
            const accessToken = await generateToken(req, res, user)
            res.redirect(`/auth-success.html?token=${accessToken}&username=${user.username}&role=${user.role}&id=${user._id}`)
        } catch (error) {
            console.error('Google callback error:', error)
            res.redirect('/login.html?error=auth_failed')
        }
    }
)

authRouter.get('/profile', requireAuth, (req, res) => {
    res.json({message: "Protected route", user: req.user})
})