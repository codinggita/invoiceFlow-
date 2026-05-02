// Invoice controller - handles all CRUD operations for invoices
// All routes are protected - user must be logged in
// Each user can only see and manage their own invoices

import Invoice from '../models/Invoice.js'
import User from '../models/User.js'

// Generate invoice number unique per user only
// Each user gets their own sequence: INV-0001, INV-0002...
const generateInvoiceNumber = async (userId) => {
  const user = await User.findById(userId)
  const prefix = user.invoicePrefix || 'INV-'

  // Find last invoice of THIS user only
  const lastInvoice = await Invoice.findOne({ userId })
    .sort({ createdAt: -1 })
    .select('invoiceNumber')

  if (!lastInvoice) {
    // First invoice for this user
    return `${prefix}0001`
  }

  // Extract number from last invoice: INV-0003 → 3
  const lastNumber = parseInt(
    lastInvoice.invoiceNumber.replace(/[^0-9]/g, ''), 10
  )

  // Increment and pad with zeros
  const nextNumber = String(lastNumber + 1).padStart(4, '0')
  return `${prefix}${nextNumber}`
}

// @route   GET /api/invoices
// @desc    Get all invoices of logged in user
// @access  Private
export const getAllInvoices = async (req, res) => {
  try {
    // Find all invoices of logged in user
    // populate('clientId') replaces clientId with actual client data
    const invoices = await Invoice.find({ userId: req.user._id })
      .populate('clientId', 'fullName email companyName')
      .sort({ createdAt: -1 })

    res.status(200).json(invoices)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   GET /api/invoices/:id
// @desc    Get single invoice by id
// @access  Private
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('clientId', 'fullName email phone companyName addressLine1 city state pincode')

    // Check if invoice exists
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }

    // Check if this invoice belongs to the logged in user
    if (invoice.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this invoice' })
    }

    res.status(200).json(invoice)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   POST /api/invoices
// @desc    Create new invoice
// @access  Private
export const createInvoice = async (req, res) => {
  try {
    const {
      clientId, issueDate, dueDate,
      items, taxRate, discount, notes, terms, status
    } = req.body

    // Check required fields
    if (!clientId || !issueDate || !dueDate || !items || items.length === 0) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    // Calculate subtotal from all items
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)

    // Calculate tax amount
    const taxAmount = (subtotal * (taxRate || 0)) / 100

    // Calculate final total
    const totalAmount = subtotal + taxAmount - (discount || 0)

    // Generate unique invoice number
    const invoiceNumber = await generateInvoiceNumber(req.user._id)

    // Create the invoice
    const invoice = await Invoice.create({
      userId: req.user._id,
      clientId,
      invoiceNumber,
      issueDate,
      dueDate,
      items,
      subtotal,
      taxRate: taxRate || 0,
      taxAmount,
      discount: discount || 0,
      totalAmount,
      status: status || 'Unpaid',
      notes: notes || '',
      terms: terms || '',
    })

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   PUT /api/invoices/:id
// @desc    Update invoice
// @access  Private
export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)

    // Check if invoice exists
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }

    // Check if this invoice belongs to the logged in user
    if (invoice.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this invoice' })
    }

    // If items are updated, recalculate totals
    if (req.body.items) {
      const subtotal = req.body.items.reduce((sum, item) => sum + item.total, 0)
      const taxRate = req.body.taxRate || invoice.taxRate
      const taxAmount = (subtotal * taxRate) / 100
      const discount = req.body.discount || invoice.discount
      const totalAmount = subtotal + taxAmount - discount

      req.body.subtotal = subtotal
      req.body.taxAmount = taxAmount
      req.body.totalAmount = totalAmount
    }

    // Update invoice with new data
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.status(200).json({
      message: 'Invoice updated successfully',
      invoice: updatedInvoice,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   DELETE /api/invoices/:id
// @desc    Delete invoice
// @access  Private
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)

    // Check if invoice exists
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }

    // Check if this invoice belongs to the logged in user
    if (invoice.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this invoice' })
    }

    // Delete the invoice
    await Invoice.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Invoice deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}