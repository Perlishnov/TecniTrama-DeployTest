import { Link } from "react-router-dom";
import { Button, Input } from "react-aria-components";
import { useEffect, useState } from "react";
import ProfileWidget from "./profileWidget";
import HomeIcon from "@/assets/icons/home.svg";
import ProjectIcon from "@/assets/icons/file-text.svg";
import ClipboardIcon from "@/assets/icons/clipboard.svg";
import ChatIcon from "@/assets/icons/message-circle.svg";
import NotificationIcon from "@/assets/icons/bell.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import Logo from "./logo";
import { useDecodeJWT } from "@/hooks/useDecodeJWT";
import NotificationsModalPage from "@/pages/notificacion";

function Sidebar() {
  const [name, setName] = useState("Usuario");
  const [email, setEmail] = useState("correo@example.com");
  const [profile_image, setAvatarUrl] = useState<string | undefined>();
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const decodedToken = useDecodeJWT();
  const apiRoute = import.meta.env.VITE_API_ROUTE;

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setTimeout(fetchUserInfo, 100);
        return;
      }
      if (!decodedToken?.id) return;
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const userRes = await fetch(`${apiRoute}users/${decodedToken.id}`, {
          headers,
        });

        const profileRes = await fetch(`${apiRoute}profiles/user/${decodedToken.id}`, {
          headers,
        });

        if (!userRes.ok || !profileRes.ok) throw new Error("No autorizado");

        const userData = await userRes.json();
        const profileData = await profileRes.json();

        setName(`${userData.first_name} ${userData.last_name}`);
        setEmail(userData.email);
        setAvatarUrl(profileData.profile_image);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [decodedToken]);

  const menuItems = [
    { icon: HomeIcon, label: "Home", href: "/dashboard" },
    { icon: ProjectIcon, label: "Proyectos", href: "/projects" },
    { icon: ClipboardIcon, label: "Solicitudes", href: "/applications" },
    { icon: ChatIcon, label: "Chats", href: "/chats/*" },
    { icon: SettingsIcon, label: "Configuración", href: "/profile" },
  ];

  return (
    <aside className="w-80 h-screen fixed left-0 top-0 bg-rojo-intec-100 flex flex-col justify-between p-4 z-50">
      <div className="w-full relative">
        <div className="flex items-center justify-between">
          <Logo />
          <button onClick={() => setShowNotifications(true)} className="p-2 hover:bg-rojo-intec-200 rounded-lg">
            <img src={NotificationIcon} alt="Notificaciones" className="w-6 h-6" />
          </button>
        </div>

        <Input placeholder="Buscar" className="my-4 w-full px-4 py-2 border rounded-lg" />

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className=" px-4 py-3 rounded-lg text-neutral-700 hover:bg-rojo-intec-200 flex items-center gap-2"
            >
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span className="text-neutral-500 font-barlow font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        <Button className="w-60 font-barlow rounded-full bg-rojo-intec-400 text-white py-2 hover:bg-rojo-intec-400">
          <Link to="/projects/new-project">Crear Proyecto +</Link>
        </Button>

        {loading ? (
          <div className="w-60 h-24 bg-rojo-intec-200 rounded-lg p-4 animate-pulse flex items-center gap-4">
            <div className="w-10 h-10 bg-rojo-intec-100 rounded-full" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 bg-rojo-intec-100 rounded w-3/4" />
              <div className="h-3 bg-rojo-intec-100 rounded w-1/2" />
            </div>
          </div>
        ) : (
          <ProfileWidget avatarUrl={profile_image} name={name} email={email} />
        )}
      </div>

      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" onClick={() => setShowNotifications(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <NotificationsModalPage onClose={() => setShowNotifications(false)} />
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;