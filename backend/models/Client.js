// Client model - stores client information
// Each client belongs to one user (the business owner)
// userId links the client to the logged in user

import mongoose from 'mongoose'

const clientSchema = new mongoose.Schema(
  {
    // Which user this client belongs to
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Client email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    gstNumber: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    addressLine1: {
      type: String,
      default: '',
    },
    addressLine2: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    pincode: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

const Client = mongoose.model('Client', clientSchema)
export default Client

