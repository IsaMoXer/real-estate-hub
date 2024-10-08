import Logo from "./Logo";
import NavMenu from "./NavMenu";

function Header() {
  return (
    <div className="bg-white shadow-md border-b-2 border-gray-300 sticky top-0 z-10">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto pb-0">
        <Logo />
        <NavMenu />
      </header>
    </div>
  );
}

export default Header;
