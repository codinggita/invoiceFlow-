import { createSlice } from "@reduxjs/toolkit";

// Client slice — no dummy data, populated from real API calls
const clientSlice = createSlice({
  name: "client",
  initialState: {
    clients: [],          // Full list of clients from API
    currentClient: null,  // Single client being viewed/edited
    loading: false,
    error: null,
  },
  reducers: {
    // Set full list (on fetch)
    setClients: (state, action) => {
      state.clients = action.payload;
    },
    // Set single client for edit view
    setCurrentClient: (state, action) => {
      state.currentClient = action.payload;
    },
    // Add new client to top of list
    addClient: (state, action) => {
      state.clients.unshift(action.payload);
    },
    // Update an existing client in the list
    updateClient: (state, action) => {
      const index = state.clients.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) state.clients[index] = action.payload;
    },
    // Remove client from list by _id
    deleteClient: (state, action) => {
      state.clients = state.clients.filter((c) => c._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setClients,
  setCurrentClient,
  addClient,
  updateClient,
  deleteClient,
  setLoading,
  setError,
} = clientSlice.actions;

export default clientSlice.reducer;
