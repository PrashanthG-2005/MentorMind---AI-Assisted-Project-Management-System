import User from '../models/User.js';
import { extractProfileFromResume } from '../services/resumeParser.js';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const _pdfModule = require('pdf-parse');
const pdf = _pdfModule.default || _pdfModule;

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ company: req.user.company }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, location, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.location = location || user.location;
    user.avatar = avatar || user.avatar;
    
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      employeeId: updatedUser.employeeId,
      role: updatedUser.role,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
      location: updatedUser.location,
      company: updatedUser.company
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    console.log('[DEBUG] Attempting to delete user with ID:', req.params.id);
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.deleteOne();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Employee (Admin Only)
// @route   POST /api/users/create-employee
// @access  Private/Admin
export const createEmployee = async (req, res) => {
  try {
    const { name, email, employeeId, role, skills } = req.body;

    const userExists = await User.findOne({ 
      $or: [{ email }, { employeeId }] 
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email or ID' });
    }

    // Default password for auto-created users
    const defaultPassword = 'MentorMind@123';

    const user = await User.create({
      name,
      email,
      employeeId: employeeId || undefined, // Allow pre-save hook to generate if missing
      password: defaultPassword,
      role: role || 'Employee',
      skills: skills || [],
      isAdmin: false,
      company: req.user.company // Use the company of the admin who is creating the employee
    });

    res.status(201).json({
      message: 'Employee created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add Member with Resume (Admin Only)
// @route   POST /api/users/add-with-resume
// @access  Private/Admin
export const addMemberWithResume = async (req, res) => {
  try {
    console.log('[DEBUG] Incoming add-with-resume request:', req.body);
    console.log('[DEBUG] File info:', req.file);
    const { name, email } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Extract text from PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    const resumeText = data.text;

    // Parse resume for profile data
    const profile = extractProfileFromResume(resumeText);

    // Default password
    const defaultPassword = 'MentorMind@123';

    // NOTE: For security, log only minimal info and avoid printing passwords.

    console.log('[DEBUG] Creating user with profile:', profile);
    const user = await User.create({
      name,
      email,
      password: defaultPassword,
      role: profile.role,
      skills: profile.skills,
      experienceLevel: profile.experienceLevel,
      resumeUrl: `/uploads/resumes/${req.file.filename}`,
      company: req.user.company || 'ProManage Inc.',
      isAdmin: false
    });
    console.log('[DEBUG] User created successfully:', user._id);

    res.status(201).json({
      message: 'Member added and profiled successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        experienceLevel: user.experienceLevel
      }
    });
  } catch (error) {
    console.error('RESUME UPLOAD ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};
