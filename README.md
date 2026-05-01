# InvoiceFlow 🧾

> A full-stack Invoice Management Web Application built for micro and small businesses (B2B) to create, track, and manage invoices efficiently — replacing manual and error-prone processes.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Author](#author)

---

## 📌 About the Project

**InvoiceFlow** is a web-based invoice management system designed specifically for micro and small businesses that currently waste 10+ hours weekly managing invoices manually using spreadsheets or paper. This application provides a clean, simple, and professional alternative to expensive enterprise ERP systems.

This project was built as a college project under the **Razorpay Problem Statement** — solving real-world financial pain points for small business owners.

---

## 🚨 Problem Statement

> *Why do micro-SMEs waste 10+ hours weekly on invoice management?*

Micro and small businesses waste significant administrative time creating, tracking, and reconciling invoices manually because:

- Enterprise-grade ERP systems are **prohibitively expensive**
- Existing tools are **overly complex** for simple needs
- They require **extensive training** that small teams cannot afford

**Severity Score:** 7/10 | **TAM Score:** 7/10 | **Frequency Score:** 9/10 | **Itch Score:** 67.5

---

## ✨ Features

### Authentication
- User Registration with business details
- Secure Login with JWT Token
- Protected Routes (unauthorized users redirected to login)
- Password stored in hashed format using Bcrypt
- Persistent login using localStorage

### Dashboard
- Overview stats — Total Invoices, Paid, Unpaid, Overdue
- Recent Invoices table with status badges
- Quick actions — Add Client, New Invoice

### Invoice Management
- Create invoices with multiple line items
- Auto-generated invoice numbers (INV-0001, INV-0002...)
- Auto-calculated Subtotal, Tax, Discount, and Total
- Filter invoices by status — All, Paid, Unpaid, Overdue
- Search invoices by client name or invoice number
- View detailed invoice with printable layout
- Edit existing invoices
- Delete invoices with confirmation
- Mark invoices as Paid directly from detail view
- Save invoices as Draft

### Client Management
- Add, Edit, Delete clients
- Client cards with initials avatar
- Search clients by name or company
- View all invoices linked to a client

### Settings
- Update personal profile (name, phone)
- Update business information (name, logo, address, GST number)
- Set invoice preferences (default tax rate, payment terms, prefix, notes, terms)

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | UI Framework |
| Redux Toolkit | State Management |
| React Router DOM | Client-side Routing |
| Material UI (MUI) | UI Component Library |
| Tailwind CSS | Utility-first Styling |
| Formik + Yup | Form Handling and Validation |
| Fetch API | HTTP Requests to Backend |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | NoSQL Database |
| Mongoose | MongoDB Object Modeling |
| JSON Web Token (JWT) | Authentication |
| Bcrypt | Password Hashing |
| Morgan | HTTP Request Logger |
| CORS | Cross-Origin Resource Sharing |
| Dotenv | Environment Variable Management |
| Nodemon | Auto-restart in Development |

---

## 📁 Project Structure

```
InvoiceFlow/
│
├── frontend/                          # React.js Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   │   ├── Sidebar.jsx        # Fixed sidebar navigation
│       │   │   ├── Navbar.jsx         # Top navigation bar
│       │   │   ├── StatCard.jsx       # Reusable stat card
│       │   │   ├── StatusBadge.jsx    # Paid/Unpaid/Overdue badge
│       │   │   └── ProtectedRoute.jsx # Auth guard for private routes
│       │   ├── invoices/
│       │   │   ├── InvoiceTable.jsx   # Reusable invoice table
│       │   │   └── InvoiceForm.jsx    # Shared create/edit form
│       │   └── clients/
│       │       ├── ClientCard.jsx     # Client grid card
│       │       └── ClientForm.jsx     # Add/edit client form
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── Login.jsx          # Login page
│       │   │   └── Register.jsx       # Register page
│       │   ├── dashboard/
│       │   │   └── Dashboard.jsx      # Main dashboard
│       │   ├── invoices/
│       │   │   ├── InvoiceList.jsx    # All invoices with filters
│       │   │   ├── CreateInvoice.jsx  # Create new invoice
│       │   │   ├── EditInvoice.jsx    # Edit existing invoice
│       │   │   └── InvoiceDetail.jsx  # View invoice detail
│       │   ├── clients/
│       │   │   ├── ClientList.jsx     # All clients grid
│       │   │   └── AddEditClient.jsx  # Add or edit client
│       │   └── settings/
│       │       ├── Settings.jsx           # Settings layout
│       │       ├── ProfileSettings.jsx    # Personal profile
│       │       ├── BusinessInfo.jsx       # Business details
│       │       └── InvoicePreferences.jsx # Invoice defaults
│       ├── layouts/
│       │   ├── AuthLayout.jsx         # Layout for login/register
│       │   └── DashboardLayout.jsx    # Layout with sidebar
│       ├── routes/
│       │   └── AppRoutes.jsx          # All route definitions
│       ├── store/
│       │   ├── store.js               # Redux store config
│       │   └── slices/
│       │       ├── authSlice.js       # Auth state
│       │       ├── invoiceSlice.js    # Invoice state
│       │       └── clientSlice.js     # Client state
│       ├── utils/
│       │   ├── api.js                 # All API call functions
│       │   └── validators.js          # Yup validation schemas
│       ├── constants/
│       │   └── index.js               # App-wide constants
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── backend/                           # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                      # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js          # Register, Login, Profile
│   │   ├── invoiceController.js       # Invoice CRUD operations
│   │   └── clientController.js        # Client CRUD operations
│   ├── models/
│   │   ├── User.js                    # User schema
│   │   ├── Invoice.js                 # Invoice schema
│   │   └── Client.js                  # Client schema
│   ├── routes/
│   │   ├── authRoutes.js              # Auth API routes
│   │   ├── invoiceRoutes.js           # Invoice API routes
│   │   └── clientRoutes.js            # Client API routes
│   ├── middleware/
│   │   └── authMiddleware.js          # JWT token verification
│   ├── .env                           # Environment variables
│   └── server.js                      # Express app entry point
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or above)
- [npm](https://www.npmjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/yourusername/invoiceflow.git
cd invoiceflow
```

### Step 2 — Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

Start the backend server:

```bash
npm run dev
```

Backend will run at: `http://localhost:5000`

### Step 3 — Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`

### Step 4 — Open in Browser

```
http://localhost:5173
```

Register a new account → Login → Start managing invoices!

---

## 🔐 Environment Variables

### Backend `.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port for backend server | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |
| `JWT_EXPIRE` | JWT token expiry time | `7d` |

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login and get token | Public |
| GET | `/api/auth/profile` | Get logged in user profile | Private |
| PUT | `/api/auth/profile` | Update user profile | Private |

### Invoice Routes — `/api/invoices`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/invoices` | Get all invoices of user | Private |
| GET | `/api/invoices/:id` | Get single invoice | Private |
| POST | `/api/invoices` | Create new invoice | Private |
| PUT | `/api/invoices/:id` | Update invoice | Private |
| DELETE | `/api/invoices/:id` | Delete invoice | Private |

### Client Routes — `/api/clients`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/clients` | Get all clients of user | Private |
| GET | `/api/clients/:id` | Get single client | Private |
| POST | `/api/clients` | Create new client | Private |
| PUT | `/api/clients/:id` | Update client | Private |
| DELETE | `/api/clients/:id` | Delete client | Private |

> **Note:** All Private routes require `Authorization: Bearer <token>` header.

---

## 🗄️ Database Schema

### User
```
fullName, businessName, email, password (hashed),
phone, businessLogo, businessAddress, city, state,
pincode, gstNumber, defaultTaxRate, defaultPaymentTerms,
invoicePrefix, defaultNotes, defaultTerms
```

### Client
```
userId (ref: User), fullName, email, phone,
companyName, gstNumber, website, addressLine1,
addressLine2, city, state, pincode
```

### Invoice
```
userId (ref: User), clientId (ref: Client),
invoiceNumber, issueDate, dueDate,
items [ { description, quantity, unitPrice, total } ],
subtotal, taxRate, taxAmount, discount,
totalAmount, status (Paid/Unpaid/Overdue/Draft),
notes, terms
```

---

## 🖥️ App Screens

| # | Screen | Route |
|---|---|---|
| 1 | Login | `/login` |
| 2 | Register | `/register` |
| 3 | Dashboard | `/dashboard` |
| 4 | Invoice List | `/invoices` |
| 5 | Create Invoice | `/invoices/create` |
| 6 | Invoice Detail | `/invoices/:id` |
| 7 | Edit Invoice | `/invoices/:id/edit` |
| 8 | Client List | `/clients` |
| 9 | Add/Edit Client | `/clients/add` or `/clients/:id/edit` |
| 10 | Profile Settings | `/settings` |
| 11 | Business Info | `/settings/business` |
| 12 | Invoice Preferences | `/settings/preferences` |

---

## 🔒 Security Features

- Passwords are **hashed using Bcrypt** before storing in database
- All private routes are protected using **JWT middleware**
- Each user can **only access their own** invoices and clients
- Token is stored in **localStorage** and sent in every request header
- Unauthenticated users are **automatically redirected** to login page

---

## 👨‍💻 Author

**Mayank Lumbhani**
- Project — Invoice Management System
- Problem Statement by: **Razorpay**
- Tech Stack: React.js, Redux Toolkit, Node.js, Express.js, MongoDB

---

