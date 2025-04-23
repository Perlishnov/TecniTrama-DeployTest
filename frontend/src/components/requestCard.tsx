import React from "react";

export interface RequestCardProps {
  projectTitle: string;
  imageUrl: string;
  cargo: string;
  estado: string;
  fecha: string;
  idProject?: number;
}

const RequestCard: React.FC<RequestCardProps> = ({
  imageUrl,
  cargo,
  estado,
  fecha,
}) => {
  return (
    <div className="shadow-[9px_9px_10.4px_rgba(0,0,0,0.25)] flex flex-row items-stretch gap-2.5 rounded-[20px] bg-rojo-intec-200 outline outline-2 outline-offset-[-2px] outline-black overflow-hidden w-[729px] min-h-64">
      {/* Image Section */}
      <div className="flex-shrink-0 w-52">
        <img
          className="w-full h-full object-cover"
          src={imageUrl}
          alt="Project"
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-4 gap-4">

        {/* Content */}
        <div className="flex justify-between">
          <div className="flex flex-col gap-3">
            <div className="text-Base-Negro text-xl font-medium font-barlow leading-relaxed">
              Cargo: {cargo}
            </div>
            <div className="text-Base-Negro text-xl font-medium font-barlow leading-relaxed">
              Estado: {estado}
            </div>
            <div className="text-Base-Negro text-xl font-medium font-barlow leading-relaxed">
              Hecha en: {fecha}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RequestCard;