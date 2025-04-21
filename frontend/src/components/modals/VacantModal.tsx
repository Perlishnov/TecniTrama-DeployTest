import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/button";
import { Department, Role } from "@/types";
import Select from "antd/es/select";

export type VacancyFormValues = {
  department_id: number;
  department_name: string;
  role_id: number;
  role_name: string;
  description: string;
  requirements: string;
};

const { Option } = Select;

export interface VacancyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vacancy: VacancyFormValues) => void;
  initialData?: VacancyFormValues;
  departments: Department[];
}

const apiRoute = import.meta.env.VITE_API_ROUTE;

const VacancyFormModal: React.FC<VacancyFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  departments
}) => {
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);
  const [roleId, setRoleId] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  useEffect(() => {
    if (initialData) {
      setDepartmentId(initialData.department_id);
      setRoleId(initialData.role_id);
      setDescription(initialData.description);
      setRequirements(initialData.requirements);
      // Precarga roles del departamento al editar
      fetchRolesByDepartment(initialData.department_id);
    } else {
      setDepartmentId(undefined);
      setRoleId(undefined);
      setDescription("");
      setRequirements("");
      setRoles([]);
    }
  }, [initialData, isOpen]);

  const fetchRolesByDepartment = async (deptId: number) => {
    try {
      setIsLoadingRoles(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${apiRoute}departments/${deptId}/roles`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      // Normaliza la respuesta para asegurarte de tener un array
      let list: Role[] = [];
      if (Array.isArray(json)) {
        list = json;
      } else if (Array.isArray((json as any).roles)) {
        list = (json as any).roles;
      } else if (Array.isArray((json as any).data)) {
        list = (json as any).data;
      } else {
        console.error("Unexpected roles response:", json);
      }
      setRoles(list);
    } catch (e) {
      console.error("Error cargando roles:", e);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const handleSave = () => {
    if (!departmentId || !roleId) {
      alert("Departamento y Cargo son obligatorios");
      return;
    }
    // Obtiene nombres de la selección
    const dept = departments.find(d => d.department_id === departmentId)!;
    const role = (Array.isArray(roles) ? roles : []).find(r => r.role_id === roleId)!;

    onSave({
      department_id: departmentId,
      department_name: dept.department_name,
      role_id: roleId,
      role_name: role.role_name,
      description,
      requirements
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      title={initialData ? "Editar Vacante" : "Agregar Vacante"}
      onClose={onClose}
      className="bg-rojo-intec-200 rounded-[10px] shadow-[0_4px_12px_2px_rgba(0,0,0,0.10)] outline outline-2 outline-black"
    >
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
            onChange={async val => {
              setDepartmentId(val);
              setRoleId(undefined);
              await fetchRolesByDepartment(val);
            }}
            className="w-full border border-black rounded-md"
          >
            {departments.map(d => (
              <Option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Cargo */}
        <div>
          <label htmlFor="vacancy-role" className="block mb-1 text-sm font-medium text-black">
            Cargo
          </label>
          <Select
            id="vacancy-role"
            placeholder={isLoadingRoles ? "Cargando cargos..." : "Seleccionar cargo"}
            value={roleId}
            onChange={val => setRoleId(val)}
            className="w-full"
            disabled={!departmentId || isLoadingRoles}
          >
            {(Array.isArray(roles) ? roles : []).map(r => (
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
            value={description}
            onChange={e => setDescription(e.target.value)}
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
            value={requirements}
            onChange={e => setRequirements(e.target.value)}
            placeholder="Inserte requerimientos"
          />
        </div>

        {/* Acciones */}
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