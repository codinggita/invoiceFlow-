const Navbar = ({ title, rightContent }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-[#0F172A]">{title}</h1>
      <div>{rightContent}</div>
    </div>
  );
};

export default Navbar;
