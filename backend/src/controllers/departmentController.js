const departmentService = require("../services/departmentService");

// GET /departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentService.getAllDepartments();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /departments/:id/roles
const getRolesByDepartmentId = async (req, res) => {
  try {
    const roles = await departmentService.getRolesByDepartmentId(req.params.id);
    if (!roles || roles.length === 0) {
      return res.status(404).json({ error: "No roles found for this department" });
    }
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllDepartments,
  getRolesByDepartmentId
};