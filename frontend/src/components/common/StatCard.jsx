// Reusable stat card for dashboard metrics
// Props: label (string), value (string/number), color (Tailwind text color class)
const StatCard = ({ label, value, color = "text-[#0F172A]" }) => (
  <div className="rounded-xl bg-white p-5 shadow-sm">
    <p className="text-sm text-[#64748B]">{label}</p>
    <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

export default StatCard;
