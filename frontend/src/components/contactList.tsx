import React, { useEffect, useState } from "react";
import { UserData } from "@/hooks/useUsers";

interface Props {
  users: UserData[];
  currentUserId: number;
  onSelectUser: (targetUser: UserData) => void;
}

const ContactList: React.FC<Props> = ({ users, currentUserId, onSelectUser }) => {
  const apiRoute = import.meta.env.VITE_API_ROUTE;
  const token    = localStorage.getItem("token");
  const [avatars, setAvatars] = useState<Record<number, string>>({});

  useEffect(() => {
    async function loadAvatars() {
      const entries = await Promise.all(
        users
          .filter(u => u.id !== currentUserId || u.id === 19)
          .map(async user => {
            try {
              const res = await fetch(
                `${apiRoute}profiles/user/${user.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Accept": "application/json",
                  },
                }
              );
              if (!res.ok) throw new Error(`Status ${res.status}`);
              const data = await res.json();
              return [user.id, data.profile_image] as [number, string];
            } catch (err) {
              console.warn(`Error fetching profile for ${user.id}`, err);
              return [user.id, ""] as [number, string];
            }
          })
      );
      // Construimos el objeto { userId: avatarUrl, ... }
      setAvatars(Object.fromEntries(entries));
    }

    loadAvatars();
  }, [users, currentUserId, apiRoute, token]);

  return (
    <div className="self-stretch bg-rojo-intec-200 outline outline-1 outline-Gris-500 inline-flex flex-col justify-start items-start overflow-x-hidden">
      {/* Línea superior */}
      <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-Gris-500" />

      {/* Título */}
      <div className="px-4 py-2 inline-flex justify-center items-center gap-2.5">
        <div className="text-Base-Negro text-xl font-medium font-barlow leading-loose">
          Mensajes
        </div>
      </div>

      {/* Lista de contactos */}
      <div className="bg-rojo-intec-300 flex flex-col justify-start items-start gap-1 overflow-x-hidden">
        {users
          .filter(u => u.id !== currentUserId)
          .map(user => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user)}
              className="w-96 px-5 py-1.5 bg-rojo-intec-300 inline-flex justify-start items-center gap-3.5 hover:bg-rojo-intec-100 transition-colors"
            >
              <img
                className="w-16 h-16 rounded-full object-cover"
                src={
                  avatars[user.id]
                    ? avatars[user.id]
                    : "https://placehold.co/64x64"
                }
                alt={user.name ?? user.email}
              />
              <div className="w-48 flex flex-col justify-center items-start overflow-x-hidden">
                <div className="text-Base-Negro text-medium font-medium font-barlow leading-7 truncate">
                  {user.name}
                </div>
                <div className="text-Base-Negro text-xs font-medium font-barlow leading-tight">
                  {user.email}
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default ContactList;