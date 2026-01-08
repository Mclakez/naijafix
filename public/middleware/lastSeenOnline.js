import { User } from "../models/Users.js"

export async function lastSeenOnline(req, res, next) {
    try {
                  if (req.user) {
                        await User.findByIdAndUpdate(req.user.id,
                            {lastSeen: new Date()}
                        )
                }
                

    } catch (err) {
        console.error('Error in when last seen:', err)
        res.status(500).json({ error: err.message })
    } finally {
        next()
    }
}

// export async function lastSeenOnline(req, res, next) {
//     try {
//         // Check if user exists on the request (meaning they're authenticated)
//         if (req.user && req.user.id) {
//             await User.findByIdAndUpdate(
//                 req.user.id,
//                 { lastSeen: new Date() },
//                 { new: true } // Optional: returns the updated document
//             )
//             console.log("Updated last seen for user:", req.user.id)
//         }
//     } catch (err) {
//         // Log the error but don't block the request
//         console.error('Error updating last seen:', err)
//     } finally {
//         // Always call next() to continue the request chain
//         next()
//     }
// }