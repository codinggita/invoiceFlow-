import { useEffect } from "react";
import { Button, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/common/Navbar";
import StatCard from "../../components/common/StatCard";
import InvoiceTable from "../../components/invoices/InvoiceTable";
import { invoicesAPI } from "../../utils/api";
import { clientsAPI } from "../../utils/api";
import { setInvoices, setLoading, setError } from "../../store/slices/invoiceSlice";
import { setClients } from "../../store/slices/clientSlice";

// Bar heights for the decorative cash flow chart
const BAR_CLASSES = ["h-16", "h-24", "h-20", "h-32", "h-40", "h-28", "h-36"];

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { invoices, loading, error } = useSelector((state) => state.invoice);
  const user = useSelector((state) => state.auth.user);

  // Fetch invoices and clients when dashboard loads
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const [invoiceData, clientData] = await Promise.all([
          invoicesAPI.getAll(),
          clientsAPI.getAll(),
        ]);
        // Store results in Redux
        dispatch(setInvoices(Array.isArray(invoiceData) ? invoiceData : []));
        dispatch(setClients(Array.isArray(clientData) ? clientData : []));
      } catch (err) {
        dispatch(setError("Failed to load dashboard data."));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchData();
  }, [dispatch]);

  // Compute stat card values from Redux invoices
  const totalCount = invoices.length;
  const paidTotal = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + Number(i.totalAmount || 0), 0);
  const unpaidTotal = invoices
    .filter((i) => i.status === "Unpaid")
    .reduce((sum, i) => sum + Number(i.totalAmount || 0), 0);
  const overdueTotal = invoices
    .filter((i) => i.status === "Overdue")
    .reduce((sum, i) => sum + Number(i.totalAmount || 0), 0);

  const fmt = (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <div>
      {/* Top bar */}
      <Navbar
        title="Dashboard"
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

      {/* Welcome message */}
      {user && (
        <p className="mb-4 text-sm text-[#64748B]">
          Welcome back, <span className="font-semibold text-[#0F172A]">{user.fullName}</span> 👋
        </p>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-12">
          <CircularProgress sx={{ color: "#6366F1" }} />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Stats section */}
      {!loading && !error && (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Invoices" value={totalCount} color="text-[#6366F1]" />
            <StatCard label="Paid" value={fmt(paidTotal)} color="text-green-600" />
            <StatCard label="Unpaid" value={fmt(unpaidTotal)} color="text-yellow-600" />
            <StatCard label="Overdue" value={fmt(overdueTotal)} color="text-red-600" />
          </div>

          {/* Recent invoices section */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Invoices</h2>
              <button
                className="text-sm font-medium text-[#6366F1]"
                onClick={() => navigate("/invoices")}
              >
                View All
              </button>
            </div>
            {/* Show last 5 invoices */}
            <InvoiceTable invoices={invoices.slice(0, 5)} />
          </div>

          {/* Cash flow chart + Quick actions */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-semibold">Cash Flow</h3>
              <div className="flex h-56 items-end justify-between gap-2">
                {BAR_CLASSES.map((barClass, index) => (
                  <div key={index} className="w-full rounded-t bg-indigo-200">
                    <div className={`rounded-t bg-[#6366F1] ${barClass}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-lg font-semibold">Quick Actions</h3>
              <div className="space-y-3">
                <Button fullWidth variant="outlined" onClick={() => navigate("/clients/add")}>
                  Add Client
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ backgroundColor: "#6366F1" }}
                  onClick={() => navigate("/invoices/create")}
                >
                  Create Invoice
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
