const prisma = require('../models/prismaClient');

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await prisma.profiles.findMany({
      select: {
        profile_id: true,
        experience: true,
        carreer: true,
        bio: true,
        profile_image: true,
      }
    });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profiles.findUnique({
      where: { profile_id: Number(id) },
      include: {
        users: true
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfileByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profiles.findUnique({
      where: { user_id: Number(id) },
      include: {
        users: true
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { experience, carreer, bio, profile_image } = req.body;

    // Check if profile exists
    const profileExists = await prisma.profiles.findUnique({
      where: { profile_id: Number(id) }
    });

    if (!profileExists) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const updatedProfile = await prisma.profiles.update({
      where: { profile_id: Number(id) },
      data: {
        experience: experience !== undefined ? experience : undefined,
        carreer: carreer !== undefined ? carreer : undefined,
        bio: bio !== undefined ? bio : undefined,
        profile_image: profile_image !== undefined ? profile_image : undefined
      },
      include: {
        users: true
      }
    });

    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if profile exists
    const profileExists = await prisma.profiles.findUnique({
      where: { profile_id: Number(id) }
    });
    
    if (!profileExists) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    await prisma.profiles.delete({
      where: { profile_id: Number(id) }
    });


    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllProfiles,
  getProfileById,
  getProfileByUserId,
  updateProfile,
  deleteProfile
};