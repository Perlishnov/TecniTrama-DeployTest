import { Modal, Button } from "antd";
import  { Request } from "@/components/requestTable";

interface Props {
  request: Request;
  open: boolean;
  onClose: () => void;
  onAccept: (req: Request) => void;
  onReject: (req: Request) => void;
}

export default function ViewRequestModal({ request, open, onClose, onAccept, onReject }: Props) {
  return (
    <Modal
      title={`Solicitud de ${request.applicant}`}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="reject" danger onClick={() => onReject(request)}>Rechazar</Button>,
        <Button key="accept" type="primary" onClick={() => onAccept(request)}>Aceptar</Button>
      ]}
    >
      <p><b>Puesto solicitado:</b> {request.position}</p>
      <p><b>Razones:</b> {request.reasons}</p>
    </Modal>
  );
}
