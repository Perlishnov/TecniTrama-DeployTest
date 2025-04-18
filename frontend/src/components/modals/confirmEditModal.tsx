// src/components/modals/ConfirmEditModal.tsx
import React from "react";
import Modal from "@/components/Modal";
import Button from "@/components/button";

export interface ConfirmEditModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
}

const ConfirmEditModal: React.FC<ConfirmEditModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  message = "¿Estás seguro de que deseas guardar los cambios?",
}) => {
  if (!isOpen) return null;

  return (
    <Modal title="Confirmar edición" onClose={onCancel} className="bg-rojo-intec-200 rounded-[10px] shadow-[0_4px_12px_2px_rgba(0,0,0,0.10)] outline outline-2 outline-black" >
      <p className="mb-4 text-black font-barlow text-medium">{message}</p>
      <div className="flex justify-end gap-4">
        <Button
          className="px-4 py-2 bg-white text-black font-barlow"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          className="px-4 py-2 bg-rojo-intec-400 text-white font-barlow"
          onClick={onConfirm}
        >
          Guardar cambios
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmEditModal;
