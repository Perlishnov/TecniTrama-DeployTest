import React, { useEffect, useState } from "react";
import { useDecodeJWT } from "@/hooks/useDecodeJWT";
import Button from "./button";

interface ChangePasswordModalProps {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
  const decoded = useDecodeJWT();
  const userId = decoded?.id; // Se asume que el payload del JWT tiene la propiedad "id"
  
  const [userData, setUserData] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("userId", userId);
    if (!userId) return;
    fetch(`http://localhost:3000/api/users/${userId}`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener datos del usuario");
        return res.json();
      })
      .then((data) => setUserData(data))
      .catch((err) => setError(err.message));
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError("");

    const updatedUser = { ...userData, password: newPassword };

    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(updatedUser)
      });
      if (!res.ok) throw new Error("Error al actualizar la contraseña");
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg">
          <p>Error: Usuario no autenticado</p>
          <Button onClick={onClose} className="mt-4 px-4 py-2">
            Cerrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {!userData ? (
          <div>Cargando datos del usuario...</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-4 py-2 border rounded"
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded bg-black text-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="px-4 py-2"
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
