//Los modelos creados con prisma se encuentran en el schema de prisma,
//para poder acceder a ellos se necesita instanciar un objeto de PrismaClient
// Uso: const prisma = require('./src/models/prismaClient');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;