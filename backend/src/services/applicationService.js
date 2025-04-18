const prisma = require('../prismaClient');

// Creates Application
const createApplication = async (applicationData) => {
    return await prisma.$transaction(async (tx) => {
        // Creates the application
        const newApplication = await tx.applications.create({
            data: {
                postulant_id: data.postulant_id,
                vacancy_id: data.vacancy_id,
                app_status_id: data.app_status_id,
                motivation_letter: data.motivation_letter || null,
              },
        });
    
        return newApplication;
    });
}

// Gets Application by ID
const getApplicationById = async (applicationId) => {
    return await prisma.applications.findUnique({
        where: {
            application_id: parseInt(applicationId)
        },
        include: {
            projects: true,
            users: true
        }
    });
}

// Gets Application by Postulant ID
const getApplicationByPostulantId = async (postulantId) => {
    return await prisma.applications.findMany({
        where: {
            user_id: parseInt(postulantId)
        },
        include: {
            projects: true,
            users: true
        }
    });
}

// Gets Application by Postulant ID and Application Status ID
const getApplicationsByPostulantAndStatus = async (postulantId, statusId) => {
  return await prisma.applications.findMany({
    where: {
      postulant_id: postulantId,
      app_status_id: statusId,
    },
    include: {
      app_status: true,
      vacancies: true,
    },
  });
};

// Gets Application by Project ID
const getApplicationByProjectId = async (projectId) => {
    return await prisma.applications.findMany({
        where: {
            project_id: parseInt(projectId)
        },
        include: {
            projects: true,
            users: true
        }
    });
}

// Gets Application by Project ID and Application Status ID
const getApplicationsByProjectAndStatus = async (projectId, statusId) => {
  return await prisma.applications.findMany({
    where: {
      project_id: projectId,
      app_status_id: statusId,
    },
    include: {
      app_status: true,
      vacancies: true,
      users: true,
    },
  });
};

module.exports = {
    createApplication,
    getApplicationById,
    getApplicationByPostulantId,
    getApplicationsByPostulantAndStatus,
    getApplicationByProjectId,
    getApplicationsByProjectAndStatus
};



