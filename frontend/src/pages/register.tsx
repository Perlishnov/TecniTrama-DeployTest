import React, { useState } from "react";
import { Checkbox } from "@heroui/checkbox";
import { useNavigate } from "react-router-dom";
import bannerImg from "../assets/loginSignupBanner.png";
import Logo from "@/components/logo";
import InputField from "@/components/input";
import CustomButton from "@/components/button";
import { Link } from "react-router-dom";

export const Register = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_num: "",
    user_type_id: 1
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validation function for phone number
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    
    // Format the phone number
    let result = digits.slice(0, 3);
    if (digits.length >= 4) result += "-" + digits.slice(3, 6);
    if (digits.length >= 7) result += "-" + digits.slice(6, 10);
    
    return result;
  };

  // Validation function for phone number input
  const validatePhoneNumber = (value: string): boolean => {
    const formattedValue = formatPhoneNumber(value);
    return formattedValue.length <= 12; // Matches format XXX-XXX-XXXX
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'phone_num' ? formatPhoneNumber(value) : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        // Handle error responses
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      // Handle successful registration
      const responseData = await response.json();
      console.log('Registration successful', responseData);
      
      // Optional: Show success message or redirect to login
      navigate('/login');
    } catch (err) {
      // Handle registration error
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen min-w-max items-center justify-center relative">
      {/* Columna izquierda con la imagen */}
      <div className="w-1/2 min-h-screen">
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
          <Logo />

          {/* Título */}
          <h1 className="text-2xl font-bold text-black mb-2 text-center">
            ¡Bienvenido a TecniTrama!
          </h1>
          <p className="text-lg text-black mb-6 text-center">¡Regístrate!</p>

          {/* Mostrar mensaje de error si existe */}
          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}

          {/* Formulario de registro */}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <InputField
              name="first_name"
              type="text"
              placeholder="Nombre"
              value={formData.first_name}
              onChange={handleChange}
              className="col-span-1"
            />
            <InputField
              name="last_name"
              type="text"
              placeholder="Apellido"
              value={formData.last_name}
              onChange={handleChange}
              className="col-span-1"
            />
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
            <InputField
              name="phone_num"
              type="tel"
              placeholder="829-000-0000"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              value={formData.phone_num}
              onChange={handleChange}
              validationFunction={validatePhoneNumber}
              className="col-span-2"
            />
            <div className="col-span-2 flex items-center">
              <Checkbox defaultSelected />
              <span className="text-black ml-2">Recuérdame</span>
            </div>
            <CustomButton 
              type="submit"
              className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </CustomButton>
          </form>

          {/* Enlace para iniciar sesión */}
          <p className="text-center text-black mt-4">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-blue-400">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;