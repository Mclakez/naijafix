import dotenv from "dotenv"
dotenv.config()
import express from 'express'
import passport from 'passport'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { configurePassport } from "./public/config/passport.js"
import { authRouter } from "./public/routes/authRoutes.js"
import { usersRouter } from "./public/routes/usersRoutes.js"
import { issuesRouter } from "./public/routes/issuesRoutes.js"
import { inItDb } from './public/config/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'


const PORT = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
   cors({
      origin: 'http://localhost:3000',
      credentials: true
   })
)

app.use(passport.initialize())
configurePassport()

app.use(express.static(path.join(__dirname, "src")))
    
   await inItDb();

    app.use("/uploads", express.static(path.join(__dirname, "uploads")))
    app.use("/api/auth", authRouter);
    app.use("/api/issues", issuesRouter)
    app.use("/api/users", usersRouter)

    app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
