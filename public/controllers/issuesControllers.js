
import { Issue } from '../models/Issues.js'
import { Counter } from '../models/Counter.js'
import { User } from '../models/Users.js'
import { cloudinary } from "..config/cloudinary.js";

async function getIssueId() {
    const counter = await Counter.findByIdAndUpdate("issues",
        { $inc: { seq: 1 }},
        { new: true, upsert: true }
    )

    return counter.seq
}

export async function postIssue(req, res) {
    const {title, description, location} = req.body
    const issueImageId = req.file ? req.file.filename : null
    const issueImage = req.file ? req.file.path : null
    const user = await req.user;
    const citizenId = user.id;
    const issueId = await getIssueId()
    
    try {
        const newIssue = await Issue.create({
            issueId,
            title,
            description,
            location,
            createdBy: citizenId,
            issueImage,
            issueImageId
        })
        res.json(newIssue)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function deleteIssue(req, res) {
    try {
        let { id } = req.params
        const issue = await Issue.findById(id)
        if(issue.issueImageId) {
            await cloudinary.uploader.destroy(issue.issueImageId);
        }
        const deletedIssue = await Issue.findByIdAndDelete(id)
        if(!deletedIssue) {
            return res.status(500).json("No issue found")
        }
        res.status(200).json({
            message: "Issue deleted successfully",
            deletedIssue
        })
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
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const totalItems = await Issue.countDocuments()
    const currentpage = page
    
    try {
        if(page && limit) {
            const skip = (page - 1) * limit
             
            const issues = await Issue.find().populate('createdBy', 'username').sort({issueId: -1}).skip(skip).limit(limit)
            res.json({
                issues,
                totalPages: Math.ceil(totalItems/limit),
                currentpage
            })
        }else {
            const issues = await Issue.find().populate('createdBy', 'username')
            res.json(issues)
        }

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function getDetails(req, res) {
    
    try {
        let { id } = req.params
        const issue = await Issue.findById(id).populate('createdBy', 'username').populate('comments.userID', 'username')
        // console.log("Issue after populate", JSON.stringify(issue, null, 2))


        if(!issue) {
            return res.status(404).json({ message: "Issue not found"})
        }
        return res.status(200).json(issue)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function postComment(req, res) {
        const { comment } = req.body
        const user = await req.user;
        const citizenId = user.id;
        const { id } = req.params

    try {
        
        const issue = await Issue.findById(id)
        if (!issue) {
            return res.status(404).json({comment: "Issue not found"})
        }
        issue.comments.push({userID: citizenId, comment})
        await issue.save()
        res.status(200).json(issue)
    } catch (err) {
        res.status(500).json({error: err.message + "true"})
    }
}

export async function updateIssueOfficer(req, res) {
    let {id} = req.params
    let {officer} = req.body
    

    try {
        let updatedIssue = await Issue.findByIdAndUpdate(
        id,
        {officer : officer},
        {new: true, runValidators: true}
    )

    if(!updatedIssue) {
       return res.status(404).json({error: 'Issue not found'})
    }

    res.status(200).json(updatedIssue)
    } catch(error) {
        res.status(500).json({error: 'Issue not found'})
    }
}



export async function getOfficerIssues(req, res) {
            let {name} = req.params
            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit)
            const totalItems = await Issue.countDocuments({officer : name})
            const currentpage = page
            console.log(name)
    
    try {
    if(page && limit) {
            const skip = (page - 1) * limit
             
            let officerIssues = await Issue.aggregate([
        {
            $match: {officer: name}
        },
        {
            $lookup: {
                from: "users",
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy'
            }
        },
        {
                    $unwind: {
                        path: '$createdBy',
                        preserveNullAndEmptyArrays: true
                    }
                },
        {
            $sort: {issueId: -1}
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ])
            res.status(200).json({
                officerIssues,
                totalPages: Math.ceil(totalItems/limit),
                currentpage
            })
        }else {
            let officerIssues = await Issue.find({officer: name})
            res.status(200).json(officerIssues)
        }
    } catch(err) {
        console.error('Error in gettimg officer issues:', err)
        res.status(500).json({ error: err.message })
    }


}

export async function updateIssueStatus(req, res) {
    let {id} = req.params
    let {status} = req.body
    

    try {
        let updatedIssue = await Issue.findByIdAndUpdate(
        id,
        {status : status},
        {new: true, runValidators: true}
    )

    if(!updatedIssue) {
       return res.status(404).json({error: 'Issue not found'})
    }

    res.status(200).json(updatedIssue)
    } catch(error) {
        res.status(500).json({error: 'Issue not found'})
    }
}

export async function addFixPhoto(req, res) {
    const { id } = req.params
    const fixImage = req.file ? req.file.filename : null
    
    try {
        const updatedIssue = await Issue.findByIdAndUpdate(
            id,
            {fixImage},
            { new: true }
        )
        res.json(updatedIssue)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}