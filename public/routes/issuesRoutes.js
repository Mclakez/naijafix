import express from 'express'
import { postIssue, getMyIssues, getAllIssues, getDetails, updateIssuesStatus, postComment, deleteIssue, updateIssueOfficer} from '../controllers/issuesControllers.js'
import { requireAuth, requireOfficer } from '../middleware/auth.js'
import { checkSuspension } from '../middleware/checkSuspension.js'
import { upload } from "../config/multer.js";
import { issuesValidator } from "../validators/issuesValidator.js";


export const issuesRouter = express.Router()


// issuesRouter.use((req, res, next) => {
//     console.log(`issuesRouter -> ${new Date().toISOString()} ${req.method} ${req.originalUrl} | Authorization: ${req.headers.authorization || 'NONE'}`)
//     next()
// })
issuesRouter.post('/', requireAuth, upload.single('issueImage'),checkSuspension, issuesValidator, postIssue)
issuesRouter.get('/', requireAuth, getAllIssues)
issuesRouter.get('/my', requireAuth, getMyIssues)
issuesRouter.get('/:id', requireAuth, checkSuspension, getDetails)
issuesRouter.delete('/delete/:id', requireAuth, deleteIssue)
issuesRouter.post('/:id/comment', requireAuth,checkSuspension, upload.none(), postComment)
issuesRouter.patch('/officers/:id', updateIssueOfficer)
issuesRouter.patch('/:id/status', requireAuth, requireOfficer, upload.single('proof'),updateIssuesStatus)

// issuesRouter.patch('/:id/fix-photo', requireAuth, requireOfficer,, addFixPhoto)