import {
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DeleteOutline, EditOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";

// Reusable invoice table used in Dashboard and InvoiceList
// Uses MongoDB _id for navigation and deletion
const InvoiceTable = ({ invoices, onDelete, showSelection = false }) => {
  const navigate = useNavigate();

  // Format ISO date string to readable format
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format number to currency string
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "—";
    return `$${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      onDelete(id);
    }
  };

  return (
    <TableContainer className="rounded-xl bg-white shadow-sm">
      <Table>
        <TableHead>
          <TableRow>
            {showSelection && <TableCell padding="checkbox"><Checkbox /></TableCell>}
            <TableCell>Invoice No</TableCell>
            <TableCell>Client Name</TableCell>
            <TableCell>Issue Date</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showSelection ? 8 : 7} align="center" sx={{ py: 4, color: "#64748B" }}>
                No invoices found.
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice._id} hover>
                {showSelection && <TableCell padding="checkbox"><Checkbox /></TableCell>}
                {/* Invoice number from backend field */}
                <TableCell>{invoice.invoiceNumber}</TableCell>
                {/* Client may be populated object or plain string */}
                <TableCell>
                  {invoice.client?.name || invoice.client || "—"}
                </TableCell>
                <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell>{formatAmount(invoice.totalAmount)}</TableCell>
                <TableCell>
                  <StatusBadge status={invoice.status} />
                </TableCell>
                <TableCell align="right">
                  {/* View detail */}
                  <IconButton onClick={() => navigate(`/invoices/${invoice._id}`)}>
                    <VisibilityOutlined />
                  </IconButton>
                  {/* Edit invoice */}
                  <IconButton onClick={() => navigate(`/invoices/${invoice._id}/edit`)}>
                    <EditOutlined />
                  </IconButton>
                  {/* Delete with confirm */}
                  {onDelete && (
                    <IconButton color="error" onClick={() => handleDelete(invoice._id)}>
                      <DeleteOutline />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InvoiceTable;
