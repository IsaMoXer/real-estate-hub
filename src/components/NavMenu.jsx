import { HiOutlineHome } from "react-icons/hi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { PiSignInBold } from "react-icons/pi";

import StyledNavLink from "./StyledNavLink";

function NavMenu() {
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

      <li>
        <StyledNavLink toPage="/sign-in">
          <PiSignInBold />
          Sign In
        </StyledNavLink>
      </li>
    </ul>
  );
}

export default NavMenu;
