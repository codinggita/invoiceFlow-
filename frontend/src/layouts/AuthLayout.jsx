import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
