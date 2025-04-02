import React, { useRef, useState } from "react";
import Calendar from "@/components/calendar";
import CreatorLayout from "@/layouts/default";
import InfoCard from "@/components/InfoCard";
import Button from "@/components/button";
import ReusableTable from "@/components/ReusableTable";
import Modal from "@/components/Modal";
import VacanteIcon from "@/assets/icons/users.svg";
import BriefCaseIcon from "@/assets/icons/briefcase.svg";
import LinkIcon from "@/assets/icons/link.svg";
import {formatDate} from "@/hooks/formatter";
import Input from "@/components/input";

// Mock Data
const formats = ["Corto", "Largo", "Serie", "Documental"];
const genres = ["Drama", "Comedia", "Acción", "Ciencia Ficción", "Terror"];
const subjects = ["Historia", "Psicología", "Sociología", "Tecnología"];

const mainColumns = [
  { key: "cargo", label: "Cargo" },
  { key: "descripcion", label: "Descripción" },
  { key: "requerimientos", label: "Requerimientos" },
  { key: "encargado", label: "Encargado" },
  { key: "departamento", label: "Departamento" },
];

const columnsLinks = [
  { key: "nombre", label: "Nombre" },
  { key: "link", label: "Link" },
];

const vacanciesData = [
  { 
    label: "Ejemplo", 
    cargo: "Director", 
    descripcion: "Director principal", 
    requerimientos: "Experiencia previa", 
    encargado: "Armando Balcacer", 
    departamento: "Audiovisual",
    hasAction: true,
    actionText: "Invitar persona"
  }
];

const dataPatrocinadores = [
  {
    label: "Patrocinador 1",
    Sponsors: "Empresa XYZ",
    contribucion: "$1000",
    hasAction: true,
    actionText: "Editar"
  }
];

const dataLinks = [
  {
    id: 1,
    nombre: "Instagram",
    link: "https://www.instagram.com/",
    hasAction: true,
    actionText: "Editar"
  }
];

const EditProject: React.FC = () => {
  // State for project fields
  const [title, setTitle] = useState("Titulo del Proyecto");
  const [description, setDescription] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
  );
  const [budget, setBudget] = useState("2.00$");
  const [selectedFormat, setSelectedFormat] = useState("Corto");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [bannerImage, setBannerImage] = useState("https://placehold.co/1305x297");
  
  const [crewModalOpen, setCrewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableCrew, setAvailableCrew] = useState([
    { id: 1, name: "John Doe", role: "Cinematographer", department: "Camera" },
    { id: 2, name: "Jane Smith", role: "Sound Engineer", department: "Audio" },
    // Add more mock crew members
    ]);
    const [vacanciesData, setVacanciesData] = useState([
    { 
        label: "Ejemplo", 
        cargo: "Director", 
        descripcion: "Director principal", 
        requerimientos: "Experiencia previa", 
        encargado: "Armando Balcacer", 
        departamento: "Audiovisual",
        hasAction: true,
        actionText: "Invitar persona"
    }
    ]);
    const [selectedCrew, setSelectedCrew] = useState([
    { 
        id: 3, 
        name: "Armando Balcacer", 
        role: "Director", 
        department: "Audiovisual"
    }
    ]);


  // Modal states
  const [formatModalOpen, setFormatModalOpen] = useState(false);
  const [genresModalOpen, setGenresModalOpen] = useState(false);
  const [subjectsModalOpen, setSubjectsModalOpen] = useState(false);
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  //Date handlers
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);


  // Handlers for selection toggling
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update logic (API calls, etc.) goes here
    console.log({
      title,
      description,
      budget,
      selectedFormat,
      selectedGenres,
      selectedSubjects,
      startDate,
      endDate,
    });
  };
   const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(event: any): void {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            // Implement image handling or state update here, for example:
            console.log("Image file selected:", file.name);
            setBannerImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }
    const handleAddCrew = (crewMember: any) => {
    setVacanciesData(prev => [...prev, {
        label: crewMember.name,
        cargo: crewMember.role,
        descripcion: crewMember.role,
        requerimientos: "Experiencia requerida",
        encargado: crewMember.name,
        departamento: crewMember.department,
        hasAction: true,
        actionText: "Remover"
    }]);
    setCrewModalOpen(false);
    setSearchQuery("");
    };
    const crewTableData = selectedCrew.map(member => ({
        label: member.name,
        cargo: member.role,
        descripcion: member.role,
        requerimientos: "Experiencia requerida",
        encargado: member.name,
        departamento: member.department,
        hasAction: true,
        actionText: "Remover"
        }));

    const handleRemoveCrew = (crewMember: any) => {
    setSelectedCrew(prev => prev.filter(m => m.id !== crewMember.id));
    setAvailableCrew(prev => [...prev, crewMember]);
    };

  return (
    <CreatorLayout>
      <div className="w-full h-full flex flex-col items-center gap-4">
        {/* Banner Image with Edit Option */}
        <div className="relative w-full h-[18.56rem]">
            <img
            src={bannerImage}
            alt="Project Banner"
            className="w-full h-full object-cover"
            />
            {/* Hidden file input */}
            <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            />
            {/* Button to trigger file picker */}
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

        {/* Main Content Container */}
        <div className="w-full flex gap-4 px-[3.375rem]">
          {/* Left Column: Format, Genres, and Subjects */}
          <div className="w-[12.625rem] flex flex-col gap-[1.563rem]">
            <InfoCard
              title="Formato"
              content={[selectedFormat]}
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
              content={
                selectedGenres.length ? selectedGenres : ["Seleccionar géneros"]
              }
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
                selectedSubjects.length
                  ? selectedSubjects
                  : ["Seleccionar materias"]
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
            <InfoCard
              content={
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-40 p-2 border-0 focus:outline-none resize-none bg-transparent"
                  placeholder="Describe tu proyecto aquí..."
                />
              }
              title="Descripción"
              headerButton={null}
              className="flex-1"
            />
          </div>

          {/* Right Column: Budget, Dates, and Action Buttons */}
          <div className="w-[16.563rem] flex flex-col justify-between gap-4">
            {/* Budget Card */}
            <div className="bg-rojo-intec-200 rounded-t-[1.25rem] outline outline-1 outline-[#63666A]">
              <InfoCard
                title="Presupuesto"
                content={
                  <Input
                    name="presupuesto"
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full p-2 border-0 focus:outline-none bg-transparent"
                    placeholder="Presupuesto"
                  />
                }
                headerButton={null}
              />
            </div>

            {/* Dates Row */}
            <div className="flex gap-[2.625rem] relative">
              <div className="relative flex-1">
                <InfoCard
                  title="Inicio"
                  content={formatDate(startDate)}
                  headerButton={
                    <button 
                      onClick={() => setShowStartCalendar(true)}
                      className="text-black text-[1.25rem] font-barlow font-medium"
                    >
                      📅
                    </button>
                  }
                />
                <Calendar
                  isOpen={showStartCalendar}
                  onClose={() => setShowStartCalendar(false)}
                  onDateSelect={(date) => setStartDate(date)}
                  selectedDate={startDate || undefined}
                />
              </div>

              <div className="relative flex-1">
                <InfoCard
                  title="Final"
                  content={formatDate(endDate)}
                  headerButton={
                    <button
                      onClick={() => setShowEndCalendar(true)}
                      className="text-black text-[1.25rem] font-barlow font-medium"
                    >
                      📅
                    </button>
                  }
                />
                <Calendar
                  isOpen={showEndCalendar}
                  onClose={() => setShowEndCalendar(false)}
                  onDateSelect={(date) => setEndDate(date)}
                  selectedDate={endDate || undefined}
                />
              </div>
            </div>

            {/* Action Buttons: Show Publish and Edit if user is not owner */}            
            <div className="flex flex-col gap-4 items-center">
              <Button className="w-[11.063rem] p-[0.625rem] bg-rojo-intec-400 rounded-[2.813rem] outline outline-1 outline-black">
                <span className="text-black text-[1.125rem] font-barlow font-medium leading-[1.75rem]">
                  Publicar proyecto
                </span>
              </Button>
              <Button className="w-[11.063rem] p-[0.625rem] bg-blue-500 rounded-[2.813rem] outline outline-1 outline-black">
                <span className="text-black text-[1.125rem] font-barlow font-medium leading-[1.75rem]">
                  Editar proyecto
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Vacancies (Crew) Table */}
        {crewModalOpen && (
            <Modal 
                title="Gestionar Miembros del Crew" 
                onClose={() => setCrewModalOpen(false)}
                className=""
                >
                <div className="flex flex-col gap-4 h-full">
                    <div className="grid grid-cols-2 gap-4 h-full">
                    {/* Selected Crew Section */}
                    <div className="border-r pr-4 flex flex-col">
                        <h3 className="font-barlow font-medium mb-2">Miembros Seleccionados</h3>
                        <div className="flex-1 overflow-y-auto">
                        {selectedCrew.map(member => (
                            <div
                            key={member.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                            >
                            <div className="min-w-0">
                                <div className="font-medium truncate">{member.name}</div>
                                <div className="text-sm text-gray-600 truncate">{member.role}</div>
                            </div>
                            <button
                                onClick={() => handleRemoveCrew(member)}
                                className="text-red-500 hover:text-red-700 px-2 py-1"
                            >
                                ✕
                            </button>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Available Crew Section */}
                    <div className="flex flex-col">
                        <div className="mb-4">
                        <Input
                            name="Buscar crew"
                            type="text"
                            placeholder="Buscar miembros..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        </div>
                        <div className="flex-1 overflow-y-auto">
                        {availableCrew
                            .filter(member => 
                            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            member.role.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map(member => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                                onClick={() => handleAddCrew(member)}
                            >
                                <div className="min-w-0">
                                <div className="font-medium truncate">{member.name}</div>
                                <div className="text-sm text-gray-600 truncate">{member.role}</div>
                                </div>
                                <button className="text-rojo-intec-400 px-2 py-1">+</button>
                            </div>
                            ))}
                        </div>
                    </div>
                    </div>
                    
                    <div className="border-t pt-4">
                    <Button 
                        onClick={() => setCrewModalOpen(false)}
                        className="w-full"
                    >
                        Cerrar
                    </Button>
                    </div>
                </div>
                </Modal>
        )}

        
        <ReusableTable
        title="Vacantes + Crew"
        titleIcon={VacanteIcon}
        columns={mainColumns}
        data={crewTableData}
        onAction={(row) => {
            // Find the crew member by name
            const member = selectedCrew.find(m => m.name === row.encargado);
            if (member) {
            handleRemoveCrew(member);
            }
        }}
        />
        <Button 
        className="mt-4 rounded-full px-4"
        onClick={() => setCrewModalOpen(true)}
        >
        Agregar Miembro de Crew
        </Button>

        {/* Additional Data Section: Two Column Layout for Patrocinadores and Links */}
        <div className="w-full flex flex-col justify-start items-center gap-6">
          <div className="w-full flex gap-9">
            <ReusableTable
              title="Patrocinadores"
              titleIcon={BriefCaseIcon}
              columns={[
                { key: "Sponsors", label: "Patrocinadores" },
                { key: "contribucion", label: "Contribución" }
              ]}
              data={dataPatrocinadores}
              onAction={(row) => console.log("Action on patrocinador row:", row)}
            />
            <ReusableTable
              title="Links, documentos, Redes"
              titleIcon={LinkIcon}
              columns={columnsLinks}
              data={dataLinks}
              onAction={(row) => console.log("Action on links row:", row)}
            />
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="w-full flex justify-between px-[3.375rem] mt-8 mb-8">
          <Button
            className="p-4 bg-red-500 text-white"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Eliminar Proyecto
          </Button>
          <div className="flex gap-4">
            <Button className="p-4 bg-gray-200">Cancelar</Button>
            <Button className="p-4 bg-green-500 text-white">Guardar Cambios</Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {formatModalOpen && (
        <Modal title="Seleccionar Formato" onClose={() => setFormatModalOpen(false)}>
          <div className="grid grid-cols-2 gap-3">
            {formats.map((format) => (
              <button
                key={format}
                className={`p-3 rounded border cursor-pointer ${
                  selectedFormat === format ? "bg-blue-100 border-blue-500" : "border-gray-300"
                }`}
                onClick={() => {
                  setSelectedFormat(format);
                  setFormatModalOpen(false);
                }}
              >
                {format}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {genresModalOpen && (
        <Modal title="Seleccionar Géneros" onClose={() => setGenresModalOpen(false)}>
          <div className="grid grid-cols-2 gap-3">
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                className={`p-3 rounded border cursor-pointer ${
                  selectedGenres.includes(genre)
                    ? "bg-blue-100 border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button className="px-4 py-2" onClick={() => setGenresModalOpen(false)}>
              Confirmar
            </Button>
          </div>
        </Modal>
      )}

      {subjectsModalOpen && (
        <Modal title="Seleccionar Materias" onClose={() => setSubjectsModalOpen(false)}>
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <button
                key={subject}
                type="button"
                className={`p-3 rounded border cursor-pointer ${
                  selectedSubjects.includes(subject)
                    ? "bg-blue-100 border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => toggleSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Button className="px-4 py-2" onClick={() => setSubjectsModalOpen(false)}>
              Confirmar
            </Button>
          </div>
        </Modal>
      )}

      {deleteConfirmOpen && (
        <Modal title="Confirmar Eliminación" onClose={() => setDeleteConfirmOpen(false)}>
          <p className="mb-4">
            ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-4">
            <Button className="px-4 py-2 bg-gray-200" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="px-4 py-2 bg-red-500 text-white"
              onClick={() => {
                console.log("Project deleted");
                setDeleteConfirmOpen(false);
              }}
            >
              Eliminar
            </Button>
          </div>
        </Modal>
      )}
    </CreatorLayout>
  );
};

export default EditProject;
