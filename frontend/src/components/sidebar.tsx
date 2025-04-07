import { Link } from "react-router-dom";
import { Button, Input } from "react-aria-components";
import ProfileWidget from "./profileWidget";
import AvatarUrl from "@/assets/avatar.png";
import HomeIcon from "@/assets/icons/home.svg";
import ProjectIcon from "@/assets/icons/file-text.svg";
import ClipboardIcon from "@/assets/icons/Clipboard.png"
import ChatIcon from "@/assets/icons/message-circle.svg";
import NotificationIcon from "@/assets/icons/bell.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import Logo from "./logo";

function Sidebar() {
  const menuItems = [
    { icon: HomeIcon, label: "Home", href: "/" },
    { icon: ProjectIcon, label: "Proyectos", href: "/projects" },
    { icon: ClipboardIcon, label: "Solicitudes", href: "/applications"},
    { icon: ChatIcon, label: "Chats", href: "#" },
    { icon: NotificationIcon, label: "Notificaciones", href: "#" },
    { icon: SettingsIcon, label: "Configuración", href: "/profile" },
  ];

  return (
    <aside className="w-80 h-screen fixed left-0 top-0 bg-rose-100 flex flex-col justify-between p-4 z-50">
      <div className="w-full">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>
        {/* Search Bar */}
        <Input placeholder="Buscar" className="mb-4 w-full px-4 py-2 border rounded-lg" />
        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="block px-4 py-3 rounded-lg text-neutral-700 hover:bg-rose-200 flex items-center gap-2"
            >
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span className="text-neutral-500 font-barlow font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      {/* Footer */}
      <div className="w-full flex flex-col items-center gap-4">
        <Button className="w-60 font-barlow rounded-full bg-rose-500 text-white py-2 hover:bg-rose-600">
          <Link to ="/projects/new-project">Crear Proyecto +</Link>
        </Button>
        <ProfileWidget avatarUrl={AvatarUrl} name="Nombre del Usuario" email="correo@example.com" />
      </div>
    </aside>
  );
}

export default Sidebar;
