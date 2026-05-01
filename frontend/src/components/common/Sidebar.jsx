import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { SIDEBAR_LINKS } from "../../constants";
import { logout } from "../../store/slices/authSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const initials =
    user?.fullName
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "IF";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-[240px] flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-6">
        <p className="text-2xl font-bold text-[#6366F1]">InvoiceFlow</p>
      </div>

      <nav className="flex-1 px-3 py-6">
        <ul className="space-y-2">
          {SIDEBAR_LINKS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block rounded-r-lg px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "border-l-4 border-[#6366F1] bg-indigo-50 text-[#6366F1]"
                      : "border-l-4 border-transparent text-[#64748B] hover:bg-slate-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6366F1] font-semibold text-white">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">{user?.fullName || "Invoice User"}</p>
            <p className="text-xs text-[#64748B]">Business Owner</p>
          </div>
        </div>
        <Button fullWidth variant="outlined" startIcon={<Logout />} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
