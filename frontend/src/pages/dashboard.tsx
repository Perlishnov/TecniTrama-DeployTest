import React, { useState, useEffect } from "react";
import CreatorLayout from "@/layouts/default";
import ProjectCard, { ProjectCardProps } from "@/components/projectCard";
import { Genre } from "@/types";
import { Dropdown, Menu, ConfigProvider } from "antd";
import type { MenuProps } from "antd";

interface ApiProject {
  project_id: number;
  title: string;
  description: string;
  banner: string;
  estimated_end: string;
  is_active: boolean;
}

const DashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [allFilters, setAllFilters] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiRoute = import.meta.env.VITE_API_ROUTE;
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsResponse = await fetch(`${apiRoute}projects`, {
          headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
          }
        });
        if (!projectsResponse.ok) throw new Error("Error obteniendo proyectos");
        
        let projectsData: ApiProject[] = await projectsResponse.json();
        // Filtrar solo proyectos publicados
        projectsData = projectsData.filter(project => project.is_published === true);

        const projectsWithGenres = await Promise.all(
          projectsData.map(async (project) => {
            try {
              const genresResponse = await fetch(
                `${apiRoute}projects/${project.project_id}/genres`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                  }
                });

              // Estructura base del proyecto
              const baseProject = {
                id: project.project_id,
                title: project.title,
                description: project.description,
                imageUrl: project.banner || "https://placehold.co/400x300",
                href: `/projects/${project.project_id}`,
                completado: !project.is_active,
                filters: [] as string[] // Valor por defecto
              };

              if (!genresResponse.ok) {
                console.warn(`Proyecto ${project.project_id} sin géneros o error de acceso`);
                return baseProject;
              }

              const genres: Genre[] = await genresResponse.json();
              return { ...baseProject, filters: genres.map(g => g.genre) };

            } catch (error) {
              console.error(`Error obteniendo géneros para proyecto ${project.project_id}:`, error);
              return {
                id: project.project_id,
                title: project.title,
                description: project.description,
                imageUrl: project.banner || "https://placehold.co/400x300",
                href: `/projects/${project.project_id}`,
                completado: !project.is_active,
                filters: []
              };
            }
          })
        );

        const uniqueGenres = Array.from(
          new Set(projectsWithGenres.flatMap(p => p.filters))
        ).filter(genre => genre.length > 0);

        setProjects(projectsWithGenres);
        setAllFilters(uniqueGenres);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = activeFilter
    ? projects.filter(project => project.filters.includes(activeFilter))
    : projects;

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setActiveFilter(e.key === 'all' ? null : e.key);
  };

  const menuItems: MenuProps['items'] = [
    ...allFilters.map(filter => ({
      label: filter,
      key: filter,
    })),
    {
      type: 'divider',
    },
    {
      label: 'Todos',
      key: 'all',
    }
  ];  

  if (loading) {
    return (
      <CreatorLayout>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-xl">Cargando proyectos...</span>
        </div>
      </CreatorLayout>
    );
  }

  if (error) {
    return (
      <CreatorLayout>
        <div className="w-full h-full flex items-center justify-center text-red-500">
          Error: {error}
        </div>
      </CreatorLayout>
    );
  }

  return (
    <CreatorLayout>
      <div className="w-full h-full px-12 pt-20 flex flex-col justify-start items-start gap-10">
        {/* Filtro Dropdown */}
          <Dropdown
            overlay={
              <Menu 
                onClick={handleMenuClick}
                items={menuItems}
                selectedKeys={activeFilter ? [activeFilter] : []}
              />
            }
            trigger={['click']}
          >
            <button className="h-10 px-6 py-1 rounded-[71px] outline outline-2 outline-black 
              bg-white hover:bg-gray-50 transition-colors flex items-center gap-2">
              <span className="text-xl font-medium font-barlow">
                {activeFilter || 'Filtrar por género'}
              </span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="black" strokeWidth="2"/>
              </svg>
            </button>
          </Dropdown>

        {/* Proyectos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))
          ) : (
            <div className="col-span-full text-center text-xl text-gray-500">
              No hay proyectos con este filtro
            </div>
          )}
        </div>
      </div>
    </CreatorLayout>
  );
};

export default DashboardPage;
