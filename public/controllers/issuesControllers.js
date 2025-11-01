import { getDB } from '../config/db.js'
import { Issue } from '../models/Issues.js'



export async function postIssue(req, res) {
    const {title, description, location} = req.body
    const issueImage = req.file ? req.file.filename : null
    const user = await req.user;
    const citizenId = user.id;
    
    try {
        const newIssue = await Issue.create({
            title,
            description,
            location,
            createdBy: citizenId,
            issueImage
        })
        res.json(newIssue)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function getMyIssues(req, res) {
    const user = await req.user;
    const citizenId = user.id;
    try {
        const issues = await Issue.find({createdBy: citizenId})
        res.json(issues)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function getAllIssues(req, res) {
    
    try {
        const issues = await Issue.find()
        res.json(issues)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function getDetails(req, res) {
    
    try {
        let { id } = req.params
        console.log('getDetails handler invoked, params:', req.params, 'req.user:', req.user)
        console.log(id)
        const issue = await Issue.findById(id)

        if(!issue) {
            return res.status(404).json({ message: "Issue not found"})
        }
        res.json(issue)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function updateIssuesStatus(req, res) {
    let db = await getDB()
    let {id} = req.params
    let {status} = req.body
    const proofImage = req.file ? req.file.filename: null
    
    const validStatuses = ["acknowledged", "in-progress", "resolved"]
   
    if(!validStatuses.includes(status)) return res.status(400).json({error: "Invalid status"})
    if (status === "resolved" && !proofImage) return res.status(400).json({error: "Proof image is required when status is 'resolved'"})
    
    try {
        await db.run(`UPDATE issues
             SET status = COALESCE(?, status),
                 proofImage = COALESCE(?, status)
              WHERE id = ?`, [status, proofImage, id])
        const updated = await db.get(`SELECT * FROM issues WHERE id = ?`, [id])
        res.json(updated)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// export async function addFixPhoto(req, res) {
//     let db = await getDB()
//     const { id } = req.params
//     const proofImage = req.file ? req.file.filename: null
//     try {
//         await db.run(`
//             UPDATE issues SET proofImage = ? WHERE id = ?
//             `, [proofImage, id])

//             const updated = await db.get(`
//                 SELECT * FROM issues WHERE id = ?
//                 `, [id])
//                 res.json(updated)
//     } catch (err) {
//         res.status(500).json({error: err.message})
//     }
// }