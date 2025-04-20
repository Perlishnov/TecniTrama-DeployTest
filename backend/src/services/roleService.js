const prisma = require("../models/prismaClient");

// Gets the department related to a role
const getDepartmentByRoleId = async (roleId) => {
  const parsedRoleId = parseInt(roleId);

  const role = await prisma.roles.findUnique({
    where: { role_id: parsedRoleId },
    include: {
      departments: true
    }
  });

  if (!role || !role.departments) {
    return null;
  }

  return role.departments;
};

module.exports = {
  getDepartmentByRoleId
};