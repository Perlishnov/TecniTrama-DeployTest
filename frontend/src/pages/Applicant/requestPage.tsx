import React from "react";
import CreatorLayout from "@/layouts/default";
import RequestCard, { RequestCardProps } from "@/components/requestCard";

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

const RequestPage: React.FC = () => {
  return (
    <CreatorLayout>
      <div className="w-full h-full px-12 pb-11 flex flex-col justify-start gap-2">
        {/* Header */}
        <div className="self-stretch flex flex-col justify-start items-center gap-4">
          <div className="w-full h-20 pr-14 inline-flex justify-start items-center">
            <div className="text-Base-Negro text-6xl font-medium font-barlow leading-[78px]">
              Solicitudes
            </div>
          </div>
          <div className="w-full h-0 outline outline-1 outline-offset-[-0.5px] outline-Gris-700"></div>
          {/* Request Cards */}
          <div className="self-stretch inline-flex justify-between items-start flex-wrap gap-6">
            {dummyRequests.map((request) => (
              <RequestCard key={request.projectTitle} {...request} />
            ))}
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default RequestPage;
