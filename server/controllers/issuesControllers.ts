
import { Issue } from '../models/Issues.js'
import { Counter } from '../models/Counter.js'
import { User } from '../models/Users.js'
import { cloudinary } from "../config/cloudinary.js";
import { Request, Response } from 'express';

async function getIssueId() {
    const counter = await Counter.findByIdAndUpdate("issues",
        { $inc: { seq: 1 }},
        { new: true, upsert: true }
    )

    return counter.seq
}

export async function postIssue(req: Request, res: Response) {
    const {title, description, location} = req.body
    const issueImageId = req.file ? req.file.filename : null
    const issueImage = req.file ? req.file.path : null
    const user = req.user as { id: string } | undefined;
  if (!user || !user.id) {
      return res.status(401).json({ error: "Unauthorized access" });
  }
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
        const error = err as  Error
        res.status(500).json({error: error.message})
    }
}

export async function deleteIssue(req: Request, res:  Response) {
    try {
        let { id } = req.params
      const issue = await Issue.findById(id)
      
      if (!issue) return res.status(401).json({ error: "Issue not found" })
      
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
      const error = err as  Error
        res.status(500).json({error: error.message})
    }
}

export async function getMyIssues(req: Request, res:Response) {
  const user = req.user as {id: string};
  if(!user) return res.status(401).json({ error: "Unauthorized access" });
    const citizenId = user.id;
    try {
        const issues = await Issue.find({createdBy: citizenId})
        res.json(issues)
    } catch (err) {
        const error = err as  Error
        res.status(500).json({error: error.message})
    }
}

export async function getAllIssues(req: Request, res:Response) {
    const page = parseInt(String(req.query.page))
    const limit = parseInt(String(req.query.limit))
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
        const error = err as  Error
        res.status(500).json({error: error.message})
    }
}

export async function getDetails(req: Request, res:Response) {
    
    try {
        let { id } = req.params
        const issue = await Issue.findById(id).populate('createdBy', 'username').populate('comments.userID', 'username')
        // console.log("Issue after populate", JSON.stringify(issue, null, 2))


        if(!issue) {
            return res.status(404).json({ message: "Issue not found"})
        }
        return res.status(200).json(issue)
    } catch (err) {
        const error = err as  Error
        res.status(500).json({error: error.message})
    }
}

export async function postComment(req: Request, res:Response) {
        const { comment } = req.body
        const user = req.user as { id: string };
        if (!user || !user.id) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
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
        const error = err as  Error
        res.status(500).json({error: error.message + "true"})
    }
}

export async function updateIssueOfficer(req: Request, res:Response) {
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
    } catch (err) {
        const error = err as  Error
        res.status(500).json({error: 'Issue not found'})
    }
}



export async function getOfficerIssues(req: Request, res:Response) {
            let {name} = req.params
            const page = parseInt(String(req.query.page))
            const limit = parseInt(String(req.query.limit))
            const totalItems = await Issue.countDocuments({officer : name})
            const currentpage = page
    
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
        const error = err as  Error
        res.status(500).json({ error: error.message })
    }


}

export async function updateIssueStatus(req: Request, res:Response) {
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
    } catch (err) {
        const error = err as  Error
        res.status(500).json({error: 'Issue not found'})
    }
}

export async function addFixPhoto(req: Request, res:Response) {
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
        const error = err as  Error
        res.status(500).json({error: error.message})
    }
}