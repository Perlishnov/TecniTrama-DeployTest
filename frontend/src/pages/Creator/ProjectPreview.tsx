import React, { useEffect, useState } from "react";
import CreatorLayout from "@/layouts/default";
import { notification } from "antd";
import InfoCard from "@/components/InfoCard";
import Button from "@/components/button";
import { Link, useParams } from "react-router-dom";
import CustomTabs, { CustomTab } from "@/components/tabs";
import CrewTable, { CrewMember } from "@/components/crewTable";
import RequestTable, { Request } from "@/components/requestTable";
import ViewRequestModal from "@/components/modals/viewRequestModal";
import { Department, Genre, ProjectFormat, Role, Subject, Vacancy } from "@/types";
import ApplyVacanciesTable from "@/components/applyVacancyTables";
import ApplyVacancyModal from "@/components/modals/applyVacancyModal";
import InviteModal from "@/components/modals/InviteModal";
import { useDecodeJWT } from "@/hooks/useDecodeJWT";
import dayjs from "dayjs";

const formatDate = (date: string) => {
  const parsedDate = dayjs(date);
  return parsedDate.isValid() ? parsedDate.format("DD/MM/YYYY") : "Fecha inválida";
}

const ProjectPreview: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const apiRoute = import.meta.env.VITE_API_ROUTE;
  const decodedToken = useDecodeJWT();

  const [isOwner, setIsOwner] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projectNotFound, setProjectNotFound] = useState(false);

  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [currentVacancies, setCurrentVacancies] = useState<Vacancy[]>([]);
  const [currentAssignedCrew, setCurrentAssignedCrew] = useState<CrewMember[]>([]);
  const [solicitudesData, setSolicitudesData] = useState<Request[]>([]);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [vacancyToApply, setVacancyToApply] = useState<Vacancy | null>(null);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [vacancyToInvite, setVacancyToInvite] = useState<Vacancy | null>(null);
  const [viewReqModalOpen, setViewReqModalOpen] = useState(false);
  const [selectedRequest] = useState<Request | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true); // Mover isLoading al inicio
      setProjectNotFound(false);
      setError(null); // Limpiar errores previos

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado"); // Validar token temprano
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch datos globales primero (o en paralelo si prefieres con Promise.all)
        const [formatsRes, genresResAll, classesResAll, rolesRes, departmentsRes] = await Promise.all([
            fetch(`${apiRoute}projects/formats`, { headers }),
            fetch(`${apiRoute}genres`, { headers }), // Todos los géneros
            fetch(`${apiRoute}classes`, { headers }), // Todas las clases/materias
            fetch(`${apiRoute}roles`, { headers }), // Todos los roles
            fetch(`${apiRoute}departments`, { headers }) // Todos los departamentos
        ]);

        // Validar todas las respuestas globales
        if (!formatsRes.ok || !genresResAll.ok || !classesResAll.ok || !rolesRes.ok || !departmentsRes.ok) {
            throw new Error("Error cargando datos globales necesarios.");
        }

        const allFormats = await formatsRes.json();
        const allGenres = await genresResAll.json();
        const allSubjects = await classesResAll.json(); // Asumiendo que classes son subjects
        const allRoles: Role[] = await rolesRes.json(); // Tipar roles
        const allDepartments: Department[] = await departmentsRes.json(); // Tipar departamentos

        // Fetch datos específicos del proyecto
        const projectRes = await fetch(`${apiRoute}projects/${projectId}`, { headers });
        if (!projectRes.ok) { /* ... (manejo 404 y otros errores) ... */ throw new Error("Proyecto no encontrado");}
        const data = await projectRes.json();

        // Fetch datos relacionados al proyecto
         const [genresProjRes, classesProjRes, vacanciesRes, crewRes, requestsRes] = await Promise.all([
            fetch(`${apiRoute}projects/${projectId}/genres`, { headers }),
            fetch(`${apiRoute}projects/${projectId}/classes`, { headers }),
            fetch(`${apiRoute}vacancies/project/${projectId}`, { headers }),
            fetch(`${apiRoute}projects/${projectId}/crew`, { headers }),
            fetch(`${apiRoute}applications/project/${projectId}`, { headers }) // Endpoint de solicitudes
        ]);

        const projectGenres = genresProjRes.ok ? await genresProjRes.json() : [];
        const projectClasses = classesProjRes.ok ? await classesProjRes.json() : [];
        const vacanciesData = vacanciesRes.ok ? await vacanciesRes.json() : [];
        const crewData = crewRes.ok ? await crewRes.json() : [];
        const applicationsData = requestsRes.ok ? await requestsRes.json() : [];

        // --- MAPEO CORREGIDO DE VACANTES ---
        const mappedVacancies = vacanciesData.map((v: any): Vacancy => {
    const role = allRoles.find((r) => r.role_id === v.role_id);
    const department = allDepartments.find((d) => d.department_id === role?.department_id);

    return {
        // Campos EXACTOS de tu interfaz Vacancy
        id: v.vacancy_id,
        cargo: role?.role_name || "Rol Desconocido",
        departamento: department?.department_name || "Departamento Desconocido",
        descripcion: v.description || "",
        requerimientos: v.requirements || "",
        role_id: v.role_id,
        department_id: role?.department_id || 0,
        // --- ELIMINAR LAS SIGUIENTES LÍNEAS (si no están en tu interfaz Vacancy) ---
        // project_id: v.project_id,       // <-- Eliminar si no está en el tipo Vacancy
        // created_at: v.created_at,       // <-- Eliminar si no está en el tipo Vacancy
        // is_visible: v.is_visible,       // <-- Eliminar si no está en el tipo Vacancy
         is_filled: v.is_filled,         // <-- Eliminar si no está en el tipo Vacancy
            };
        });
        setCurrentVacancies(mappedVacancies);

        const mappedCrew = crewData.map((c: any): CrewMember => { // Tipar retorno como CrewMember
    const role = allRoles.find((r) => r.role_id === c.role_id);
    // Asumiendo que la API de crew devuelve department_id o podemos obtenerlo del rol
    const department_id_for_lookup = c.department_id || role?.department_id;
    const department = allDepartments.find((d) => d.department_id === department_id_for_lookup);
    return {
        // Campos EXACTOS de tu interfaz CrewMember
        id: c.crew_member_id || c.id || c.user_id, // Usar el ID correcto que devuelve tu API para esta entrada
        name: `${c.users?.first_name || ''} ${c.users?.last_name || ''}`.trim() || c.name || "Nombre Desconocido", // Ajustar según API
        role_id: c.role_id,
        role_name: role?.role_name || "Rol Desconocido",
        department_id: department_id_for_lookup || 0,
        department_name: department?.department_name || "Departamento Desconocido",
        assigned_at: c.assigned_at || c.joined_at || new Date().toISOString(), // Usar el campo correcto
        // --- ELIMINAR LA SIGUIENTE LÍNEA (si 'id' ya es el identificador único) ---
        user_id: c.user_id, // <-- Eliminar: No está en la interfaz CrewMember
        // Si tu interfaz CrewMember SÍ tiene user_id, mantenla y asegúrate que el tipo lo refleje.
        // Pero si solo tiene 'id', elimina esta línea.
          }
      });
      setCurrentAssignedCrew(mappedCrew); // Establecer estado con objetos tipo CrewMember


        // --- MAPEO DE SOLICITUDES (Ajustado a tu interfaz Request) ---
        const pendingApplications = applicationsData.filter((app: any) => app.app_status_id === 1); // Filtrar pendientes
        const mappedRequests = pendingApplications.map((app: any): Request => { // Tipar retorno como Request
          const vacancy = mappedVacancies.find(v:any => v.id === app.vacancy_id); // Buscar vacante para obtener el nombre del cargo
          return {
            // Campos EXACTOS de tu interfaz Request
            id: app.app_id,
            applicant: `${app.users.first_name} ${app.users.last_name}` || 'Solicitante Desconocido',
            position: vacancy?.cargo || 'Posición Desconocida', // Usar 'cargo' de la vacante mapeada
            date: dayjs(app.applied_at).format("DD/MM/YYYY HH:mm"),
            reasons: app.motivation_letter || '',
            // --- ELIMINAR LAS SIGUIENTES LÍNEAS ---
            // user_id: app.user_id, // <-- Eliminar: No está en la interfaz Request
            // vacancy_id: app.vacancy_id, // <-- Eliminar: No está en la interfaz Request
          };
        });
        setSolicitudesData(mappedRequests); // Establecer estado con objetos tipo Request

        // Poblar detalles del proyecto
        const formato = allFormats.find((f: ProjectFormat) => f.format_id === data.format_id)?.format_name || "Desconocido";
        setProjectDetails({
            ...data,
            formatoNombre: formato,
            // Filtrar listas globales para obtener solo los asociados al proyecto
            genres: allGenres.filter((g: Genre) => projectGenres.some((pg: any) => pg.genre_id === g.genre_id)),
            classes: allSubjects.filter((s: Subject) => projectClasses.some((pc: any) => pc.class_id === s.class_id)),
            // Guardar texto simple si API los devuelve así
            sponsorsText: data.sponsors || "",
            attachmentsText: data.attachmenturl || ""
        });

        // Determinar si es Owner (ya lo hacías)
        setIsOwner(decodedToken?.id === data.creator_id);
        // Establecer estado activo/publicado
        setIsActive(data.is_active);
        setIsPublished(data.is_published);

      } catch (error: any) {
        console.error("Error cargando datos del proyecto:", error);
        setError(error.message || "Error al cargar datos");
        if (!projectNotFound) setProjectNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId, apiRoute, decodedToken?.id]); 

  const handleApplyToVacancy = (vacancy: Vacancy) => {
    setVacancyToApply(vacancy);
    setApplyModalVisible(true);
  };

  const handleInviteToVacancy = (vacancy: Vacancy) => {
    setVacancyToInvite(vacancy);
    setInviteModalVisible(true);
  };


  const handleToggleActive = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${apiRoute}projects/${projectId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al cambiar el estado del proyecto");
      }

      // Invertimos el estado localmente
      setIsActive(prev => !prev);

      notification.success({
        message: isActive ? "Proyecto terminado" : "Proyecto activado",
      });

    } catch (error) {
      console.error(error);
      notification.error({
        message: "Hubo un error al cambiar el estado del proyecto",
      });
    }
  };

  const handlePublishProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiRoute}projects/${projectId}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al publicar el proyecto");
      }

      notification.success({
        message: "Proyecto publicado exitosamente",
      });

      setIsPublished(true);
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Hubo un error al publicar el proyecto"
      });
    }
  };

  const handleAcceptRequest = async (request: Request) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiRoute}applications/${request.id}/status/2`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al aceptar solicitud");
      }

      setSolicitudesData((prev) => prev.filter((r) => r.id !== request.id));

      notification.success({
        message: "Solicitud aceptada",
        description: "La persona ha sido agregada exitosamente al proyecto.",
        placement: "topRight",
        duration: 3,
      });

    } catch (error) {
      console.error(error);
      notification.error({
        message: "Hubo un error al aceptar la solicitud",
      });
    }
  };

  const handleDenyRequest = async (request: Request) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiRoute}applications/${request.id}/status/3`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al rechazar solicitud");
      }

      setSolicitudesData((prev) => prev.filter((r) => r.id !== request.id));

      notification.success({
        message: "Solicitud rechazada",
        description: "La persona ha sido rechazada del proyecto.",
        placement: "topRight",
        duration: 3,
      });

    } catch (error) {
      console.error(error);
      notification.error({
        message: "Hubo un error al rechazar la solicitud",
      });
    }
  };
  if(isLoading) {
    return (
      <CreatorLayout>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-rojo-intec-600 rounded-full animate-spin"></div>
            <p className="text-xl font-barlow font-medium">Cargando proyecto...</p>
          </div>
        </div>
      </CreatorLayout>
    );
  }
  
  if(projectNotFound) {
    return (
      <CreatorLayout>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-barlow font-medium">Proyecto no encontrado</h1>
            <Link to="/dashboard" className="text-rojo-intec-400 hover:text-rojo-intec-800">
              Regresar al Dashboard
            </Link>
          </div>
        </div>
      </CreatorLayout>
    );
  }
  // --- Handler para Eliminar Miembros del Crew (Dueño) ---
  const handleDeleteCrewMembers = async (memberRowIdsToDelete: React.Key[]) => { // Recibe los IDs de las filas/asignaciones
    // Convertir Keys (posiblemente string) a IDs numéricos de fila (CrewMember.id)
    const numericRowIds = memberRowIdsToDelete
        .map(id => Number(id))
        .filter(id => !isNaN(id));

    if (!projectId || numericRowIds.length === 0) return;

    // Encontrar los objetos CrewMember completos basados en el ID de la fila/asignación
    const membersToDelete = currentAssignedCrew.filter(m => numericRowIds.includes(m.id));
    if (membersToDelete.length === 0) return;

    // Extraer los USER IDs de los miembros seleccionados para el payload de la API
    const userIdsPayload = membersToDelete.map(m => m.user_id); // <<< OBTENER user_id

    const names = membersToDelete.map(m => m.name).join(', ');
    if (!window.confirm(`¿Seguro que deseas eliminar a ${names} del crew?`)) {
      return;
    }

    console.log(`Eliminando miembros con User IDs: ${userIdsPayload.join(', ')} del proyecto ${projectId}`);

    // --- PREPARAR PAYLOAD con la key "userIds" ---
    const payload = {
      userIds: userIdsPayload // Usar la key confirmada y los user_id extraídos
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiRoute}projects/${projectId}/crew`, { // Endpoint correcto
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status} eliminando miembros.`);
      }

      // Actualizar estado local filtrando por el ID de la fila/asignación (CrewMember.id)
      setCurrentAssignedCrew(prev => prev.filter(m => !numericRowIds.includes(m.id)));

      notification.success({ message: "Miembros eliminados con éxito." });

    } catch (error: any) {
      console.error("Error eliminando miembros:", error);
      notification.error({ message: "Error al eliminar miembros", description: error.message });
    }
  };

  if (error) {
    return (
      <CreatorLayout>
        <div className="w-full h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-barlow font-medium">Error: {error}</h1>
            <Link to="/dashboard" className="text-rojo-intec-400 hover:text-rojo-intec-800">
              Regresar al Dashboard
            </Link>
          </div>
        </div>
      </CreatorLayout>
    );
  }


  const { title, banner, description, genres, classes, budget, estimated_start, estimated_end, sponsors, attachmenturl, formatoNombre } = projectDetails;

  // Antes del return, dentro de tu componente:
  const tabs: React.ReactElement[] = [
    // Tab General
    <CustomTab label="General" key="general">
      <div className="w-full flex flex-col md:flex-row gap-4 px-[3.375rem] mt-4">
        <div className="w-full md:w-[12.625rem] flex flex-col gap-[1.563rem]">
          <InfoCard title="Formato" content={[formatoNombre]} />
          <InfoCard title="Géneros" content={genres.map((g: any) => g.genre)} />
          <InfoCard title="Materias" content={classes.map((c: any) => c.class_name)} />
        </div>
        <InfoCard title="Descripción" content={description} className="flex-1 min-w-0" />
        <div className="w-full md:w-[16.563rem] flex flex-col justify-between gap-4">
          <InfoCard title="Presupuesto" content={budget} />
          <div className="flex gap-4">
            <InfoCard title="Inicio" content={formatDate(estimated_start)} />
            <InfoCard title="Final" content={formatDate(estimated_end)} />
          </div>
          <InfoCard title="Patrocinadores" content={sponsors} />
          <InfoCard title="Links" content={attachmenturl} />
          {isOwner && (
            <>
              <Button className="p-4 bg-gray-200">
                <Link to={`/projects/${projectId}/edit`}>Editar proyecto</Link>
              </Button>

              {!isPublished ? (
                <Button
                  className="p-4 bg-rojo-intec-200 text-white hover:bg-red-300"
                  onClick={handlePublishProject}
                >
                  Publicar
                </Button>
              ) : (
                isActive && (
                  <Button
                    className="p-4 bg-gray-300 text-black hover:bg-gray-400"
                    onClick={handleToggleActive}
                  >
                    Terminar
                  </Button>
                )
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-full px-[3.375rem] mt-6">
        <ApplyVacanciesTable
          vacancies={currentVacancies}
          isOwner={isOwner}
          onApply={handleApplyToVacancy}
          onInvite={handleInviteToVacancy}
        />
      </div>
    </CustomTab>,

    // Tab Crew
    <CustomTab label="Crew" key="crew">
      <div className="px-[3.375rem] w-full mt-4">
        <CrewTable items={currentAssignedCrew} isCreator={isOwner} onDelete={handleDeleteCrewMembers}/>
      </div>
    </CustomTab>,

    // Tab Solicitudes sólo si es owner
    ...(
      isOwner
        ? [
          <CustomTab label="Solicitudes" key="solicitudes">
            <div className="px-[3.375rem] w-full mt-4">
              <RequestTable
                requests={solicitudesData}
                onAccept={handleAcceptRequest}
                onDeny={handleDenyRequest}
              />
            </div>
          </CustomTab>
        ]
        : []
    )
  ];
  // Y ahora tu return:
  return (
    <CreatorLayout>
      <div className="w-full h-full flex flex-col items-center gap-4 pb-10 bg-rojo-intec-100 overflow-x-hidden">
        <img
          src={banner}
          alt="Project Banner"
          className="w-full h-[18.56rem] object-cover"
        />
        <h1 className="w-full text-center text-[4.5rem] font-barlow font-medium leading-[5.85rem] px-2">
          {title}
        </h1>

        {/* Aquí pasamos el array directamente */}
        <CustomTabs children={tabs} />

        {/* Modales */}
        {applyModalVisible && vacancyToApply && (
          <ApplyVacancyModal
            className="bg-rojo-intec-200"
            vacancy={vacancyToApply}
            open={applyModalVisible}
            onClose={() => setApplyModalVisible(false)}
            onSubmit={async (_vacancy, motivationLetter) => {
              if (!vacancyToApply) return;

              try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${apiRoute}applications/`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    postulant_id: decodedToken?.id,
                    vacancy_id: vacancyToApply.id,
                    app_status_id: 1,
                    motivation_letter: motivationLetter,
                  }),
                });

                if (!res.ok) {
                  throw new Error("Error al enviar la solicitud");
                }

                console.log("Solicitud enviada correctamente");
                setApplyModalVisible(false);
              } catch (error) {
                console.error(error);
                alert("Hubo un error al enviar tu solicitud. Intenta nuevamente.");
              }
            }}
          />
        )}
        {inviteModalVisible && vacancyToInvite && (
          <InviteModal
          onInvite={vacancyToInvite}
            vacancy={vacancyToInvite}
            onClose={() => setInviteModalVisible(false)}
          />
        )}
        {selectedRequest && (
          <ViewRequestModal
            request={selectedRequest}
            open={viewReqModalOpen}
            onClose={() => setViewReqModalOpen(false)}
            onAccept={handleAcceptRequest}
            onReject={handleDenyRequest}
          />
        )}
      </div>
    </CreatorLayout>
  );
}
export default ProjectPreview;