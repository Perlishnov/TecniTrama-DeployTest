import React, { useState } from "react";
import CreatorLayout from "@/layouts/default";
import ProjectsTab from "@/components/ProjectsTab";
import Button from "@/components/button";
import AvatarUrl from "@/assets/profile_page_avatar.svg";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { useDecodeJWT } from "@/hooks/useDecodeJWT";
import { Link, redirect } from "react-router-dom";

const sampleProjects = [
  {
    id: 1,
    title: "Proyecto 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
    imageUrl: "https://placehold.co/186x270",
    filters: ["Filtro 1", "Filtro 2", "Filtro 3"],
    Completado: false,
  },
  {
    id: 2,
    title: "Proyecto 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
    imageUrl: "https://placehold.co/186x270",
    filters: ["Filtro 1", "Filtro 2", "Filtro 3"],
    Completado: true,
  },
  // Agrega más proyectos según sea necesario
];

const CreatorProfilePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <CreatorLayout>
      <div className="w-full flex flex-col items-center gap-14">
        {/* Profile Header */}
        <div className="flex items-start gap-12">
          <img
            className="w-40 h-44 object-fill rounded-full"
            src={AvatarUrl}
            alt="Profile"
          />
          <div className="w-96 h-36 flex flex-col gap-3.5">
            <div className="text-black text-2xl font-bold font-barlow leading-loose">
              Nombre del Usuario
            </div>
            <div className="flex items-center gap-4">
              <div className="text-black text-base font-medium font-barlow leading-relaxed">
                Correo@example.com
              </div>
              <div className="text-black text-base font-medium font-barlow leading-relaxed">
                Carrera
              </div>
            </div>
            <div className="h-24 flex items-start">
              <div className="flex-1 text-gray-600 text-base font-medium font-barlow leading-relaxed">
                Biografía: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-10 flex-grow">
            <Button className="px-2">
                <Link to="/profile/edit-profile">Editar perfil</Link>
            </Button>
            <Button onClick={() => setShowModal(true)} className="px-4 py-2">
                Cambiar contraseña
            </Button>
            {showModal && (
              <ChangePasswordModal onClose={() => setShowModal(false)} />
            )}
          </div>
        </div>

        {/* Projects Section with Tabs */}
        <div className="w-full flex flex-col items-center">
          <div className="text-center text-base-negro text-3xl font-medium font-barlow leading-10 mb-8">
            Tus proyectos
          </div>
          {/* Pendiente a correcta implementacion e integracion */}
          {/* <ProjectsTab
            finishedProjects={sampleProjects.filter((p) => p.Completado)}
            inProgressProjects={sampleProjects.filter((p) => !p.Completado)}
          /> */}
        </div>
      </div>
    </CreatorLayout>
  );
};

export default CreatorProfilePage;
