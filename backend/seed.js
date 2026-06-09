import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';
import Invite from './models/Invite.js';
import Notification from './models/Notification.js';

// Load environment variables
dotenv.config();

const usersData = [
  {
    name: 'Suresh Kumar',
    email: 'suresh@company.com',
    password: 'password123',
    employeeId: 'EMP001',
    role: 'Project Manager',
    company: 'ProManage Inc.',
    isAdmin: true,
    skills: ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Risk Management'],
    experienceLevel: 8,
    availability: true
  },
  {
    name: 'Arun Kumar',
    email: 'arun@company.com',
    password: 'password123',
    employeeId: 'EMP002',
    role: 'Senior Developer',
    company: 'ProManage Inc.',
    skills: ['Node.js', 'React', 'MongoDB', 'System Architecture', 'JavaScript', 'TypeScript'],
    experienceLevel: 7,
    availability: true
  },
  {
    name: 'Priya Sharma',
    email: 'priya@company.com',
    password: 'password123',
    employeeId: 'EMP003',
    role: 'UI/UX Designer',
    company: 'ProManage Inc.',
    skills: ['Figma', 'Wireframing', 'User Research', 'Prototyping', 'Adobe XD'],
    experienceLevel: 5,
    availability: true
  },
  {
    name: 'Kumar Swamy',
    email: 'kumar@company.com',
    password: 'password123',
    employeeId: 'EMP004',
    role: 'Backend Developer',
    company: 'ProManage Inc.',
    skills: ['Node.js', 'Express', 'MongoDB', 'SQL', 'APIs', 'Redis'],
    experienceLevel: 4,
    availability: true
  },
  {
    name: 'Anitha Reddy',
    email: 'anitha@company.com',
    password: 'password123',
    employeeId: 'EMP005',
    role: 'DevOps Engineer',
    company: 'ProManage Inc.',
    skills: ['Docker', 'AWS', 'CI/CD', 'Kubernetes', 'Linux', 'Terraform'],
    experienceLevel: 6,
    availability: true
  },
  {
    name: 'Vijay Singh',
    email: 'vijay@company.com',
    password: 'password123',
    employeeId: 'EMP006',
    role: 'QA Engineer',
    company: 'ProManage Inc.',
    skills: ['Selenium', 'Jest', 'Manual Testing', 'Automation', 'Cypress'],
    experienceLevel: 3,
    availability: true
  },
  {
    name: 'Divya Patel',
    email: 'divya@company.com',
    password: 'password123',
    employeeId: 'EMP007',
    role: 'Frontend Developer',
    company: 'ProManage Inc.',
    skills: ['React', 'HTML', 'CSS', 'JavaScript', 'Tailwind', 'Redux'],
    experienceLevel: 3,
    availability: true
  },
  {
    name: 'Raghav Rao',
    email: 'raghav@company.com',
    password: 'password123',
    employeeId: 'EMP008',
    role: 'Data Analyst',
    company: 'ProManage Inc.',
    skills: ['Python', 'SQL', 'Tableau', 'Excel', 'Data Analysis', 'Pandas'],
    experienceLevel: 4,
    availability: true
  },
  {
    name: 'Kavitha Ram',
    email: 'kavitha@company.com',
    password: 'password123',
    employeeId: 'EMP009',
    role: 'Product Owner',
    company: 'ProManage Inc.',
    skills: ['Product Strategy', 'Roadmapping', 'Agile', 'Requirements', 'Jira'],
    experienceLevel: 6,
    availability: true
  },
  {
    name: 'Mohan Das',
    email: 'mohan@company.com',
    password: 'password123',
    employeeId: 'EMP010',
    role: 'Security Engineer',
    company: 'ProManage Inc.',
    skills: ['Penetration Testing', 'OAuth', 'SSL/TLS', 'Security Audits', 'Cryptography'],
    experienceLevel: 5,
    availability: true
  }
];

const seedDB = async () => {
  try {
    // 1. Connect to DB
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);

    // 2. Clear Existing Data
    console.log('Clearing old collections...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Invite.deleteMany({});
    await Notification.deleteMany({});
    console.log('Database collections cleared.');

    // 3. Seed Users
    console.log('Seeding users...');
    // We use User.create instead of insertMany to ensure schema pre-save hooks (like password hashing) are fired.
    const users = await User.create(usersData);
    console.log(`Successfully seeded ${users.length} users.`);

    // Helper map of email to user object
    const userMap = {};
    users.forEach(u => {
      userMap[u.email] = u;
    });

    const suresh = userMap['suresh@company.com'];
    const arun = userMap['arun@company.com'];
    const priya = userMap['priya@company.com'];
    const kumar = userMap['kumar@company.com'];
    const anitha = userMap['anitha@company.com'];
    const vijay = userMap['vijay@company.com'];
    const divya = userMap['divya@company.com'];
    const raghav = userMap['raghav@company.com'];
    const kavitha = userMap['kavitha@company.com'];
    const mohan = userMap['mohan@company.com'];

    // Helper date utility
    const daysFromNow = (days) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d;
    };

    // 4. Seed Projects
    console.log('Seeding projects...');
    const projectsData = [
      {
        title: 'Enterprise Cloud Migration',
        description: 'Migrating the core legacy infrastructure to AWS cloud to improve scalability, reliability, and security.',
        category: 'Web Development',
        status: 'On Track',
        priority: 'High',
        progress: 45,
        startDate: daysFromNow(-30),
        dueDate: daysFromNow(60),
        tags: ['AWS', 'Migration', 'Infrastructure'],
        company: 'ProManage Inc.',
        requiredRoles: [
          { role: 'DevOps Engineer', count: 1, description: 'Required to setup terraform and CI/CD pipelines' },
          { role: 'Security Engineer', count: 1, description: 'Required for security auditing' }
        ],
        team: [
          { user: suresh._id, role: 'Project Manager', assessmentStatus: 'Completed', assessmentScore: 90 },
          { user: anitha._id, role: 'DevOps Engineer', assessmentStatus: 'Completed', assessmentScore: 85 },
          { user: mohan._id, role: 'Security Engineer', assessmentStatus: 'Completed', assessmentScore: 88 }
        ],
        owner: suresh._id
      },
      {
        title: 'ProManage Mobile App',
        description: 'Building the iOS and Android mobile applications using React Native for on-the-go project tracking.',
        category: 'Mobile App',
        status: 'Not Started',
        priority: 'Medium',
        progress: 0,
        startDate: daysFromNow(5),
        dueDate: daysFromNow(120),
        tags: ['React Native', 'Mobile', 'iOS', 'Android'],
        company: 'ProManage Inc.',
        requiredRoles: [
          { role: 'UI/UX Designer', count: 1, description: 'Design mobile views and user flow' },
          { role: 'Senior Developer', count: 1, description: 'Lead engineer for react native codebase' },
          { role: 'Frontend Developer', count: 1, description: 'Implement design templates' }
        ],
        team: [
          { user: suresh._id, role: 'Project Manager', assessmentStatus: 'Completed', assessmentScore: 92 },
          { user: priya._id, role: 'UI/UX Designer', assessmentStatus: 'Pending', assessmentScore: 0 },
          { user: arun._id, role: 'Senior Developer', assessmentStatus: 'Completed', assessmentScore: 95 },
          { user: divya._id, role: 'Frontend Developer', assessmentStatus: 'Completed', assessmentScore: 82 }
        ],
        owner: suresh._id
      },
      {
        title: 'Customer Portal UI/UX Redesign',
        description: 'Redesigning the user journey and visual elements of the customer portal to boost engagement and reduce churn.',
        category: 'UI/UX Design',
        status: 'At Risk',
        priority: 'High',
        progress: 15,
        startDate: daysFromNow(-15),
        dueDate: daysFromNow(20),
        tags: ['Figma', 'UI/UX', 'Customer Portal'],
        company: 'ProManage Inc.',
        requiredRoles: [
          { role: 'UI/UX Designer', count: 1, description: 'Lead designer for user journey map' },
          { role: 'Frontend Developer', count: 1, description: 'Convert Figma mockup to React components' }
        ],
        team: [
          { user: kavitha._id, role: 'Product Owner', assessmentStatus: 'Completed', assessmentScore: 91 },
          { user: priya._id, role: 'UI/UX Designer', assessmentStatus: 'Completed', assessmentScore: 94 },
          { user: divya._id, role: 'Frontend Developer', assessmentStatus: 'Completed', assessmentScore: 80 }
        ],
        owner: kavitha._id
      },
      {
        title: 'AI-Powered Talent Matching System',
        description: 'Developing an intelligent recommendation model to automatically match employees to project tasks based on skills and workload.',
        category: 'Data Science',
        status: 'Delayed',
        priority: 'Urgent',
        progress: 30,
        startDate: daysFromNow(-40),
        dueDate: daysFromNow(30),
        tags: ['AI', 'Python', 'Machine Learning'],
        company: 'ProManage Inc.',
        requiredRoles: [
          { role: 'Data Analyst', count: 1, description: 'Develop recommendation system model' },
          { role: 'Backend Developer', count: 1, description: 'API creation and integration' }
        ],
        team: [
          { user: suresh._id, role: 'Project Manager', assessmentStatus: 'Completed', assessmentScore: 88 },
          { user: raghav._id, role: 'Data Analyst', assessmentStatus: 'Completed', assessmentScore: 89 },
          { user: kumar._id, role: 'Backend Developer', assessmentStatus: 'Completed', assessmentScore: 84 }
        ],
        owner: suresh._id
      },
      {
        title: 'Automated E2E Testing Suite',
        description: 'Setting up a robust end-to-end automated testing pipeline using Cypress and Selenium to ensure high code quality.',
        category: 'Other',
        status: 'Completed',
        priority: 'Low',
        progress: 100,
        startDate: daysFromNow(-25),
        dueDate: daysFromNow(-3),
        tags: ['QA', 'Testing', 'Automation'],
        company: 'ProManage Inc.',
        requiredRoles: [
          { role: 'QA Engineer', count: 1, description: 'Setup cypress tests for backend/frontend' }
        ],
        team: [
          { user: suresh._id, role: 'Project Manager', assessmentStatus: 'Completed', assessmentScore: 87 },
          { user: vijay._id, role: 'QA Engineer', assessmentStatus: 'Completed', assessmentScore: 92 }
        ],
        owner: suresh._id
      }
    ];

    const projects = await Project.create(projectsData);
    console.log(`Successfully seeded ${projects.length} projects.`);

    const cloudProj = projects[0];
    const mobileProj = projects[1];
    const uiRedesignProj = projects[2];
    const aiProj = projects[3];
    const testingProj = projects[4];

    // 5. Seed Tasks
    console.log('Seeding tasks...');
    const tasksData = [
      {
        title: 'Setup AWS VPC and Subnets',
        description: 'Configure the virtual private cloud, public/private subnets, and internet gateway for the cloud environment.',
        status: 'Completed',
        priority: 'high',
        requiredSkills: ['AWS', 'Linux'],
        dueDate: daysFromNow(-14),
        project: cloudProj._id,
        assignees: [anitha._id],
        createdBy: suresh._id,
        confirmedByMember: true,
        tags: ['AWS', 'Network']
      },
      {
        title: 'Configure IAM Policies & Roles',
        description: 'Establish role-based access control and secure AWS API access for all services.',
        status: 'In-Progress',
        priority: 'high',
        requiredSkills: ['AWS', 'Security Audits'],
        dueDate: daysFromNow(7),
        project: cloudProj._id,
        assignees: [anitha._id, mohan._id],
        createdBy: suresh._id,
        confirmedByMember: true,
        tags: ['Security', 'AWS']
      },
      {
        title: 'Design Wireframes for mobile login & dashboard',
        description: 'Create interactive high-fidelity wireframes in Figma for the initial user authentication flow.',
        status: 'Awaiting-Confirmation',
        priority: 'medium',
        requiredSkills: ['Figma', 'Wireframing'],
        dueDate: daysFromNow(20),
        project: mobileProj._id,
        assignees: [priya._id],
        createdBy: suresh._id,
        confirmedByMember: false,
        tags: ['Design', 'Figma']
      },
      {
        title: 'Setup React Native codebase template',
        description: 'Initialize the repository with typescript, linting, routing, and shared component folder structures.',
        status: 'Pending',
        priority: 'medium',
        requiredSkills: ['React', 'JavaScript'],
        dueDate: daysFromNow(45),
        project: mobileProj._id,
        assignees: [arun._id],
        createdBy: suresh._id,
        confirmedByMember: false,
        tags: ['Mobile', 'React Native']
      },
      {
        title: 'Conduct customer feedback survey',
        description: 'Interview 15 active users to collect pain points regarding the current portal layout.',
        status: 'Completed',
        priority: 'medium',
        requiredSkills: ['User Research'],
        dueDate: daysFromNow(-7),
        project: uiRedesignProj._id,
        assignees: [priya._id],
        createdBy: kavitha._id,
        confirmedByMember: true,
        tags: ['Research', 'Feedback']
      },
      {
        title: 'Develop prototype for new navigation bar',
        description: 'Create an interactive prototype demonstrating the responsive sidebar navigation.',
        status: 'Under-Review',
        priority: 'high',
        requiredSkills: ['Figma', 'Prototyping'],
        dueDate: daysFromNow(3),
        project: uiRedesignProj._id,
        assignees: [priya._id],
        createdBy: kavitha._id,
        confirmedByMember: true,
        tags: ['Figma', 'Prototype']
      },
      {
        title: 'Clean and preprocess historical assignment data',
        description: 'Write a python script to clean task history, remove null values, and prepare feature vectors.',
        status: 'Completed',
        priority: 'medium',
        requiredSkills: ['Python', 'Data Analysis'],
        dueDate: daysFromNow(-14),
        project: aiProj._id,
        assignees: [raghav._id],
        createdBy: suresh._id,
        confirmedByMember: true,
        tags: ['Python', 'Data cleaning']
      },
      {
        title: 'Train basic recommendation model',
        description: 'Use a collaborative filtering or classification approach to draft the auto-assigner model.',
        status: 'In-Progress',
        priority: 'high',
        requiredSkills: ['Python', 'Data Analysis'],
        dueDate: daysFromNow(14),
        project: aiProj._id,
        assignees: [raghav._id],
        createdBy: suresh._id,
        confirmedByMember: true,
        tags: ['AI', 'Python']
      },
      {
        title: 'Integrate model with backend API',
        description: 'Expose an API endpoint in Express that accepts task ID and returns recommended employee IDs.',
        status: 'Pending',
        priority: 'medium',
        requiredSkills: ['Node.js', 'Express', 'MongoDB'],
        dueDate: daysFromNow(21),
        project: aiProj._id,
        assignees: [kumar._id],
        createdBy: suresh._id,
        confirmedByMember: false,
        tags: ['Node.js', 'API']
      },
      {
        title: 'Write E2E test scripts for auth module',
        description: 'Verify login, registration, password recovery, and token expiry flows.',
        status: 'Completed',
        priority: 'low',
        requiredSkills: ['Automation', 'Jest'],
        dueDate: daysFromNow(-3),
        project: testingProj._id,
        assignees: [vijay._id],
        createdBy: suresh._id,
        confirmedByMember: true,
        tags: ['QA', 'E2E', 'Jest']
      }
    ];

    const tasks = await Task.create(tasksData);
    console.log(`Successfully seeded ${tasks.length} tasks.`);

    // 6. Seed Notifications
    console.log('Seeding notifications...');
    const notificationsData = [
      {
        recipient: anitha._id,
        sender: suresh._id,
        project: cloudProj._id,
        type: 'TASK_ASSIGNMENT',
        task: tasks[1]._id, // Configure IAM Policies & Roles
        title: 'New Task Assigned',
        message: "You have been assigned the task 'Configure IAM Policies & Roles' in the project 'Enterprise Cloud Migration'.",
        isRead: false
      },
      {
        recipient: priya._id,
        sender: suresh._id,
        project: mobileProj._id,
        type: 'assessment_request',
        title: 'Assessment Requested',
        message: "Suresh Kumar has requested a skill assessment for the project 'ProManage Mobile App'.",
        isRead: false
      },
      {
        recipient: priya._id,
        sender: kavitha._id,
        project: uiRedesignProj._id,
        type: 'PROJECT_UPDATE',
        title: 'New project requirement',
        message: "Kavitha Ram updated the requirements for 'Customer Portal UI/UX Redesign'. Please check the new Figma link.",
        isRead: true
      }
    ];

    const notifications = await Notification.create(notificationsData);
    console.log(`Successfully seeded ${notifications.length} notifications.`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
