// src/components/AdminSidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "@/components/logo";
import ProfileWidget from "@/components/profileWidget";
import { useDecodeJWT } from "@/hooks/useDecodeJWT";
import HomeIcon from "@/assets/icons/home.svg";
import ProjectIcon from "@/assets/icons/file-text.svg";
import UsersIcon from "@/assets/icons/users.svg";

const adminMenu = [
  { icon: HomeIcon,      label: "Dashboard", href: "/admin/dashboard" },
  { icon: ProjectIcon, label: "Proyectos",  href: "/admin/projects" },
  { icon: UsersIcon,     label: "Usuarios",   href: "/admin/users" },
];

export default function AdminSidebar() {
  const location = useLocation();
  const decoded = useDecodeJWT();
  const apiRoute = import.meta.env.VITE_API_ROUTE || "localhost:3000/api/";

  // profile state
  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!decoded?.id) return;
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
        // assume your API has same endpoints
        const userRes    = await fetch(`${apiRoute}users/${decoded.id}`, { headers });
        const profileRes = await fetch(`${apiRoute}profiles/user/${decoded.id}`, { headers });
        if (!userRes.ok || !profileRes.ok) throw new Error();
        const userData    = await userRes.json();
        const profileData = await profileRes.json();
        setName(`${userData.first_name} ${userData.last_name}`);
        setEmail(userData.email);
        setAvatarUrl(profileData.profile_image);
      } catch {
        console.error("Could not load admin profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [decoded, apiRoute]);

  return (
    <aside className="w-80 h-screen fixed left-0 top-0 bg-rojo-intec-100 flex flex-col justify-between p-4 z-50">
      <div className="w-full flex-1 flex flex-col">
        <div className="w-1/3 flex items-center justify-center">
          <div className="w-full h-20 flex items-center justify-center">
              <Logo/>
          </div>
        </div>
        <nav className="flex flex-col gap-4">
          {adminMenu.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                location.pathname.startsWith(item.href)
                  ? "bg-rojo-intec-200"
                  : "hover:bg-rojo-intec-300"
              }`}
            >
              <img src={item.icon} alt={item.label} className="w-5 h-5" />
              <span className="font-medium text-gray-700">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div>
        {loading ? (
          <div className="w-full h-24 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          <ProfileWidget avatarUrl={avatarUrl} name={name} email={email} />
        )}
      </div>
    </aside>
  );
}
