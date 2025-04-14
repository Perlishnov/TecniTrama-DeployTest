import React, { act } from "react";
import CreatorLayout from "@/layouts/default";
import InfoCard from "@/components/InfoCard";
import Button from "@/components/button";
import ReusableTable from "@/components/ReusableTable";
import VacanteIcon from "@/assets/icons/users.svg";
import BriefCaseIcon from "@/assets/icons/briefcase.svg";
import LinkIcon from "@/assets/icons/link.svg";
import addPeopleIcon from "@/assets/icons/user-plus.svg"
import { Link, useParams } from "react-router-dom";

// Sample data for main content
const genres = ["Indie", "Filtro", "Filtro", "Mas..."];
const subjects = [
  "LCC - Tecnica y registro sonoro",
  "IDS123 - Base de datos",
  "Mas..."
];

const mainColumns = [
  { key: "position", label: "Cargo" },
  { key: "description", label: "Descripción" },
  { key: "requirements", label: "Requerimientos" },
  { key: "department", label: "Departamento" },
  { key: "person", label: "Encargado" },
];

const vacanciesData = [
  { 
    position: "Lorem Ipsum...", 
    description: "Lorem Ipsum", 
    requirements: "Lorem Ipsum", 
    person: "Armando Balcacer", 
    hasAction: true,
    actionText: "Invitar persona",
    actionIcon: addPeopleIcon,
    department: "Audiovisual",
  },
  { 
    position: "Necesitamos un...", 
    description: "Leer Mas...", 
    person: "Armando Balcacer", 
    hasAction: false,
    department: "Audiovisual",
  }
];

// Sample data for extra tables
const dataPatrocinadores = [
  { Sponsors: "Ejemplo",  }
];

const columnsLinks = [
  { key: "nombre", label: "Nombre" },
  { key: "url", label: "URL" },
];
const dataLinksOriginal = [
  { id: 1, nombre: "Instagram", url: "https://www.instagram.com/" },
  { id: 2, nombre: "Guion", url: "https://www.example.com/guion" },
];
// Shape dataLinks to remove any default fallback label by ensuring label is empty:
const dataLinks = dataLinksOriginal.map((row) => ({ ...row, label: "" }));

// Simulate ownership; set to false to simulate a non-owner view.
const isOwner = false;

const ProjectPreview: React.FC = () => {
  const { projectId } = useParams();
  return (
    <CreatorLayout>
      <div className="w-full h-full flex flex-col items-center gap-4">
        {/* Banner Image */}
        <img
          src="https://placehold.co/1305x297"
          alt="Project Banner"
          className="w-full h-[18.56rem] object-cover"
        />

        {/* Project Title */}
        <h1 className="w-full text-center text-[4.5rem] font-barlow font-medium leading-[5.85rem] px-2">
          Titulo
        </h1>

        {/* Main Content Container */}
        <div className="w-full flex gap-4 px-[3.375rem]">
          {/* Left Column: Filters and Categories */}
          <div className="w-[12.625rem] flex flex-col gap-[1.563rem]">
            <InfoCard title="Formato" content={["Corto"]} />
            <InfoCard title="Generos" content={genres} />
            <InfoCard
              title="Materias"
              content={subjects}
              headerButton={
                <button className="text-black text-[1.25rem] font-barlow font-medium leading-[1.625rem]">
                  +
                </button>
              }
            />
          </div>

          {/* Center Column: Description Card */}
          <InfoCard
            title="Descripción"
            content={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`}
            headerButton={null}
            className="flex-1"
          />

          {/* Right Column: Budget, Dates, and Action Buttons */}
          <div className="w-[16.563rem] flex flex-col justify-between">
            {/* Budget Card */}
            <div className="bg-rojo-intec-200 rounded-t-[1.25rem] outline outline-1 outline-[#63666A] overflow-hidden">
              <InfoCard title="Presupuesto" content="2.00$" headerButton={null} headerColor="bg-rojo-intec-300" className="rounded-b-none" />
            </div>

            {/* Dates Row */}
            <div className="flex gap-[2.625rem]">
              <InfoCard title="Inicio" content="XX/XX/20XX" headerButton={null} className="rounded-br-none" />
              <InfoCard title="Final" content="XX/XX/20XX" headerButton={null} className="rounded-bl-none" />
            </div>

            {/* Action Buttons: Show report button for owner, or publish and edit for non-owner */}
            {isOwner ? (
              <Button className="p-4">
                  Reportar proyecto
  
              </Button>
            ) : (
                <>
                <Button className="p-4 bg-Gris-100">
                  <Link 
                    to={`/projects/${projectId}/edit`}
                    className="block w-full h-full text-inherit no-underline"
                  >
                    Editar proyecto
                  </Link>
                </Button>
                <Button className="p-4">
                    Publicar proyecto
                </Button>
                </>
            )}
          </div>
        </div>

        {/* Vacancies (Crew) Table with an Add Crew Member Option */}
        <ReusableTable
          title="Vacantes + Crew"
          titleIcon={VacanteIcon}
          columns={mainColumns}
          data={vacanciesData}
          onAction={(row) => console.log("Action on row:", row)}
        />
        {/** Option to add a crew member if user is owner or always available */}        
        {isOwner && (
          <Button className="mt-4 rounded-full px-4 py-2">
            Agregar Miembro de Crew
          </Button>
        )}

        {/* Additional Data Section: Tw`o Column Layout for Patrocinadores and Links */}
        <div className="w-full flex flex-col justify-start items-center gap-6">
          <div className="w-full flex gap-9">
            <ReusableTable
              title="Patrocinadores"
              titleIcon={BriefCaseIcon}
              columns={[{ key: "Sponsors", label: "Patrocinadores" }]}
              data={dataPatrocinadores}
              onAction={(row) => console.log("Action on patrocinador row:", row)}
            />
            <ReusableTable
              title="Links, documentos, Redes"
              titleIcon={LinkIcon}
              columns={columnsLinks}
              data={dataLinks}
              onAction={(row) => console.log("Action on links row:", row)}
            />
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default ProjectPreview;
