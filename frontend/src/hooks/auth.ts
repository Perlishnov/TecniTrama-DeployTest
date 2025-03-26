import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token") // Estado inicial desde localStorage
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token", token);
    setIsAuthenticated(!!token);
  }, []);

  return { isAuthenticated };
};
