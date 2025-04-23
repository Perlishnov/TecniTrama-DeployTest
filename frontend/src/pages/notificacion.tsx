import { useEffect, useState } from "react";
import { useDecodeJWT } from "@/hooks/useDecodeJWT";
import { useNavigate } from "react-router-dom";
import { Badge } from "antd";
import Modal from "@/components/Modal";
import { CheckOutlined, EyeOutlined } from "@ant-design/icons";

type NotificationsModalPageProps = {
  onClose?: () => void;
};

type Notification = {
  notif_id: number;
  content: string;
  created_at: string;
  project_id: number;
  is_read: boolean;
};

const NotificationsModalPage = ({ onClose }: NotificationsModalPageProps) => {
  const decodedToken = useDecodeJWT();
  const user_id = decodedToken?.id;
  const navigate = useNavigate();
  const apiRoute = import.meta.env.VITE_API_ROUTE;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró token de autenticación");
      setLoading(false);
      return;
    }

    if (!user_id) {
      setError("Usuario no autenticado");
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${apiRoute}notifications/${user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error al cargar las notificaciones");
        }
        const data = await response.json();
        const parsedNotifications = data.map((item: any) => ({
          notif_id: item.notifications.notif_id,
          content: item.notifications.content,
          created_at: item.notifications.created_at,
          project_id: item.project_id,
          is_read: item.is_read,
        }));
        setNotifications(parsedNotifications);
      } catch (err: any) {
        setError(err.message || "Ocurrió un error");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [decodedToken, user_id]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const markAsRead = async (notificationId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró token de autenticación");
      return;
    }

    try {
      const response = await fetch(`${apiRoute}notifications/${notificationId}/${user_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_read: true, // <-- MUY IMPORTANTE: enviar is_read en el body si tu API lo requiere
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la notificación');
      }

      // Actualiza en frontend también
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notif_id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Modal
      onClose={handleClose}
      className="w-[529px] py-6 bg-rojo-intec-200 rounded-xl outline outline-2 outline-offset-[-2px] outline-Gris-500 gap-7 overflow-hidden"
    >
      {/* Título */}
      <div className="flex items-center justify-center gap-2 text-xl font-semibold font-barlow text-Base-Negro">
        Centro de notificaciones
        {unreadCount > 0 && (
          <Badge count={unreadCount} size="small" style={{ backgroundColor: "#f5222d" }} />
        )}
      </div>

      {/* Línea divisoria */}
      <div className="w-full h-0 outline outline-1 outline-offset-[-0.5px] outline-Gris-500 my-4" />

      {/* Lista de notificaciones */}
      <div className="w-full flex flex-col justify-start items-start max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="text-center w-full py-4">Cargando notificaciones...</div>
        ) : error ? (
          <div className="text-center text-red-500 w-full py-4">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="text-center w-full py-4">No tienes notificaciones nuevas.</div>
        ) : (
          notifications.map((notification, index) => (
            <div key={notification.notif_id} className="w-full">
              {index > 0 && (
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.5px] outline-Gris-500" />
              )}
              <div
                className={`flex justify-between items-center px-6 py-2 cursor-pointer transition-colors
                  ${notification.is_read ? "bg-gray-300 hover:bg-gray-400" : "bg-rojo-intec-300 hover:bg-rojo-intec-500"}
                `}
              >
                <div
                  className="flex-1 inline-flex flex-col justify-start items-start gap-1.5"
                  onClick={() => navigate(`/projects/${notification.project_id}`)}
                >
                  <div className="text-sm font-medium font-barlow text-Base-Negro leading-tight text-justify">
                    {notification.content}
                  </div>
                  <div className="text-xs font-medium font-barlow text-Base-Negro leading-tight text-justify">
                    {new Date(notification.created_at).toLocaleString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Botón para marcar como leído */}
                {!notification.is_read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que también haga navigate
                      markAsRead(notification.notif_id);
                    }}
                    className="ml-4 p-2 rounded-full hover:bg-gray-200 transition"
                    title="Marcar como leída"
                  >
                    <CheckOutlined style={{ fontSize: 20, color: "#52c41a" }} />
                  </button>
                )}
                {/* Si ya está leída, mostramos el ojo */}
                {notification.is_read && (
                  <div className="ml-4 p-2">
                    <EyeOutlined style={{ fontSize: 20, color: "gray" }} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default NotificationsModalPage;