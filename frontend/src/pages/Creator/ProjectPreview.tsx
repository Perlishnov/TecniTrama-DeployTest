import React, { useEffect, useState } from "react";
import CreatorLayout from "@/layouts/default";
import InfoCard from "@/components/InfoCard";
import Button from "@/components/button";
import { Link, useParams } from "react-router-dom";
import CustomTabs, { CustomTab } from "@/components/tabs";
import CrewTable, { CrewMember } from "@/components/crewTable";
import RequestTable, { Request } from "@/components/requestTable";
import ViewRequestModal from "@/components/modals/viewRequestModal";
import { Vacancy } from "@/types";
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
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const formatsRes = await fetch(`${apiRoute}projects/formats`, { headers });
        const formats = formatsRes.ok ? await formatsRes.json() : [];

        const res = await fetch(`${apiRoute}projects/${projectId}`, { headers });
        if (!res.ok) {
          if (res.status === 404) setProjectNotFound(true);
          throw new Error("Proyecto no encontrado");
        }
        const data = await res.json();

        const formato = formats.find((f: any) => f.format_id === data.format_id) || "Desconocido";

        setIsActive(data.is_active);
        setIsOwner(decodedToken?.id === data.creator_id);

        const genresRes = await fetch(`${apiRoute}projects/${projectId}/genres`, { headers });
        const genres = genresRes.ok ? await genresRes.json() : [];

        const classesRes = await fetch(`${apiRoute}projects/${projectId}/classes`, { headers });
        const classes = classesRes.ok ? await classesRes.json() : [];

        const vacanciesRes = await fetch(`${apiRoute}vacancies/project/${projectId}`, { headers });
        const vacanciesData = vacanciesRes.ok ? await vacanciesRes.json() : [];

        const rolesRes = await fetch(`${apiRoute}roles`, { headers });
        const roles = rolesRes.ok ? await rolesRes.json() : [];

        const departmentsRes = await fetch(`${apiRoute}departments`, { headers });
        const departments = departmentsRes.ok ? await departmentsRes.json() : [];

        const crewRes = await fetch(`${apiRoute}projects/${projectId}/crew`, { headers });
        const crew = crewRes.ok ? await crewRes.json() : [];

        const requestsRes = await fetch(`${apiRoute}applications/project/${projectId}`, { headers });
        const applications = requestsRes.ok ? await requestsRes.json() : [];


        //const requestsRes = await fetch(`${apiRoute}projects/${projectId}`, { headers });
        //const requests = requestsRes.ok ? await requestsRes.json() : [];

        const mappedVacancies = vacanciesData.map((v: any) => {
          const role = roles.find((r: any) => r.role_id === v.role_id);
          const department = departments.find((d: any) => d.department_id === role?.department_id);

          return {
            id: v.vacancy_id,
            cargo: role?.role_name || "Desconocido",
            descripcion: v.description,
            requerimientos: v.requirements,
            departamento: department?.department_name || "Desconocido",
            department_id: role?.department_id,
            role_id: v.role_id,
            project_id: v.project_id,
            created_at: v.created_at,
            is_visible: v.is_visible,
          };
        });

        const mappedRequests = applications.map((app: any) => ({
          id: app.app_id,
          applicant: `${app.users.first_name} ${app.users.last_name}`,  
          position: app.vacancies?.description || "Cargo desconocido",
          date: dayjs(app.applied_at).format("DD/MM/YYYY"),  
          reasons: app.motivation_letter, 
        }));

        setSolicitudesData(mappedRequests);
        setCurrentVacancies(mappedVacancies);
        setCurrentAssignedCrew(crew);

        setProjectDetails({
          ...data,
          formatoNombre: formato,
          genres,
          classes
        });
      } catch (error) {
        console.error("Error cargando proyecto:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [apiRoute, decodedToken?.id, projectId]);

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
      const res = await fetch(`${apiRoute}projects/${projectId}/toggle-activity`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setIsActive(!isActive);
      } else {
        alert("Error al cambiar el estado del proyecto");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptRequest = (request: Request) => {
    setSolicitudesData((prev) => prev.filter((r) => r.id !== request.id));
  };

  const handleDenyRequest = (request: Request) => {
    setSolicitudesData((prev) => prev.filter((r) => r.id !== request.id));
  };

  if (isLoading) return <div>Cargando...</div>;
  if (projectNotFound) return <div>Proyecto no encontrado</div>;

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
              <Button className="p-4" onClick={handleToggleActive}>
                {isActive ? "Terminar" : "Publicar"}
              </Button>
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
        <CrewTable items={currentAssignedCrew} isCreator={isOwner} />
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
                    motivation_letter: motivationLetter, // <-- AHORA sí el texto real
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
            open={inviteModalVisible}
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