import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import InvoiceList from "../pages/invoices/InvoiceList";
import CreateInvoice from "../pages/invoices/CreateInvoice";
import EditInvoice from "../pages/invoices/EditInvoice";
import InvoiceDetail from "../pages/invoices/InvoiceDetail";
import ClientList from "../pages/clients/ClientList";
import AddEditClient from "../pages/clients/AddEditClient";
import Settings from "../pages/settings/Settings";
import ProfileSettings from "../pages/settings/ProfileSettings";
import BusinessInfo from "../pages/settings/BusinessInfo";
import InvoicePreferences from "../pages/settings/InvoicePreferences";

const AppRoutes = () => (
  <Routes>
    {/* Default: redirect to login */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Public auth routes */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Protected dashboard routes — redirects to /login if not authenticated */}
    <Route
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/invoices" element={<InvoiceList />} />
      <Route path="/invoices/create" element={<CreateInvoice />} />
      <Route path="/invoices/:id" element={<InvoiceDetail />} />
      <Route path="/invoices/:id/edit" element={<EditInvoice />} />
      <Route path="/clients" element={<ClientList />} />
      <Route path="/clients/add" element={<AddEditClient />} />
      <Route path="/clients/:id/edit" element={<AddEditClient />} />
      <Route path="/settings" element={<Settings />}>
        <Route index element={<ProfileSettings />} />
        <Route path="business" element={<BusinessInfo />} />
        <Route path="preferences" element={<InvoicePreferences />} />
      </Route>
    </Route>

    {/* Fallback — redirect unknown paths to login */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
