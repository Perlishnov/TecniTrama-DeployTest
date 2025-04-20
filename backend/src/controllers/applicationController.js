const { parse } = require('dotenv');
const applicationService = require('../services/applicationService');

// Creates Application
// POST /applications
const createApplication = async (req, res) => {
    try {
        const newApplication = await applicationService.createApplication(req.body);
        res.status(201).json(newApplication);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Gets Application by ID
// GET /applications/:id
const getApplicationById = async (req, res) => {
    try {
        const application = await applicationService.getApplicationById(req.params.id);
        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Gets Application by Postulant ID
// GET /applications/postulant/:id
const getApplicationByPostulantId = async (req, res) => {
    try {
        const applications = await applicationService.getApplicationByPostulantId(req.params.id);
        if (!applications) {
            return res.status(404).json({ error: "No applications found for this postulant" });
        }
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Gets Application by Postulant ID and Application Status ID
// GET /applications/postulant/:postulantId/status/:statusId
const getApplicationsByPostulantAndStatus = async (req, res) => {
    try {
        const { postulantId, statusId } = req.params;
        const applications = await applicationService.getApplicationsByPostulantAndStatus(postulantId, statusId);
        if (!applications) {
            return res.status(404).json({ error: "No applications found for this postulant and status" });
        }
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Gets Application by Project ID
// GET /applications/project/:id
const getApplicationsByProjectId = async (req, res) => {
    try {
        const applications = await applicationService.getApplicationsByProjectId(req.params.id);
        if (!applications) {
            return res.status(404).json({ error: "No applications found for this project" });
        }
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Gets Application by Project ID and Application Status ID
// GET /applications/project/:projectId/status/:statusId
const getApplicationsByProjectAndStatus = async (req, res) => {
    try {
        const { projectId, statusId } = req.params;
        const applications = await applicationService.getApplicationsByProjectAndStatus(projectId, statusId);
        if (!applications) {
            return res.status(404).json({ error: "No applications found for this project and status" });
        }
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Changes Application Status
// PATCH /applications/:appId/status/:statusId
const changeApplicationStatus = async (req, res) => {
    try {
      const applicationId = parseInt(req.params.appId, 10);
      const newStatusId = parseInt(req.params.statusId, 10);             
  
      const updatedApp = await applicationService.changeApplicationStatus(
        applicationId,
        parseInt(newStatusId, 10)
      );
  
      res.status(200).json(updatedApp);
    } catch (error) {
        if (error.statusCode === 404) {
            res.status(404).json({ error: error.message });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
    }
  };
  

module.exports = {
    createApplication,
    getApplicationById,
    getApplicationByPostulantId,
    getApplicationsByPostulantAndStatus,
    getApplicationsByProjectId,
    getApplicationsByProjectAndStatus,
    changeApplicationStatus
};