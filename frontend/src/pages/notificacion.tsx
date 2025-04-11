import { useState } from 'react';
import CreatorLayout from '@/layouts/default';

interface Notification {
  notify_id: number;
  content: string;
  created_at: string;
  userRead: boolean;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      notify_id: 1,
      content: 'Nueva solicitud recibida para el proyecto "Documental Social"',
      created_at: '2024-03-20T15:30:00',
      userRead: false
    },
    {
      notify_id: 2,
      content: 'Tu proyecto "Cortometraje Estudiantil" ha sido aprobado',
      created_at: '2024-03-19T09:15:00',
      userRead: true
    },
    {
      notify_id: 3,
      content: 'Recordatorio: Reunión de equipo hoy a las 17:00',
      created_at: '2024-03-18T08:00:00',
      userRead: false
    }
  ]);

  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);

  const handleSelectNotification = (notifyId: number) => {
    setSelectedNotification(notifyId);
    
    // Marcar como leído
    setNotifications(notifications.map(n => 
      n.notify_id === notifyId ? { ...n, userRead: true } : n
    ));
  };

  return (
    <CreatorLayout>
      <div className="self-stretch pt-9 inline-flex flex-col justify-end items-start h-full">
        {/* Header */}
        <div className="self-stretch flex flex-col justify-start items-center gap-9">
          <div className="w-full h-20 px-14 inline-flex justify-start items-center gap-2.5">
            <h1 className="text-Base-Negro text-6xl font-medium font-barlow leading-[78px]">
              Notificaciones
            </h1>
          </div>
          <div className="self-stretch h-0 outline outline-2 outline-offset-[-1px] outline-Gris-500" />
        </div>

        {/* Contenido principal */}
        <div className="self-stretch flex-1 bg-rojo-intec-100 inline-flex justify-start items-end w-full">
          {/* Lista de notificaciones */}
          <div className="self-stretch bg-rojo-intec-200 outline outline-1 outline-Gris-500 inline-flex flex-col justify-start items-start">
            <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-Gris-500" />
            
            <div className="p-4 inline-flex justify-center items-center gap-1">
              <h2 className="text-Base-Negro text-2xl font-w500 font-barlow">
                Centro de notificaciones
              </h2>
            </div>
            
            <div className="flex flex-col justify-start items-center gap-1 w-full">
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-Gris-500" />
              
              <div className="overflow-y-auto max-h-[80vh] w-full p-4 space-y-4 flex flex-col">
                {notifications.map((notification) => (
                  <div
                    key={notification.notify_id}
                    onClick={() => handleSelectNotification(notification.notify_id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleSelectNotification(notification.notify_id)}
                    className={`w-96 h-20 px-5 py-1.5 rounded-2xl outline outline-1 outline-offset-[-1px] outline-Gris-500 inline-flex justify-start items-center gap-3.5 cursor-pointer ${
                      notification.userRead 
                        ? 'bg-rojo-intec-300' 
                        : 'bg-rojo-intec-400'
                    } ${
                      selectedNotification === notification.notify_id 
                        ? 'ring-2 ring-black' 
                        : ''
                    } transition-all`}
                  >
                    <div className="w-48 inline-flex flex-col justify-start items-start">
                      <div className={`self-stretch text-Base-Negro text-lg font-medium font-barlow leading-7 ${
                        !notification.userRead ? 'font-bold' : ''
                      }`}>
                        {notification.content.substring(0, 30)}...
                      </div>
                      <div className="self-stretch text-Base-Negro text-sm font-medium font-barlow leading-tight">
                        {new Date(notification.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel de detalle */}
          <div className="flex-1 h-[80vh] px-5 pb-8 bg-rojo-intec-100 overflow-y-auto">
            {selectedNotification ? (
              <div className="p-6 space-y-4">
                <h3 className="text-3xl font-bold font-barlow">
                  Detalles completos
                </h3>
                <p className="text-lg text-Base-Negro font-barlow">
                  {notifications.find(n => n.notify_id === selectedNotification)?.content}
                </p>
                <div className="text-gray-500 text-sm font-barlow">
                  Fecha: {new Date(
                    notifications.find(n => n.notify_id === selectedNotification)?.created_at || ''
                  ).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 font-barlow text-xl">
                Selecciona una notificación para ver los detalles
              </div>
            )}
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default NotificationsPage;