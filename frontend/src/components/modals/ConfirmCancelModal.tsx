import React from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <Modal title="Confirmar Eliminación" onClose={onCancel} className='bg-rojo-intec-200'>
      <p className="mb-4 font-barlow font-medium text-lg max-w-md">
        ¿Estás seguro de que deseas cancelar? Esta acción no se
        puede deshacer.
      </p>
      <div className="flex justify-end gap-4">
        <Button
          className="px-4 py-2 bg-white"
          onClick={onCancel}
        >
          No
        </Button>
        <Button
          className="px-4 py-2 bg-red-500"
          onClick={onConfirm}
        >
          Si
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
