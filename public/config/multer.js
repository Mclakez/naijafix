import multer from "multer"
import path from "node:path"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, unique + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Only .jpg, .png, .jpeg allowed"), false)
    }
}

export const upload = multer({ storage, fileFilter})