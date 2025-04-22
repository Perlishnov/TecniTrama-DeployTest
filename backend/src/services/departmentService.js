const prisma = require("../models/prismaClient");

// Gets all departments
const getAllDepartments = async () => {
  return await prisma.departments.findMany();
};

// Gets roles associated with a department
const getRolesByDepartmentId = async (departmentId) => {
  const parsedDepartmentId = parseInt(departmentId);
  return await prisma.roles.findMany({
    where: { department_id: parsedDepartmentId }
  });
};

module.exports = {
  getAllDepartments,
  getRolesByDepartmentId
};