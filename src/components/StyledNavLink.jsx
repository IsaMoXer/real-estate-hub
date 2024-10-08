import { NavLink } from "react-router-dom";

function StyledNavLink({ children, toPage }) {
  return (
    <NavLink
      to={toPage}
      className={({ isActive }) =>
        `flex items-center gap-2 py-3 font-semibold border-b-[3px] text-gray-400 ${
          isActive ? "border-red-500 text-slate-800" : "border-transparent"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default StyledNavLink;
