const prisma = require("../models/prismaClient");
const { createNotification } = require("./notificationService");
const { getVacancyById } = require("./vacancyService");
const { updateVacancyFilledStatus } = require("./vacancyService");
const { addCrewMemberToProject } = require("./projectService");


// Creates Application
const createApplication = async (applicationData) => {
    return await prisma.$transaction(async (tx) => {
        // Creates the application
        const newApplication = await tx.applications.create({
            data: {
                postulant_id: applicationData.postulant_id,
                vacancy_id: applicationData.vacancy_id,
                app_status_id: applicationData.app_status_id,
                motivation_letter: applicationData.motivation_letter || null,
              },
        });

        // Get necessary data for notification
        const vacancy = await getVacancyById(applicationData.vacancy_id, tx);

        const postulant = await tx.users.findUnique({
          where: { user_id: applicationData.postulant_id },
        });

        const project = vacancy.projects;
        const role = vacancy.roles;

        const appStatus = await tx.app_status.findUnique({
          where: { app_status_id: applicationData.app_status_id },
        });

        // Create notification based on application status
        if (appStatus.status === "PENDIENTE") {
          await createNotification({
            userId: project.creator_id,
            projectId: project.project_id,
            content: `${postulant.first_name} ${postulant.last_name} ha solicitado unirse a tu proyecto "${project.title}" como ${role.role_name}.`,
          });
        } else if (appStatus.status === "INVITADO") {
          await createNotification({
            userId: applicationData.postulant_id,
            projectId: project.project_id,
            content: `Has sido invitado al proyecto "${project.title}" como ${role.role_name}. Revisa tu bandeja de solicitudes.`,
          });
        } 
    
        return newApplication;
    });
}

// Gets Application by ID
const getApplicationById = async (applicationId) => {
    return await prisma.applications.findUnique({
        where: {
            app_id: parseInt(applicationId)
        },
        include: {
            vacancies: true,
            users: {
              select: {
                user_id: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            }
        }
    });
}

// Gets Application by Postulant ID
const getApplicationByPostulantId = async (postulantId) => {
    return await prisma.applications.findMany({
        where: {
            postulant_id: parseInt(postulantId)
        },
        include: {
          vacancies: true,
          users: {
            select: {
              user_id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          }
      }
  });
}

// Gets Application by Postulant ID and Application Status ID
const getApplicationsByPostulantAndStatus = async (postulantId, statusId) => {
  return await prisma.applications.findMany({
    where: {
      postulant_id: parseInt(postulantId),
      app_status_id: parseInt(statusId),
    },
    include: {
      app_status: true,
      vacancies: true,
    },
  });
};

// Gets Applications by Project ID
const getApplicationsByProjectId = async (projectId) => {
  return await prisma.applications.findMany({
      where: {
          vacancies: {
              project_id: parseInt(projectId)
          }
      },
      include: {
          vacancies: true,
          users: {
              select: {
                  user_id: true,
                  first_name: true,
                  last_name: true,
                  email: true
              }
          }
      }
  });
}

// Gets Application by Project ID and Application Status ID
const getApplicationsByProjectAndStatus = async (projectId, statusId) => {
  return await prisma.applications.findMany({
    where: {
      vacancies: {
        project_id: parseInt(projectId)
    },
      app_status_id: parseInt(statusId),
    },
    include: {
      app_status: true,
      vacancies: true,
      users: {
        select: {
          user_id: true,
          first_name: true,
          last_name: true,
          email: true,
        },
      },
    },
  });
};

const changeApplicationStatus = async (applicationId, newStatusId) => {
  return await prisma.$transaction(async (tx) => {
    // Get current application and related data
    const application = await tx.applications.findUnique({
      where: { app_id: applicationId },
      include: {
        users: {
          select: {
            user_id: true,
            first_name: true,
            last_name: true,
          },
        },
        vacancies: {
          include: {
            projects: {
              select: {
                project_id: true,
                title: true,
              },
            },
            roles: true,
          },
        },
        app_status: true,
      },
    });

    if (!application) {
      const error = new Error("Application not found");
      error.statusCode = 404;
      throw error;
    }

    // Store previous and new status
    const prevStatus = application.app_status.status;
    const newStatus = await tx.app_status.findUnique({
      where: { app_status_id: newStatusId },
    });

    if (!newStatus) {
      const error = new Error("New status not found");
      error.statusCode = 404;
      throw error;
    }

    // Update the application status
    const updatedApp = await tx.applications.update({
      where: { app_id: applicationId },
      data: { app_status_id: newStatusId },
      include: { app_status: true },
    });

    // If the application is approved, update the vacancy status and add the user to the project
    if (newStatus.status === "APROBADO") {
      // Update vacancy filled status
      await updateVacancyFilledStatus(application.vacancy_id, true, tx);
      
      // Add user to project
      await addCrewMemberToProject(
        application.vacancies.project_id,
        application.postulant_id,
        application.vacancies.role_id,
        tx
      );


    }

    const user = application.users;
    const project = application.vacancies.projects;
    const role = application.vacancies.roles;

    // Conditionally create notification
    if (prevStatus === "PENDIENTE" && ["APROBADO", "RECHAZADO"].includes(newStatus.status)) {
      await createNotification(
        {
          userId: user.user_id,
          projectId: project.project_id,
          content: `Tu solicitud para unirte al proyecto "${project.title}" como ${role.role_name} ha sido ${newStatus.status.toLocaleLowerCase()}.`,
        },
        tx // Transaction client
      );
    }

    if (prevStatus === "INVITADO" && ["APROBADO", "RECHAZADO"].includes(newStatus.status)) {
      await createNotification(
        {
          userId: project.creator_id,
          projectId: project.project_id,
          content: `${user.first_name} ${user.last_name} ha ${newStatus.status.toLowerCase()} la invitación al proyecto "${project.title}".`,
        },
        tx
      );
    }

    return updatedApp;
  });
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