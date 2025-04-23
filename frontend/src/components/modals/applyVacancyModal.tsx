import React, { useState } from "react";
import Modal, { ModalProps } from "@/components/Modal";
import Button from "@/components/button";
import type { Vacancy } from "@/types";

export interface ApplyVacancyModalProps extends Pick<ModalProps, "onClose" | "className"> {
  vacancy: Vacancy;
  open: boolean;
  onSubmit: (vacancy: Vacancy, reasons: string) => void;
}

const ApplyVacancyModal: React.FC<ApplyVacancyModalProps> = ({
  vacancy,
  open,
  onClose,
  onSubmit,
  className
}) => {
  const [reasons, setReasons] = useState("");

  if (!open) return null;

  return (
    <Modal
      title={`Aplicar a: ${vacancy.cargo}`}
      onClose={onClose}
      className={className}
    >
      <div className="space-y-4">
        <p>
          <strong>Descripción:</strong> {vacancy.descripcion}
        </p>
        <p>
          <strong>Requerimientos:</strong> {vacancy.requerimientos}
        </p>
        <div className="flex flex-col">
          <label htmlFor="apply-reasons" className="mb-1 text-sm font-medium">
            Razones para aplicar
          </label>
          <textarea
            id="apply-reasons"
            value={reasons}
            onChange={(e) => setReasons(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded focus:outline-none resize-none "
            placeholder="Explica por qué eres buen candidato…"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            className="px-4 py-2 bg-white"
            onClick={() => {
              setReasons("");
              onClose();
            }}
          >
            Cancelar
          </Button>
          <Button
            className="px-4 py-2 bg-rojo-intec-400 text-white"
            disabled={!reasons.trim()}
            onClick={() => {
              onSubmit(vacancy, reasons.trim());
              setReasons("");
            }}
          >
            Enviar solicitud
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApplyVacancyModal;
