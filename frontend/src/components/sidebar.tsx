import {Link} from "react-router-dom";
import SearchBar from "@/components/searchBar";
import Button from "@/components/button";
import ProfileWidget from "./profileWidget";
import AvatarUrl from "@/assets/avatar.png";
import HomeIcon from "@/assets/icons/home.svg"; 
import ProjectIcon from "@/assets/icons/file-text.svg";
import ChatIcon from "@/assets/icons/message-circle.svg";
import NotificationIcon from "@/assets/icons/bell.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import Logo from "./logo";

function Sidebar() {
  return (
    <aside className="w-80 h-screen pt-4 bg-rose-100 flex flex-col justify-between items-center overflow-hidden">
      <div className="w-full px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Logo/>
        </div>
        {/* Search Bar */}
        <SearchBar placeholder="Buscar" className="mb-4" />
        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          {[
            {icon: HomeIcon, label: "Home", href: "#" },
            {icon:ProjectIcon, label: "Proyectos", href: "#" },
            {icon:ChatIcon, label: "Chats", href: "#" },
            {icon:NotificationIcon, label: "Notificaciones", href: "#" },
            {icon:SettingsIcon, label: "Configuración", href: "#" },
          ].map((item) => (
            <Link key={item.label} to={item.href} className="block px-4 py-3 rounded-lg text-neutral-700 hover:bg-rose-200 flex items-center gap-2 ">
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
              <span className="text-neutral-500 font-barlow font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      {/* Footer */}
      <div className="w-full flex flex-col items-center gap-4 p-4">
        <Button className="w-60 font-barlow rounded-full">Crear Proyecto</Button>
        <ProfileWidget avatarUrl={AvatarUrl} name="Nombre del Usuario" email="correo@example.com"/>
        
      </div>
    </aside>
  );
}
export default Sidebar;