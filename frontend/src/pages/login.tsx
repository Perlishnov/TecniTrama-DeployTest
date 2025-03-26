import React from "react";
import { Checkbox } from "@heroui/checkbox";
import bannerImg from "../assets/loginSignupBanner.png";
import Logo from "@/components/logo";
import InputField from "@/components/input";
import CustomButton from "@/components/button";

export const Login = (): JSX.Element => {
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

          {/* Títulos */}
          <h1 className="text-2xl font-bold text-black mb-2 text-center">
            ¡Bienvenido de vuelta!
          </h1>
          <p className="text-lg text-black mb-6 text-center">Inicio de sesión</p>

          {/* Formulario de Login */}
          <form className="grid grid-cols-2 gap-4">
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
            <div className="col-span-2 flex items-center">
              <Checkbox defaultSelected />
              <span className="text-black ml-2">Recuérdame</span>
            </div>
            <CustomButton type="submit" className="col-span-2 bg-red-500 text-black">
              Iniciar sesión
            </CustomButton>
          </form>

          {/* Enlace para registro */}
          <p className="text-center text-black mt-4">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-400">
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
