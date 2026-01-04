import { User } from "../models/Users.js"

export async function lastSeenOnline(req, res, next) {
    try {
                  if (req.user) {
                        await User.findByIdAndUpdate(req.user.id,
                            {lastSeen: Date.now()}
                        )
                        console.log("Updated LAST sEEN")
                        console.log(req.user.id)
                }
                

    } catch (err) {
        console.error('Error in when last seen:', err)
        res.status(500).json({ error: err.message })
    } finally {
        next()
    }
}