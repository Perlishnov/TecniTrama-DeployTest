const vacancyService = require("../services/vacancyService");

// Creates a new vacancy
// POST /vacancies
const createVacancy = async (req, res) => {
  try {
    const newVacancy = await vacancyService.createVacancy(req.body);
    res.status(201).json(newVacancy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gets all vacancies by project ID
// GET /vacancies/:project_id
const getVacanciesByProjectId = async (req, res) => {
  try {
    const vacancies = await vacancyService.getVacanciesByProjectId(req.params.project_id);
    res.status(200).json(vacancies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gets a single vacancy by ID
// GET /vacancies/:id
const getVacancyById = async (req, res) => {
  try {
    const vacancy = await vacancyService.getVacancyById(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }
    res.status(200).json(vacancy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Updates a vacancy
// PUT /vacancies/:id
const updateVacancy = async (req, res) => {
  try {
    const vacancy = await vacancyService.getVacancyById(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }

    const updatedVacancy = await vacancyService.updateVacancy(req.params.id, req.body);
    res.status(200).json(updatedVacancy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletes a vacancy
// DELETE /vacancies/:id
const deleteVacancy = async (req, res) => {
  try {
    const vacancy = await vacancyService.getVacancyById(req.params.id);
    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }

    await vacancyService.deleteVacancy(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gets all vacancies
// GET /vacancies
const getAllVacancies = async (req, res) => {
  try {
    const vacancies = await vacancyService.getAllVacancies();
    res.status(200).json(vacancies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createVacancy,
  getAllVacancies,
  getVacanciesByProjectId,
  getVacancyById,
  updateVacancy,
  deleteVacancy
};