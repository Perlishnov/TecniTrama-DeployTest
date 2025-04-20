const projectService = require("../services/projectService");
const prisma = require("../models/prismaClient");

// Creates a new project
// POST /projects
const createProject = async (req, res) => {
  try {
    const newProject = await projectService.createProject(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gets all projects
// GET /projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gets a single project by ID
// GET /projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gets projects by user ID
// GET /projects/user/:id
const getProjectsByCreatorId = async (req, res) => {
  try {
    const projects = await projectService.getProjectByCreatorId(req.params.id);
    if (!projects) {
      return res.status(404).json({ error: "No projects found for this user" });
    }
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gets all projects where a user is part of the crew
// GET /projects/user/:id/crew
const getProjectsByCrewMemberId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const projects = await projectService.getProjectsByCrewMemberId(userId);

    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: "No projects found where this user is part of the crew" });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Updates a project
// PUT /projects/:id
const updateProject = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProject = await projectService.updateProject(id, req.body);
    res.status(200).json(updatedProject);
  } catch (error) {
    if (error.message === 'Project not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Deletes a project
// DELETE /projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await projectService.deleteProject(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggles project active status
// PATCH /projects/:id/status
const toggleProjectStatus = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const updatedProject = await projectService.toggleProjectStatus(
      req.params.id, 
      req.body.is_active
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggles project publish status
// PATCH /projects/:id/publish
const toggleProjectPublishStatus = async (req, res) => {
  try {
    // Update the project publish status
    const updatedProject = await projectService.toggleProjectPublishStatus(
      req.params.id
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({ error: error.message });
  }
}

  // Gets all genres associated with a project
  // GET /projects/:id/genres
  const getProjectGenres = async (req, res) => {
    try {
      const project = await projectService.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
  
      const projectGenres = await prisma.project_genres.findMany({
        where: { project_id: parseInt(req.params.id) },
        include: {
          genres: {
            select: {
              genre_id: true,
              genre: true
            }
          }
        }
      });
  
      // Transform the data to a more friendly format
      const genres = projectGenres.map(pg => ({
        genre_id: pg.genres.genre_id,
        genre: pg.genres.genre
      }));
  
      res.status(200).json(genres);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Gets all classes associated with a project
// GET /projects/:id/classes
const getProjectClasses = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectClasses = await prisma.class_projects.findMany({
      where: { project_id: parseInt(req.params.id) },
      include: {
        classes: {
          select: {
            class_id: true,
            class_name: true
          }
        }
      }
    });

    // Transform the data to a more friendly format
    const classes = projectClasses.map(pc => ({
      class_id: pc.classes.class_id,
      class_name: pc.classes.class_name
    }));

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gets all formats
// GET /formats?
const getAllFormats = async (req, res) => {
  try {
    const formats = await prisma.project_formats.findMany({
      select: {
        format_id: true,
        format_name: true
      }
    });
    res.status(200).json(formats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gets all formats associated with a project
// GET /projects/:id/formats
const getProjectFormats = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const projectFormats = await prisma.project_formats.findMany({
      where: { project_id: parseInt(req.params.id) },
      include: {
        formats: {
          select: {
            format_id: true,
            format: true
          }
        }
      }
    });

    // Transform the data to a more friendly format
    const formats = projectFormats.map(pf => ({
      format_id: pf.formats.format_id,
      format: pf.formats.format
    }));

    res.status(200).json(formats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Checks if a user is the owner of a project
// GET /projects/:id/isOwner
const isOwner = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const isOwner = await projectService.isProjectOwner(req.params.id, req.user.id);
    res.status(200).json({ isOwner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gets all crew members associated with a project
// GET /projects/:id/crew
const getCrewByProjectId = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const crew = await projectService.getCrewByProjectId(req.params.id);
    res.status(200).json(crew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Deletes specific crew members from a project
// DELETE /projects/:id/crew
const deleteCrewByProjectId = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (!req.body.userIds || !Array.isArray(req.body.userIds) || req.body.userIds.length === 0) {
      return res.status(400).json({ error: "User IDs must be provided as a non-empty array" });
    }

    await projectService.deleteCrewByProjectId(req.params.id, req.body.userIds);
    res.status(200).json({ message: "Crew members removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Updates a project's format
// PATCH /projects/:id/format
const updateProjectFormat = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (!req.body.format_id) {
      return res.status(400).json({ error: "Format ID must be provided" });
    }

    const updatedProject = await projectService.updateProjectFormat(
      req.params.id,
      req.body.format_id
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Updates genres associated with a project
// PUT /projects/:id/genres
const updateProjectGenres = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (!req.body.genre_ids || !Array.isArray(req.body.genre_ids)) {
      return res.status(400).json({ error: "Genre IDs must be provided as an array" });
    }

    const updatedProject = await projectService.updateProjectGenres(
      req.params.id,
      req.body.genre_ids
    );

    // Format data to match frontend structure
    const genres = updatedProject.project_genres.map(pg => ({
      genre_id: pg.genres.genre_id,
      genre: pg.genres.genre
    }));

    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Updates classes associated with a project
// PUT /projects/:id/classes
const updateProjectClasses = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (!req.body.class_ids || !Array.isArray(req.body.class_ids)) {
      return res.status(400).json({ error: "Class IDs must be provided as an array" });
    }

    const updatedProject = await projectService.updateProjectClasses(
      req.params.id,
      req.body.class_ids
    );

    // Format data to match frontend structure
    const classes = updatedProject.class_projects.map(pc => ({
      class_id: pc.classes.class_id,
      class_name: pc.classes.class_name
    }));

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectsByCreatorId,
  updateProject,
  deleteProject,
  toggleProjectStatus,
  toggleProjectPublishStatus,
  getProjectGenres,
  getProjectClasses,
  getProjectFormats,
  getProjectsByCrewMemberId,
  getAllFormats,
  isOwner,
  getCrewByProjectId,
  deleteCrewByProjectId,
  updateProjectFormat,
  updateProjectGenres,
  updateProjectClasses
};