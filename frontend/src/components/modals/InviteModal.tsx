import React, { useState } from "react";
import Modal from "@/components/Modal";
import Input from "@/components/input";
import Button from "@/components/button";
import { Vacancy } from "@/types";

interface InvitePersonModalProps {
  onClose: () => void;
  onInvite: (username: string) => void;
  vacancy : Vacancy;
}

const InvitePersonModal: React.FC<InvitePersonModalProps> = ({ onClose, onInvite }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    if (username.trim()) {
      onInvite(username);
      setUsername(""); // Clear field
      onClose(); // Close modal
    }
  };

  return (
    <Modal className="bg-rojo-intec-100" onClose={onClose} title="Invitar persona">
      <div className="flex flex-col gap-6 bg-rojo-intec-100 px-2 rounded-xl">
        <div>
          <label htmlFor="Usuario" className="block text-black font-semibold text-xl mb-2">
            Escribe el nombre de la persona encargada
          </label>
          <Input
            placeholder="Inserte usuario a invitar"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full" name={"Usuario"}          />
        </div>
        <div className="flex justify-end gap-4">
          <Button className="bg-white text-black" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-rojo-intec-300 text-white" onClick={handleSubmit}>
            Enviar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InvitePersonModal;
