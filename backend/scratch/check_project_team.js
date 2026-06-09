import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';

dotenv.config();

const checkProjectTeam = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/MentorMind');
    
    const project = await Project.findOne({ title: /ShopSphere/i });
    if (project) {
      console.log(`--- PROJECT TEAM: ${project.title} ---`);
      console.log(JSON.stringify(project.team, null, 2));
    } else {
      console.log('Project not found');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkProjectTeam();
