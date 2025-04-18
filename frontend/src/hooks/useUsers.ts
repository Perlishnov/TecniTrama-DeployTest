// src/hooks/useUsers.ts
import { useEffect, useState } from "react";

export interface UserData {
  id: number;
  email: string;
  name: string;
  // añade aquí más campos si los necesitas
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      // Suponemos que tu JWT está en localStorage bajo la clave "token"
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        console.error("No se encontró token de autenticación");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
        });

        if (!res.ok) {
          console.error(`Error ${res.status} al obtener usuarios`);
          setUsers([]);
        } else {
          const data = await res.json();
          // Tu endpoint devuelve un array plano con user_id, first_name, etc.
          const list: UserData[] = Array.isArray(data)
            ? data.map((u: any) => ({
                id: u.user_id,
                email: u.email,
                name: `${u.first_name} ${u.last_name}`,
              }))
            : [];

          setUsers(list);
        }
      } catch (error) {
        console.error("Error cargando usuarios:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading };
};