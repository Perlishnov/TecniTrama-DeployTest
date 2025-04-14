import { Link } from "react-aria-components";
import React from "react";

export interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  filters: string[];
  completado: boolean;
  onClick?: () => void; // para navegación manual si se desea
  href?: string;        // para navegación por enlace
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
  className=""
}) => {
  const Wrapper = href
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={href} className="block w-full">
          {children}
        </Link>
      )
    : onClick
    ? ({ children }: { children: React.ReactNode }) => (
        <div onClick={onClick} className="cursor-pointer w-full">
          {children}
        </div>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
      <Wrapper>
        <div
          className={`w-full max-w-[471px] h-56 bg-red-100 rounded-2xl border border-black flex overflow-hidden hover:shadow-lg transition-shadow ${className}`}
          aria-label={`Proyecto: ${title}`}
        >
          {/* Imagen */}
          <div className="w-48 h-full bg-white shrink-0">
            <img
              src={imageUrl}
              alt={`Imagen del proyecto ${title}`}
              className="object-cover w-full h-full rounded-l-2xl"
            />
          </div>

          {/* Contenido */}
          <div className="flex flex-col justify-between p-4 flex-1">
            {/* Título */}
            <h3 className="text-xl font-semibold text-black font-barlow">{title}</h3>

            {/* Descripción */}
            <p className="text-sm text-black font-barlow text-justify line-clamp-3">
              {description}
            </p>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.map((filter) => (
                <span
                  key={filter}
                  className="bg-white text-xs px-3 py-1 rounded-full font-medium font-barlow border"
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