import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const checkAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/MentorMind');
    const users = await User.find({});
    console.log(`Total Users: ${users.length}`);
    users.forEach(u => console.log(`${u._id} | ${u.name} | ${u.email}`));
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkAllUsers();
