import express from 'express'
import { inItDb } from './public/config/db.js'
const PORT = 4000

const app = express()

app.get('/', (req, res) => {
    res.send("API is running...")
})

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`))