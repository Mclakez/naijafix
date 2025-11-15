import mongoose from "mongoose"

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Acknowledged", "In-progress", "Resolved"],
        default: "Pending"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    issueImage: {
        type: String,
        default: null
    },
    fixImage: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            userID: {
                type:mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            comment: String,
            date: { type: Date, default: Date.now }
        }
    ]
})

export const Issue = mongoose.model("Issue", issueSchema)