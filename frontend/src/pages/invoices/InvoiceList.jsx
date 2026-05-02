import { useEffect, useMemo, useState } from "react";
import { Button, CircularProgress, Alert, Pagination, Tab, Tabs, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import InvoiceTable from "../../components/invoices/InvoiceTable";
import { invoicesAPI } from "../../utils/api";
import {
  setInvoices,
  deleteInvoice,
  setLoading,
  setError,
} from "../../store/slices/invoiceSlice";

const PAGE_SIZE = 10;

const InvoiceList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { invoices, loading, error } = useSelector((state) => state.invoice);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [page, setPage] = useState(1);

  // Fetch all invoices from API on mount
  useEffect(() => {
    const load = async () => {
      dispatch(setLoading(true));
      try {
        const data = await invoicesAPI.getAll();
        dispatch(setInvoices(Array.isArray(data) ? data : []));
      } catch {
        dispatch(setError("Could not load invoices."));
      } finally {
        dispatch(setLoading(false));
      }
    };
    load();
  }, [dispatch]);

  // Filter invoices by search query and active status tab (no extra API call)
  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const clientName = inv.client?.name || String(inv.client || "");
      const matchesQuery =
        (inv.invoiceNumber || "").toLowerCase().includes(query.toLowerCase()) ||
        clientName.toLowerCase().includes(query.toLowerCase());
      const matchesTab = tab === "All" ? true : inv.status === tab;
      return matchesQuery && matchesTab;
    });
  }, [invoices, query, tab]);

  // Pagination
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Delete invoice — calls API then removes from Redux
  const handleDelete = async (id) => {
    try {
      await invoicesAPI.delete(id);
      dispatch(deleteInvoice(id));
    } catch {
      alert("Failed to delete invoice.");
    }
  };

  // Compute summary totals from ALL invoices (not just current page)
  const totalPaid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + Number(i.totalAmount || 0), 0);
  const totalUnpaid = invoices.filter((i) => i.status === "Unpaid").reduce((s, i) => s + Number(i.totalAmount || 0), 0);
  const totalOverdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + Number(i.totalAmount || 0), 0);
  const fmt = (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <div>
      <Navbar
        title="Invoices"
        rightContent={
          <Button
            variant="contained"
            sx={{ backgroundColor: "#6366F1" }}
            onClick={() => navigate("/invoices/create")}
          >
            + New Invoice
          </Button>
        }
      />

      {/* Search + filter tabs */}
      <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-4">
          <TextField
            fullWidth
            label="Search invoices"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </div>
        <Tabs
          value={tab}
          onChange={(_, v) => { setTab(v); setPage(1); }}
          textColor="primary"
          indicatorColor="primary"
          sx={{ "& .MuiTabs-indicator": { backgroundColor: "#6366F1" } }}
        >
          {["All", "Paid", "Unpaid", "Overdue", "Draft"].map((item) => (
            <Tab key={item} label={item} value={item} />
          ))}
        </Tabs>
      </div>

      {/* Loading / error states */}
      {loading && (
        <div className="flex justify-center py-12">
          <CircularProgress sx={{ color: "#6366F1" }} />
        </div>
      )}
      {error && !loading && <Alert severity="error">{error}</Alert>}

      {/* Invoice table */}
      {!loading && !error && (
        <>
          <InvoiceTable invoices={paginated} showSelection onDelete={handleDelete} />

          {/* Pagination */}
          <div className="mt-4 flex justify-end">
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="primary"
            />
          </div>
        </>
      )}

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-[#64748B]">Total Received</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{fmt(totalPaid)}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-[#64748B]">Pending Amount</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">{fmt(totalUnpaid)}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-[#64748B]">Overdue Balance</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{fmt(totalOverdue)}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
