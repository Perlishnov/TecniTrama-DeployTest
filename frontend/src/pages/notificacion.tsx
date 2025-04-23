import Modal from "@/components/Modal";

type NotificationsModalPageProps = {
  onClose?: () => void;
};

const NotificationsModalPage = ({ onClose }: NotificationsModalPageProps) => {
  const notifications = [
    {
      notify_id: 1,
      content: 'Has sido invitado a [Documental Social]. Te ha invitado Ana Pérez. Haz click para ver las invitaciones.',
      created_at: '2024-03-20T15:30:00',
    },
    {
      notify_id: 2,
      content: 'Carlos Gómez ha aceptado tu invitación al proyecto [Cortometraje Estudiantil]! Haz click para ver el proyecto.',
      created_at: '2024-03-19T09:15:00',
    },
    {
      notify_id: 3,
      content: 'Te han aceptado tu solicitud de [Editor] para [Serie Documental]. Haz click para ver el proyecto.',
      created_at: '2024-03-18T08:00:00',
    },
  ];

  const handleClose = () => {
    if (onClose) {
      onClose(); // Cierra el modal correctamente
    }
  };

  return (
    <Modal
      title='Centro de notificaciones'
      onClose={handleClose}
      className="w-[529px] py-6 bg-rojo-intec-200 rounded-xl outline outline-2 outline-offset-[-2px] outline-Gris-500 gap-7 overflow-hidden"
    >
      <div className="w-full h-0 outline outline-1 outline-offset-[-0.5px] outline-Gris-500 my-4" />

      <div className="w-full flex flex-col justify-start items-start max-h-[400px] overflow-y-auto">
        {notifications.map((notification, index) => (
          <div key={notification.notify_id}>
            {index > 0 && (
              <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.5px] outline-Gris-500" />
            )}
            <div className="self-stretch px-6 py-2 bg-rojo-intec-300 inline-flex justify-between items-center cursor-pointer hover:bg-rojo-intec-500 transition-colors">
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                <div className="text-sm font-medium font-barlow text-Base-Negro leading-tight text-justify">
                  {notification.content}
                </div>
                <div className="text-xs font-medium font-barlow text-Base-Negro leading-tight text-justify">
                  {new Date(notification.created_at).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default NotificationsModalPage;