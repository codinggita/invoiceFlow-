// App-wide constants — no dummy data here, all data comes from the real API

export const APP_NAME = "InvoiceFlow";

export const SIDEBAR_LINKS = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Invoices", path: "/invoices" },
  { label: "Clients", path: "/clients" },
  { label: "Settings", path: "/settings" },
];

// Invoice status values used across pages and components
export const INVOICE_STATUS = {
  PAID: "Paid",
  UNPAID: "Unpaid",
  OVERDUE: "Overdue",
  DRAFT: "Draft",
};

// Payment terms options for dropdowns
export const PAYMENT_TERMS = ["Net 15", "Net 30", "Net 60"];
