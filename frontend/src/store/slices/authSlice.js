import { createSlice } from "@reduxjs/toolkit";

// Persist user and token across page refreshes using localStorage
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called after successful login or register
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.error = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    // Called on logout — clear everything
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    // Update user in Redux store after profile update
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, logout, setUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
