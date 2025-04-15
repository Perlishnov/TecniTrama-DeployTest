// const bcrypt = require('bcryptjs'); // Removed in favor of hash utility
const hash = require('../utils/hash')
const { generateToken } = require('../services/authService');
const prisma = require('../models/prismaClient');
const { StreamChat } = require('stream-chat');

const streamApiKey = process.env.STREAM_API_KEY;
const streamApiSecret = process.env.STREAM_API_SECRET;
const streamClient = StreamChat.getInstance(streamApiKey, streamApiSecret);

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone_num: true,
        registration_date: true,
        is_active: true,
        user_type_id: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get user by ID (with profile info)
const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone_num: true,
        registration_date: true,
        is_active: true,
        user_type_id: true,
        profiles: {
          select: {
            profile_id: true,
            experience: true,
            carreer: true,
            bio: true,
            profile_image: true,
            profile_interest: {
              select: {
                interest_id: true,
                interests: {
                  select: {
                    interest_name: true
                  }
                }
              }
            },
            profile_roles: {
              select: {
                role_id: true,
                roles: {
                  select: {
                    role_name: true,
                    responsibilities: true,
                    department_id: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};


// Register new user
const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone_num, user_type_id } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email || !password || !user_type_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email ends with @est.intec.edu.do
    if (!email.endsWith('@est.intec.edu.do')) {
      return res.status(400).json({ message: 'Email must end with @est.intec.edu.do' });
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Validate user_type_id exists
    const userTypeExists = await prisma.user_types.findUnique({
      where: { user_type_id: parseInt(user_type_id) }
    });

    if (!userTypeExists) {
      // Fetch all valid user types to include in the error message
      const validUserTypes = await prisma.user_types.findMany({
        select: {
          user_type_id: true,
          type: true
        }
      });

      return res.status(400).json({ 
        message: 'Invalid user type selected', 
        validUserTypes: validUserTypes 
      });
    }

    // Hash password using utility
    const hashedPassword = await hash.hashPassword(password);

    // Use transaction to create user and profile atomically
    const result = await prisma.$transaction(async (prisma) => {
      // Create new user
      const newUser = await prisma.users.create({
        data: {
          first_name,
          last_name,
          email,
          password: hashedPassword,
          phone_num,
          user_type_id: parseInt(user_type_id),
          is_active: true
        }
      });

      // Create empty profile for the new user
      await prisma.profiles.create({
        data: {
          user_id: newUser.user_id,
          experience: null,
          carreer: null,
          bio: null,
          profile_image: null
        }
      });

      return newUser;
    });

    // Create JWT token
    const token = generateToken({ id: result.user_id, email: result.email });
    const streamToken = streamClient.createToken(user.user_id.toString());
    res.status(201).json({
      message: 'User registered successfully with empty profile',
      token,
      streamToken,
      user: {
        user_id: result.user_id,
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(400).json({ message: 'Account is inactive' });
    }

    // Verify password using utility
    const isPasswordValid = await hash.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = generateToken({ id: user.user_id, email: user.email, user_type_id: user.user_type_id });
    const streamToken = streamClient.createToken(user.user_id.toString());
    res.json({
      message: 'Login successful',
      token,
      streamToken,
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { oldPassword, newPassword } = req.body;

    // Validate required fields
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new passwords are required' });
    }

    // Find user by ID
    const user = await prisma.users.findUnique({
      where: { user_id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify old password using utility
    const isOldPasswordValid = await hash.comparePassword(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: 'Invalid old password' });
    }

    // Hash new password using utility
    const hashedNewPassword = await hash.hashPassword(newPassword);

    // Update password
    await prisma.users.update({
      where: { user_id: userId },
      data: { password: hashedNewPassword }
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
}

// Update user
const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { first_name, last_name, email, phone_num, is_active, user_type_id, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { user_id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { user_id: userId },
      data: {
        first_name: first_name || existingUser.first_name,
        last_name: last_name || existingUser.last_name,
        email: email || existingUser.email,
        phone_num: phone_num || existingUser.phone_num,
        is_active: is_active !== undefined ? is_active : existingUser.is_active,
        user_type_id: user_type_id ? parseInt(user_type_id) : existingUser.user_type_id,
        password: password ? await hash.hashPassword(password) : existingUser.password
      }
    });

    res.json({
      message: 'User updated successfully',
      user: {
        user_id: updatedUser.user_id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        is_active: updatedUser.is_active,
        password: updatedUser.password,
        user_type_id: updatedUser.user_type_id
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { user_id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await prisma.users.delete({
      where: { user_id: userId }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

module.exports = {

  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  updateUser,
  changePassword,
  deleteUser
};