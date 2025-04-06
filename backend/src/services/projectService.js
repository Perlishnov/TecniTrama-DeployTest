const prisma = require("../models/prismaClient");

// Creates Project
const createProject = async (projectData) => {
  return await prisma.projects.create({
    data: {
      creator_id: parseInt(projectData.creator_id),
      title: projectData.title,
      description: projectData.description,
      banner: projectData.banner || null,
      attachmenturl: projectData.attachmenturl || null,
      budget: projectData.budget ? parseFloat(projectData.budget) : null,
      sponsors: projectData.sponsors || null,
      estimated_start: projectData.estimated_start ? new Date(projectData.estimated_start) : null,
      estimated_end: projectData.estimated_end ? new Date(projectData.estimated_end) : null,
      is_published: projectData.is_published || false,
      format_id: projectData.format_id ? parseInt(projectData.format_id) : null
    }
  });
};

// Gets all Projects
const getAllProjects = async () => {
  return await prisma.projects.findMany({
    include: {
      project_formats: true,
      users: true
    }
  });
};

// Gets Project by ID
const getProjectById = async (id) => {
  return await prisma.projects.findUnique({
    where: { project_id: parseInt(id) },
    include: {
      project_formats: true,
      users: true,
      crew: true,
      project_genres: true
    }
  });
};

// Updates Project
const updateProject = async (id, projectData) => {
  const existingProject = await getProjectById(id);
  
  return await prisma.projects.update({
    where: { project_id: parseInt(id) },
    data: {
      title: projectData.title || existingProject.title,
      description: projectData.description || existingProject.description,
      banner: projectData.banner !== undefined ? projectData.banner : existingProject.banner,
      attachmenturl: projectData.attachmenturl !== undefined ? projectData.attachmenturl : existingProject.attachmenturl,
      budget: projectData.budget !== undefined ? parseFloat(projectData.budget) : existingProject.budget,
      sponsors: projectData.sponsors !== undefined ? projectData.sponsors : existingProject.sponsors,
      estimated_start: projectData.estimated_start ? new Date(projectData.estimated_start) : existingProject.estimated_start,
      estimated_end: projectData.estimated_end ? new Date(projectData.estimated_end) : existingProject.estimated_end,
      is_published: projectData.is_published !== undefined ? projectData.is_published : existingProject.is_published,
      format_id: projectData.format_id ? parseInt(projectData.format_id) : existingProject.format_id
    }
  });
};

// Deletes Project
const deleteProject = async (id) => {
  return await prisma.projects.delete({
    where: { project_id: parseInt(id) }
  });
};

// Toggles Project Status
const toggleProjectStatus = async (id, is_active) => {
  return await prisma.projects.update({
    where: { project_id: parseInt(id) },
    data: { is_active }
  });
};

// Checks if a user is the owner of a project
const isProjectOwner = async (projectId, userId) => {
  const project = await prisma.projects.findFirst({
    where: {
      project_id: parseInt(projectId),
      creator_id: parseInt(userId)
    }
  });
  return project !== null;
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleProjectStatus,
  isProjectOwner
};