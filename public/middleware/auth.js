import { verifyToken } from '../config/jwt.js'

export async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization
    if(!authHeader) {
        console.log('The issue is from require auth')
       return res.status(401).json({error: 'No token provided'})
    }

    const token = authHeader.split(" ")[1]
    try {
       const decoded = await verifyToken(token)
       req.user = decoded
       next()

    } catch(err) {
        return res.status(401).json({error: "Invalid or expired token"})
    }
}

export async function requireOfficer(req, res, next) {
    const user = await req.user
    const role = user.role
    if(role !== 'officer') {
        return res.status(403).json({error: "Officer role required"})
    }
    next()
}

