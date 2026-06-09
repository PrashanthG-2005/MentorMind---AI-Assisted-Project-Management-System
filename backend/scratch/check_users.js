import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/MentorMind');
    const users = await User.find({}, 'name email role company');
    console.log('--- USER LIST ---');
    console.log(JSON.stringify(users, null, 2));
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkUsers();
