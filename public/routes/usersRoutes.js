import express from 'express'
import { getAllUsers, getAllOfficers } from '../controllers/usersControllers.js'

export const usersRouter = express.Router()

usersRouter.get('/', getAllUsers)
usersRouter.get('/officers', getAllOfficers)