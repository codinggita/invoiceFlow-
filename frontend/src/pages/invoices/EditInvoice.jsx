import { useEffect, useState } from "react";
import { Button, CircularProgress, Alert } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import InvoiceForm from "../../components/invoices/InvoiceForm";
import { invoicesAPI, clientsAPI } from "../../utils/api";
import { updateInvoice, deleteInvoice } from "../../store/slices/invoiceSlice";

const EditInvoice = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch invoice and client list in parallel on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [inv, cl] = await Promise.all([
          invoicesAPI.getById(id),
          clientsAPI.getAll(),
        ]);
        setInvoice(inv);
        setClients(Array.isArray(cl) ? cl : []);
      } catch {
        setError("Could not load invoice.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Pre-fill form values from fetched invoice
  const initialValues = invoice
    ? {
      invoiceNumber: invoice.invoiceNumber || "",
      issueDate: invoice.issueDate ? invoice.issueDate.slice(0, 10) : "",
      dueDate: invoice.dueDate ? invoice.dueDate.slice(0, 10) : "",
      // client field may be populated object or just an ID string
      clientId: String(invoice.client?._id || invoice.client || ""),
      items: invoice.items?.length
        ? invoice.items.map((item) => ({
          description: item.description || "",
          // Use quantity from backend (returned by our API)
          qty: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
        }))
        : [{ description: "", qty: 1, unitPrice: 0 }],
      taxRate: invoice.taxRate ?? 0,
      discount: invoice.discount ?? 0,
      notes: invoice.notes || "",
      terms: invoice.terms || "",
    }
    : {
      invoiceNumber: "",
      issueDate: "",
      dueDate: "",
      clientId: "",
      items: [{ description: "", qty: 1, unitPrice: 0 }],
      taxRate: 0, discount: 0, notes: "", terms: "",
    };

  // Submit updates the invoice via API
  const handleSubmit = async (values) => {
    // Map form items to backend format
    const fixedItems = values.items.map((item) => ({
      description: item.description,
      quantity: Number(item.qty),
      unitPrice: Number(item.unitPrice),
      total: Number(item.qty) * Number(item.unitPrice),
    }));

    const payload = {
      clientId: values.clientId,
      issueDate: values.issueDate,
      dueDate: values.dueDate,
      items: fixedItems,
      taxRate: Number(values.taxRate),
      discount: Number(values.discount),
      notes: values.notes,
      terms: values.terms,
      status: invoice?.status || "Unpaid",
    };
    try {
      const result = await invoicesAPI.update(id, payload);
      dispatch(updateInvoice(result));
      navigate(`/invoices/${id}`);
    } catch {
      alert("Failed to save changes.");
    }
  };

  // Delete invoice via API then navigate away
  const handleDelete = async () => {
    if (!window.confirm("Delete this invoice? This cannot be undone.")) return;
    try {
      await invoicesAPI.delete(id);
      dispatch(deleteInvoice(id));
      navigate("/invoices");
    } catch {
      alert("Failed to delete invoice.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <CircularProgress sx={{ color: "#6366F1" }} />
      </div>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/invoices")}>
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Edit Invoice</h1>
      </div>
      <InvoiceForm
        clients={clients}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        isEdit
        onDelete={handleDelete}
      />
    </div>
  );
};

export default EditInvoice;
