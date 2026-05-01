// User model - stores user account information
// Password is stored in hashed format using bcrypt
// Each user has their own invoices and clients

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    phone: {
      type: String,
      default: '',
    },
    businessLogo: {
      type: String,
      default: '',
    },
    businessAddress: {
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
    gstNumber: {
      type: String,
      default: '',
    },
    defaultTaxRate: {
      type: Number,
      default: 18,
    },
    defaultPaymentTerms: {
      type: String,
      default: 'Net 30',
    },
    invoicePrefix: {
      type: String,
      default: 'INV-',
    },
    defaultNotes: {
      type: String,
      default: 'Thank you for your business!',
    },
    defaultTerms: {
      type: String,
      default: 'Payment is due within 30 days.',
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving to database
// This runs automatically before every save
userSchema.pre('save', async function (next) {
  // Only hash password if it was changed or is new
  if (!this.isModified('password')) return next()

  // Hash the password with salt rounds of 10
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User

