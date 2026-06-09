import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const checkUserDetails = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/MentorMind');
    const user = await User.findOne({ name: /Srii/i });
    if (user) {
      console.log('--- USER DETAILS: Srii ---');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('User not found');
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkUserDetails();
