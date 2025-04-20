const prisma = require("../models/prismaClient");
const { createNotificationForMultipleUsers } = require("./notificationService");

// Creates Project
const createProject = async (projectData) => {
  return await prisma.$transaction(async (tx) => {
    // Creates the project
    const newProject = await tx.projects.create({
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

    // Associates the genres with the project
    if (Array.isArray(projectData.genre_ids) && projectData.genre_ids.length > 0) {
      await tx.project_genres.createMany({
        data: projectData.genre_ids.map((genreId) => ({
          project_id: newProject.project_id,
          genre_id: genreId
        }))
      });
    }

    // Associates the classes with the project
    if (Array.isArray(projectData.class_ids) && projectData.class_ids.length > 0) {
      await tx.class_projects.createMany({
        data: projectData.class_ids.map((classId) => ({
          project_id: newProject.project_id,
          class_id: classId
        }))
      });
    }

    return newProject;
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

// Gets Project by User ID
const getProjectByCreatorId = async (userId) => {
  return await prisma.projects.findMany({
    where: { creator_id: parseInt(userId) },
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
  const projectId = parseInt(id);

  return await prisma.$transaction(async (tx) => {
    // Get Existing project data
    const existingProject = await tx.projects.findUnique({
      where: { project_id: projectId }
    });

    if (!existingProject) {
      throw new Error('Project not found');
    }

    // Update project data
    const updatedProject = await tx.projects.update({
      where: { project_id: projectId },
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

    // Update genres
    if (Array.isArray(projectData.genre_ids)) {
      await tx.project_genres.deleteMany({ where: { project_id: projectId } });

      if (projectData.genre_ids.length > 0) {
        await tx.project_genres.createMany({
          data: projectData.genre_ids.map((genreId) => ({
            project_id: projectId,
            genre_id: genreId
          }))
        });
      }
    }

    // Update classes
    if (Array.isArray(projectData.class_ids)) {
      await tx.project_classes.deleteMany({ where: { project_id: projectId } });

      if (projectData.class_ids.length > 0) {
        await tx.project_classes.createMany({
          data: projectData.class_ids.map((classId) => ({
            project_id: projectId,
            class_id: classId
          }))
        });
      }
    }

    return updatedProject;
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

// Toggles Project Publish Status
const toggleProjectPublishStatus = async (id) => {
  return await prisma.$transaction(async (tx) => {
    
    // Check if project exists
    const project = await tx.projects.findUnique({
      where: { project_id: parseInt(id) },
    });

    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      throw error;
    }

    // Toggle publish status
    const updatedProject = await tx.projects.update({
      where: { project_id: project.project_id },
      data: { is_published: !project.is_published },
    });

    // If the project is being published
    if (!project.is_published && updatedProject.is_published) {

      // Update publish date
      await tx.projects.update({
        where: { project_id: updatedProject.project_id },
        data: { publication_date: new Date() },
      });

      // Get all users to notify
      const allUsers = await tx.users.findMany({
        select: { user_id: true },
        where: {
          user_type_id: 1, // Assuming 1 is the user type for common users
          user_id: {
            not: updatedProject.creator_id // Exclude the project creator
          }
        }, 
      });

      const notifContent = `¡Nuevo proyecto "${updatedProject.title}"! Dale un vistazo a las vacantes.`;

      // Create notifications in batch for all users
      await createNotificationForMultipleUsers({
        userIds: allUsers.map(u => u.user_id),
        projectId: updatedProject.project_id,
        content: notifContent,
      }, tx);
      
    }

    // Return the final updated project
    const finalProject = await tx.projects.findUnique({
      where: { project_id: project.project_id },
    });

    return finalProject;
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

// Gets crew members associated with a project
const getCrewByProjectId = async (projectId) => {
  return await prisma.crew.findMany({
    where: { project_id: parseInt(projectId) },
    include: {
      users: {
        select: {
          user_id: true,
          email: true,
          first_name: true,
          last_name: true
        }
      },
      roles: {
        select: {
          role_id: true,
          role_name: true
        }
      }
    }
  });
};

// Deletes specific crew members from a project
const deleteCrewByProjectId = async (projectId, userIds) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new Error('User IDs must be provided as a non-empty array');
  }

  return await prisma.crew.deleteMany({
    where: {
      project_id: parseInt(projectId),
      user_id: {
        in: userIds.map(id => parseInt(id))
      }
    }
  });
};

// Updates the format of a project
const updateProjectFormat = async (projectId, formatId) => {
  if (!formatId) {
    throw new Error('Format ID must be provided');
  }

  return await prisma.projects.update({
    where: { project_id: parseInt(projectId) },
    data: { format_id: parseInt(formatId) },
    include: {
      project_formats: true
    }
  });
};

// Updates the genres associated with a project
const updateProjectGenres = async (projectId, genreIds) => {
  if (!Array.isArray(genreIds)) {
    throw new Error('Genre IDs must be provided as an array');
  }

  const parsedProjectId = parseInt(projectId);

  return await prisma.$transaction(async (tx) => {
    // Check if project exists
    const project = await tx.projects.findUnique({
      where: { project_id: parsedProjectId }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Delete existing genre associations
    await tx.project_genres.deleteMany({
      where: { project_id: parsedProjectId }
    });

    // Create new genre associations if genreIds is not empty
    if (genreIds.length > 0) {
      await tx.project_genres.createMany({
        data: genreIds.map(genreId => ({
          project_id: parsedProjectId,
          genre_id: parseInt(genreId)
        }))
      });
    }

    // Return the updated project with genres
    return await tx.projects.findUnique({
      where: { project_id: parsedProjectId },
      include: {
        project_genres: {
          include: {
            genres: true
          }
        }
      }
    });
  });
};

// Updates the classes associated with a project
const updateProjectClasses = async (projectId, classIds) => {
  if (!Array.isArray(classIds)) {
    throw new Error('Class IDs must be provided as an array');
  }

  const parsedProjectId = parseInt(projectId);

  return await prisma.$transaction(async (tx) => {
    // Check if project exists
    const project = await tx.projects.findUnique({
      where: { project_id: parsedProjectId }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Verify that all class IDs exist before proceeding
    if (classIds.length > 0) {
      const existingClasses = await tx.classes.findMany({
        where: {
          class_id: {
            in: classIds
          }
        },
        select: {
          class_id: true
        }
      });

      const validClassIds = existingClasses.map(c => c.class_id);

      if (validClassIds.length !== classIds.length) {
        const invalidIds = classIds.filter(id => !validClassIds.includes(id));
        throw new Error(`The following class IDs do not exist: ${invalidIds.join(', ')}`);
      }
    }

    // Delete existing class associations
    await tx.class_projects.deleteMany({
      where: { project_id: parsedProjectId }
    });

    // Create new class associations if classIds is not empty
    if (classIds.length > 0) {
      await tx.class_projects.createMany({
        data: classIds.map(classId => ({
          project_id: parsedProjectId,
          class_id: classId
        }))
      });
    }

    // Return the updated project with classes
    return await tx.projects.findUnique({
      where: { project_id: parsedProjectId },
      include: {
        class_projects: {
          include: {
            classes: true
          }
        }
      }
    });
  });
};

// Gets all projects where a user is part of the crew
const getProjectsByCrewMemberId = async (userId) => {
  const parsedUserId = parseInt(userId);
 // Get all project_ids where the user is part of the crew
  const crewEntries = await prisma.crew.findMany({
    where: { user_id: parsedUserId },
    select: { project_id: true }
  });

  const projectIds = crewEntries.map(entry => entry.project_id);

  // Fetch all related projects using getProjectById for each project_id

  const projects = await Promise.all(
    projectIds.map(id => getProjectById(id))
  );

  // Filter out any nulls (in case some projects were deleted)
  return projects.filter(project => project);
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectByCreatorId,
  updateProject,
  deleteProject,
  toggleProjectStatus,
  toggleProjectPublishStatus,
  isProjectOwner,
  getCrewByProjectId,
  deleteCrewByProjectId,
  getProjectsByCrewMemberId,
  updateProjectFormat,
  updateProjectGenres,
  updateProjectClasses
};