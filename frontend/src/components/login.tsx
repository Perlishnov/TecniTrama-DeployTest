import { Checkbox } from "@heroui/checkbox";
import bannerImg from "../assets/loginSignupBanner.png";

export const Login = (): JSX.Element => {
  
  return (
    <div className="flex min-h-screen min-w-max items-center justify-center relative">
      {/* Columna izquierda con la imagen de fondo */}
      <div className="w-1/2 min-h-screen">
        <img
          src={bannerImg}
          alt="Banner"
          className="w-full min-h-screen object-cover"
        />
      </div>

      {/* Columna derecha con el formulario */}
      <div className="w-1/2 min-h-screen flex items-center justify-center bg-rojo-intec-50 ">
        <div className="w-3/4 m-0">
          {/* Logo */}
          <div className="text-center text-4xl font-bold mb-4">
            <span role="img" aria-label="Logo">🍓</span> Logo
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-black mb-2">¡Bienvenido de vuelta!</h1>
          <p className="text-lg text-black mb-6">Inicio de sesión</p>
          {/* Formulario */}
          <form className="grid grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Correo Institucional"
              className="col-span-2 px-4 py-2 bg-white border-2 border-black rounded-xl"
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="col-span-2 px-4 py-2 bg-white border-2 border-black rounded-xl"
            />
            <div className="col-span-2 flex items-center">
              <Checkbox defaultSelected/>
              <span className="text-black">Recuérdame</span>
            </div>
            <button
              type="submit"
              className="col-span-2 bg-red-500 text-black py-2 rounded-full border-2 border-black"
            >
              Iniciar sesión
            </button>
          </form>

          {/* Enlace a iniciar sesión */}
          <p className="text-center text-black mt-4">
            ¿No tienes cuenta?{" "}
            <a href="/login" className="text-blue-400">Registrate</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
