// src/pages/RequestPage.tsx
import React from "react";
import CreatorLayout from "@/layouts/default";
import RequestCard, { RequestCardProps } from "@/components/requestCard";
import CustomTabs, { CustomTab } from "@/components/tabs";

const dummyRequests: RequestCardProps[] = [
  {
    projectTitle: "Proyecto Alpha",
    imageUrl: "https://placehold.co/208x266",
    cargo: "Director",
    estado: "Pendiente",
    fecha: "01/04/2025",
  },
  {
    projectTitle: "Proyecto Beta",
    imageUrl: "https://placehold.co/208x266",
    cargo: "Cineasta",
    estado: "Aprobada",
    fecha: "02/04/2025",
  },
  {
    projectTitle: "Proyecto Gamma",
    imageUrl: "https://placehold.co/208x266",
    cargo: "Editor",
    estado: "Rechazada",
    fecha: "03/04/2025",
  },
];

const dummyInvitations: RequestCardProps[] = [
  {
    projectTitle: "Invitación a Cortometraje XYZ",
    imageUrl: "https://placehold.co/208x266",
    cargo: "Asistente de Dirección",
    estado: "Pendiente",
    fecha: "05/04/2025",
  },
  {
    projectTitle: "Invitación a Documental Social",
    imageUrl: "https://placehold.co/208x266",
    cargo: "Sonidista",
    estado: "Aprobada",
    fecha: "06/04/2025",
  },
];

const RequestPage: React.FC = () => {
  return (
    <CreatorLayout>
      <div className="w-full h-full px-12 pb-11 flex flex-col justify-start gap-6">
        {/* Header */}
        <div className="w-full h-20 pr-14 inline-flex justify-start items-center">
          <h1 className="text-Base-Negro text-6xl font-medium font-barlow leading-[78px]">
            Solicitudes e Invitaciones
          </h1>
        </div>

        {/* Tabs */}
        <CustomTabs>
          <CustomTab label="Solicitudes">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
              {dummyRequests.map((request) => (
                <RequestCard key={request.projectTitle} {...request} />
              ))}
            </div>
          </CustomTab>

          <CustomTab label="Invitaciones">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
              {dummyInvitations.map((invitation) => (
                <RequestCard key={invitation.projectTitle} {...invitation} />
              ))}
            </div>
          </CustomTab>
        </CustomTabs>
      </div>
    </CreatorLayout>
  );
};

export default RequestPage;
