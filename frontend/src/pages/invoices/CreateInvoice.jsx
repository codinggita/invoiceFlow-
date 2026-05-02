import { useEffect, useState } from "react";
import { Button, CircularProgress, Alert } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InvoiceForm from "../../components/invoices/InvoiceForm";
import { invoicesAPI, clientsAPI } from "../../utils/api";
import { addInvoice } from "../../store/slices/invoiceSlice";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all clients for the dropdown on page load
  useEffect(() => {
    clientsAPI.getAll()
      .then((data) => setClients(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load clients."))
      .finally(() => setLoadingClients(false));
  }, []);

  // Initial empty form values
  // taxRate matches backend field name
  // qty is used in form display, mapped to quantity before sending to backend
  const initialValues = {
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    clientId: "",
    items: [{ description: "", qty: 1, unitPrice: 0 }],
    taxRate: 0,
    discount: 0,
    notes: "",
    terms: "",
  };

  // Build correct payload and send to backend
  const buildPayload = (values, status) => {
    // Map form items to backend format
    // qty (form) → quantity (backend)
    // calculate total per item = qty x unitPrice
    const fixedItems = values.items.map((item) => ({
      description: item.description,
      quantity: Number(item.qty),
      unitPrice: Number(item.unitPrice),
      total: Number(item.qty) * Number(item.unitPrice),
    }));

    return {
      clientId: values.clientId,
      issueDate: values.issueDate,
      dueDate: values.dueDate,
      items: fixedItems,
      taxRate: Number(values.taxRate),
      discount: Number(values.discount),
      notes: values.notes,
      terms: values.terms,
      status: status,
    };
  };

  // Submit invoice with status Unpaid
  const handleSubmit = async (values) => {
    try {
      const payload = buildPayload(values, "Unpaid");
      const result = await invoicesAPI.create(payload);
      dispatch(addInvoice(result.invoice || result));
      navigate("/invoices");
    } catch {
      alert("Failed to create invoice.");
    }
  };

  // Save as draft with status Draft
  const handleDraft = async (values) => {
    try {
      const payload = buildPayload(values, "Draft");
      const result = await invoicesAPI.create(payload);
      dispatch(addInvoice(result.invoice || result));
      navigate("/invoices");
    } catch {
      alert("Failed to save draft.");
    }
  };

  if (loadingClients) {
    return (
      <div className="flex justify-center py-12">
        <CircularProgress sx={{ color: "#6366F1" }} />
      </div>
    );
  }

  return (
    <div>
      {/* Top bar with back button and title */}
      <div className="mb-6 flex items-center gap-2">
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/invoices")}>
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Create New Invoice</h1>
      </div>

      {/* Show error if clients failed to load */}
      {error && (
        <Alert severity="warning" className="mb-4">
          {error} — You need at least one client to create an invoice.
        </Alert>
      )}

      {/* Show message if no clients exist yet */}
      {clients.length === 0 && !error && (
        <Alert severity="info" className="mb-4">
          No clients found. Please add a client first before creating an invoice.
        </Alert>
      )}

      <InvoiceForm
        clients={clients}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onDraft={handleDraft}
        submitLabel="Send Invoice"
      />
    </div>
  );
};

export default CreateInvoice;