import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/MentorMind');
    const users = await User.find({});
    console.log('--- REGISTERED USERS ---');
    users.forEach(u => {
      console.log(`Name: ${u.name} | Email: ${u.email} | Role: ${u.role} | isAdmin: ${u.isAdmin} | Company: ${u.company} | ID: ${u.employeeId}`);
    });
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

listUsers();
