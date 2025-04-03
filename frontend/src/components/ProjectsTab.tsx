import React, { useState } from "react";

export interface ProjectsTabProps {
  inProgressProjects: React.ReactNode[];
  finishedProjects: React.ReactNode[];
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  inProgressProjects,
  finishedProjects,
}) => {
  const [activeTab, setActiveTab] = useState<"inProgress" | "finished">("inProgress");

  return (
    <div className="w-full flex flex-col">
      {/* Tabs Header */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium focus:outline-none ${
            activeTab === "inProgress" ? "border-b-2 border-black" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("inProgress")}
        >
          En Proceso
        </button>
        <button
          className={`px-4 py-2 font-medium focus:outline-none ${
            activeTab === "finished" ? "border-b-2 border-black" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("finished")}
        >
          Terminados
        </button>
      </div>

      {/* Tabs Content */}
      <div className="flex-grow">
        {activeTab === "inProgress" ? (
          <>
            {inProgressProjects ? inProgressProjects : "No hay proyectos en proceso"}
          </>
        ) : (
          <>
            {finishedProjects ? finishedProjects : "No hay proyectos terminados"}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectsTab;
