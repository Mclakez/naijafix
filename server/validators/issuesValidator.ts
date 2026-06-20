import { body } from 'express-validator'

export const issuesValidator = [
    body('title')
    .notEmpty().withMessage('Title is required').isLength({min: 3}).withMessage('Title must be at least 3 characters'),

    body('description')
    .notEmpty().withMessage('Description is required').isLength({min: 10}).withMessage('Description must be at least 10 characters'),

    body('location')
    .notEmpty().withMessage('Location is required')
]