import { User } from "../models/Users.js"
export async function checkSuspension(req, res, next) {
    try {
        let user = await User.findById(req.user.id)
        if (user && user.suspension === "suspended") {
            let currentDate = new Date()
            if (currentDate < user.suspendedUntil) {
                return res.status(403).json({ error: "User is suspended" })
            } else {
                user.suspension = "active"
                user.suspendedUntil = null
                await user.save()
                console.log("Testing for status")
            }
        }
        next()
    } catch (err) {
        console.error('Error in checking suspension:', err)
        res.status(500).json({ error: err.message })
    }
}