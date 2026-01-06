import jwt from 'jsonwebtoken'
import { RefreshToken } from '../models/RefreshToken.js'



export async function generateToken(req,res,user) {
    const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET
    const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET
    let days = 1
    let expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + days)
    
    const accessToken = jwt.sign(
        { id: user._id},
        ACCESS_SECRET,
        { expiresIn: "15m"}
    )

    const refreshToken = jwt.sign(
        { id: user._id},
        REFRESH_SECRET,
        { expiresIn: "1d"}
    )

    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: expiryDate
    })
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 1 * 24 * 60 * 60 * 1000
    })

    return accessToken

    
}

export async function verifyToken(token) {
    const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET
    return jwt.verify(token, SECRET)
}