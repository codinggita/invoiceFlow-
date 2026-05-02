// Invoice model - stores all invoice information
// Each invoice belongs to one user and one client
// items is an array because one invoice can have multiple items

import mongoose from 'mongoose'

// Schema for each item inside an invoice
const invoiceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
  },
})

const invoiceSchema = new mongoose.Schema(
  {
    // Which user created this invoice
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Which client this invoice is for
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    // Auto generated invoice number like INV-0001
    // ✅ Correct - unique per user only
    invoiceNumber: {
      type: String,
      required: true,
    },
     issueDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    // Array of items in this invoice
    items: [invoiceItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Overdue', 'Draft'],
      default: 'Unpaid',
    },
    notes: {
      type: String,
      default: '',
    },
    terms: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

const Invoice = mongoose.model('Invoice', invoiceSchema)
export default Invoice

