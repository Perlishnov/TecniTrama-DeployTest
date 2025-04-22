import React, { useEffect, useState } from "react";
import { UserData } from "@/hooks/useUsers";

interface Props {
  users: UserData[];
  currentUserId: number;
  onSelectUser: (targetUser: UserData) => void;
}

// Debounce hook
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const ContactList: React.FC<Props> = ({ users, currentUserId, onSelectUser }) => {
  const apiRoute = import.meta.env.VITE_API_ROUTE;
  const token = localStorage.getItem("token");
  const [avatars, setAvatars] = useState<Record<number, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    async function loadAvatars() {
      const entries = await Promise.all(
        users
          .filter(u => u.id !== currentUserId)
          .map(async user => {
            try {
              const res = await fetch(
                `${apiRoute}profiles/user/${user.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                  },
                }
              );
              if (!res.ok) throw new Error(`Status ${res.status}`);
              const data = await res.json();
              return [user.id, data.profile_image] as [number, string];
            } catch {
              return [user.id, ""] as [number, string];
            }
          })
      );
      setAvatars(Object.fromEntries(entries));
    }
    loadAvatars();
  }, [users, currentUserId, apiRoute, token]);

  const filteredUsers = users
    .filter(u => u.id !== currentUserId)
    .filter(u =>
      u.name.toLowerCase().includes(debouncedSearch.trim().toLowerCase())
    );

  const handleSelect = (user: UserData) => {
    setSearchTerm("");            // Clear search
    onSelectUser(user);
  };

  return (
    <div className="self-stretch bg-rojo-intec-200 outline outline-1 outline-Gris-500 inline-flex flex-col justify-start items-start overflow-x-hidden">
      <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-Gris-500" />
      <div className="px-4 py-2 inline-flex justify-center items-center gap-2.5 w-full">
        <div className="text-Base-Negro text-xl font-medium font-barlow leading-loose">
          Mensajes
        </div>
      </div>

      {/* Search bar with icon and clear button */}
      <div className="w-full px-4 pb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar contacto..."
            className="w-full pl-10 pr-10 py-2 border rounded-lg text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {/* Search icon */}
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m1.7-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {/* Clear button */}
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="bg-rojo-intec-300 flex flex-col justify-start items-start gap-1 overflow-x-hidden">
        {filteredUsers.length === 0 ? (
          <div className="px-5 py-3 text-sm text-gray-600">No hay resultados</div>
        ) : (
          filteredUsers.map(user => (
            <button
              key={user.id}
              onClick={() => handleSelect(user)}
              className="w-96 px-5 py-1.5 bg-rojo-intec-300 inline-flex justify-start items-center gap-3.5 hover:bg-rojo-intec-100 transition-colors"
            >
              <img
                className="w-16 h-16 rounded-full object-cover"
                src={avatars[user.id] || "https://placehold.co/64x64"}
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
          ))
        )}
      </div>
    </div>
  );
};

export default ContactList;