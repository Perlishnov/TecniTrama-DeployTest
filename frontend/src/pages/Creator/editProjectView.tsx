import React, { useRef, useState } from "react";
import CreatorLayout from "@/layouts/default";
import InfoCard from "@/components/InfoCard";
import Button from "@/components/button";
import ReusableTable from "@/components/ReusableTable";
import Modal from "@/components/Modal";
import VacanteIcon from "@/assets/icons/users.svg";
import BriefCaseIcon from "@/assets/icons/briefcase.svg";
import LinkIcon from "@/assets/icons/link.svg";
import Input from "@/components/input";
import CustomDatePicker from "@/components/CustomDatePicker";
import CalendarIcon from "@/assets/icons/calendar.svg";
import { GenresModal } from "@/components/modals/genreModal";
import FormatSelector from "@/components/modals/formatModal";
import { SubjectsModal } from "@/components/modals/subjectModal";
import  VacantForm  from "@/components/modals/VacantForm";
import { Link } from "react-router-dom";

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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  //Date handlers
   const [startDate, setStartDate] = useState<string>("");
   const [endDate, setEndDate] = useState<string>("");
   const [openPicker, setOpenPicker] = useState<"start" | "end" | null>(null);


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
      <div className="w-full h-full flex flex-col items-center gap-4 px-4 bg-rojo-intec-50">
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
        <div className="w-full max-w-[75rem] flex gap-4 px-8 my-8">
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
            <label
                htmlFor="budget"
                className="text-black text-medium font-barlow font-medium leading-loose"
            >
              Descripción  
            </label>
            <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-full p-2 resize-none border border-gray-300 rounded-md"
                  placeholder="Describe tu proyecto aquí..."
              />
          </div>

          {/* Right Column: Budget, Dates, and Action Buttons */}
          <div className="w-[16.563rem] flex flex-col justify-between gap-2">
            {/* Budget Card */}
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

            {/* Dates Row */}
            <div className="flex flex-col relative">
             <div className="flex gap-4 w-full">
      {/* Start Date Input */}
      <div className="flex-1 relative">
        <p className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de inicio
        </p>
        <div className="relative">
          <input
            type="text"
            readOnly
            placeholder="Seleccionar fecha de inicio"
            value={startDate}
            onClick={() => setOpenPicker("start")}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setOpenPicker("start")}
          >
            <img src={CalendarIcon} alt="" />
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
            />
          </div>
        )}
      </div>

      {/* End Date Input */}
      <div className="flex-1 relative">
          <p className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de fin
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="Seleccionar fecha de fin"
              value={endDate}
              onClick={() => setOpenPicker("end")}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setOpenPicker("end")}
            >
              <img src={CalendarIcon} alt="" />
            </button>
          </div>

          {openPicker === "end" && (
            <div className="absolute z-10 mt-2">
              <CustomDatePicker
                selectedDate={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setOpenPicker(null);
                }}
                onClose={() => setOpenPicker(null)}
              />
            </div>
          )}
        </div>
      </div>
  
            </div>

            {/* Action Buttons: Show Publish and Edit if user is not owner */}            
            <div className="flex flex-col gap-2 items-center">
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
        {/* {crewModalOpen && 
          <VacantModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            departments={departments}
            positions={positions}
            selectedDepartment={selectedDepartment}
            selectedPosition={selectedPosition}
            onDepartmentChange={setSelectedDepartment}
            onPositionChange={setSelectedPosition}
            description={description}
            setDescription={setDescription}
            requirements={requirements}
            setRequirements={setRequirements}
            onSubmit={handleSubmit}
          />
        } */}

        
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
            <Link to="/dashboard">Eliminar Proyecto</Link>
          </Button>
          <div className="flex gap-4">
            <Button className="p-4 bg-gray-200">Cancelar</Button>
            <Button className="p-4 bg-green-500 text-white">Guardar Cambios</Button>
          </div>
        </div>
      </div>
      {formatModalOpen && 
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
      }       

      {genresModalOpen && 
            <GenresModal
        isOpen={genresModalOpen}
        onClose={() => setGenresModalOpen(false)}
        selectedGenres={selectedGenres}
        toggleGenre={toggleGenre}
        genres={genres}
      />
      }

      {subjectsModalOpen && 
        <SubjectsModal
          isOpen={subjectsModalOpen}
          onClose={() => setSubjectsModalOpen(false)}
          selectedSubjects={selectedSubjects}
          toggleSubject={toggleSubject}
          subjects={subjects}
        />
        }

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
