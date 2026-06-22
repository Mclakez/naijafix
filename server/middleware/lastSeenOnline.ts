import { User } from "../models/Users.js"
import { Request, Response,  NextFunction } from 'express'

export async function lastSeenOnline(req: Request, res: Response, next: NextFunction) {
  try {
      const user = req.user as {id: string}
                  if (user) {
                        await User.findByIdAndUpdate(user.id,
                            {lastSeen: new Date()}
                        )
                }
                

    } catch (err) {
      const error = err as  Error
        res.status(500).json({ error: error.message })
    } finally {
        next()
    }
}
