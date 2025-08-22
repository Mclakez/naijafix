import dotenv from "dotenv"
dotenv.config()
import express from 'express'
import { authRouter } from "./public/routes/authRoutes.js"
import { inItDb } from './public/config/db.js'

const PORT = 4000

const app = express()
app.use(express.json())

async function startServer() {
    await inItDb();
    app.use("/api/auth", authRouter);

    app.get('/', (req, res) => {
        res.send("API is running...");
    });

    app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
}

startServer();
