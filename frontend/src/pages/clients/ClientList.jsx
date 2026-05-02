import { useEffect, useMemo, useState } from "react";
import { Button, CircularProgress, Alert, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import ClientCard from "../../components/clients/ClientCard";
import { clientsAPI } from "../../utils/api";
import { setClients, deleteClient } from "../../store/slices/clientSlice";

const ClientList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clients, loading, error } = useSelector((state) => state.client);
  const [query, setQuery] = useState("");

  // Fetch all clients on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await clientsAPI.getAll();
        dispatch(setClients(Array.isArray(data) ? data : []));
      } catch {
        // error is handled in selector below if needed
      }
    };
    load();
  }, [dispatch]);

  // Filter by name or company (client-side, no extra API call)
  const filtered = useMemo(
    () =>
      clients.filter((c) =>
        (c.name || "").toLowerCase().includes(query.toLowerCase()) ||
        (c.companyName || "").toLowerCase().includes(query.toLowerCase())
      ),
    [clients, query]
  );

  // Delete client via API then remove from Redux
  const handleDelete = async (id) => {
    try {
      await clientsAPI.delete(id);
      dispatch(deleteClient(id));
    } catch {
      alert("Failed to delete client.");
    }
  };

  return (
    <div>
      <Navbar
        title="Clients"
        rightContent={
          <Button
            variant="contained"
            sx={{ backgroundColor: "#6366F1" }}
            onClick={() => navigate("/clients/add")}
          >
            + Add Client
          </Button>
        }
      />

      {/* Search bar */}
      <div className="mb-5">
        <TextField
          fullWidth
          label="Search clients"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-12">
          <CircularProgress sx={{ color: "#6366F1" }} />
        </div>
      )}

      {/* Error state */}
      {error && !loading && <Alert severity="error">{error}</Alert>}

      {/* Client cards grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((client) => (
            <ClientCard key={client._id} client={client} onDelete={handleDelete} />
          ))}
          {/* Add New Client card (always last) */}
          <button
            onClick={() => navigate("/clients/add")}
            className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-5 text-center text-[#6366F1] font-medium hover:bg-indigo-50 transition-colors"
          >
            + Add New Client
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientList;
