const roleService = require("../services/roleService");

// GET /roles/:id/department
const getDepartmentByRoleId = async (req, res) => {
  try {
    const department = await roleService.getDepartmentByRoleId(req.params.id);
    if (!department) {
      return res.status(404).json({ error: "Department not found for this role" });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDepartmentByRoleId
};