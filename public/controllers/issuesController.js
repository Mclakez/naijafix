import { getDB } from '../config/db.js'


export async function postIssue(req, res) {
    let db = getDB()
    const {title, description, image, location} = req.body
    try {
        const result = await db.run(`
        INSERT INTO issues (title, description, image, location, status, citizenId)
        VALUES (?, ?, ?, ?, ?, ?)
        `, [title, description, image, location, "pending", req.user.id])

        const issue = await db.get(`SELECT * FROM issues WHERE id = ?`, [issue.lastID])
        res.json(issue)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
    
}

export async function getMyIssues(req, res) {
    let db = getDB()
    try {
        await db.get(`SELECT * FROM issues WHERE citizenId = ?`, [req.user.id])
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function getAllIssues(req, res) {
    let db = getDB()
    try {
        const issues = await db.all(`SELECT * FROM issues`)
        res.json(issues)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function updateIssuesStatus(req, res) {
    let db = getDB()
    let {id} = req.params
    let {status} = req.body
    const validStatuses = ["acknowledged", "in-progress", "resolved"]
    if(!validStatuses.includes(status)) return res.status(400).json({error: "Invalid status"})
    try {
    await db.run(`UPDATE issues SET status = ? WHERE id = ?`, [status, id])
    const updated = db.get()
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}