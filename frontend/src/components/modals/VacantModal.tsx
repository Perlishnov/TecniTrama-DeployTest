// src/components/modals/VacancyFormModal.tsx
import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/button";
import { Department, Role } from "@/types";
import Select from "antd/es/select";
type VacancyFormValues = {
  department_id: number;
  role_id: number;
  descripcion: string;
  requerimientos: string;
};

const { Option } = Select;

export interface VacancyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vacancy: VacancyFormValues) => void;
  initialData?: VacancyFormValues;
  departments: Department[];
  roles: Role[];
}

export const VacancyFormModal: React.FC<VacancyFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  departments,
  roles
}) => {
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);
  const [roleId, setRoleId] = useState<number | undefined>(undefined);
  const [descripcion, setDescripcion] = useState("");
  const [requerimientos, setRequerimientos] = useState("");

  useEffect(() => {
    if (initialData) {
      setDepartmentId(initialData.department_id);
      setRoleId(initialData.role_id);
      setDescripcion(initialData.descripcion);
      setRequerimientos(initialData.requerimientos);
    } else {
      setDepartmentId(undefined);
      setRoleId(undefined);
      setDescripcion("");
      setRequerimientos("");
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!departmentId || !roleId) {
      alert("Departamento y Cargo son obligatorios");
      return;
    }
    onSave({ department_id: departmentId, role_id: roleId, descripcion, requerimientos });
    onClose();
  };

  if (!isOpen) return null;
  return (
    <Modal
      title={initialData ? "Editar Vacante" : "Agregar Vacante"}
      onClose={onClose}
      className="bg-rojo-intec-200 rounded-[10px] shadow-[0_4px_12px_2px_rgba(0,0,0,0.10)] outline outline-2 outline-black">

      <div className="space-y-4">
        {/* Departamento */}
        <div>
          <label htmlFor="vacancy-department" className="block mb-1 text-sm font-medium text-black">
            Departamento
          </label>
          <Select
            id="vacancy-department"
            placeholder="Seleccionar departamento"
            value={departmentId}
            onChange={val => { setDepartmentId(val); setRoleId(undefined); }}
            className="w-full border border-black rounded-md"
          >
            {departments.map(d => (
              <Option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Cargo (filtrado) */}
        <div>
          <label htmlFor="vacancy-role" className="block mb-1 text-sm font-medium text-black">
            Cargo
          </label>
          <Select
            id="vacancy-role"
            placeholder="Seleccionar cargo"
            value={roleId}
            onChange={val => setRoleId(val)}
            className="w-full"
            disabled={!departmentId}
          >
            {roles
              .filter(r => r.department_id === departmentId)
              .map(r => (
                <Option key={r.role_id} value={r.role_id}>
                  {r.role_name}
                </Option>
              ))}
          </Select>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="vacancy-description" className="block mb-1 text-sm font-medium text-black">
            Descripción
          </label>
          <textarea
            id="vacancy-description"
            className="w-full p-2 border border-black rounded-md resize-none"
            rows={4}
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Inserte descripción"
          />
        </div>

        {/* Requerimientos */}
        <div>
          <label htmlFor="vacancy-requirements" className="block mb-1 text-sm font-medium text-black">
            Requerimientos
          </label>
          <textarea
            id="vacancy-requirements"
            className="w-full p-2 border border-black rounded-md resize-none"
            rows={4}
            value={requerimientos}
            onChange={e => setRequerimientos(e.target.value)}
            placeholder="Inserte requerimientos"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button className="bg-white" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>
            {initialData ? "Guardar" : "Agregar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VacancyFormModal;
