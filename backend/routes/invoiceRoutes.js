// Invoice routes - all routes are private (need JWT token)
// GET    /api/invoices       - get all invoices
// GET    /api/invoices/:id   - get one invoice
// POST   /api/invoices       - create invoice
// PUT    /api/invoices/:id   - update invoice
// DELETE /api/invoices/:id   - delete invoice

import express from 'express'
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from '../controllers/invoiceController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Apply protect middleware to all routes below
router.use(protect)

router.route('/')
  .get(getAllInvoices)
  .post(createInvoice)

router.route('/:id')
  .get(getInvoiceById)
  .put(updateInvoice)
  .delete(deleteInvoice)

export default router

