import express from 'express'
import { getAllUsers, getAllOfficers, deleteUser, suspendUser, addOfficer } from '../controllers/usersControllers.js'
import { requireAuth } from "../middleware/auth.js"

export const usersRouter = express.Router()

usersRouter.get('/',requireAuth, getAllUsers)
usersRouter.patch('/suspend/:id', requireAuth, suspendUser)
usersRouter.delete('/:id', requireAuth, deleteUser)
usersRouter.get('/officers', requireAuth, getAllOfficers)
usersRouter.post('/officers', requireAuth, addOfficer)