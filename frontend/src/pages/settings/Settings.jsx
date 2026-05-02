import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../../components/common/Navbar";

const tabs = [
  { label: "Profile", to: "/settings" },
  { label: "Business Info", to: "/settings/business" },
  { label: "Invoice Preferences", to: "/settings/preferences" }
];

const Settings = () => {
  return (
    <div>
      <Navbar title="Settings" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <div className="h-fit rounded-xl bg-white p-3 shadow-sm">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              end={tab.to === "/settings"}
              to={tab.to}
              className={({ isActive }) =>
                `mb-1 block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-indigo-50 text-[#6366F1]" : "text-[#64748B] hover:bg-slate-50"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
