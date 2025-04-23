import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
export type Vacancy = {
  id: number | string;
  cargo: string;
  departamento: string;
  descripcion: string;
  requerimientos: string;
  role_id: number;
  department_id: number;
  is_filled: boolean;
};
export interface ProjectLink {
  id: string | number;
  nombre: string;
  link: string; // 'link' en vez de 'url'
}
export interface Subject {
  class_id: string;
  class_name: string;
}

// Represents a project format
export interface ProjectFormat {
  format_id: number;
  format_name: string;
}

// Represents a genre
export interface Genre {
  genre_id: number;
  genre: string;
}
// departments.ts
export interface Department {
  /** Clave primaria */
  department_id: number;
  /** Nombre del departamento */
  department_name: string;
}

// roles.ts
export interface Role {
  /** Clave primaria */
  role_id: number;
  /** Clave foránea hacia Department.department_id */
  department_id: number;
  /** Nombre del rol */
  role_name: string;
  /** Descripción de las responsabilidades */
  responsibilities: string;
}
export interface ApiVacancy {
  id: string;
  position: string;
  description: string;
  requirements: string;
  department: string;
  department_id?: number;
  role_id?: number;
}
