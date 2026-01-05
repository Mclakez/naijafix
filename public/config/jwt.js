import jwt from 'jsonwebtoken'



export async function generateToken(user) {
    const SECRET = process.env.JWT_SECRET
    return jwt.sign(
        { id: user._id, role: user.role},
        SECRET,
        { expiresIn: "1d"}
    )
}

export async function verifyToken(token) {
    const SECRET = process.env.JWT_SECRET
    return jwt.verify(token, SECRET)
}