import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/MentorMind');
    const user = await User.findOne({ email: 'prashanth95286@gmail.com' });
    if (user) {
      user.password = 'password123';
      await user.save();
      console.log('Password reset successfully! Employee ID:', user.employeeId);
    } else {
      console.log('Admin user not found');
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

resetPassword();
