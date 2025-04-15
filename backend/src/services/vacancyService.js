const prisma = require("../models/prismaClient");

// Creates Vacacy
const createVacancy = async (vacancyData) => {
  return await prisma.vacancies.create({
    data: {
      project_id: parseInt(vacancyData.project_id),
      title: vacancyData.title,
      description: vacancyData.description,
      requirements: vacancyData.requirements || null,
      is_active: vacancyData.is_active || false,
      is_published: vacancyData.is_published || false,
      estimated_start: vacancyData.estimated_start ? new Date(vacancyData.estimated_start) : null,
      estimated_end: vacancyData.estimated_end ? new Date(vacancyData.estimated_end) : null
    }
  });
};

// Get Vacancies by Project ID
const getVacanciesByProjectId = async (project_id) => {
  return await prisma.vacancies.findMany({
    where: { project_id: parseInt(project_id) },
    include: {
      projects: true,
      roles: true,
      applications: true
    }
  });
};

// Get vacancy by ID
const getVacancyById = async (id) => {
  return await prisma.vacancies.findUnique({
    where: { vacancy_id: parseInt(id) },
    include: {
      projects: true,
      roles: true,
      applications: true
    }
  });
};

// Updates Vacancy
const updateVacancy = async (id, vacancyData) => {
  const existingVacancy = await getVacancyById(id);

  return await prisma.vacancies.update({
    where: { vacancy_id: parseInt(id) },
    data: {
      title: vacancyData.title || existingVacancy.title,
      description: vacancyData.description || existingVacancy.description,
      requirements: vacancyData.requirements !== undefined ? vacancyData.requirements : existingVacancy.requirements,
      is_active: vacancyData.is_active !== undefined ? vacancyData.is_active : existingVacancy.is_active,
      is_published: vacancyData.is_published !== undefined ? vacancyData.is_published : existingVacancy.is_published,
      estimated_start: vacancyData.estimated_start ? new Date(vacancyData.estimated_start) : existingVacancy.estimated_start,
      estimated_end: vacancyData.estimated_end ? new Date(vacancyData.estimated_end) : existingVacancy.estimated_end
    }
  });
};

// Deletes Vacancy
const deleteVacancy = async (id) => {
  return await prisma.vacancies.delete({
    where: { vacancy_id: parseInt(id) }
  });
};

// Get all vacancies
const getAllVacancies = async () => {
  return await prisma.vacancies.findMany({
    include: {
      projects: true,
      roles: true,
      applications: true
    }
  });
};

module.exports = {
  createVacancy,
  getAllVacancies,
  getVacanciesByProjectId,
  getVacancyById,
  updateVacancy,
  deleteVacancy
};