import { HiOutlineHome } from "react-icons/hi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { PiSignInBold } from "react-icons/pi";
import { BsPerson } from "react-icons/bs";

import StyledNavLink from "./StyledNavLink";
import { useAuth } from "../hooks/useAuth";

function NavMenu() {
  const { isAuthenticated } = useAuth();

  return (
    <ul className="flex justify-center gap-8 items-center">
      <li>
        <StyledNavLink toPage="/">
          <HiOutlineHome />
          Home
        </StyledNavLink>
      </li>

      <li>
        <StyledNavLink toPage="/offers">
          <MdOutlineLocalOffer />
          Offers
        </StyledNavLink>
      </li>

      {!isAuthenticated ? (
        <li>
          <StyledNavLink toPage="/sign-in">
            <PiSignInBold />
            Sign In
          </StyledNavLink>
        </li>
      ) : (
        <li>
          <StyledNavLink toPage="/profile">
            <BsPerson />
            Profile
          </StyledNavLink>
        </li>
      )}
    </ul>
  );
}

export default NavMenu;
