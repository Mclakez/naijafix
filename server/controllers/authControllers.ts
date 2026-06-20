import { Request, Response} from "express"
import bcrypt from 'bcrypt'
import { generateToken } from '../config/jwt.js'
import { User } from '../models/Users.js'
import { RefreshToken } from '../models/RefreshToken.js'
import jwt from 'jsonwebtoken'
import { Document } from 'mongoose'
import { UserProps, UserSchemaProps } from '../types/index.js'

export async function signup(req: Request, res: Response) {
    const { username, email, password } = req.body
    console.log(username,email)
    
    try {
        const existing = await User.findOne({username})
        if(existing) {
            res.status(400).json({error: "Username is taken already"})
            return
        }
        const hashed = await bcrypt.hash(password, 10)
        const role = "user"
    const department = null
        
        const newUser = await User.create({
            username,
            email,
            password: hashed,
            role
        })
        res.json({user : newUser.username})

    } catch (err) {
        const error = err as Error
        res.status(500).json({error: error.message + "From the backend"})
    }
}

export async function login(req: Request, res: Response) {
    const { username, password } = req.body
    
    
    try {
        const user = await User.findOne({username}) as (Document & UserSchemaProps)
            if (!user) {
               return res.status(400).json({error: 'Invalid username'})
            }
            

            const match = await bcrypt.compare(password, user.password || "")
            
            if(!match) {
                return res.status(400).json({error: 'Invalid Password'})
            }
            const accessToken = await generateToken(req,res,user)
            res.json({ user: {id: user._id, username: user.username, role: user.role, suspension: user.suspension}, accessToken})
    } catch (err) {
        const error = err as Error
        res.status(500).json({error: error.message})
    } 
}

export async function refreshToken(req:Request, res: Response) {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) {
        console.log('The issue is no refresh token')
        return res.status(401).json({error : 'No refresh token'})
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
        const isValidToken = await RefreshToken.findOne({token: refreshToken})
        if(!isValidToken) {
            return res.status(401).json({error : 'Invalid refresh token'})
        }

        const accessToken = jwt.sign(
                { id: decoded.id},
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: "15m"}
            )

            res.json({accessToken})
    } catch(err){
        res.status(401).json({error: 'Invalid refresh token'})
    }
}