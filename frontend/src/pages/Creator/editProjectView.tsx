import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreatorLayout from "@/layouts/default";
import InfoCard from "@/components/InfoCard";
import Button from "@/components/button";
import Input from "@/components/input";
import CustomDatePicker from "@/components/CustomDatePicker"; // Your custom date picker component
import CalendarIcon from "@/assets/icons/calendar.svg";
import FormatSelector from "@/components/modals/formatModal";
import { GenresModal } from "@/components/modals/genreModal";
import { SubjectsModal } from "@/components/modals/subjectModal";

import CustomTabs, { CustomTab } from "@/components/tabs";
import { Department, Genre, ProjectFormat, Role, Subject, Vacancy } from "@/types";
import ConfirmCancelModal from "@/components/modals/ConfirmCancelModal";
import VacancyFormModal  from "@/components/modals/VacantModal";
import VacanciesTable from "@/components/VacancyTable";
import ConfirmEditModal from "@/components/modals/confirmEditModal";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useDecodeJWT } from "@/hooks/useDecodeJWT";
import { useCloudinaryUpload } from "@/hooks/usecloudinary";
import Modal from "@/components/Modal";


const EditProyect: React.FC = () => {
  // Project Fields
  const { projectId } = useParams<{ projectId: string }>(); // Obtener ID de la URL
    const navigate = useNavigate();
    const decodedToken = useDecodeJWT();
    const apiRoute = import.meta.env.VITE_API_ROUTE;
    const { isUploading, uploadFile, error: uploadError } = useCloudinaryUpload({
      uploadPreset: "tecnitrama-asset",
      cloudName: "dcrl5demd",
    });

    // --- ESTADOS ADICIONALES ---
    const [isLoading, setIsLoading] = useState(true); // Para carga inicial
    const [isSubmitting, setIsSubmitting] = useState(false); // Para guardado
    const [error, setError] = useState<string | null>(null); // Para mostrar errores
    const [projectNotFound, setProjectNotFound] = useState(false);

    // --- ESTADOS DEL FORMULARIO (Inicializar vacíos/nulos) ---
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [selectedFormat, setSelectedFormat] = useState<ProjectFormat | null>(null);
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
    const [bannerImage, setBannerImage] = useState<string >(""); // URL actual
    const [bannerFile, setBannerFile] = useState<File | null>(null); // Nuevo archivo
    const [sponsors, setSponsors] = useState("");
    const [attachmentsUrl, setAttachmentsUrl] = useState("");
    const [startDate, setStartDate] = useState<string | null>(null); // Usar Date
    const [endDate, setEndDate] = useState<string | null>(null);   // Usar Date
    const [isPublished, setIsPublished] = useState(false); // Estado de publicación

    // Estados para listas globales y vacantes
    const [formats, setFormats] = useState<ProjectFormat[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const initialVacanciesRef = useRef<Vacancy[]>([]); // Para comparar al guardar
    const formatDate = (dateStr: string | null) => {
      if (!dateStr) return "";
      return dateStr;
    };  
    const formatForPicker = (iso: string) => dayjs(iso).format("DD/MM/YYYY");

    // Estados de modales (igual que antes)
    const [vacancyModalOpen, setVacancyModalOpen] = useState(false);
    const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
    const [formatModalOpen, setFormatModalOpen] = useState(false);
    const [genresModalOpen, setGenresModalOpen] = useState(false);
    const [subjectsModalOpen, setSubjectsModalOpen] = useState(false);
    const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false); // Cambiado de delete a cancel
    const [deleteProjectConfirmOpen, setDeleteProjectConfirmOpen] = useState(false); // Estado para modal de eliminar proyecto
    const [confirmEditOpen, setConfirmEditOpen] = useState(false); // Para confirmar edición
    const [openPicker, setOpenPicker] = useState<"start" | "end" | null>(null); // Para el selector de fechas
    
  // --- Carga de datos globales (Formatos, Géneros, Materias, Depts, Roles) ---
    const loadGlobalData = useCallback(async () => {
        // Usar Promise.all para eficiencia
        try {
             // Solo cargar si están vacíos
            const fetches = [];
            if (formats.length === 0) fetches.push(fetch(`${apiRoute}projects/formats`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then(res => res.ok ? res.json() : [])); else fetches.push(Promise.resolve(formats));
            if (genres.length === 0) fetches.push(fetch(`${apiRoute}genres`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then(res => res.ok ? res.json() : [])); else fetches.push(Promise.resolve(genres));
            if (subjects.length === 0) fetches.push(fetch(`${apiRoute}classes`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then(res => res.ok ? res.json() : [])); else fetches.push(Promise.resolve(subjects));
            if (departments.length === 0) fetches.push(fetch(`${apiRoute}departments`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then(res => res.ok ? res.json() : [])); else fetches.push(Promise.resolve(departments));
            if (roles.length === 0) fetches.push(fetch(`${apiRoute}roles`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }).then(res => res.ok ? res.json() : [])); else fetches.push(Promise.resolve(roles));

            const [formatsData, genresData, subjectsData, departmentsData, rolesData] = await Promise.all(fetches);

            setFormats(formatsData);
            setGenres(genresData);
            setSubjects(subjectsData);
            setDepartments(departmentsData);
            setRoles(rolesData);

        } catch (error) {
             console.error("Error cargando datos globales:", error);
             setError("Error al cargar listas necesarias (formatos, géneros, etc.).");
        }
    }, [apiRoute, formats, genres, subjects, departments, roles]); // Dependencias


  // --- EFECTO PRINCIPAL PARA CARGAR DATOS DEL PROYECTO ---
    useEffect(() => {
        if (!projectId) {
            setError("ID de proyecto no encontrado en la URL.");
            setProjectNotFound(true); setIsLoading(false); return;
        }

        const loadProject = async () => {
            setIsLoading(true); setProjectNotFound(false); setError(null);
            try {
                // Cargar datos globales primero (o en paralelo)
                await loadGlobalData();

                // Fetch principal del proyecto
                const projectRes = await fetch(`${apiRoute}projects/${projectId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
                if (!projectRes.ok) {
                    if (projectRes.status === 404) setProjectNotFound(true);
                    throw new Error(`Error al cargar proyecto: ${projectRes.statusText}`);
                }
                const projectData = await projectRes.json();

                // Fetch de datos relacionados (en paralelo)
                const [genresRes, classesRes, vacanciesRes] = await Promise.all([
                    fetch(`${apiRoute}projects/${projectId}/genres`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
                    fetch(`${apiRoute}projects/${projectId}/classes`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
                    fetch(`${apiRoute}vacancies/project/${projectId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
                ]);

                const projectGenres = genresRes.ok ? await genresRes.json() : [];
                const projectClasses = classesRes.ok ? await classesRes.json() : [];
                let projectVacancies = vacanciesRes.ok ? await vacanciesRes.json() : [];

                // --- Poblar Estado ---
                setTitle(projectData.title || "");
                setDescription(projectData.description || "");
                setBudget(String(projectData.budget ?? '')); // Convertir a string
                setBannerImage(projectData.banner || null);
                setSponsors(projectData.sponsors || "");
                setAttachmentsUrl(projectData.attachmenturl || "");
                setStartDate(projectData.estimated_start ? dayjs(projectData.estimated_start).format("DD/MM/YYYY") : null);
                setEndDate(projectData.estimated_end ? dayjs(projectData.estimated_end).format("DD/MM/YYYY") : null);
                setIsPublished(projectData.is_published || false);

                // Encontrar objetos completos para selecciones
                setSelectedFormat(formats.find(f => f.format_id === projectData.format_id) || null);
                setSelectedGenres(genres.filter(g => projectGenres.some((pg: Genre) => pg.genre_id === g.genre_id)));
                setSelectedSubjects(subjects.filter(s => projectClasses.some((pc: Subject) => pc.class_id === s.class_id)));

                 // Transformar vacantes cargadas si es necesario para coincidir con el estado Vacancy del frontend
                projectVacancies = projectVacancies.map((vac: any) => ({
                    id: vac.vacancy_id, // Usar ID real de la DB
                    role_id: vac.role_id,
                    department_id: roles.find(r => r.role_id === vac.role_id)?.department_id || 0, // Buscar dept ID via rol
                    cargo: roles.find(r => r.role_id === vac.role_id)?.role_name || "Desconocido", // Buscar nombre rol
                    departamento: departments.find(d => d.department_id === (roles.find(r => r.role_id === vac.role_id)?.department_id))?.department_name || "Desconocido", // Buscar nombre dept
                    descripcion: vac.description,
                    requerimientos: vac.requirements
                    // Añadir otros campos si tu tipo Vacancy los tiene
                }));
                setVacancies(projectVacancies);
                initialVacanciesRef.current = [...projectVacancies]; // Guardar copia inicial

            } catch (err: any) {
                console.error("Error detallado cargando datos:", err);
                setError(err.message || "Error al cargar datos del proyecto.");
                if (!projectNotFound) setProjectNotFound(true); // Asumir no encontrado si hay error grave
            } finally {
                setIsLoading(false);
            }
        };

        loadProject();

    }, [projectId, apiRoute, loadGlobalData, formats, genres, subjects, departments, roles]); // Incluir listas globales como dependencias

  // File Input for Banner Image
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: any): void => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("Image file selected:", file.name);
      setBannerImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
   // Abrir modal (nuevo o edición)
  const openVacancyModal = (vacancy: Vacancy | null = null) => {
    setEditingVacancy(vacancy);
    setVacancyModalOpen(true);
  };

    const handleSaveVacancy = (data: {
    department_id: number;
    role_id: number;
    description: string;
    requirements: string;
  }) => {
    const role = roles.find(r => r.role_id === data.role_id);
    const department = departments.find(d => d.department_id === data.department_id);

    if (!role || !department) {
      alert("Departamento o Rol inválido");
      return;
    }

    const transformedData: Omit<Vacancy, "id"> = {
      department_id: data.department_id,
      role_id: data.role_id,
      descripcion: data.description,
      requerimientos: data.requirements,
      cargo: role.role_name,
      departamento: department.department_name,
    };

    if (editingVacancy) {
      setVacancies((prev) =>
        prev.map((v) =>
          v.id === editingVacancy.id ? { ...v, ...transformedData } : v
        )
      );
    } else {
      const newVacancy: Vacancy = {
        id: `temp-${Date.now()}`,
        ...transformedData,
      };
      setVacancies((prev) => [...prev, newVacancy]);
    }

    setVacancyModalOpen(false);
    setEditingVacancy(null);
  };


  const handleDeleteVacancy = (id: string) => {
    setVacancies((prev) => prev.filter(v => v.id.toString() !== id));
  }; 



  // --- Handler para Actualizar Proyecto ---
    const handleUpdateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        // --- Validaciones ---
        if (!title || !selectedFormat || !description) { /* ... */ setError("Campos obligatorios faltan."); setIsSubmitting(false); return; }
        if (!decodedToken?.id) { /* ... */ setError("Error de autenticación."); setIsSubmitting(false); return; }
        if (!projectId) { /* ... */ setError("Error interno: Falta ID."); setIsSubmitting(false); return; }

        // --- 1. Subir Banner si cambió ---
        let finalBannerUrl = bannerImage; // Usar URL actual por defecto
        if (bannerFile) {
            try {
                const uploadedUrl = await uploadFile(bannerFile);
                if (uploadedUrl) {
                    finalBannerUrl = uploadedUrl;
                    console.log("Nuevo banner subido:", finalBannerUrl);
                } else {
                    throw new Error("Error al subir el nuevo banner a Cloudinary.");
                }
            } catch (uploadErr: any) {
                setError(`Error subiendo imagen: ${uploadErr.message}`);
                setIsSubmitting(false);
                return;
            }
        }

        // --- 2. Preparar Payloads ---
        const projectPayload = {
            title, description,
            // creator_id: No se envía usualmente en PUT si se usa token
            banner: finalBannerUrl, // URL actualizada o la original
            attachmenturl: attachmentsUrl,
            budget: Number.parseFloat(budget.replace(/[^0-9.]/g, '')) || 0,
            sponsors,
            estimated_start: startDate ? dayjs(startDate, "DD/MM/YYYY").toISOString() : null,
            estimated_end: endDate ? dayjs(endDate,   "DD/MM/YYYY").toISOString() : null,
            is_published: isPublished,
            // Omitir IDs de formato, género, clases aquí si se actualizan por separado
        };
        // Filtrar undefined/null si API es estricta
        Object.keys(projectPayload).forEach(key => (projectPayload[key as keyof typeof projectPayload] === null || projectPayload[key as keyof typeof projectPayload] === undefined) && delete projectPayload[key as keyof typeof projectPayload]);


        const formatPayload = { format_id: selectedFormat?.format_id };
        const genresPayload = { genre_ids: selectedGenres.map(g => g.genre_id) };
        const classesPayload = { class_ids: selectedSubjects.map(s => s.class_id) };

        try {
            // --- 3. Ejecutar API Calls (Ejemplo secuencial) ---
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            };

            // PUT Proyecto Principal
            const projectRes = await fetch(`${apiRoute}projects/${projectId}`, { method: 'PUT', headers, body: JSON.stringify(projectPayload) });
            if (!projectRes.ok) throw new Error(`Error actualizando proyecto: ${await projectRes.text()}`);
            console.log("Proyecto actualizado");

            // PATCH Formato
            if (selectedFormat) {
                const formatRes = await fetch(`${apiRoute}projects/${projectId}/format`, { method: 'PATCH', headers, body: JSON.stringify(formatPayload) });
                if (!formatRes.ok) console.error(`Error actualizando formato: ${await formatRes.text()}`); else console.log("Formato actualizado");
            }

            // PUT Géneros
            const genresRes = await fetch(`${apiRoute}projects/${projectId}/genres`, { method: 'PUT', headers, body: JSON.stringify(genresPayload) });
            if (!genresRes.ok) console.error(`Error actualizando géneros: ${await genresRes.text()}`); else console.log("Géneros actualizados");

             // PUT Clases
             const classesRes = await fetch(`${apiRoute}projects/${projectId}/classes`, { method: 'PUT', headers, body: JSON.stringify(classesPayload) });
             if (!classesRes.ok) console.error(`Error actualizando clases: ${await classesRes.text()}`); else console.log("Clases actualizadas");

             // --- 4. Manejar Vacantes ---
             await handleVacancyUpdates(projectId); // Llamar función separada

             navigate(`/projects/${projectId}`); // Volver a la vista del proyecto

         } catch (err: any) {
             console.error("Error al actualizar:", err);
             setError(err.message || "Ocurrió un error al guardar.");
             alert(`Error: ${err.message}`);
         } finally {
             setIsSubmitting(false);
         }
    };

    // --- Función Separada para Actualizar Vacantes ---
    const handleVacancyUpdates = async (currentProjectId: string) => {
      const initialIds = new Set(initialVacanciesRef.current.map(v => v.id));
      const currentIds = new Set(vacancies.map(v => v.id));

      const addedVacancies = vacancies.filter(v => typeof v.id === 'string' && v.id.startsWith('temp-'));
      const deletedVacancies = initialVacanciesRef.current.filter(v => !currentIds.has(v.id));
      const updatedVacancies = vacancies.filter(v => {
        // Existe en ambos y no es temporal
        if(typeof v.id !== 'string' && initialIds.has(v.id)){
          const initial = initialVacanciesRef.current.find(iv => iv.id === v.id);
          // Simple comparación (mejorar si es necesario)
          return JSON.stringify(initial) !== JSON.stringify(v);
        }
        return false;
      });

      console.log("Vacantes a Añadir:", addedVacancies);
      console.log("Vacantes a Eliminar:", deletedVacancies);
      console.log("Vacantes a Actualizar:", updatedVacancies);

      // Implementar llamadas API POST/PUT/DELETE para vacantes
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("token")}` };

      try {
        // DELETEs - Eliminar vacantes
        const deletePromises = deletedVacancies.map(async (vac) => {
          if (typeof vac.id === 'number') { // Solo eliminar si tiene ID de DB
            console.log(`Eliminando vacante: ${vac.id}`);
            const deleteRes = await fetch(`${apiRoute}vacancies/${vac.id}`, { 
              method: 'DELETE', 
              headers 
            });
            
            if (!deleteRes.ok) {
              throw new Error(`Error al eliminar vacante ${vac.id}: ${deleteRes.statusText}`);
            }
            return deleteRes;
          }
          return null;
        }).filter(Boolean);

        // POSTs - Crear nuevas vacantes
        const createPromises = addedVacancies.map(async (vac) => {
          const payload = { 
            project_id: currentProjectId, 
            role_id: vac.role_id, 
            description: vac.descripcion, 
            requirements: vac.requerimientos, 
            is_filled: false, 
            is_visible: true 
          };
          console.log(`Creando nueva vacante:`, payload);
          
          const createRes = await fetch(`${apiRoute}vacancies`, { 
            method: 'POST', 
            headers, 
            body: JSON.stringify(payload) 
          });
          
          if (!createRes.ok) {
            throw new Error(`Error al crear vacante: ${await createRes.text()}`);
          }
          return createRes;
        });

        // PUTs - Actualizar vacantes existentes
        const updatePromises = updatedVacancies.map(async (vac) => {
          if (typeof vac.id === 'number') { // Solo actualizar si tiene ID de DB
            const payload = { 
              role_id: vac.role_id, 
              description: vac.descripcion, 
              requirements: vac.requerimientos 
            };
            console.log(`Actualizando vacante ${vac.id}:`, payload);
            
            const updateRes = await fetch(`${apiRoute}vacancies/${vac.id}`, { 
              method: 'PUT', 
              headers, 
              body: JSON.stringify(payload) 
            });
            
            if (!updateRes.ok) {
              throw new Error(`Error al actualizar vacante ${vac.id}: ${await updateRes.text()}`);
            }
            return updateRes;
          }
          return null;
        }).filter(Boolean);

        // Ejecutar todas las operaciones de vacantes en paralelo
        await Promise.all([...deletePromises, ...createPromises, ...updatePromises]);
        console.log("Todas las operaciones de vacantes completadas con éxito");
        
        // Actualizar la referencia de vacantes iniciales para futuras comparaciones
        initialVacanciesRef.current = [...vacancies].map(v => {
          // Convertir IDs temporales a reales si se necesitara
          // Esto requeriría capturar los IDs reales de las respuestas POST
          return v;
        });

      } catch (err: any) {
        console.error("Error al gestionar vacantes:", err);
        throw new Error(`Error al actualizar vacantes: ${err.message}`);
      }
    };


    // --- Handler para Eliminar Proyecto ---
    const handleDeleteProject = async () => {
      setIsSubmitting(true);
      setError(null);
      
      try {
        const response = await fetch(`${apiRoute}projects/${projectId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        // Handle different response statuses
        if (response.status === 204) {
          // Success - project deleted
          alert("Proyecto eliminado correctamente");
          navigate("/projects"); // Navigate back to projects list
        } else if (response.status === 401) {
          throw new Error("No estás autorizado para realizar esta acción");
        } else if (response.status === 403) {
          throw new Error("No tienes permiso para eliminar este proyecto");
        } else if (response.status === 404) {
          throw new Error("Proyecto no encontrado");
        } else {
          throw new Error(`Error del servidor: ${response.statusText}`);
        }
      } catch (err: any) {
        console.error("Error al eliminar el proyecto:", err);
        setError(err.message || "Ocurrió un error al eliminar el proyecto");
        alert(err.message || "No se pudo eliminar el proyecto");
      } finally {
        setIsSubmitting(false);
        setDeleteProjectConfirmOpen(false); // Close confirmation modal regardless of outcome
      }
    };


    // --- RENDERIZADO ---
    if (isLoading) { /* ... Loading ... */ }
    if (projectNotFound) { /* ... Not Found ... */ }


    const toggleGenre = (genre: Genre) => {
    setSelectedGenres(prev =>
      prev.some(g => g.genre === genre.genre)
        ? prev.filter(g => g.genre !== genre.genre)
        : [...prev, genre]
    );
  };

  const toggleSubject = (subject: Subject) => {
    setSelectedSubjects(prev =>
      prev.some(s => s.class_name === subject.class_name)
        ? prev.filter(s => s.class_name !== subject.class_name)
        : [...prev, subject]
    );
  };

  return (
    <CreatorLayout>
      <div className="max-w-[70rem] h-full flex flex-col items-center gap-4 px-4 bg-rojo-intec-100 overflow-x-hidden">
        {/* Banner Image with Edit Option */}
        <div className="relative w-full h-1/3">
          <img
            src={bannerImage}
            alt="Project Banner"
            className="w-full h-full object-cover"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg"
          >
            📷 Edit
          </button>
        </div>

        {/* Editable Project Title */}
        <Input
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-center text-[4.5rem] font-barlow font-medium leading-[5.85rem] px-2 border-b border-gray-300 focus:outline-none focus:border-gray-500"
          placeholder="Título del Proyecto"
        />
        <CustomTabs>
          <CustomTab label="General">
            {/* Main Content Container */}
            <div className="w-full max-w-[75rem] flex gap-10 px-8 my-8">
              {/* Left Column: Format, Genres, Subjects */}
              <div className="w-1/4 flex flex-col gap-[1.563rem]">
                <InfoCard
                  title="Formato"
                  content={
                      selectedFormat ? 
                      [selectedFormat] :  // Envuelve en un array si es un objeto
                      "Seleccionar formato"
                    }                  
                  headerButton={
                    <button
                      className="text-black text-[1.25rem] font-barlow font-medium leading-[1.625rem]"
                      onClick={() => setFormatModalOpen(true)}
                    >
                      +
                    </button>
                  }
                />
                <InfoCard
                  title="Generos"
                  content={selectedGenres.length ? selectedGenres : ["Seleccionar géneros"]}
                  headerButton={
                    <button
                      className="text-black text-[1.25rem] font-barlow font-medium leading-[1.625rem]"
                      onClick={() => setGenresModalOpen(true)}
                    >
                      +
                    </button>
                  }
                />
                <InfoCard
                  title="Materias"
                  content={
                    selectedSubjects.length ? selectedSubjects : ["Seleccionar materias"]
                  }
                  headerButton={
                    <button
                      className="text-black text-[1.25rem] font-barlow font-medium leading-[1.625rem]"
                      onClick={() => setSubjectsModalOpen(true)}
                    >
                      +
                    </button>
                  }
                />
              </div>

              {/* Center Column: Description */}
              <div className="flex-1">
                <label
                  htmlFor="description"
                  className="block mb-1 text-sm font-medium font-barlow text-Base-Negro"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-full p-2 border border-gray-300 rounded-md resize-none"
                  placeholder="Describe tu proyecto aquí..."
                />
              </div>

              {/* Right Column: Budget, Dates, and Action Buttons */}
              <div className="w-[16.563rem] flex flex-col justify-between gap-2">
                {/* Budget Field */}
                <div className="flex flex-col justify-start items-start gap-2.5">
                  <label
                    htmlFor="budget"
                    className="text-black text-medium font-barlow font-medium leading-loose"
                  >
                    Presupuesto
                  </label>
                  <Input
                    name="budget"
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="0.0$"
                    className="min-w-full"
                  />
                </div>

                {/* Dates Section */}
                <div className="flex flex-col gap-4 relative">
                  {/* Start Date Field */}
                  <div className="flex-1 relative">
                    <label
                      htmlFor="FechaInicio"
                      className="text-black text-medium font-barlow font-medium leading-loose"
                    >
                      Fecha de Inicio
                    </label>
                    <div className="relative">
                      <input
                        name="FechaInicio"
                        type="text"
                        placeholder="Seleccionar fecha de inicio"
                        value={formatDate(startDate)}
                        onClick={() => setOpenPicker("start")}
                        className="w-full p-2.5 border-2 border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => setOpenPicker("start")}
                      >
                        <img src={CalendarIcon} alt="Calendar" className="w-5 h-5" />
                      </button>
                    </div>
                    {openPicker === "start" && (
                      <div className="absolute z-10 mt-2">
                        <CustomDatePicker
                          selectedDate={startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            setOpenPicker(null);
                          }}
                          onClose={() => setOpenPicker(null)}
                          maxDate={dayjs().add(2, 'year')}
                        />
                      </div>
                    )}
                  </div>

                  {/* End Date Field */}
                  <div className="flex-1 relative">
                    <label
                      htmlFor="FechaFin"
                      className="text-black text-medium font-barlow font-medium leading-loose"
                    >
                      Fecha de fin
                    </label>
                    <div className="relative">
                      <input
                        name="FechaFin"
                        type="text"
                        placeholder="Seleccionar fecha de fin"
                        value={formatDate(endDate)}
                        onClick={() => setOpenPicker("end")}
                        className="w-full p-2.5 border-2 border-black rounded-lg focus:ring-2"/>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => setOpenPicker("end")}
                      >
                        <img src={CalendarIcon} alt="Calendar" className="w-5 h-5" />
                      </button>
                    </div>
                    {openPicker === "end" && (
                      <div className="absolute z-10 mt-2 right-0">
                        <CustomDatePicker
                          selectedDate={endDate}// Convertir Date a string
                          onSelect={(date) => { setEndDate(date); setOpenPicker(null); }} // Convertir string a Date
                          onClose={() => setOpenPicker(null)}
                          minDate={startDate ? dayjs(startDate, "DD/MM/YYYY") : undefined}                          
                          disabled={!startDate} // Deshabilitar si no hay fecha inicio
                          />
                      </div>
                    )}
                  </div>
                  {/* Sponsors Field */}
                  <div className="flex flex-col justify-start items-start gap-2.5">
                    <label
                      htmlFor="sponsors"
                      className="text-black text-medium font-barlow font-medium leading-loose"
                    >
                      Patrocinadores
                    </label>
                    <Input
                      name="sponsors"
                      type="text"
                      value={sponsors}
                      onChange={(e) => setSponsors(e.target.value)}
                      placeholder="Nombre de patrocinadores"
                      className="min-w-full"
                    />
                  </div>

                  {/* Attachments URL Field */}
                  <div className="flex flex-col justify-start items-start gap-2.5">
                    <label
                      htmlFor="attachmentsUrl"
                      className="text-black text-medium font-barlow font-medium leading-loose"
                    >
                      URLs de Adjuntos
                    </label>
                    <textarea
                      name="attachmentsUrl"
                      value={attachmentsUrl}
                      onChange={(e) => setAttachmentsUrl(e.target.value)}
                      placeholder="Ej: https://example.com/documento.pdf"
                      className="w-full p-2.5 border-2 border-black rounded-lg  resize-none"
                      rows={3}
                    />
                  </div>
                </div>
                
                
              </div>
            </div>
          </CustomTab>
          <CustomTab label="Vacantes">
              <>
              {/* Tabla de Vacantes */}
            <VacanciesTable
              vacancies={vacancies}
              onEdit={openVacancyModal}
              onDelete={handleDeleteVacancy}
            />

            {/* Botón para añadir */}
            <div className="mt-4">
              <Button onClick={() => openVacancyModal(null)}>
                Agregar Vacante
              </Button>
            </div>

            {/* Modal de Formulario */}
            <VacancyFormModal
            isOpen={vacancyModalOpen}
            onClose={() => setVacancyModalOpen(false)}
            onSave={handleSaveVacancy}
            initialData={editingVacancy ? {
              department_id: editingVacancy.department_id,
              role_id: editingVacancy.role_id,
              description: editingVacancy.descripcion,
              requirements: editingVacancy.requerimientos,
              department_name: editingVacancy.departamento,
              role_name: editingVacancy.cargo
            } : undefined}
            departments={departments}
          />
          </>           
          </CustomTab>
          
        </CustomTabs>

        

        {/* Bottom Action Buttons */}
        <div className="w-full flex justify-center px-[3.375rem] mt-8 mb-8 gap-4">
          <Button
            className="p-4 bg-white"
            onClick={() => setDeleteProjectConfirmOpen(true)}
          >
            Cancelar
          </Button>
  
            <Button onClick={()=> setConfirmEditOpen(true)} className="p-4 bg-rojo-intec-400 text-white">Guardar cambias</Button>
        </div>
      </div>
      <ConfirmEditModal
        isOpen={confirmEditOpen}
        onCancel={() => setConfirmEditOpen(false)}
        onConfirm={() => handleUpdateProject(new Event('submit') as unknown as React.FormEvent)}
        message="Los cambios serán permanentes, ¿deseas continuar?"
      />
      {/* Modals */}
      {formatModalOpen && (
        <FormatSelector
          isOpen={formatModalOpen}
          formats={formats}
          selectedFormat={selectedFormat}
          onSelect={(format) => {
            setSelectedFormat(format);
            setFormatModalOpen(false);
          }}
          onClose={() => setFormatModalOpen(false)}
        />
      )}

      {genresModalOpen && (
        <GenresModal
          isOpen={genresModalOpen}
          onClose={() => setGenresModalOpen(false)}
          selectedGenres={selectedGenres}
          toggleGenre={toggleGenre}
          genres={genres}
        />
      )}

      {subjectsModalOpen && (
        <SubjectsModal
          isOpen={subjectsModalOpen}
          onClose={() => setSubjectsModalOpen(false)}
          selectedSubjects={selectedSubjects}
          toggleSubject={toggleSubject}
          subjects={subjects}
        />
      )}

      {deleteProjectConfirmOpen && (
        <Modal title="Confirmar Eliminación Proyecto" onClose={() => setDeleteProjectConfirmOpen(false)}>
          <p className="mb-4">¿Estás SEGURO de eliminar este proyecto? Esta acción es PERMANENTE.</p>
          <div className="flex justify-end gap-4">
            <Button className="bg-white" onClick={() => setDeleteProjectConfirmOpen(false)}>No, Conservar</Button>
            <Button onClick={handleDeleteProject}>Sí, Eliminar Proyecto</Button>
          </div>
        </Modal>
      )}
    </CreatorLayout>
  );
};

export default EditProyect;
