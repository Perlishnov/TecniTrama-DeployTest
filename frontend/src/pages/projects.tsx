import React, { useState } from "react";
import CreatorLayout from "@/layouts/default";
import ProjectCard, { ProjectCardProps } from "@/components/projectCard";
import CustomTabs, { CustomTab } from "@/components/tabs";

const dummyProjects: ProjectCardProps[] = [
  {
    id: 1,
    title: "Proyecto Alpha",
    description: "Descripción breve del Proyecto Alpha. Es un proyecto de género dramático con toques de acción.",
    imageUrl: "https://placehold.co/400x300",
    filters: ["Drama", "Acción"],
    completado: true,
    href: "/projects/1", // Use as navigation link if needed
  },
  {
    id: 2,
    title: "Proyecto Beta",
    description: "Descripción breve del Proyecto Beta. Una propuesta de comedia ligera para televisión.",
    imageUrl: "https://placehold.co/400x300",
    filters: ["Comedia", "Romance"],
    completado: false,
    href: "/projects/2",
  },
  {
    id: 3,
    title: "Proyecto Gamma",
    description: "Descripción breve del Proyecto Gamma. Un documental que analiza la realidad social actual.",
    imageUrl: "https://placehold.co/400x300",
    filters: ["Documental"],
    completado: true,
    href: "/projects/3",
  },
  {
    id: 4,
    title: "Proyecto Delta",
    description: "Descripción breve del Proyecto Delta. Proyecto experimental con mezclas de géneros.",
    imageUrl: "https://placehold.co/400x300",
    filters: ["Experimental"],
    completado: false,
    href: "/projects/4",
  },
];

const ProjectsPage: React.FC = () => {
  return (
    <CreatorLayout>
      <div className="w-full h-full px-12 pb-11 flex flex-col justify-start gap-6">
        {/* Header */}
        <div className="w-full h-20 pr-14 inline-flex justify-start items-center">
          <div className="text-Base-Negro text-5xl font-medium font-barlow leading-[78px]">
            Proyectos
          </div>
        </div>

        {/* Tabs modificado para coincidir con la lógica funcional */}
        <CustomTabs>
          <CustomTab label="Activos">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {dummyProjects
                .filter(p => p.completado) // Activos = proyectos no completados
                .map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    {...project}
                    className="w-full h-full" // Asegurar tamaño
                  />
                ))}
            </div>
          </CustomTab>

          <CustomTab label="Inactivos">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {dummyProjects
                .filter(p => !p.completado) // Inactivos = proyectos completados
                .map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    {...project}
                    className="w-full h-full"
                  />
                ))}
            </div>
          </CustomTab>
        </CustomTabs>
      </div>
    </CreatorLayout>
  );
};
export default ProjectsPage;