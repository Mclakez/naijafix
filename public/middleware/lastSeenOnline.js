import { User } from "../models/Users.js"

export async function lastSeenOnline(req, res, next) {
    try {
        
        let user = await User.findById(req.user.id)
                if (user) {
                        user.lastSeen = Date.now()
                        await user.save()
                        console.log("Testing from suspension")
                }
                next()

    } catch (err) {
        console.error('Error in when last seen:', err)
        res.status(500).json({ error: err.message })
    }
}