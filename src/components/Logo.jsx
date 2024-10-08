import { NavLink } from "react-router-dom";

function Logo() {
  return (
    <NavLink to="/">
      <img
        src="https://static.rdc.moveaws.com/rdc-ui/logos/logo-brand.svg"
        alt="realtor.com logo"
        className="h-5 cursor-pointer"
      />
    </NavLink>
  );
}

export default Logo;
