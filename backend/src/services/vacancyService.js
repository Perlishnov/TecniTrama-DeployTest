const prisma = require("../models/prismaClient");

// Creates Vacancy
const createVacancy = async (vacancyData) => {
  return await prisma.vacancies.create({
    data: {
      project_id: parseInt(vacancyData.project_id),
      role_id: parseInt(vacancyData.role_id),
      description: vacancyData.description,
      requirements: vacancyData.requirements,
      is_filled: vacancyData.is_filled || false,
      is_visible: vacancyData.is_visible || true
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
      description: vacancyData.description || existingVacancy.description,
      requirements: vacancyData.requirements !== undefined ? vacancyData.requirements : existingVacancy.requirements,
      is_filled: vacancyData.is_filled !== undefined ? vacancyData.is_filled : existingVacancy.is_filled,
      is_visible: vacancyData.is_visible !== undefined ? vacancyData.is_visible : existingVacancy.is_visible,
      role_id: vacancyData.role_id !== undefined ? parseInt(vacancyData.role_id) : existingVacancy.role_id
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