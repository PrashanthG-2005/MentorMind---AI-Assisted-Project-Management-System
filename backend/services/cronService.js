import cron from 'node-cron';
import nodemailer from 'nodemailer';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});

export const initCronJobs = () => {
  // Run every day at 17:00 (5 PM)
  // '0 17 * * *'
  cron.schedule('0 17 * * *', async () => {
    console.log('Running daily project status reports...');
    try {
      // Find all active projects
      const activeProjects = await Project.find({ status: { $nin: ['Completed'] } }).populate('owner', 'name email');

      for (const project of activeProjects) {
        // Get tasks for this project
        const tasks = await Task.find({ project: project._id });
        
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'Completed').length;
        const pending = tasks.filter(t => t.status !== 'Completed').length;
        
        // Find tasks completed today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayCompleted = tasks.filter(t => 
          t.status === 'Completed' && 
          t.updatedAt && 
          new Date(t.updatedAt) >= today
        );
        
        // Find delayed tasks
        const delayed = tasks.filter(t => 
          t.status !== 'Completed' && 
          t.dueDate && 
          new Date(t.dueDate) < new Date()
        );

        // Generate email HTML
        const html = `
          <h2>Daily Status Report: ${project.title}</h2>
          <p>Hello ${project.owner.name},</p>
          <p>Here is the daily overview for your project.</p>
          
          <h3>Summary</h3>
          <ul>
            <li><strong>Total Tasks:</strong> ${total}</li>
            <li><strong>Tasks Pending:</strong> ${pending}</li>
            <li><strong>Tasks Completed OVERALL:</strong> ${completed}</li>
          </ul>

          <h3>Activity Today</h3>
          <ul>
            <li><strong>Tasks Completed Today:</strong> ${todayCompleted.length}</li>
          </ul>

          ${delayed.length > 0 ? `
            <h3 style="color: red;">⚠️ Delayed Tasks (${delayed.length})</h3>
            <ul>
              ${delayed.map(task => `<li>${task.title} (Due: ${new Date(task.dueDate).toLocaleDateString()})</li>`).join('')}
            </ul>
          ` : ''}

          <br/>
          <p>Best regards,<br/>MentorMind System</p>
        `;

        if (process.env.SMTP_USER) {
          await transporter.sendMail({
            from: '"MentorMind System" <no-reply@mentormind.com>',
            to: project.owner.email,
            subject: `Daily Project Report: ${project.title}`,
            html: html,
          });
          console.log(`Sent daily report to ${project.owner.email} for project ${project._id}`);
        } else {
          console.log(`Email feature disabled (No SMTP_USER in .env). Would have sent to ${project.owner.email}:\n`, html);
        }
      }
    } catch (error) {
      console.error('Error running daily cron job:', error);
    }
  });

  console.log('Cron jobs initialized successfully');
};
