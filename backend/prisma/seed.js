const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Check if user types already exist
    const existingUserTypes = await prisma.user_types.findMany();
    
    if (existingUserTypes.length === 0) {
      console.log('Seeding user types...');
      
      // Create default user types
      const userTypes = [
        { type: 'Student' },
        { type: 'Professor' },
        { type: 'Administrator' }
      ];
      
      for (const userType of userTypes) {
        await prisma.user_types.create({
          data: userType
        });
      }
      
      console.log('User types seeded successfully!');
    } else {
      console.log('User types already exist, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding user types:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();