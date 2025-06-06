import React, { useState } from "react";
import { Checkbox } from "@heroui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import bannerImg from "../assets/loginSignupBanner.png";
import Logo from "@/components/logo";
import InputField from "@/components/input";
import CustomButton from "@/components/button";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  user_type_id: number;
}

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const apiRoute = import.meta.env.VITE_API_ROUTE;

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiRoute}users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        // Handle error responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el inicio de sesión');
      }

      // Handle successful login
      const responseData = await response.json();
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('streamToken', responseData.streamToken)
      
      // Disparar evento para actualizar el estado global
      window.dispatchEvent(new Event('storage'));
      
      // Redirigir inmediatamente según el tipo de usuario
      const decoded = jwtDecode<CustomJwtPayload>(responseData.token);
      if (decoded.user_type_id === 2) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err:any) {
      console.error('Login error:', error);
      setError(err.message || 'Error al iniciar sesión');
      // Limpiar tokens en caso de error
      localStorage.removeItem('token');
      localStorage.removeItem('streamToken');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen min-w-max items-center justify-center relative">
      {/* Columna izquierda con la imagen */}
      <div className="w-1/2">
        <img
          src={bannerImg}
          alt="Banner"
          className="w-full min-h-screen object-cover"
        />
      </div>

      {/* Columna derecha con el formulario */}
      <div className="w-1/2 min-h-screen flex items-center justify-center bg-rojo-intec-50">
        <div className="w-3/4 m-0">
          {/* Logo */}
          <Logo  className="w-1/2"/>

          {/* Títulos */}
          <h1 className="text-2xl font-bold text-black mb-2 text-center">
            ¡Bienvenido de vuelta!
          </h1>
          <p className="text-lg text-black mb-6 text-center">Inicio de sesión</p>

          {/* Mostrar mensaje de error si existe */}
          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}

          {/* Formulario de Login */}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <InputField
              name="email"
              type="email"
              placeholder="Correo Institucional"
              value={formData.email}
              onChange={handleChange}
              className="col-span-2"
            />
            <InputField
              name="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="col-span-2"
            />
            <div className="col-span-2 flex items-center">
              <Checkbox defaultSelected />
              <span className="text-black ml-2">Recuérdame</span>
            </div>
            <CustomButton 
              type="submit"
              className={`col-span-2 bg-red-500 text-black ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </CustomButton>
          </form>

          {/* Enlace para registro */}
          <p className="text-center text-black mt-4">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-blue-400">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;