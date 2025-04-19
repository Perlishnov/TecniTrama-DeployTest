// src/lib/maps.ts
import { ApiVacancy, Vacancy } from "@/types";

export function mapApiVacancy(v: ApiVacancy): Vacancy {
  return {
    id: v.id,
    cargo: v.position,
    descripcion: v.description,
    requerimientos: v.requirements,
    departamento: v.department,
    // if your API gives you department_id/role_id, use them; otherwise default to 0
    department_id: v.department_id ?? 0,
    role_id: v.role_id ?? 0,
  };
}

export function mapApiVacancies(arr: ApiVacancy[]): Vacancy[] {
  return arr.map(mapApiVacancy);
}
