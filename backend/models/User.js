import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { generateEmployeeId } from '../utils/idGenerator.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Team Lead', 'Project Manager', 'Senior Developer', 'Backend Developer', 'Frontend Developer', 'UI/UX Designer', 'DevOps Engineer', 'QA Engineer', 'Data Analyst', 'Product Owner', 'Security Engineer', 'Employee', 'Developer'],
    default: 'Employee'
  },
  skills: [{
    type: String,
    trim: true
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: 'ProManage Inc.'
  },
  avatar: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  experienceLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  currentWorkload: {
    type: Number,
    default: 0,
    min: 0
  },
  availability: {
    type: Boolean,
    default: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  resumeUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate employeeId and hash password before saving
userSchema.pre('save', async function(next) {
  // Generate employeeId if not present
  if (!this.employeeId && this.company) {
    this.employeeId = generateEmployeeId(this.company);
    console.log(`[DEBUG] Generated new employeeId: ${this.employeeId} for company: ${this.company}`);
  } else if (!this.employeeId) {
    // Fallback if company is not provided (though it should be)
    this.employeeId = generateEmployeeId('MM');
    console.log(`[DEBUG] Generated fallback employeeId: ${this.employeeId}`);
  }

  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
