import { createContext, useEffect, useState } from "react";
import { subscribeToAuthChanges } from "../services/apiAuth";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function () {
    const unsubscribe = subscribeToAuthChanges(user => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAuthenticated = Boolean(user);

  const value = {
    user,
    isAuthenticated,
    isLoading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, AuthContext };
