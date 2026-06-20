import multer from "multer"
import path from "node:path"
import { cloudinary } from "./cloudinary.js"
import {CloudinaryStorage} from "multer-storage-cloudinary"

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/")
//     },
//     filename: (req, file, cb) => {
//         const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
//         cb(null, unique + path.extname(file.originalname))
//     }
// })



// const fileFilter = (req, file, cb) => {
//     const allowed = ["image/jpeg", "image/png", "image/jpg"];
//     if (allowed.includes(file.mimetype)) {
//         cb(null, true)
//     } else {
//         cb(new Error("Only .jpg, .png, .jpeg allowed"), false)
//     }
// }

// export const upload = multer({ storage, fileFilter})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "naijafix",
        allowed_formats: ["jpg", "png", "jpeg"],
        transformation: [
            {width: 800, height: 800, crop: "limit"}
        ]
    },
})
export const upload = multer({ storage})