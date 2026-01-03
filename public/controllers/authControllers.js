import bcrypt from 'bcrypt'
// import db from '../config/db.js'
import { getDB } from '../config/db.js'
import { generateToken } from '../config/jwt.js'
import { User } from '../models/Users.js'

export async function signup(req, res) {
    const { username, email, password } = req.body
    
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
            role,
            department: role === "officer" ? department : null
        })
            
            
            
            
            const token = await generateToken(newUser)
            res.json({user: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role
            }, token})

        

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function login(req, res) {
    const { username, password } = req.body
    
    
    try {
        const user = await User.findOne({username})
            if (!user) {
               return res.status(400).json({error: 'Invalid username'})
            }
            

            const match = await bcrypt.compare(password, user.password)
            
            if(!match) {
                return res.status(400).json({error: 'Invalid Password'})
            }
            const token = await generateToken(user)
            res.json({ user: {id: user._id, username: user.username, role: user.role, suspension: user.suspension}, token})
    } catch(err) {
        res.status(500).json({error: err.message})
    } 
}