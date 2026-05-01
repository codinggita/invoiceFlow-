// Auth middleware - protects private routes
// It checks if the request has a valid JWT token
// If token is valid, it adds the user info to the request
// If token is missing or invalid, it returns 401 error

import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
  let token

  // Check if token exists in Authorization header
  // Token format: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header (remove "Bearer " prefix)
      token = req.headers.authorization.split(' ')[1]

      // Verify the token using our JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Find the user from database using id from token
      // We exclude password from the result
      req.user = await User.findById(decoded.id).select('-password')

      // Move to the next middleware or route handler
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }
}

export default protect

