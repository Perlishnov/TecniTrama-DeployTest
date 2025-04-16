import React, { useState } from "react";
import CreatorLayout from "@/layouts/default";
import ProjectCard, { ProjectCardProps } from "@/components/projectCard";

const dummyProjects: ProjectCardProps[] = [
  {
    id: 1,
    title: "Proyecto Alpha",
    description:
      "Descripción breve del Proyecto Alpha. Es un proyecto de género dramático con toques de acción.",
    imageUrl: "https://placehold.co/400x300",
    filters: ["Drama", "Acción"],
    completado: false,
    href: "/projects/1",
  },
  {
    id: 2,
    title: "Proyecto Beta",
    description:
      "Descripción breve del Proyecto Beta. Una propuesta de comedia ligera para televisión.",
    imageUrl: "https://placehold.co/400x300",
    filters: ["Comedia", "Romance"],
    completado: false,
    href: "/projects/2",
  },
  {
    id: 3,
    title: "Proyecto Gamma",
    description:
      "Descripción breve del Proyecto Gamma. Un documental que analiza la realidad social actual.",
    imageUrl: "https://placehold.co/400x300",
    filters: ["Documental"],
    completado: true,
    href: "/projects/3",
  },
  {
    id: 4,
    title: "Proyecto Delta",
    description:
      "Descripción breve del Proyecto Delta. Proyecto experimental con mezclas de géneros.",
    imageUrl: "https://placehold.co/400x300",
    filters: ["Experimental"],
    completado: false,
    href: "/projects/4",
  },
];

const DashboardPage: React.FC = () => {
  // Los filtros se derivan de todos los "tags" presentes en los proyectos dummy.
  const allFilters = Array.from(
    new Set(dummyProjects.flatMap((project) => project.filters))
  );
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredProjects = activeFilter
    ? dummyProjects.filter((project) =>
        project.filters.includes(activeFilter)
      )
    : dummyProjects;

  return (
    <CreatorLayout>
      <div className="w-full h-full px-12 pt-20 flex flex-col justify-start items-start gap-10">
        {/* Header con filtros */}
        <div className="flex flex-wrap justify-start items-center gap-3.5">
          {allFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`h-10 px-3.5 py-1 bg-white rounded-[71px] outline outline-2 outline-offset-[-2px] outline-black flex justify-center items-center gap-1 transition-colors 
                ${activeFilter === filter ? "bg-blue-500 text-white" : "text-black"}`}
            >
              <span className="text-xl p-2 font-medium font-barlow leading-relaxed">
                {filter}
              </span>
            </button>
          ))}
          <button
            onClick={() => setActiveFilter(null)}
            className="w-28 h-10 px-3.5 py-1 bg-white rounded-[71px] outline outline-2 outline-offset-[-2px] outline-black flex justify-center items-center gap-1 transition-colors"
          >
            <span className="text-xl font-medium font-barlow leading-relaxed">
              Todos
            </span>
          </button>
        </div>

        {/* Grid de ProjectCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))
          ) : (
            <div className="col-span-full text-center text-xl text-gray-500">
              No hay proyectos para este filtro
            </div>
          )}
        </div>
      </div>
    </CreatorLayout>
  );
};

export default DashboardPage;
