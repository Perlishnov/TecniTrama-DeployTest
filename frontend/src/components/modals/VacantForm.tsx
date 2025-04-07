import React from "react";

interface Option {
  id: string;
  name: string;
}

interface VacantFormProps {
  departments: Option[];
  positions: Option[];
  selectedDepartment: string;
  selectedPosition: string;
  onDepartmentChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  requirements: string;
  setRequirements: (value: string) => void;
}

const VacantForm: React.FC<VacantFormProps> = ({
  departments,
  positions,
  selectedDepartment,
  selectedPosition,
  onDepartmentChange,
  onPositionChange,
  description,
  setDescription,
  requirements,
  setRequirements,
}) => {
  return (
    <div className="space-y-4">
      {/* Department Dropdown */}
      <div>
        <label htmlFor="" className="block mb-1 text-sm font-medium font-barlow text-Base-Negro">
          Departamento
        </label>
        <select
          value={selectedDepartment}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="w-full h-12 pl-5 pr-3.5 py-3.5 bg-Base-Blanco rounded-[10px] outline outline-1 outline-offset-[-1px] outline-black"
        >
          <option value="">Elegir...</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* Vacant Name Dropdown */}
      <div>
        <label className="block mb-1 text-sm font-medium font-barlow text-Base-Negro">
          Nombre de la vacante
        </label>
        <select
          value={selectedPosition}
          onChange={(e) => onPositionChange(e.target.value)}
          className="w-full h-12 pl-5 pr-3.5 py-3.5 bg-Base-Blanco rounded-[10px] outline outline-1 outline-offset-[-1px] outline-black"
        >
          <option value="">Elegir...</option>
          {positions.map((pos) => (
            <option key={pos.id} value={pos.name}>
              {pos.name}
            </option>
          ))}
        </select>
      </div>

      {/* Descripción Field */}
      <div>
        <label className="block mb-1 text-sm font-medium font-barlow text-Base-Negro">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Inserte descripción"
          className="w-full h-28 p-3 bg-Base-Blanco rounded-[10px] outline outline-1 outline-offset-[-1px] outline-black text-sm font-medium font-barlow leading-tight"
        />
      </div>

      {/* Requerimientos Field */}
      <div>
        <label className="block mb-1 text-sm font-medium font-barlow text-Base-Negro">
          Requerimientos
        </label>
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          placeholder="Inserte requerimientos"
          className="w-full h-28 p-3 bg-Base-Blanco rounded-[10px] outline outline-1 outline-offset-[-1px] outline-black text-sm font-medium font-barlow leading-tight"
        />
      </div>
    </div>
  );
};

export default VacantForm;
