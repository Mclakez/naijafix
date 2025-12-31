import { User } from '../models/Users.js'
import { Issue } from '../models/Issues.js'

export async function getAllUsers(req, res) {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const totalItems = await User.countDocuments()
    const currentpage = page
    
    try {
            const skip = (page - 1) * limit
             
            const usersWithIssuesCount = await User.aggregate([
                {
                    $match: {
                        role: "user"
                    }
                },
                {
                    $lookup: {
                        from: "issues",
                        localField: "_id",
                        foreignField: "createdBy",
                        as: "issues"
                    }
                },
                {
                    $addFields: {
                        totalIssues: {$size: "$issues"}
                    }
                },            
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                }
            ])


            res.json({
                usersWithIssuesCount,
                totalPages: Math.ceil(totalItems/limit),
                currentpage
            })
        


    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export async function getAllOfficers(req, res) { 
    
    try {     
              
            const officers = await User.aggregate([
                {
                    $match: {
                        role: "officer"
                    }
                },           
                {
                    $sort: {
                        createdAt: -1
                    }
                }
            ])

            
res.status(200).json({officers})
        


    } catch (err) {
        console.error('Error in getAllOfficers:', err)
        res.status(500).json({ error: err.message })
    }
}
