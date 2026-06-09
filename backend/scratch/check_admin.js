import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/MentorMind');
    const user = await User.findOne({ email: 'suresh23112004@gmail.com' });
    if (user) {
      console.log(`User: ${user.name} | isAdmin: ${user.isAdmin}`);
    } else {
      console.log('User not found');
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkAdmin();
