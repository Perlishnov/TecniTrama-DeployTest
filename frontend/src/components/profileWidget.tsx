import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ExitIcon from "@/assets/icons/exit.svg";

export interface ProfileWidgetProps {
  avatarUrl?: string;
  name: string;
  email: string;
  className?: string;
}

const ProfileWidget: React.FC<ProfileWidgetProps> = ({
  avatarUrl,
  name,
  email,
  className = "",
}) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("streamToken");
    window.dispatchEvent(new Event('storage'));
  
    // Redirigir y forzar recarga para limpiar estado
    navigate("/login", { 
      replace: true,
      state: { from: location.pathname } 
    });
  };

  return (
    <div
      className={`self-stretch h-24 px-4 py-6 bg-rose-200 inline-flex flex-col justify-between items-start ${className}`}
    >
      <div className="inline-flex justify-start items-center gap-4">
        <Link to="/profile" className="contents">
          <div data-state="online" className="w-10 h-10 rounded-full overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-400" />
            )}
          </div>
          <div className="inline-flex flex-col justify-start items-start">
            <div className="text-black text-base font-semibold font-barlow leading-tight">
              {name}
            </div>
            <div className="text-black text-xs font-medium font-barlow leading-tight">
              {email}
            </div>
          </div>
        </Link>
        <button onClick={handleLogout}>
            <img
              src={ExitIcon}
              alt="Exit Icon"
              className="w-full h-full"
            />
        </button> 
      </div>
    </div>
  );
};

export default ProfileWidget;