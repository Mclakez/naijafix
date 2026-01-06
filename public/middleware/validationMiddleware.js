import { validationResult } from 'express-validator'

export const handleValidation = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors) {
        return res.status(400).json({ errors: errors.array() })
    }
    console.log(
        'E reach handle too'
    )
    next()
}
