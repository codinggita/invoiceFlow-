// Client controller - handles all CRUD operations for clients
// All routes are protected - user must be logged in
// Each user can only see and manage their own clients

import Client from '../models/Client.js'

// @route   GET /api/clients
// @desc    Get all clients of logged in user
// @access  Private
export const getAllClients = async (req, res) => {
  try {
    // Find all clients that belong to the logged in user
    const clients = await Client.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json(clients)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   GET /api/clients/:id
// @desc    Get single client by id
// @access  Private
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)

    // Check if client exists
    if (!client) {
      return res.status(404).json({ message: 'Client not found' })
    }

    // Check if this client belongs to the logged in user
    if (client.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this client' })
    }

    res.status(200).json(client)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   POST /api/clients
// @desc    Create new client
// @access  Private
export const createClient = async (req, res) => {
  try {
    const {
      fullName, email, phone, companyName,
      gstNumber, website, addressLine1,
      addressLine2, city, state, pincode
    } = req.body

    // Check required fields
    if (!fullName || !email || !phone || !companyName) {
      return res.status(400).json({ message: 'Please fill all required fields' })
    }

    // Create client and link it to the logged in user
    const client = await Client.create({
      userId: req.user._id,
      fullName,
      email,
      phone,
      companyName,
      gstNumber,
      website,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
    })

    res.status(201).json({
      message: 'Client created successfully',
      client,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   PUT /api/clients/:id
// @desc    Update client
// @access  Private
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)

    // Check if client exists
    if (!client) {
      return res.status(404).json({ message: 'Client not found' })
    }

    // Check if this client belongs to the logged in user
    if (client.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this client' })
    }

    // Update client with new data
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.status(200).json({
      message: 'Client updated successfully',
      client: updatedClient,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   DELETE /api/clients/:id
// @desc    Delete client
// @access  Private
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)

    // Check if client exists
    if (!client) {
      return res.status(404).json({ message: 'Client not found' })
    }

    // Check if this client belongs to the logged in user
    if (client.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this client' })
    }

    // Delete the client
    await Client.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Client deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

