import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default AppLayout;