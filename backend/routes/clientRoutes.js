// Client routes - all routes are private (need JWT token)
// GET    /api/clients       - get all clients
// GET    /api/clients/:id   - get one client
// POST   /api/clients       - create client
// PUT    /api/clients/:id   - update client
// DELETE /api/clients/:id   - delete client

import express from 'express'
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from '../controllers/clientController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Apply protect middleware to all routes below
router.use(protect)

router.route('/')
  .get(getAllClients)
  .post(createClient)

router.route('/:id')
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient)

export default router

