import { body } from 'express-validator'

export const signupValidation = [
    body('username')
    .notEmpty().withMessage('Username is required'),

    // body('email')
    // .isEmail().withMessage('A valid email is required'),

    body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

export const logInValidation = [
    body('username')
    .notEmpty().withMessage('Username is required'),

    body('password')
    .notEmpty().withMessage("Password is required"),
]