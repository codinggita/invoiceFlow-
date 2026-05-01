// Central API utility — all fetch calls go through here
// Uses JWT token stored in localStorage for protected routes

const BASE_URL = "http://localhost:5000/api";

// Get saved token from localStorage
const getToken = () => localStorage.getItem("token");

// Build headers with Authorization for protected endpoints
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ──────────────────────────────────────────────
// AUTH API
// ──────────────────────────────────────────────
export const authAPI = {
  // POST /api/auth/register
  register: (data) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  // POST /api/auth/login
  login: (data) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  // GET /api/auth/profile
  getProfile: () =>
    fetch(`${BASE_URL}/auth/profile`, {
      headers: getHeaders(),
    }).then((res) => res.json()),

  // PUT /api/auth/profile
  updateProfile: (data) =>
    fetch(`${BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json()),
};

// ──────────────────────────────────────────────
// CLIENTS API
// ──────────────────────────────────────────────
export const clientsAPI = {
  // GET /api/clients
  getAll: () =>
    fetch(`${BASE_URL}/clients`, {
      headers: getHeaders(),
    }).then((res) => res.json()),

  // GET /api/clients/:id
  getById: (id) =>
    fetch(`${BASE_URL}/clients/${id}`, {
      headers: getHeaders(),
    }).then((res) => res.json()),

  // POST /api/clients
  create: (data) =>
    fetch(`${BASE_URL}/clients`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  // PUT /api/clients/:id
  update: (id, data) =>
    fetch(`${BASE_URL}/clients/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  // DELETE /api/clients/:id
  delete: (id) =>
    fetch(`${BASE_URL}/clients/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((res) => res.json()),
};

// ──────────────────────────────────────────────
// INVOICES API
// ──────────────────────────────────────────────
export const invoicesAPI = {
  // GET /api/invoices
  getAll: () =>
    fetch(`${BASE_URL}/invoices`, {
      headers: getHeaders(),
    }).then((res) => res.json()),

  // GET /api/invoices/:id
  getById: (id) =>
    fetch(`${BASE_URL}/invoices/${id}`, {
      headers: getHeaders(),
    }).then((res) => res.json()),

  // POST /api/invoices
  create: (data) =>
    fetch(`${BASE_URL}/invoices`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  // PUT /api/invoices/:id
  update: (id, data) =>
    fetch(`${BASE_URL}/invoices/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then((res) => res.json()),

  // DELETE /api/invoices/:id
  delete: (id) =>
    fetch(`${BASE_URL}/invoices/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((res) => res.json()),
};
