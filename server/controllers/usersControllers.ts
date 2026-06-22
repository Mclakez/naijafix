import { User } from '../models/Users.js'
import { Issue } from '../models/Issues.js'
import { RefreshToken } from '../models/RefreshToken.js'
import bcrypt from 'bcrypt'
import { Request, Response  } from 'express'


export async function getAllUsers(req: Request, res: Response) {
    const page = parseInt(String(req.query.page))
    const limit = parseInt(String(req.query.limit))
    const totalItems = await User.countDocuments({role: "user"})
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
        const error = err as  Error
        res.status(500).json({error: error.message})
    }
}

export async function getAllOfficers(req: Request, res: Response) { 
    const page = parseInt(String(req.query.page))
        const limit = parseInt(String(req.query.limit))
        const totalItems = await User.countDocuments({role : "officer"})
        const currentpage = page
    try {     
            if(page && limit) {
                let officers = await User.aggregate([
                {
                    $match: {
                        role: "officer"
                    }
                },  
                {
                    $lookup: {
                        from: "issues",
                        localField: "username",
                        foreignField: "officer",
                        as: "issues"
                    }
                },
                {
                    $addFields: {
                        totalIssues: {$size: "$issues"},
                        issuesResolved: {$size: {
                            $filter: {
                                input: "$issues",
                                as:"issue",
                                cond: {$eq: ["$$issue.status", "resolved"]}
                            }
                        }}
                    }
                },         
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { 
                    $skip: (page - 1) * limit 
                },
                { 
                    $limit : limit
                }
            ])

            
            res.status(200).json({
                officers,
                totalPages: Math.ceil(totalItems/limit),
                currentpage
            })

            } else {
                let officers = await User.aggregate([
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
            }
            
        


    } catch (err) {
        const error = err as  Error
        res.status(500).json({ error: error.message })
    }
}


export async function deleteUser(req: Request,res: Response) {
    let {id} = req.params

    try {
        let deletedUser = await User.findByIdAndDelete(id)
        res.status(200).json({deletedUser})
    } catch(err) {
        const error = err as  Error
        res.status(500).json({ error: error.message })
    }


}

export async function suspendUser(req: Request, res: Response){
    let { id } = req.params
    let days = 7
    let expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + days)

    try{

        let suspendedUser = await User.findByIdAndUpdate(
            id,
            {suspension : "suspended", suspendedUntil: expiryDate}
        )

    } catch(err) {
        const error = err as  Error
        res.status(500).json({ error: error.message })
    }
}

export async function addOfficer(req: Request, res: Response) {
    let {username, email, password} = req.body
    let hashed = await bcrypt.hash(password, 10)

    try {
        let newOfficer = await User.create({
            username,
            email,
            password : hashed,
            role: "officer"
        })
        res.status(200).json(newOfficer)
    } catch (err) {
        const error = err as  Error
        res.status(500).json({error: error.message})
    }
}

export async function logOutUser(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken
    
    try {
        res.clearCookie('refreshToken')
        if (refreshToken) {
            try {
                await RefreshToken.deleteOne({token: refreshToken})
            } catch (dbError) {
                console.error('Failed to delete token from DB:', dbError)
            }
        }
        
        return res.status(200).json({success: true})
        
    } catch (error) {
        return res.status(500).json({error: 'Logout failed'})
    }
}