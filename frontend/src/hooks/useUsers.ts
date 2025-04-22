import { useEffect, useState } from "react";

export interface UserData {
  id: number;
  email: string;
  name: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const apiRoute = import.meta.env.VITE_API_ROUTE;

  useEffect(() => {
    const fetchUsers = async () => {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        console.error("No se encontró token de autenticación");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiRoute}users`, {
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

          // Filtrar por user_type_id === 1 antes de mapear
          const list: UserData[] = Array.isArray(data)
            ? data
                .filter((u: any) => u.user_type_id === 1)
                .map((u: any) => ({
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