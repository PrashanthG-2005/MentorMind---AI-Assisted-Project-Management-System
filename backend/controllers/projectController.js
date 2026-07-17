import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { extractTasksFromText } from '../nlp/extractTasks.js';
import { matchTasksWithTeam, analyzeProjectRoles } from '../services/aiService.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ company: req.user.company })
      .populate('team.user', 'name email employeeId avatar role')
      .populate('owner', 'name email avatar')
      .sort({ createdAt: -1 });
    
    // Get task stats for each project
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id });
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'Completed').length;
        const pending = total - completed;
        
        return {
          ...project.toObject(),
          tasks: { total, completed, pending }
        };
      })
    );
    
    res.json(projectsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, company: req.user.company })
      .populate('team.user', 'name email employeeId avatar role')
      .populate('owner', 'name email avatar');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Get task stats
    const tasks = await Task.find({ project: project._id });
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    
    res.json({
      ...project.toObject(),
      tasks: { total, completed, pending }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    console.log('CREATE PROJECT REQUEST BODY:', req.body);
    console.log('CREATE PROJECT REQUEST FILE:', req.file);
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        message: 'Project creation failed: No data received in request body.',
        debug: {
          contentType: req.headers['content-type'],
          hasFile: !!req.file,
          fileField: req.file?.fieldname
        }
      });
    }

    const { 
      title, 
      description, 
      status, 
      progress, 
      dueDate, 
      startDate, 
      category, 
      priority, 
      tags, 
      team, 
      requiredRoles,
      documentText 
    } = req.body;
    
    let documents = [];
    if (req.file) {
      documents.push({
        name: req.file.originalname,
        url: `/uploads/projects/${req.file.filename}`,
        uploadedAt: new Date()
      });
    }

    let parsedTeam = [];
    try {
      if (typeof team === 'string') {
        parsedTeam = JSON.parse(team);
      } else if (Array.isArray(team)) {
        parsedTeam = team;
      }
    } catch (parseError) {
      console.error('TEAM PARSING ERROR:', parseError);
      parsedTeam = [];
    }

    let parsedRequiredRoles = [];
    try {
      if (typeof requiredRoles === 'string') {
        parsedRequiredRoles = JSON.parse(requiredRoles);
      } else if (Array.isArray(requiredRoles)) {
        parsedRequiredRoles = requiredRoles;
      }
    } catch (parseError) {
      console.error('REQUIRED ROLES PARSING ERROR:', parseError);
      parsedRequiredRoles = [];
    }

    // Format team correctly for the schema
    const formattedTeam = parsedTeam.map(member => {
      const userId = typeof member === 'string' ? member : (member.user?._id || member.user || member._id);
      return {
        user: userId,
        role: member.role || 'Member',
        assessmentStatus: 'Pending',
        assessmentScore: 0
      };
    });

    // ═══════════════════════════════════════════════════════════════════
    // STEP 1: Create the Project
    // ═══════════════════════════════════════════════════════════════════
    const project = await Project.create({
      title,
      description,
      status: status || 'Not Started',
      priority: priority || 'Medium',
      category: category || 'Other',
      progress: progress || 0,
      startDate: startDate || new Date(),
      dueDate,
      tags: typeof tags === 'string' ? JSON.parse(tags) : (tags || []),
      requiredRoles: parsedRequiredRoles,
      team: formattedTeam,
      owner: req.user._id,
      company: req.user.company,
      documents
    });

    // ═══════════════════════════════════════════════════════════════════
    // STEP 2: AI Pipeline — Auto-Generate Tasks → Match Skills → Assign
    // ═══════════════════════════════════════════════════════════════════
    const briefingText = description;
    let pipelineResults = { tasksCreated: 0, tasksAssigned: 0, gapAlerts: [] };

    if (briefingText) {
      try {
        console.log('[AI PIPELINE] Starting autonomous task generation for project:', project.title);

        // 2a. Auto-generate tasks from the project description using AI
        const generatedTasks = await extractTasksFromText(briefingText);
        console.log(`[AI PIPELINE] Generated ${generatedTasks.length} tasks`);

        if (generatedTasks.length > 0) {
          // 2b. Fetch ALL available users for intelligent assignment (fully autonomous)
          const allUsers = await User.find({ company: req.user.company, isAdmin: false })
            .select('name email avatar skills role currentWorkload experienceLevel availability');

          // 2c. Match generated tasks with best members
          const tasksWithAssignments = await matchTasksWithTeam(generatedTasks, allUsers);
          console.log(`[AI PIPELINE] Skill matching complete`);

          const createdTasks = [];
          const assignedNotifications = [];
          const gapAlerts = [];

          for (const taskObj of tasksWithAssignments) {
            const taskDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

            // 2d. Create the Task
            const task = await Task.create({
              title: taskObj.title,
              description: taskObj.description || taskObj.title,
              requiredSkills: taskObj.requiredSkills || [],
              status: 'Awaiting-Confirmation',
              priority: taskObj.priority || 'medium',
              dueDate: taskDueDate,
              project: project._id,
              assignees: taskObj.assignedUser ? [taskObj.assignedUser] : [],
              autoAssignReasoning: taskObj.matchReasoning || 'AI matched based on resume skills',
              createdBy: req.user._id
            });

            createdTasks.push(task);

            if (taskObj.assignedUser) {
              // Increment workload
              await User.findByIdAndUpdate(taskObj.assignedUser, { $inc: { currentWorkload: 1 } });

              // 2e. Notification
              assignedNotifications.push({
                recipient: taskObj.assignedUser,
                sender: req.user._id,
                project: project._id,
                task: task._id,
                type: 'TASK_ASSIGNMENT',
                title: '🎯 New Task Assigned (Needs Confirmation)',
                message: `You have been AI-assigned to "${task.title}". Please confirm to start working!`,
                data: { taskId: task._id }
              });
            } else {
              gapAlerts.push({ taskTitle: task.title, requiredSkills: task.requiredSkills });
            }
          }

          if (assignedNotifications.length > 0) {
            await Notification.insertMany(assignedNotifications);
          }

          pipelineResults = {
            tasksCreated: createdTasks.length,
            tasksAssigned: assignedNotifications.length,
            gapAlerts
          };
        }
      } catch (pipelineError) {
        console.error('[AI PIPELINE] Error:', pipelineError.message);
        pipelineResults.error = pipelineError.message;
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // STEP 3: Send assessment notifications to team members
    // ═══════════════════════════════════════════════════════════════════
    if (formattedTeam.length > 0) {
      const assessmentNotifications = formattedTeam.map(member => ({
        recipient: member.user,
        sender: req.user._id,
        project: project._id,
        type: 'assessment_request',
        title: 'Skill Assessment Required',
        message: `You have been assigned to project "${project.title}". Please complete your skill assessment test.`,
        data: {
          category: project.category,
          role: member.role
        }
      }));
      await Notification.insertMany(assessmentNotifications);
    }

    // ═══════════════════════════════════════════════════════════════════
    // STEP 4: Return populated project + pipeline results
    // ═══════════════════════════════════════════════════════════════════
    const populatedProject = await Project.findById(project._id)
      .populate('team.user', 'name email employeeId avatar role')
      .populate('owner', 'name email avatar');
    
    res.status(201).json({
      ...populatedProject.toObject(),
      pipelineResults
    });
  } catch (error) {
    console.error('CREATE PROJECT ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const { title, description, status, progress, dueDate, startDate, category, priority, tags, team } = req.body;
    
    const project = await Project.findOne({ _id: req.params.id, company: req.user.company });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check ownership or admin
    if (project.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    if (req.file) {
      project.documents.push({
        name: req.file.originalname,
        url: `/uploads/projects/${req.file.filename}`,
        uploadedAt: new Date()
      });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.status = status || project.status;
    project.priority = priority || project.priority;
    project.category = category || project.category;
    project.progress = progress !== undefined ? progress : project.progress;
    project.startDate = startDate || project.startDate;
    project.dueDate = dueDate || project.dueDate;
    project.tags = typeof tags === 'string' ? JSON.parse(tags) : (tags || project.tags);
    
    // Handle team update with potential schema conversion
    if (team) {
      const parsedTeam = typeof team === 'string' ? JSON.parse(team) : team;
      project.team = parsedTeam.map(member => {
        const userId = typeof member === 'string' ? member : (member.user?._id || member.user || member._id);
        return {
          user: userId,
          role: member.role || 'Member',
          assessmentStatus: member.assessmentStatus || 'Pending',
          assessmentScore: member.assessmentScore || 0,
          location: member.location,
          deadline: member.deadline
        };
      });
    }
    
    const updatedProject = await project.save();
    
    const populatedProject = await Project.findById(updatedProject._id)
      .populate('team.user', 'name email employeeId avatar role')
      .populate('owner', 'name email avatar');
    
    res.json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, company: req.user.company });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check ownership or admin
    if (project.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    // Delete all tasks associated with the project
    await Task.deleteMany({ project: project._id });
    
    await project.deleteOne();
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project tasks
// @route   GET /api/projects/:id/tasks
// @access  Private
export const getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id })
      .populate('assignees', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload project doc and auto assign tasks
// @route   POST /api/projects/:id/auto-assign
// @access  Private
export const autoAssignTasks = async (req, res) => {
  try {
    const { documentText } = req.body;
    if (!documentText) {
      return res.status(400).json({ message: 'Please provide document text to analyze' });
    }

    const project = await Project.findOne({ _id: req.params.id, company: req.user.company }).populate('team.user', 'name email employeeId avatar role skills');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check ownership or admin
    if (project.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to auto-assign tasks for this project' });
    }

    // Extract tasks using AI
    const extractedTasks = await extractTasksFromText(documentText);
    
    if (extractedTasks.length === 0) {
      return res.status(400).json({ message: 'Could not extract any tasks from the document' });
    }

    // Match tasks with team members using Gemini AI
    const teamMembers = (project.team || []).map(member => member.user).filter(Boolean);
    const tasksWithAssignments = await matchTasksWithTeam(extractedTasks, teamMembers);

    const createdTasks = [];
    const unassignedTasks = [];

    for (const taskObj of tasksWithAssignments) {
      // Create due date (e.g., 7 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const task = await Task.create({
        title: taskObj.title,
        description: taskObj.description,
        requiredSkills: taskObj.requiredSkills,
        status: 'Pending',
        priority: taskObj.priority || 'medium',
        dueDate,
        project: project._id,
        assignees: taskObj.assignedUser ? [taskObj.assignedUser] : [],
        createdBy: req.user._id
      });

      if (!taskObj.assignedUser) {
        unassignedTasks.push({
          title: task.title,
          requiredSkills: task.requiredSkills
        });
      }

      createdTasks.push(task);
    }

    // Add document to project
    project.documents.push({
      name: 'Auto Generated Tasks Document',
      url: '',
      uploadedAt: new Date()
    });
    await project.save();

    res.status(201).json({
      message: `${createdTasks.length} tasks were automatically extracted. ${createdTasks.length - unassignedTasks.length} tasks assigned.`,
      tasks: createdTasks,
      unassignedTasks
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Initiate skill assessments for team members
// @route   POST /api/projects/:id/assessments
// @access  Private (Owner only)
export const initiateSkillAssessments = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, company: req.user.company });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create notifications for each team member
    const notifications = project.team.map(member => ({
      recipient: member.user,
      sender: req.user._id,
      project: project._id,
      type: 'assessment_request',
      title: 'Skill Assessment Required',
      message: `You have been assigned to project "${project.title}". Please complete your skill assessment test.`,
      data: {
        category: project.category,
        role: member.role
      }
    }));

    await Notification.insertMany(notifications);

    res.json({ message: 'Skill assessments initiated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit skill assessment response
// @route   POST /api/projects/:id/assessments/submit
// @access  Private
export const submitAssessmentResponse = async (req, res) => {
  try {
    const { abilityDetails, accuracySelfScore, expectedDeadline, workLocation, preferredTools } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Find the member in the team array
    const memberIndex = project.team.findIndex(m => m.user.toString() === req.user._id.toString());
    
    if (memberIndex === -1) {
      return res.status(403).json({ message: 'You are not a member of this project' });
    }

    project.team[memberIndex].assessmentStatus = 'Completed';
    project.team[memberIndex].assessmentScore = accuracySelfScore || 0;
    project.team[memberIndex].location = workLocation || 'Remote';
    project.team[memberIndex].deadline = expectedDeadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    // Save details to a potential "notes" field or log
    console.log(`Assessment Details for ${req.user.name}:`, abilityDetails, preferredTools);

    await project.save();

    res.json({ message: 'Assessment submitted successfully', member: project.team[memberIndex] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Analyze project requirements and suggest roles
// @route   POST /api/projects/analyze-roles
// @access  Private
export const analyzeProjectRequirements = async (req, res) => {
  try {
    const { documentText } = req.body;
    if (!documentText) {
      return res.status(400).json({ message: 'Please provide project description to analyze' });
    }

    const suggestedRoles = await analyzeProjectRoles(documentText);
    res.json(suggestedRoles);
  } catch (error) {
    console.error('ANALYZE ROLES ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Simulate AI project pipeline (extract tasks & verify skill coverage)
// @route   POST /api/projects/simulate-pipeline
// @access  Private
export const simulateProjectPipeline = async (req, res) => {
  try {
    const { documentText, team } = req.body;
    
    if (!documentText) {
      return res.status(400).json({ message: 'Project description/briefing is required for verification' });
    }

    if (!team || !Array.isArray(team) || team.length === 0) {
      return res.status(400).json({ message: 'A team must be assembled before verifying the project' });
    }

    // Extract raw User IDs from the incoming team array
    const teamUserIds = team.map(member => 
      typeof member === 'string' ? member : (member.user?._id || member.user || member._id)
    );

    console.log('[AI SIMULATION] Starting task extraction for verification');
    const extractedTasks = await extractTasksFromText(documentText);
    console.log(`[AI SIMULATION] Extracted ${extractedTasks.length} tasks`);

    let gapAlerts = [];
    let tasksAssigned = 0;

    if (extractedTasks.length > 0) {
      // Fetch full team member profiles (with skills) for matching
      const teamMembers = await User.find({ _id: { $in: teamUserIds } })
        .select('name email avatar skills role');

      const tasksWithAssignments = await matchTasksWithTeam(extractedTasks, teamMembers);

      for (const taskObj of tasksWithAssignments) {
        if (taskObj.assignedUser) {
          tasksAssigned++;
        } else {
          // Track gaps
          gapAlerts.push({
            taskTitle: taskObj.title,
            requiredSkills: taskObj.requiredSkills || []
          });
        }
      }
    }

    const missingSkills = [...new Set(gapAlerts.flatMap(g => g.requiredSkills))];

    res.json({
      tasksExtracted: extractedTasks.length,
      tasksAssigned,
      gapAlerts,
      missingSkills,
      isReady: gapAlerts.length === 0
    });

  } catch (error) {
    console.error('SIMULATE PIPELINE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};
