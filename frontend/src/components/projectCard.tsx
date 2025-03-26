import React from "react";

export interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  filters: string[];
  Completado: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  imageUrl,
  filters
}) => {
  return (
    <div className="w-[471px] h-56 pr-4 bg-Rojo---Intec-100 rounded-[20px] outline outline-[1.50px] outline-offset-[-1.50px] outline-black flex justify-center items-center gap-5 flex-wrap content-center overflow-hidden">
      <div className="w-48 h-64 bg-white flex flex-col justify-center items-center">
        <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
      </div>
      <div className="flex-1 max-w-96 min-w-56 px-1 py-5 flex flex-col justify-center items-start gap-7">
        <div className="w-48 flex justify-start items-start gap-2.5">
          <div className="text-black text-2xl font-medium font-['Barlow'] leading-loose">
            {title}
          </div>
        </div>
        <div className="w-full flex justify-center items-center gap-2.5">
          <div className="flex-1 text-justify text-black text-sm font-normal font-['Barlow'] leading-tight">
            {description}
          </div>
          { filters.map((filter) => (
            <div key={filter} className="px-2 py-1 bg-white rounded-full text-xs font-medium font-['Barlow']">
              {filter}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
