import express from 'express'
import { getAllUsers, getAllOfficers, deleteUser, suspendUser } from '../controllers/usersControllers.js'

export const usersRouter = express.Router()

usersRouter.get('/', getAllUsers)
usersRouter.patch('/suspend/:id', suspendUser)
usersRouter.delete('/:id', deleteUser)
usersRouter.get('/officers', getAllOfficers)