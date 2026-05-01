import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="ml-[240px] p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
