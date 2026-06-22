import { verifyToken } from '../config/jwt.js'
import { Request, Response,  NextFunction } from 'express'

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if(!authHeader) {
        console.log('The issue is from require auth')
       return res.status(401).json({error: 'No token provided'})
    }

    const token = authHeader.split(" ")[1]
    try {
       const decoded = await verifyToken(token) as {id: string}
       req.user = decoded
       next()

    } catch(err) {
        return res.status(401).json({error: "Invalid or expired token"})
    }
}

