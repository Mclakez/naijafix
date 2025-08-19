import bcrypt from 'bcrypt'
// import db from '../config/db.js'
import { getDB } from '../config/db.js'
import { generateToken } from '../config/jwt.js'

export async function signup(req, res) {
    const { username, password } = req.body
    let db = getDB()
    try {
        const existing = await db.get("SELECT * FROM users WHERE username = ?", [username])
        if(existing) {
            res.status(400).json({error: "Username is taken already"})
            return
        }
        const hashed = await bcrypt.hash(password, 10)

        const result = await db.run(`
            INSERT INTO users (username, password, role)
            VALUES (?, ?, ?)
            `, [username, hashed, 'citizen'])

            const user = await db.get("SELECT id, username, role FROM users WHERE id = ?", [result.lastID])
            const token = generateToken(user)
            res.json({user, token})

        

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function login(req, res) {
    const { username, password } = req.body
    let db = getDB()
    try {
        const user = await db.get(`
            SELECT * FROM users WHERE username = ?
            `, [username])
            if (!user) {
               return res.status(400).json({error: 'Invalid credentials'})
            }

            const match = await bcrypt.compare(password, user.password)
            if(!match) {
                return res.status(400).json({error: 'Invalid credentials'})
            }
            const token = generateToken(user)
            res.json({ user: {id: user.id, username: user.username, role: user.role}, token})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
}