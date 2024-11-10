import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/Spinner";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Spinner />;

  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;

  return children;
}

export default ProtectedRoute;
