import React from "react";
import CreatorLayout from "@/layouts/default";
import ProjectCard, { ProjectCardProps } from "@/components/projectCard";
import CustomTabs, { CustomTab } from "@/components/tabs";

const dummyProjects: ProjectCardProps[] = [
  {
    id: 1,
    title: "Proyecto Alpha",
    description:
      "Descripción breve del Proyecto Alpha. Es un proyecto de género dramático con toques de acción.",
    imageUrl: "https://placehold.co/400x300",
    filters: ["Drama", "Acción"],
    completado: false, // Activo
    href: "/projects/1",
  },
  {
    id: 2,
    title: "Proyecto Beta",
    description:
      "Descripción breve del Proyecto Beta. Una propuesta de comedia ligera para televisión.",
    imageUrl: "https://placehold.co/400x300",
    filters: ["Comedia", "Romance"],
    completado: true, // Inactivo
    href: "/projects/2",
  },
  {
    id: 3,
    title: "Proyecto Gamma",
    description:
      "Descripción breve del Proyecto Gamma. Un documental que analiza la realidad social actual.",
    imageUrl: "https://placehold.co/400x300",
    filters: ["Documental"],
    completado: false, // Activo
    href: "/projects/3",
  },
  {
    id: 4,
    title: "Proyecto Delta",
    description:
      "Descripción breve del Proyecto Delta. Proyecto experimental con mezclas de géneros.",
    imageUrl: "https://placehold.co/400x300",
    filters: ["Experimental"],
    completado: true, // Inactivo
    href: "/projects/4",
  },
];

const ProjectsPage: React.FC = () => {
  return (
    <CreatorLayout>
      <div className="w-full h-full px-12 pb-11 flex flex-col justify-start gap-6">
        {/* Header */}
        <div className="w-full h-20 pr-14 inline-flex justify-start items-center">
          <div className="text-Base-Negro text-6xl font-medium font-barlow leading-[78px]">
            Proyectos
          </div>
        </div>

        {/* Custom Tabs */}
        <CustomTabs>
          <CustomTab label="Activos">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
              {dummyProjects
                .filter((p) => !p.completado)
                .map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
            </div>
          </CustomTab>

          <CustomTab label="Inactivos">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
              {dummyProjects
                .filter((p) => p.completado)
                .map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
            </div>
          </CustomTab>
        </CustomTabs>
      </div>
    </CreatorLayout>
  );
};

export default ProjectsPage;
