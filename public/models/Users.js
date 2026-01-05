import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "officer", "admin"],
        default: "user"
    },
    department: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    suspension: {
        type: String,
        enum: ["active", "suspended"],
        default: "active"
    },
    suspendedUntil: {
        type: Date,
        default: null
    },
    lastSeen: {
        type: Date,
        default: Date.now
    }
})

export const User = mongoose.model("User", userSchema)