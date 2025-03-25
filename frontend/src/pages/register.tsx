import React from "react";
import { Checkbox } from "@heroui/checkbox";
import bannerImg from "../assets/loginSignupBanner.png";
import Logo from "@/components/logo";
import InputField from "@/components/input";
import CustomButton from "@/components/button";
import { Link } from "react-router-dom";

export const Register = (): JSX.Element => {
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

          {/* Formulario de registro */}
          <form className="grid grid-cols-2 gap-4">
            <InputField
              type="text"
              placeholder="Nombre"
              className="col-span-1"
            />
            <InputField
              type="text"
              placeholder="Apellido"
              className="col-span-1"
            />
            <InputField
              type="email"
              placeholder="Correo Institucional"
              className="col-span-2"
            />
            <InputField
              type="password"
              placeholder="Contraseña"
              className="col-span-2"
            />
            <InputField
              type="tel"
              placeholder="829-000-0000"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              className="col-span-2"
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                let result = digits.slice(0, 3);
                if (digits.length >= 4) result += "-" + digits.slice(3, 6);
                if (digits.length >= 7) result += "-" + digits.slice(6, 10);
                e.target.value = result;
              }}
            />
            <div className="col-span-2 flex items-center">
              <Checkbox defaultSelected />
              <span className="text-black ml-2">Recuérdame</span>
            </div>
            <CustomButton type="submit" className="col-span-2">
              Registrarse
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
