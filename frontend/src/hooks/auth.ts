import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Interface para el tipo de usuario
interface UserType {
  user_type_id?: number;
  id?: string;
  email?: string;
  [key: string]: any; // Para otras propiedades posibles del token
}

export const useAuth = () => {
  const [state, setState] = useState<{
    isAuthenticated: boolean;
    isLoading: boolean;
    user: UserType | null;
    isAdmin: boolean;
  }>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    isAdmin: false,
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          isAdmin: false,
        });
        return;
      }

      try {
        // Hacemos el casting al tipo UserType
        const decoded = jwtDecode<UserType>(token);

        setState({
          isAuthenticated: true,
          isLoading: false,
          user: decoded,
          isAdmin: decoded?.user_type_id === 2,
        });
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("token");
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          isAdmin: false,
        });
      }
    };

    checkAuth();

    const handleStorageChange = () => checkAuth();

    // Línea en blanco aquí para ESLint
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Línea en blanco aquí para ESLint
  return {
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    user: state.user,
    isAdmin: state.isAdmin,
  };
};
