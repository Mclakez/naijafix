import { User } from "../models/Users.js"
import { Request, Response,  NextFunction } from 'express'

export async function checkSuspension(req: Request, res: Response, next: NextFunction) {
  try {
    let getUser = req.user as { id: string }
    if (!getUser || !getUser.id) {
        return res.status(401).json({ error: "Unauthorized access" });
    }
    let user = await User.findById(getUser.id)
        if (user && user.suspension === "suspended") {
          let currentDate = new Date()
          if(user.suspendedUntil === null) return
            if (currentDate < user.suspendedUntil) {
                return res.status(403).json({ error: "User is suspended" })
            } else {
                user.suspension = "active"
                user.suspendedUntil = null
                await user.save()
            }
        }
        next()
    } catch (err) {
        const error = err as  Error
        res.status(500).json({ error: error.message })
    }
}