import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

import {XS_SCREEN_SIZE} from "../utils/constants";

function Logo() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < XS_SCREEN_SIZE);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < XS_SCREEN_SIZE);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <NavLink to="/">
      <img
        src={isMobile ? "/RealEstateHub_Logo.png" : "/Logo-letters-tranparent.png"}
        alt="real estate logo"
        className="h-6 xs:h-12 cursor-pointer md:h-16"
      />
    </NavLink>
  );
}

export default Logo;