import { createSlice } from "@reduxjs/toolkit";

// Invoice slice — no dummy data, populated from real API calls
const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoices: [],          // Full list of invoices from API
    currentInvoice: null,  // Single invoice being viewed/edited
    loading: false,
    error: null,
  },
  reducers: {
    // Set full list (on fetch)
    setInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    // Set single invoice for detail/edit view
    setCurrentInvoice: (state, action) => {
      state.currentInvoice = action.payload;
    },
    // Add new invoice to top of list
    addInvoice: (state, action) => {
      state.invoices.unshift(action.payload);
    },
    // Update an existing invoice in the list
    updateInvoice: (state, action) => {
      const index = state.invoices.findIndex((i) => i._id === action.payload._id);
      if (index !== -1) state.invoices[index] = action.payload;
    },
    // Remove invoice from list by _id
    deleteInvoice: (state, action) => {
      state.invoices = state.invoices.filter((i) => i._id !== action.payload);
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
  setInvoices,
  setCurrentInvoice,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  setLoading,
  setError,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
