import express from 'express'
import { postIssue, getMyIssues, getAllIssues, updateIssuesStatus} from '../controllers/issuesControllers.js'
import { requireAuth, requireOfficer } from '../middleware/auth.js'
import { upload } from "../config/multer.js";
import { issuesValidator } from "../validators/issuesValidator.js";


export const issuesRouter = express.Router()

issuesRouter.post('/', requireAuth, upload.single('issueImage'), issuesValidator, postIssue)
issuesRouter.get('/', requireAuth, getAllIssues)
issuesRouter.get('/my', requireAuth, getMyIssues)
issuesRouter.patch('/:id/status', requireAuth, requireOfficer, upload.single('proof'),updateIssuesStatus)

// issuesRouter.patch('/:id/fix-photo', requireAuth, requireOfficer,, addFixPhoto)