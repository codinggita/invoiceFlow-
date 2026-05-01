// Colored pill badge for invoice status
// Colors: green=Paid, yellow=Unpaid, red=Overdue, gray=Draft
const StatusBadge = ({ status }) => {
  const styles = {
    Paid: "bg-green-100 text-green-700",
    Unpaid: "bg-yellow-100 text-yellow-700",
    Overdue: "bg-red-100 text-red-700",
    Draft: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || styles.Draft
        }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
