import React, { useState } from "react";
import VacantModal from "./VacantModal";

const ParentComponent: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // Example state values for the form
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  const departments = [
    { id: "1", name: "Ingeniería" },
    { id: "2", name: "Diseño" },
    { id: "3", name: "Marketing" },
  ];

  const positions = [
    { id: "dev", name: "Desarrollador" },
    { id: "ux", name: "Diseñador UX" },
    { id: "pm", name: "Project Manager" },
  ];

  const handleSubmit = () => {
    // Here, update your vacants variable or perform your submission logic
    console.log({
      department: selectedDepartment,
      position: selectedPosition,
      description,
      requirements,
    });
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-Rojo---Intec-500 text-white px-4 py-2 rounded"
      >
        Agregar Vacante
      </button>
      <VacantModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        departments={departments}
        positions={positions}
        selectedDepartment={selectedDepartment}
        selectedPosition={selectedPosition}
        onDepartmentChange={setSelectedDepartment}
        onPositionChange={setSelectedPosition}
        description={description}
        setDescription={setDescription}
        requirements={requirements}
        setRequirements={setRequirements}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ParentComponent;
