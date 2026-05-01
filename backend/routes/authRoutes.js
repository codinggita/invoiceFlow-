// Auth routes
// Public routes: register, login
// Private routes: getProfile, updateProfile (need JWT token)

import express from 'express'
import {
  register,
  login,
  getProfile,
  updateProfile,
} from '../controllers/authController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes - no token needed
router.post('/register', register)
router.post('/login', login)

// Private routes - token required
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)

export default router

