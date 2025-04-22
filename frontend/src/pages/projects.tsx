import React, { useState, useEffect } from "react";
import { useNavigate }                from "react-router-dom";
import CreatorLayout                  from "@/layouts/default";
import ProjectCard, { ProjectCardProps } from "@/components/projectCard";
import CustomTabs, { CustomTab }      from "@/components/tabs";
import { useDecodeJWT } from "@/hooks/useDecodeJWT";

interface BackendProject {
  project_id: number;
  title:       string;
  description: string;
  banner:      string | null;   // puede venir null
  is_active:   boolean;
}

// Helper para convertir el banner de la BD en una URL válida
function resolveBannerUrl(banner: string | null): string {
  const PLACEHOLDER = "https://placehold.co/400x300";
  if (!banner) return PLACEHOLDER;

  // Si ya es una URL completa, la usamos directamente
  if (banner.startsWith("http://") || banner.startsWith("https://")) {
    return banner;
  }

  // Si es ruta relativa, la apuntamos a tu backend
  return `http://localhost:3000/${banner.replace(/^\/+/,"")}`;
}

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string|null>(null);
  const decoded = useDecodeJWT();
  const userId = decoded?.id;
  const apiRoute = import.meta.env.VITE_API_ROUTE;

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const creatorPromise = fetch(`${apiRoute}projects/creator/${userId}`, { headers });
      const crewPromise    = fetch(`${apiRoute}projects/user/${userId}/crew`, { headers });

      const [creatorResp, crewResp] = await Promise.all([creatorPromise, crewPromise.catch(e => e)]);

      if (creatorResp.status === 401 || crewResp?.status === 401) {
        throw new Error("No autorizado");
      }

      if (!creatorResp.ok && creatorResp.status !== 404) {
        throw new Error("Error al cargar proyectos del creador");
      }

      // crew puede fallar con 404, lo tratamos como array vacío
      let crewData: BackendProject[] = [];
      if (crewResp instanceof Response && crewResp.ok) {
        crewData = await crewResp.json();
      }

      const creatorData: BackendProject[] = creatorResp.ok ? await creatorResp.json() : [];

      const allProjects = [...creatorData, ...crewData];

      const cards = allProjects.map((p) => ({
        id: p.project_id,
        title: p.title,
        description: p.description,
        imageUrl: resolveBannerUrl(p.banner),
        filters: [],
        completado: !p.is_active,
        href: `/projects/${p.project_id}`,
      }));

      const uniqueCards = Array.from(new Map(cards.map(p => [p.id, p])).values());

      setProjects(uniqueCards);
    } catch (err: any) {
      console.error("Error cargando proyectos:", err);
      if (err.message === "No autorizado") {
        navigate("/login");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

    fetchProjects();
  }, [navigate, userId]);



  if (loading) {
    return (
      <CreatorLayout>
        <div className="p-6 text-center">Cargando proyectos…</div>
      </CreatorLayout>
    );
  }
  if (error) {
    return (
      <CreatorLayout>
        <div className="p-6 text-center text-red-600">
          Error al cargar proyectos: {error}
        </div>
      </CreatorLayout>
    );
  }

  return (
    <CreatorLayout>
      <div className="w-full px-12 pb-11 flex flex-col gap-6">
        <h1 className="text-6xl font-medium font-barlow">Proyectos</h1>

        <CustomTabs>
          <CustomTab label="Activos">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                {projects.filter((p) => !p.completado).length > 0 ? (
                projects.filter((p) => !p.completado)
                    .map((pr) => <ProjectCard key={pr.id} {...pr} />)
                ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No hay proyectos activos disponibles.
                </div>
                )}
            </div>
          </CustomTab>

          <CustomTab label="Inactivos">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                {projects.filter((p) => p.completado).length > 0 ? (
                projects.filter((p) => p.completado)
                    .map((pr) => <ProjectCard key={pr.id} {...pr} />)
                ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No hay proyectos activos disponibles.
                </div>
                )}
            </div>
          </CustomTab>
        </CustomTabs>
      </div>
    </CreatorLayout>
  );
};

export default ProjectsPage;