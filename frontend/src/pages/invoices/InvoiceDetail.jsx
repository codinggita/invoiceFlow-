import { useEffect, useState } from "react";
import { Button, CircularProgress, Alert, MenuItem, TextField } from "@mui/material";
import { ArrowBack, Download, EditOutlined } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import StatusBadge from "../../components/common/StatusBadge";
import { invoicesAPI } from "../../utils/api";
import { updateInvoice } from "../../store/slices/invoiceSlice";

const InvoiceDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");

  // Fetch invoice by id from API
  useEffect(() => {
    invoicesAPI.getById(id)
      .then((data) => {
        setInvoice(data);
        setStatus(data.status || "Unpaid");
      })
      .catch(() => setError("Could not load invoice."))
      .finally(() => setLoading(false));
  }, [id]);

  // Format ISO date
  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  // Format currency
  const fmtMoney = (n) =>
    n !== undefined ? `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—";

  // Calculate totals from items
  const subtotal = invoice?.items?.reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.unitPrice || 0), 0
  ) || 0;
  const taxValue = subtotal * ((invoice?.tax || 0) / 100);
  const total = subtotal + taxValue - Number(invoice?.discount || 0);

  // Change status via dropdown — saves to backend and updates Redux
  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    try {
      const result = await invoicesAPI.update(id, { status: newStatus });
      dispatch(updateInvoice(result));
    } catch {
      alert("Failed to update status.");
    }
  };

  // Mark as Paid shortcut button
  const handleMarkPaid = async () => {
    await handleStatusChange("Paid");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <CircularProgress sx={{ color: "#6366F1" }} />
      </div>
    );
  }
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!invoice) return null;

  // Client info (may be populated object or plain string)
  const client = invoice.client || {};
  const clientName = client.name || invoice.clientName || "—";

  return (
    <div>
      {/* ── Header action bar ── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button startIcon={<ArrowBack />} onClick={() => navigate("/invoices")}>
            Back
          </Button>
          <h1 className="text-2xl font-semibold">Invoice #{invoice.invoiceNumber}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status change dropdown */}
          <TextField
            select
            size="small"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Unpaid">Unpaid</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
            <MenuItem value="Draft">Draft</MenuItem>
          </TextField>
          <Button
            variant="outlined"
            startIcon={<EditOutlined />}
            onClick={() => navigate(`/invoices/${id}/edit`)}
          >
            Edit
          </Button>
          <Button variant="outlined" startIcon={<Download />} onClick={() => window.print()}>
            Download PDF
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#6366F1" }}
            onClick={handleMarkPaid}
            disabled={status === "Paid"}
          >
            Mark as Paid
          </Button>
        </div>
      </div>

      {/* ── Invoice document card ── */}
      <div className="rounded-xl bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#6366F1]">InvoiceFlow</h2>
            <p className="text-sm text-slate-500">billing@invoiceflow.com</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">INVOICE</p>
            <p className="text-sm text-slate-500">#{invoice.invoiceNumber}</p>
          </div>
        </div>

        {/* Bill From / Bill To */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="font-semibold">Bill From</p>
            <p className="text-sm text-slate-600">InvoiceFlow Studio</p>
          </div>
          <div>
            <p className="font-semibold">Bill To</p>
            <p className="text-sm text-slate-600">{clientName}</p>
            {client.email && <p className="text-sm text-slate-500">{client.email}</p>}
            {client.phone && <p className="text-sm text-slate-500">{client.phone}</p>}
          </div>
        </div>

        {/* Metadata row */}
        <div className="mb-6 flex flex-wrap items-center gap-6 text-sm">
          <p>Invoice Date: <span className="font-medium">{fmt(invoice.issueDate)}</span></p>
          <p>Due Date: <span className="font-medium">{fmt(invoice.dueDate)}</span></p>
          <StatusBadge status={status} />
        </div>

        {/* Items table */}
        <table className="mb-6 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Unit Price</th>
              <th className="p-3 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="p-3">{item.description}</td>
                <td className="p-3">{item.qty}</td>
                <td className="p-3">{fmtMoney(item.unitPrice)}</td>
                <td className="p-3">{fmtMoney(Number(item.qty) * Number(item.unitPrice))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="mb-6 ml-auto max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span><span>{fmtMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({invoice.tax || 0}%)</span>
            <span>{fmtMoney(taxValue)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span><span>-{fmtMoney(invoice.discount || 0)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-[#6366F1]">
            <span>Total</span><span>{fmtMoney(total)}</span>
          </div>
        </div>

        {/* Notes & Terms */}
        {(invoice.notes || invoice.terms) && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {invoice.notes && (
              <div>
                <p className="font-semibold">Notes</p>
                <p className="text-sm text-slate-600">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <p className="font-semibold">Terms</p>
                <p className="text-sm text-slate-600">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetail;
