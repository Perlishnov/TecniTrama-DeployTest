import React from "react";
import { Link } from "react-router-dom";

export interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  filters: string[];
  completado: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  imageUrl,
  filters,
  completado,
  href,
  onClick,
  className = "",
}) => {
  const Wrapper = href
    ? ({ children }: { children: React.ReactNode }) => (
      <Link to={href} className="block w-full">
        {children}
      </Link>
    )
    : onClick
      ? ({ children }: { children: React.ReactNode }) => (
        <div
          onClick={onClick}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClick();
            }
          }}
          className="cursor-pointer w-full"
        >
          {children}
        </div>
      )
      : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <Wrapper>
      <div
        className={`flex w-full max-w-[600px] h-48 ${completado ? "bg-gray-100" : "bg-red-100"
          } border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
        aria-label={`Proyecto: ${title}`}
      >

        {/* Imagen */}
        <div className="w-48 h-full">
          <img
            src={imageUrl}
            alt={`Imagen del proyecto ${title}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contenido */}
        <div className="flex flex-col justify-between p-4 flex-1">
          <div>
            <h3 className="text-lg font-semibold text-black font-barlow mb-1 line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-700 font-barlow line-clamp-2">
              {description}
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.map((filter) => (
              <span
                key={filter}
                className="bg-gray-100 text-xs px-3 py-1 rounded-full font-medium font-barlow border border-gray-300"
              >
                {filter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Wrapper>

  );
};

export default ProjectCard;
