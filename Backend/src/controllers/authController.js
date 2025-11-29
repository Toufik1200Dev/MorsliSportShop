import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// Admin credentials (hardcoded for security)
const ADMIN_EMAIL = 'morslisport97@gmail.com';
const ADMIN_PASSWORD = 'MorsliSport99@T';

// @desc    Admin login only
// @route   POST /api/auth/login
// @access  Public (but only admin can login)
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    // Check if it's the admin email
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Verify admin password
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if admin user exists in database, if not create it
    let adminUser = await User.findOne({ email: ADMIN_EMAIL });

    if (!adminUser) {
      // Create admin user in database
      adminUser = await User.create({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD, // Will be hashed by pre-save hook
        role: 'admin',
        name: 'Admin',
      });
    } else {
      // Ensure the user has admin role
      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
      }
    }

    // Generate token
    const token = generateToken(adminUser._id);

    res.status(200).json({
      success: true,
      token,
      data: {
        id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name,
        role: 'admin',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    // JWT is stateless, so logout is handled client-side by removing token
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

