// Auth controller - handles user registration and login
// register: creates new user account with hashed password
// login: verifies credentials and returns JWT token
// getProfile: returns logged in user data
// updateProfile: updates user profile and settings

import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Helper function to generate JWT token
// Token contains user id and expires in 7 days
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
export const register = async (req, res) => {
  try {
    const { fullName, businessName, email, password } = req.body

    // Check if all required fields are provided
    if (!fullName || !businessName || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    // Check if user already exists with this email
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    // Create new user - password will be hashed automatically by model
    const user = await User.create({
      fullName,
      businessName,
      email,
      password,
    })

    // Return user data with token
    res.status(201).json({
      message: 'Account created successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        businessName: user.businessName,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   POST /api/auth/login
// @desc    Login user and return token
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Compare entered password with hashed password in database
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Return user data with token
    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        businessName: user.businessName,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   GET /api/auth/profile
// @desc    Get logged in user profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user._id).select('-password')
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    // Find user and update with new data
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update only the fields that are sent in request
    user.fullName = req.body.fullName || user.fullName
    user.phone = req.body.phone || user.phone
    user.businessName = req.body.businessName || user.businessName
    user.businessAddress = req.body.businessAddress || user.businessAddress
    user.city = req.body.city || user.city
    user.state = req.body.state || user.state
    user.pincode = req.body.pincode || user.pincode
    user.gstNumber = req.body.gstNumber || user.gstNumber
    user.defaultTaxRate = req.body.defaultTaxRate || user.defaultTaxRate
    user.defaultPaymentTerms = req.body.defaultPaymentTerms || user.defaultPaymentTerms
    user.invoicePrefix = req.body.invoicePrefix || user.invoicePrefix
    user.defaultNotes = req.body.defaultNotes || user.defaultNotes
    user.defaultTerms = req.body.defaultTerms || user.defaultTerms

    // Save updated user
    const updatedUser = await user.save()

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        businessName: updatedUser.businessName,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

