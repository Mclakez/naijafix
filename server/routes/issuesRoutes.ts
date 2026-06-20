import express from 'express'
import { postIssue, getMyIssues, getAllIssues, getDetails, addFixPhoto, postComment, deleteIssue, updateIssueOfficer, getOfficerIssues, updateIssueStatus} from '../controllers/issuesControllers.js'
import { requireAuth, requireOfficer } from '../middleware/auth.js'
import { checkSuspension } from '../middleware/checkSuspension.js'
import { lastSeenOnline } from '../middleware/lastSeenOnline.js'
import { upload } from "../config/multer.js";
import { issuesValidator } from "../validators/issuesValidator.js";


export const issuesRouter = express.Router()


// issuesRouter.use((req, res, next) => {
//     console.log(`issuesRouter -> ${new Date().toISOString()} ${req.method} ${req.originalUrl} | Authorization: ${req.headers.authorization || 'NONE'}`)
//     next()
// })
issuesRouter.post('/', requireAuth, upload.single('issueImage'), checkSuspension, issuesValidator, postIssue)
issuesRouter.get('/', requireAuth, lastSeenOnline, getAllIssues)
issuesRouter.get('/my', requireAuth, lastSeenOnline, getMyIssues)
issuesRouter.patch('/status/:id', requireAuth, checkSuspension, lastSeenOnline, updateIssueStatus)
issuesRouter.get('/:id', requireAuth, checkSuspension, getDetails)
issuesRouter.get('/officer/:name', requireAuth, lastSeenOnline, checkSuspension, getOfficerIssues)
issuesRouter.delete('/delete/:id', requireAuth, deleteIssue)
issuesRouter.post('/:id/comment', requireAuth, checkSuspension, upload.none(), postComment)
issuesRouter.patch('/officers/:id', updateIssueOfficer)
 issuesRouter.patch('/fix/:id', requireAuth, lastSeenOnline, upload.single('fixImage'), addFixPhoto)