import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuth] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem("isAuthenticated")
    setAuth(storedValue == "true")
  }, [])

  const login = () => {
    localStorage.setItem("isAuthenticated", true)
    setAuth(true);
  };

  const logout = () => {
    localStorage.setItem("isAuthenticated", false)
    setAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
