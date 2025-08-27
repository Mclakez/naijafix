import express from 'express'
import { postIssue, getMyIssues, getAllIssues, updateIssuesStatus, addFixPhoto } from '../controllers/issuesControllers.js'
import { requireAuth, requireOfficer } from '../middleware/auth.js'
import { upload } from "../config/multer.js";
import { issuesValidator } from "../validators/issuesValidator.js";


export const issuesRouter = express.Router()

issuesRouter.post('/', issuesValidator, requireAuth, upload.single('image'), postIssue)
issuesRouter.get('/', requireAuth, getAllIssues)
issuesRouter.get('/my', requireAuth, getMyIssues)
issuesRouter.patch('/:id/status', requireAuth, requireOfficer, updateIssuesStatus)

issuesRouter.patch('/:id/fix-photo', requireAuth, requireOfficer, upload.single('proof'), addFixPhoto)