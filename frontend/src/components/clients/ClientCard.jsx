import { IconButton } from "@mui/material";
import { DeleteOutline, EditOutlined, MailOutline, Phone } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Client card for the client list grid
// Uses MongoDB _id for navigation and deletion
const ClientCard = ({ client, onDelete }) => {
  const navigate = useNavigate();

  // Build initials from the client name
  const initials = (client.name || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleDelete = () => {
    if (window.confirm(`Delete client "${client.name}"? This cannot be undone.`)) {
      onDelete(client._id);
    }
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      {/* Avatar and name */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6366F1] font-bold text-white">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-[#0F172A]">{client.name}</p>
          <p className="text-sm text-[#64748B]">{client.companyName || "—"}</p>
        </div>
      </div>

      {/* Contact details */}
      <p className="mb-2 flex items-center gap-2 text-sm text-[#64748B]">
        <MailOutline fontSize="small" /> {client.email}
      </p>
      <p className="mb-4 flex items-center gap-2 text-sm text-[#64748B]">
        <Phone fontSize="small" /> {client.phone || "—"}
      </p>

      {/* View invoices link and action buttons */}
      <div className="flex items-center justify-between">
        <button
          className="text-sm font-medium text-[#6366F1]"
          onClick={() => navigate("/invoices")}
        >
          View Invoices
        </button>
        <div className="flex">
          <IconButton onClick={() => navigate(`/clients/${client._id}/edit`)}>
            <EditOutlined />
          </IconButton>
          <IconButton color="error" onClick={handleDelete}>
            <DeleteOutline />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
