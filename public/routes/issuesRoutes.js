import express from 'express'
import { postIssue, getMyIssues, getAllIssues, getDetails, updateIssuesStatus, postComment} from '../controllers/issuesControllers.js'
import { requireAuth, requireOfficer } from '../middleware/auth.js'
import { upload } from "../config/multer.js";
import { issuesValidator } from "../validators/issuesValidator.js";


export const issuesRouter = express.Router()


// issuesRouter.use((req, res, next) => {
//     console.log(`issuesRouter -> ${new Date().toISOString()} ${req.method} ${req.originalUrl} | Authorization: ${req.headers.authorization || 'NONE'}`)
//     next()
// })
issuesRouter.post('/', requireAuth, upload.single('issueImage'), issuesValidator, postIssue)
issuesRouter.get('/', requireAuth, getAllIssues)
issuesRouter.get('/my', requireAuth, getMyIssues)
issuesRouter.get('/:id', requireAuth, getDetails)
issuesRouter.post('/:id/comment', requireAuth,upload.none(), postComment)
issuesRouter.patch('/:id/status', requireAuth, requireOfficer, upload.single('proof'),updateIssuesStatus)

// issuesRouter.patch('/:id/fix-photo', requireAuth, requireOfficer,, addFixPhoto)