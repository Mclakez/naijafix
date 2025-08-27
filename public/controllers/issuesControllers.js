import { getDB } from '../config/db.js'


export async function postIssue(req, res) {
    let db = await getDB()
    const {title, description, location} = req.body
    const image = req.file ? req.file.filename : null
    const user = await req.user;
    const citizenId = user.id;

    try {
        const result = await db.run(`
        INSERT INTO issues (title, description, image, location, status, citizenId)
        VALUES (?, ?, ?, ?, ?, ?)
        `, [title, description, image, location, "pending", citizenId])
        const issue = await db.get(`SELECT * FROM issues WHERE id = ?`, [result.lastID])
        res.json(issue)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function getMyIssues(req, res) {
    let db = await getDB()
    const user = await req.user;
    const citizenId = user.id;
    try {
        const issues = await db.all(`SELECT * FROM issues WHERE citizenId = ?`, [citizenId])
        res.json(issues)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function getAllIssues(req, res) {
    let db = await getDB()
    try {
        const issues = await db.all(`SELECT * FROM issues`)
        res.json(issues)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function updateIssuesStatus(req, res) {
    let db = await getDB()
    let {id} = req.params
    let {status} = req.body
    
    const validStatuses = ["acknowledged", "in-progress", "resolved"]
   
    if(!validStatuses.includes(status)) return res.status(400).json({error: "Invalid status"})
    
    try {
        await db.run(`UPDATE issues SET status = ? WHERE id = ?`, [status, id])
        const updated = await db.get(`SELECT * FROM issues WHERE id = ?`, [id])
        res.json(updated)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function addFixPhoto(req, res) {
    let db = await getDB()
    const { id } = req.params
    const proofImage = req.file ? req.file.filename: null
    try {
        await db.run(`
            UPDATE issues SET proofImage = ? WHERE id = ?
            `, [proofImage, id])

            const updated = await db.get(`
                SELECT * FROM issues WHERE id = ?
                `, [id])
                res.json(updated)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}