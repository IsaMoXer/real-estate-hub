import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ProtectedRoute from "./pages/ProtectedRoute";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Offers from "./pages/Offers";
import ForgotPassword from "./pages/ForgotPassword";
import PageNotFound from "./pages/PageNotFound";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import AppLayout from "./components/AppLayout";

import { AuthProvider } from "./contexts/AuthContext";
import Listing from "./pages/Listing";
import Category from "./pages/Category";

const protectedRoutes = [
  { path: "/profile", component: Profile },
  { path: "/create-listing", component: CreateListing },
  { path: "/edit-listing/:listingId", component: EditListing },
];

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              {protectedRoutes.map(({ path, component: Component }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute>
                      <Component />
                    </ProtectedRoute>
                  }
                />
              ))}
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/category/:listingCategory" element={<Category />} />
              <Route path="/category/:listingCategory/:listingId" element={<Listing />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
