import React, { useState, useEffect } from "react";
import CreatorLayout from "@/layouts/default";
import InfoCard from "@/components/InfoCard";
import Button from "@/components/button"; // Nombre 'button' minúscula? Verificar
import ReusableTable from "@/components/ReusableTable";
import { Link, useParams } from "react-router-dom";
import CustomTabs, { CustomTab } from "@/components/tabs";
import VacanteIcon from "@/assets/icons/users.svg"; // Icono para Vacantes?
import CrewTable, { CrewMember } from "@/components/crewTable";
import RequestTable, { Request } from "@/components/requestTable";
import ViewRequestModal from "@/components/modals/viewRequestModal";
import { Vacancy } from "@/types";
import ApplyVacanciesTable from "@/components/applyVacancyTables";
import { mapApiVacancies } from "@/utils/maps";
import ApplyVacancyModal from "@/components/modals/applyVacancyModal";

// --- DATOS DE MUESTRA ---
// Datos generales (sin cambios)
const mockGenres = ["Indie", "Filtro", "Filtro", "Mas..."];
const mockSubjects = ["LCC - Tecnica...", "IDS123 - Base de datos...", "Mas..."];

// Miembros del Crew (Ya coincidía razonablemente con tu interfaz CrewMember)
const mockCrewMembers: CrewMember[] = [
    { id: 1, name: 'Juan Pérez', role_id: 201, role_name: 'Director/a', department_id: 2, department_name: 'Dirección', assigned_at: '2024-01-15T10:00:00Z', joined_at: '2024-01-15T10:00:00Z' }, // Añadí user_id y joined_at si CrewMember los tiene
    { id: 2, name: 'María García', role_id: 401, role_name: 'Director/a de Fotografía', department_id: 4, department_name: 'Fotografía', assigned_at: '2024-01-16T11:00:00Z', user_id: 102, joined_at: '2024-01-16T11:00:00Z' },
    { id: 3, name: 'Carlos López', role_id: 901, role_name: 'Editor/a / Montajista', department_id: 9, department_name: 'Edición y Post-producción', assigned_at: '2024-01-17T12:00:00Z', user_id: 103, joined_at: '2024-01-17T12:00:00Z' }
];

// Vacantes (Ajustado a tu interfaz Vacancy)
const mockVacanciesData: Vacancy[] = [
    { id: "vac-1", cargo: "Sonidista Directo", departamento: "Sonido", descripcion: "Grabación en set.", requerimientos: "Experiencia y equipo.", role_id: 502, department_id: 5,  project_id: 'proj123', created_at: '2024-01-10T00:00:00Z', is_visible: true }, // Añadidos campos de interfaz
    { id: "vac-2", cargo: "Utilería / Atrezzo", departamento: "Arte", descripcion: "Manejo de utilería.", requerimientos: "Organización.", role_id: 604, department_id: 6,  project_id: 'proj123', created_at: '2024-01-11T00:00:00Z', is_visible: true },
    { id: "vac-3", cargo: "Asistente de Producción", departamento: "Producción", descripcion: "Apoyo general.", requerimientos: "Proactividad.", role_id: 104, department_id: 1,  project_id: 'proj123', created_at: '2024-01-12T00:00:00Z', is_visible: true }
];

// Solicitudes (Ajustado a tu interfaz Request)
const mockRequestsData: Request[] = [
    // Nota: La interfaz Request es simple. La lógica de asociar a vacante/usuario ocurre en backend o al aceptar.
    { id: 'req-1', applicant: "Ana Martínez (ana.m@email.com)", position: "Sonidista Directo", date: '2024-01-18T10:00:00Z', reasons: 'Tengo experiencia y equipo propio, adjunto CV.' },
    { id: 'req-2', applicant: "Luis Rodríguez (luis.r@email.com)", position: "Asistente de Producción", date: '2024-01-19T11:30:00Z', reasons: 'Muy interesado en aprender y colaborar.' },
];
// --- DATOS PARA VACANTES (Pestaña General) ---
const vacanciesColumnsDefinition = [
  { key: "position", label: "Cargo Vacante" },
  { key: "description", label: "Descripción" },
  { key: "requirements", label: "Requerimientos" },
  { key: "department", label: "Departamento" },
];
const initialVacanciesData = [
  {
    id: "vac1",
    position: "Editor de Video",
    description: "Editar cortos promocionales.",
    requirements: "Experiencia con Premiere Pro.",
    department: "Post-producción",
  },
  {
    id: "vac2",
    position: "Sonidista",
    description: "Grabación de sonido directo.",
    requirements: "Equipo propio deseable.",
    department: "Sonido",
  },
];


// --- COMPONENTE PRINCIPAL ProjectPreview ---
const ProjectPreview: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [sponsorsText, setSponsorsText] = useState<string>('Coca Cola');
  const [attachmentsText, setAttachmentsText] = useState<string>('http://instagram.com');

  // --- ESTADO ---
  const [isOwner, setIsOwner] = useState(false); // TODO: Lógica real
  const [isActive, setIsActive] = useState(false); // TODO: Lógica real
  const [isLoading, setIsLoading] = useState(true);
  const [projectNotFound, setProjectNotFound] = useState(false);
  const [projectDetails, setProjectDetails] = useState({ // TODO: Cargar de API
    title: "Titulo Placeholder",
    bannerUrl: "https://placehold.co/1305x297",
    format: ["Corto"],
    description: `Lorem ipsum dolor sit amet...`,
    budget: "2.00$",
    startDate: "XX/XX/20XX",
    endDate: "XX/XX/20XX",
    sponsorsText: "Sponsor 1, Sponsor 2",
    attachmentsText: "link1.com\nlink2.com",
  });
  // Estados separados para vacantes y miembros
  const [currentVacancies, setCurrentVacancies] = useState(initialVacanciesData);
  const [currentAssignedCrew, setCurrentAssignedCrew] = useState(mockCrewMembers);
  const [solicitudesData, setSolicitudesData] = useState<Request | any >([]); // TODO: Cargar de API
  // Vacantes
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [vacancyToApply, setVacancyToApply] = useState<Vacancy | null>(null);

  // Solicitudes
  const [viewReqModalOpen, setViewReqModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  // --- EFECTOS ---
    useEffect(() => {
        // ... (Lógica de carga simulada o real como en el ejemplo anterior) ...
        // Asegúrate de poblar los estados con datos que coincidan con las interfaces
        setIsLoading(true); setProjectNotFound(false);
        const loadData = async () => {
             await new Promise(resolve => setTimeout(resolve, 500));
             setProjectDetails({
                 title: "Proyecto Ejemplo Cargado",
                 bannerUrl: "https://placehold.co/1305x297/3498db/ffffff?text=Proyecto+Cargado",
                 format: ["Largometraje"],
                 description: "Descripción cargada...", budget: "5,000.00 USD",
                 startDate: "15/06/2025", endDate: "30/09/2025",
                 sponsorsText: "Sponsor 1, Sponsor 2", 
                 attachmentsText: "link1.com\nlink2.com"
             });
             setCurrentVacancies(mapApiVacancies(mockVacanciesData));
             setCurrentAssignedCrew(mockCrewMembers);
             setSolicitudesData(mockRequestsData);
             setIsActive(false);
             setIsLoading(false);
        };
        loadData();
    }, [projectId]);

  // --- MANEJADORES ---
  const handleToggleActive = () => { /* ... (igual que antes) ... */
      const newState = !isActive;
      console.log(newState ? "Publicando proyecto" : "Terminando proyecto");
      setIsActive(newState);
      // TODO: API Call
  };
   // Handler para Vacantes (Aplicante)
    const handleApplyToVacancy = (vacancy: Vacancy) => {
        // Usar los datos de la interfaz Vacancy
        console.log(`Aplicando a Vacante ID: ${vacancy.id}, Cargo: ${vacancy.cargo}`);
        // TODO: Implementar lógica real (puede abrir un modal o llamar a API directamente)
        // Ejemplo API: fetch('/api/requests', { method: 'POST', body: JSON.stringify({ vacancy_id: vacancy.id, user_message: '...' }) })
        setVacancyToApply(vacancy);
        setApplyModalVisible(true);
        alert(`Solicitud enviada para ${vacancy.cargo} (simulado)`);
    };

    // Handler para Crew (Dueño) - Recibe ID numérico
    const handleRemoveCrewMember = (memberId: number) => {
        const member = currentAssignedCrew.find(m => m.id === memberId);
        if (!member) return;
        console.log("Eliminando Miembro ID:", memberId);
        if (window.confirm(`¿Realmente deseas eliminar a ${member.name} (${member.role_name}) del crew?`)) {
            // TODO: API Call DELETE /api/projects/:projectId/crew/:memberId
            setCurrentAssignedCrew(prev => prev.filter(m => m.id !== memberId));
            alert(`${member.name} eliminado (simulado).`);
        }
    };
        // Handlers para Solicitudes (Dueño) - Usan el tipo Request
    const handleAcceptRequest = (request: Request) => {
        console.log("Aceptando solicitud:", request);
        // TODO: API Call PUT /api/requests/:requestId (status: 'accepted')
        // TODO: API Call POST /api/projects/:projectId/crew (con datos del usuario/rol de la solicitud)
        // TODO: API Call PUT /api/vacancies/:vacancyId (is_filled: true) - Necesitarías el vacancyId asociado a la solicitud

        // Simulación Frontend:
        // 1. Añadir al crew (Necesitarías más info del usuario/rol que la que está en la interfaz Request)
         alert(`Lógica para añadir a ${request.applicant} al crew no implementada con la interfaz Request actual.`);
        // 2. Eliminar solicitud de la lista
        setSolicitudesData(prev => prev.filter(r => r.id !== request.id));
        alert(`Solicitud de ${request.applicant} aceptada (simulado).`);
    };

    const handleDenyRequest = (request: Request) => {
        console.log("Rechazando solicitud:", request);
        // TODO: API Call PUT /api/requests/:requestId (status: 'rejected')
        setSolicitudesData(prev => prev.filter(r => r.id !== request.id));
        alert(`Solicitud de ${request.applicant} rechazada (simulado).`);
    };

  // --- DEFINICIÓN DE COLUMNAS CON ACCIONES (Para pasar a ReusableTable) ---

  // Columnas para la tabla de Vacantes
  const vacanciesColumns = [
      ...vacanciesColumnsDefinition,
      {
          key: "actions",
          label: "Acciones",
          renderCell: (row: any) => ( // Renderizado condicional de acciones
              <div className="flex items-center gap-2">
                  {isOwner ? (
                      <>
                          <Button  className="px-2 py-1" onClick={() => handleEditVacancy(row)}> {/* Ajustar estilo/variant */}
                              Editar
                          </Button>
                          <Button className="px-2 py-1" onClick={() => handleDeleteVacancy(row)}>
                              Eliminar
                          </Button>
                           {/* Podría haber un botón "Ver Solicitudes" aquí */}
                      </>
                  ) : (
                      <Button className="px-2 py-1" onClick={() => handleApplyToVacancy(row)}>
                          Aplicar
                      </Button>
                  )}
              </div>
          )
      }
  ];

  // --- RENDERIZADO ---
    if (isLoading) { /* ... */ }
    if (projectNotFound) { /* ... */ }
  return (
    <CreatorLayout>
      <div className="w-full h-full flex flex-col items-center gap-4 pb-10 bg-rojo-intec-100 overflow-x-hidden">
        {/* ... Banner y Título (igual que antes) ... */}
        <img src={projectDetails.bannerUrl} alt="Project Banner" className="w-full h-[18.56rem] object-cover"/>
        <h1 className="w-full text-center text-[4.5rem] font-barlow font-medium leading-[5.85rem] px-2">
           {projectDetails.title}
        </h1>

        {isOwner ? (
          // --- VISTA DEL DUEÑO ---
          <CustomTabs>
            {/* Pestaña General (Dueño) */}
            <CustomTab label="General">
              {/* --- Sección Superior: 3 Columnas InfoCards --- */}
              <div className="w-full flex flex-col md:flex-row gap-4 px-[3.375rem] mt-4">
                 {/* ... Col Izq (Formato, Géneros, Materias con botón +) ... */}
                 <div className="w-full md:w-[12.625rem] flex flex-col gap-[1.563rem]">
                    <InfoCard title="Formato" content={projectDetails.format} />
                    <InfoCard title="Generos" content={mockGenres} />
                    <InfoCard title="Materias" content={mockSubjects} headerButton={ <button>+</button> }/>
                 </div>
                 {/* ... Col Central (Descripción) ... */}
                  <InfoCard title="Descripción" content={projectDetails.description} className="flex-1 min-w-0"/>
                 {/* ... Col Der (Presupuesto, Fechas, Botones Editar/Publicar) ... */}
                 <div className="w-full md:w-[16.563rem] flex flex-col justify-between gap-4">
                    <div className="bg-gray-100 rounded-t-[1.25rem] outline outline-1 outline-[#63666A] overflow-hidden">
                       <InfoCard title="Presupuesto" content={projectDetails.budget} headerColor="bg-red-200" className="rounded-b-none border-none"/>
                    </div>
                    <div className="flex flex-row gap-[1rem] justify-between">
                       <InfoCard title="Inicio" content={projectDetails.startDate} className=""/>
                       <InfoCard title="Final" content={projectDetails.endDate} className=""/>
                    </div>
                     <div className="flex flex-col gap-[1rem] justify-between">
                       {sponsorsText &&
                          <InfoCard title="Patrocinadores" content={sponsorsText} />
                         }
                         {attachmentsText &&
                          <InfoCard title="Links" content={attachmentsText} />
                         }
                     </div>
                    <div className="flex flex-col gap-2 mt-auto">
                        <Button className="p-4 bg-gray-200 ..."><Link to={`/projects/${projectId}/edit`}>Editar proyecto</Link></Button>
                        <Button className="p-4" onClick={handleToggleActive}>{isActive ? "Terminar" : "Publicar"}</Button>
                    </div>
                 </div>
              </div>
              {/* --- Sección Inferior: Tabla de Vacantes --- */}
              <div className="w-full px-[3.375rem] mt-6">
                <ApplyVacanciesTable
                  vacancies={currentVacancies}
                  isOwner={isOwner}
                  onApply={handleApplyToVacancy} // Lógica del aplicante
                />
              </div>
            </CustomTab>

            <CustomTab label="Crew">
              {/* Vista para Dueño/Creador */}
              <div className="px-[3.375rem] w-full mt-4">
                <CrewTable
                  items={currentAssignedCrew}
                  isCreator={isOwner}
                  onDelete={ids => { /* llamar a API y actualizar */ }}
                />
              </div>
            </CustomTab>

            {/* Pestaña Solicitudes (Dueño) */}
            <CustomTab label="Solicitudes">
              <div className="px-[3.375rem] w-full mt-4">
              {/* Usar RequestTable según la interfaz de props */}
              <RequestTable
                requests={solicitudesData} // Coincide con la prop
                onAccept={handleAcceptRequest} // Coincide con la prop
                onDeny={handleDenyRequest}   // Coincide con la prop
              />
             </div>
            </CustomTab>

          </CustomTabs>
        ) : (
          // --- VISTA DEL APLICANTE ---
          <CustomTabs>
            {/* Pestaña General (Aplicante) */}
            <CustomTab label="General">
               <div className="w-full flex flex-col md:flex-row gap-4 px-[3.375rem] mt-4">
                 {/* ... Col Izq (Formato, Géneros, Materias con botón +) ... */}
                 <div className="w-full md:w-[12.625rem] flex flex-col gap-[1.563rem]">
                    <InfoCard title="Formato" content={projectDetails.format} />
                    <InfoCard title="Generos" content={mockGenres} />
                    <InfoCard title="Materias" content={mockSubjects} headerButton={ <button>+</button> }/>
                 </div>
                 {/* ... Col Central (Descripción) ... */}
                  <InfoCard title="Descripción" content={projectDetails.description} className="flex-1 min-w-0"/>
                 {/* ... Col Der (Presupuesto, Fechas, Botones Editar/Publicar) ... */}
                 <div className="w-full md:w-[16.563rem] flex flex-col justify-between gap-4">
                    <div className="bg-gray-100 rounded-t-[1.25rem] outline outline-1 outline-[#63666A] overflow-hidden">
                       <InfoCard title="Presupuesto" content={projectDetails.budget} headerColor="bg-red-200" className="rounded-b-none border-none"/>
                    </div>
                    <div className="flex flex-row gap-[1rem] justify-between">
                       <InfoCard title="Inicio" content={projectDetails.startDate} className=""/>
                       <InfoCard title="Final" content={projectDetails.endDate} className=""/>
                    </div>
                     <div className="flex flex-col gap-[1rem] justify-between">
                       {sponsorsText &&
                          <InfoCard title="Patrocinadores" content={sponsorsText} />
                         }
                         {attachmentsText &&
                          <InfoCard title="Links" content={<a href={attachmentsText}>{attachmentsText} </a>} />
                         }
                     </div>
                    
                 </div>
              </div>
              {/* --- Sección Inferior: Tabla de Vacantes --- */}
              <div className="w-full px-[3.375rem] mt-6">
                <ApplyVacanciesTable
                  vacancies={currentVacancies}
                  isOwner={isOwner}
                  onApply={handleApplyToVacancy} // Lógica del aplicante
                />
              </div>
              {applyModalVisible && vacancyToApply && (<ApplyVacancyModal
              className="bg-rojo-intec-200"
                vacancy={vacancyToApply}
                open={applyModalVisible}
                onClose={() => setApplyModalVisible(false)}
                onSubmit={(message) => {
                  console.log("Solicitud enviada:", message);
                  setApplyModalVisible(false);
                }}
              />)}
            </CustomTab>

            <CustomTab label="Crew">
            <div className="px-[3.375rem] w-full mt-4">
                {/* CrewTable Read-Only */}
                <CrewTable items={currentAssignedCrew} isCreator={isOwner} />
            </div>
            </CustomTab>
          </CustomTabs>
        )}
        {/* --- Modales (Vacantes y Solicitudes) --- */}
        {selectedRequest && (
        <ViewRequestModal
          request={selectedRequest}
          open={viewReqModalOpen}
          onClose={() => setViewReqModalOpen(false)}
          onAccept={(req) => {
            console.log("Aceptar", req);
            setSolicitudesData(prev => prev.filter(r => r.id !== req.id));
            setViewReqModalOpen(false);
          }}
          onReject={(req) => {
            console.log("Rechazar", req);
            setSolicitudesData(prev => prev.filter(r => r.id !== req.id));
            setViewReqModalOpen(false);
          }}
        />
      )}
      </div>
    </CreatorLayout>
  );
};

export default ProjectPreview;