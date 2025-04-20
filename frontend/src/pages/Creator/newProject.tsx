import React, { useRef, useState } from "react";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import CreatorLayout from "@/layouts/default";
import InfoCard from "@/components/InfoCard";
import Button from "@/components/button";
import Input from "@/components/input";
import CustomDatePicker from "@/components/CustomDatePicker";
import CalendarIcon from "@/assets/icons/calendar.svg";
import FormatSelector from "@/components/modals/formatModal";
import { GenresModal } from "@/components/modals/genreModal";
import { SubjectsModal } from "@/components/modals/subjectModal";
import CustomTabs, { CustomTab } from "@/components/tabs";
import { Department, Genre, ProjectFormat, Role, Subject, Vacancy } from "@/types";
import ConfirmCancelModal from "@/components/modals/ConfirmCancelModal";
import VacancyFormModal from "@/components/modals/VacantModal";
import VacanciesTable from "@/components/VacancyTable";
import { useDecodeJWT } from "@/hooks/useDecodeJWT";


export const mockDepartments: Department[] = [
  { department_id: 1, department_name: "Producción" },
  { department_id: 2, department_name: "Dirección" },
  { department_id: 3, department_name: "Guion" },
  { department_id: 4, department_name: "Fotografía" },
  { department_id: 5, department_name: "Sonido" },
  { department_id: 6, department_name: "Arte" },
  { department_id: 7, department_name: "Vestuario" },
  { department_id: 8, department_name: "Maquillaje y Peinado" },
  { department_id: 9, department_name: "Edición y Post-producción" },
  { department_id: 10, department_name: "Efectos Visuales (VFX)" },
  { department_id: 11, department_name: "Música" },
  { department_id: 12, department_name: "Administración y Legal" },
];

export const mockRoles: Role[] = [
  // Producción (department_id: 1)
  { role_id: 101, role_name: "Productor/a Ejecutivo/a", department_id: 1, responsibilities: "Financiación y supervisión general del proyecto." },
  { role_id: 102, role_name: "Productor/a General", department_id: 1, responsibilities: "Supervisión diaria de la producción." },
  { role_id: 103, role_name: "Jefe/a de Producción", department_id: 1, responsibilities: "Logística, presupuesto y cronograma del rodaje." },
  { role_id: 104, role_name: "Asistente de Producción", department_id: 1, responsibilities: "Apoyo general al equipo de producción." },
  { role_id: 105, role_name: "Secretario/a de Producción", department_id: 1, responsibilities: "Tareas administrativas y de comunicación." },
  { role_id: 106, role_name: "Administrador/a de Locaciones", department_id: 1, responsibilities: "Búsqueda, gestión y permisos de locaciones." },

  // Dirección (department_id: 2)
  { role_id: 201, role_name: "Director/a", department_id: 2, responsibilities: "Visión creativa y dirección de actores y equipo técnico." },
  { role_id: 202, role_name: "Primer/a Asistente de Dirección", department_id: 2, responsibilities: "Planificación del rodaje, gestión del set." },
  { role_id: 203, role_name: "Segundo/a Asistente de Dirección", department_id: 2, responsibilities: "Coordinación de extras, logística del set." },
  { role_id: 204, role_name: "Script Supervisor / Continuista", department_id: 2, responsibilities: "Seguimiento de la continuidad y notas del guion." },
];

const initialVacanciesData = [
  {
    id: "",
    cargo: "",
    descripcion: "",
    requerimientos: "",
    departamento: "",
    role_id: "",
    department_id: "",
  },
];

const NewProject: React.FC = () => {
  // Project Fields
  const navigate = useNavigate();
  const [title, setTitle] = useState("Titulo del Proyecto");
  const [description, setDescription] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
  );
  const decodedToken = useDecodeJWT();
  const apiRoute = import.meta.env.VITE_API_ROUTE;

  const [formats, setFormats] = useState<ProjectFormat[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [isLoadingFormats, setIsLoadingFormats] = useState(false);
  const [isLoadingGenres, setIsLoadingGenres] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

  const [budget, setBudget] = useState("2.00$");
  const [selectedFormat, setSelectedFormat] = useState<ProjectFormat | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [bannerImage, setBannerImage] = useState("https://placehold.co/1305x297");
  const [sponsors, setSponsors] = useState("");
  const [attachmentsUrl, setAttachmentsUrl] = useState("");
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [roles, setRoles] = useState<Role[]>(mockRoles);

  const [vacancies, setVacancies] = useState<Vacancy[]>(initialVacanciesData); // Empezar vacío
  const [vacancyModalOpen, setVacancyModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null); // Para editar

  // Modal States for Format, Genres, Subjects, and Delete Confirmation
  const [formatModalOpen, setFormatModalOpen] = useState(false);
  const [genresModalOpen, setGenresModalOpen] = useState(false);
  const [subjectsModalOpen, setSubjectsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Date States (using string for simplicity in display; ideally, you'd use a date type)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openPicker, setOpenPicker] = useState<"start" | "end" | null>(null);

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
  // Abrir modal (nuevo o edicion)
  const openVacancyModal = (vacancy: Vacancy | null = null) => {
    setEditingVacancy(vacancy);
    setVacancyModalOpen(true);
  };

  const fetchGenres = async () => {
    try {
      setIsLoadingGenres(true);
      const response = await fetch(`${apiRoute}genres`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error("Error cargando géneros", error);
    } finally {
      setIsLoadingGenres(false);
    }
  };

  const fetchFormats = async () => {
    try {
      setIsLoadingFormats(true);
      const response = await fetch(`${apiRoute}projects/formats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setFormats(data);
    } catch (error) {
      console.error("Error cargando formatos", error);
    } finally {
      setIsLoadingFormats(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      setIsLoadingSubjects(true);
      const response = await fetch(`${apiRoute}classes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error cargando materias", error);
    } finally {
      setIsLoadingSubjects(false);
    }
  };
  const handleSaveVacancy = (data: {
    department_id: number;
    role_id: number;
    descripcion: string;
    requerimientos: string;
  }) => {
    const role = roles.find(r => r.role_id === data.role_id);
    const department = departments.find(d => d.department_id === data.department_id);

    if (!role || !department) {
      alert("Departamento o Rol invalido");
      return;
    }

    const transformedData: Omit<Vacancy, "id"> = {
      department_id: data.department_id,
      role_id: data.role_id,
      descripcion: data.descripcion,
      requerimientos: data.requerimientos,
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
    setVacancies((prev) => prev.filter((v) => v.id !== id));
  };

  const formatDate = (date: string) => (date ? date : "Seleccionar");

  const handleSubmit = async () => {// Form Submission for the project

    if (!decodedToken) {
      alert("No se pudo decodificar el token. Vuelve a iniciar sesión.");
      return;
    }

    const creatorId = decodedToken.id;
    if (!creatorId) {
      alert("ID de creador no encontrado en el token.");
      return;
    }

    // Validaciones normales
    if (!title || !selectedFormat || selectedGenres.length === 0 || selectedSubjects.length === 0 ) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      const projectPayload = {
        title,
        description,
        creator_id: creatorId,
        banner: bannerImage,
        attachmenturl: attachmentsUrl,
        budget: parseFloat(budget.replace("$", "").trim()) || 0,
        sponsors,
        estimated_start: new Date(startDate),
        estimated_end: new Date(endDate),
        is_published: true,
        //is_active: true,
        format_id: selectedFormat.format_id,
        genre_ids: selectedGenres.map(g => g.genre_id),
        class_ids: selectedSubjects.map(s => s.class_id),
      };

      const projectResponse = await fetch(`${apiRoute}projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(projectPayload),
      });

      console.log(projectResponse)
      if (!projectResponse.ok) {
        throw new Error("Error al crear el proyecto.");
      }

      const projectData = await projectResponse.json();
      const newProjectId = projectData.project_id;

      // Crear vacantes
      for (const vacancy of vacancies) {
        const vacancyPayload = {
          project_id: newProjectId,
          role_id: vacancy.role_id,
          description: vacancy.descripcion,
          requirements: vacancy.requerimientos,
          is_filled: false,
          is_visible: true,
        };

        const vacancyResponse = await fetch(`${apiRoute}vacancies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(vacancyPayload),
        });

        if (!vacancyResponse.ok) {
          console.error("Error al crear una vacante:", vacancy);
        }
      }
      navigate("/dashboard");

    } catch (error) {
      console.error("Error en la creación del proyecto o vacantes:", error);
      alert("Hubo un error al crear el proyecto. Intenta de nuevo.");
    }
  };

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
        <div className="relative w-full">
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
                      [selectedFormat.format_name] :  // Envuelve en un array si es un objeto
                      "Seleccionar formato"
                  }
                  headerButton={
                    <button
                      className="text-black text-[1.25rem] font-barlow font-medium leading-[1.625rem]"
                      onClick={() => { if (formats.length === 0) fetchFormats(); setFormatModalOpen(true) }}
                    >
                      +
                    </button>
                  }
                />
                <InfoCard
                  title="Materias"
                  content={
                    selectedSubjects.length
                      ? selectedSubjects.map((subject) => subject.class_name)
                      : ["Seleccionar materias"]
                  }
                  headerButton={
                    <button
                      className="text-black text-[1.25rem] font-barlow font-medium leading-[1.625rem]"
                      onClick={() => { if (subjects.length === 0) fetchSubjects(); setSubjectsModalOpen(true) }}
                    >
                      +
                    </button>
                  }
                />
                <InfoCard
                  title="Géneros"
                  content={
                    selectedGenres.length
                      ? selectedGenres.map((genre) => genre.genre)
                      : ["Seleccionar géneros"]
                  }
                  headerButton={
                    <button
                      className="text-black text-[1.25rem] font-barlow font-medium leading-[1.625rem]"
                      onClick={() => { if (genres.length === 0) fetchGenres(); setGenresModalOpen(true) }}
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
                        readOnly
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
                          selectedDate={startDate ? new Date(startDate) : null}
                          onSelect={(date) => {
                            setStartDate(date);
                            setOpenPicker(null);
                          }}
                          onClose={() => setOpenPicker(null)}
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
                        readOnly
                        placeholder="Seleccionar fecha de fin"
                        value={formatDate(endDate)}
                        onClick={() => setOpenPicker("end")}
                        className="w-full p-2.5 border-2 border-black rounded-lg focus:ring-2" />
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
                          selectedDate={endDate ? new Date(endDate) : null}
                          onSelect={(date) => {
                            setEndDate(date);
                            setOpenPicker(null);
                          }}
                          onClose={() => setOpenPicker(null)}
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
                  descripcion: editingVacancy.descripcion,
                  requerimientos: editingVacancy.requerimientos
                } : undefined}
                departments={departments}
                roles={roles}
              />
            </>
          </CustomTab>
        </CustomTabs>
        {/* Bottom Action Buttons */}
        <div className="w-full flex justify-center px-[3.375rem] mt-8 mb-8 gap-4">
          <Button
            className="p-4 bg-white"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="p-4 bg-rojo-intec-400 text-white">Crear Proyecto</Button>
        </div>
      </div>

      {/* Modals */}
      {formatModalOpen && (
        <FormatSelector
          isOpen={formatModalOpen}
          formats={formats}
          selectedFormat={selectedFormat}
          onSelect={(format) => { setSelectedFormat(format); setFormatModalOpen(false); }}
          onClose={() => setFormatModalOpen(false)}
        />
      )}

      {genresModalOpen && (
        <GenresModal
          isOpen={genresModalOpen}
          onClose={() => setGenresModalOpen(false)}
          selectedGenres={selectedGenres}
          toggleGenre={(genre) => {
            setSelectedGenres(prev => prev.some(g => g.genre_id === genre.genre_id) ? prev.filter(g => g.genre_id !== genre.genre_id) : [...prev, genre]);
          }}
          genres={genres}
        />
      )}

      {subjectsModalOpen && (
        <SubjectsModal
          isOpen={subjectsModalOpen}
          onClose={() => setSubjectsModalOpen(false)}
          selectedSubjects={selectedSubjects}
          toggleSubject={(subject) => {
            setSelectedSubjects(prev => prev.some(s => s.class_id === subject.class_id) ? prev.filter(s => s.class_id !== subject.class_id) : [...prev, subject]);
          }}
          subjects={subjects}
        />
      )}

      {deleteConfirmOpen && (
        <ConfirmCancelModal
          isOpen={deleteConfirmOpen}
          onCancel={() => setDeleteConfirmOpen(false)}
          onConfirm={() => {
            navigate("/dashboard"); // Redirigir al dashboard
            setDeleteConfirmOpen(false);
          }}
        />
      )}
    </CreatorLayout>
  );
};

export default NewProject;