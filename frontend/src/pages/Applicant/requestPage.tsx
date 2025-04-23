// src/pages/RequestPage.tsx
import React, { useEffect, useState } from "react";
import CreatorLayout from "@/layouts/default";
import RequestCard from "@/components/requestCard";
import { useDecodeJWT } from "@/hooks/useDecodeJWT";
import dayjs from "dayjs";

interface Application {
  app_id: number;
  project_id: number;
  vacancy_id: number;
  app_status_id: number;
  applied_at: string;
  motivation_letter: string;
}
interface RequestCardProps {
  projectTitle: string;
  imageUrl: string;
  cargo: string;
  estado: string;
  fecha: string;
}

interface Project {
  project_id: number;
  title: string;
  banner: string | null;
}

interface Vacancy {
  vacancy_id: number;
  role_id: number;
  description: string;
}

interface Role {
  role_id: number;
  role_name: string;
}

const RequestPage: React.FC = () => {
  const [requests, setRequests] = useState<RequestCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const decodedToken = useDecodeJWT();
  const apiRoute = import.meta.env.VITE_API_ROUTE;

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !decodedToken?.id) {
        throw new Error("Usuario no autenticado");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Fetch roles
      const rolesRes = await fetch(`${apiRoute}roles`, { headers });
      const roles: Role[] = await rolesRes.json();
      const roleMap = new Map(roles.map((r) => [r.role_id, r.role_name]));

      // Fetch applications by status (e.g., statusId = 1 for "Pendiente")
      const statusId = 1; // Example: Fetch only "Pendiente" applications
      const appsRes = await fetch(
        `${apiRoute}applications/postulant/${decodedToken.id}/status/${statusId}`,
        { headers }
      );
      const applications: Application[] = await appsRes.json();

      // Fetch additional data for each application
      const requestsData = await Promise.all(
        applications.map(async (app) => {
          try {
            const [projectRes, vacancyRes] = await Promise.all([
              fetch(`${apiRoute}projects/${app.project_id}`, { headers }),
              fetch(`${apiRoute}vacancies/${app.vacancy_id}`, { headers }),
            ]);

            const project: Project = await projectRes.json();
            const vacancy: Vacancy = await vacancyRes.json();

            return {
              projectTitle: project.title,
              imageUrl: project.banner || "https://placehold.co/208x266",
              cargo: roleMap.get(vacancy.role_id) || "Cargo desconocido",
              estado: getStatusText(app.app_status_id),
              fecha: dayjs(app.applied_at).format("DD/MM/YYYY"),
            };
          } catch (error) {
            console.error(
              `Error cargando datos para aplicación ${app.app_id}:`,
              error
            );
            return null;
          }
        })
      );

      setRequests(requestsData.filter(Boolean) as RequestCardProps[]);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [apiRoute, decodedToken?.id]);
  const getStatusText = (statusId: number) => {
    switch(statusId) {
      case 1: return "Pendiente";
      case 2: return "Aprobada";
      case 3: return "Rechazada";
      default: return "Desconocido";
    }
  };

  if (loading) {
    return (
      <CreatorLayout>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-xl">Cargando solicitudes...</span>
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
      <div className="w-full h-full px-12 pb-11 flex flex-col justify-start gap-6">
        {/* Header */}
        <div className="w-full h-20 pr-14 inline-flex justify-start items-center">
          <h1 className="text-Base-Negro text-6xl font-medium font-barlow leading-[78px]">
            Mis Solicitudes
          </h1>
        </div>

        {/* Listado de solicitudes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
          {requests.length > 0 ? (
            requests.map((request) => (
              <RequestCard key={request.projectTitle} {...request} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No tienes solicitudes registradas
            </div>
          )}
        </div>
      </div>
    </CreatorLayout>
  );
};

export default RequestPage;