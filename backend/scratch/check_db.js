import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

dotenv.config();

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/MentorMind');
    
    const users = await User.find({}, 'name email role company');
    const projects = await Project.find({}, 'title status company');
    const tasks = await Task.find({}, 'title status project');
    
    console.log('--- DB SUMMARY ---');
    console.log(`Users: ${users.length}`);
    console.log(JSON.stringify(users, null, 2));
    
    console.log(`\nProjects: ${projects.length}`);
    console.log(JSON.stringify(projects, null, 2));
    
    console.log(`\nTasks: ${tasks.length}`);
    console.log(JSON.stringify(tasks, null, 2));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkDB();
