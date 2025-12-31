import express from 'express'
import { getAllUsers } from '../controllers/usersControllers.js'

export const usersRouter = express.Router()

usersRouter.get('/', getAllUsers)