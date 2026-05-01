// Main server file - entry point of the backend
// Sets up express app, middleware, routes and starts server

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import clientRoutes from './routes/clientRoutes.js'
import invoiceRoutes from './routes/invoiceRoutes.js'

// Load environment variables from .env file
dotenv.config()

// Connect to MongoDB database
connectDB()

const app = express()

// Middleware
// cors allows frontend to communicate with backend
app.use(cors())

// express.json allows us to receive JSON data in requests
app.use(express.json())

// morgan logs every request in the terminal (dev mode)
app.use(morgan('dev'))

// Routes
// All auth routes: /api/auth/register, /api/auth/login etc
app.use('/api/auth', authRoutes)

// All client routes: /api/clients
app.use('/api/clients', clientRoutes)

// All invoice routes: /api/invoices
app.use('/api/invoices', invoiceRoutes)

// Default route to check if server is running
app.get('/', (req, res) => {
  res.json({ message: 'InvoiceFlow API is running' })
})

// Start server on port from .env or default 5000
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

