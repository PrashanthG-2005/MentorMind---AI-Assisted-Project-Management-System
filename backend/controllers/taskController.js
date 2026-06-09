import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { evaluateTaskSubmission, autoAssignTask as aiAutoAssign } from '../services/aiService.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Multer Setup for Submission File Uploads ────────────────────────────────
const submissionUploadDir = path.join(__dirname, '../uploads/submissions');
if (!fs.existsSync(submissionUploadDir)) {
  fs.mkdirSync(submissionUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, submissionUploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

export const uploadSubmissionFile = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /pdf|doc|docx|txt|png|jpg|jpeg|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext || mime) cb(null, true);
    else cb(new Error('Only documents and images are allowed'));
  }
}).single('submissionFile');

// ─── Helper: Read file content for AI evaluation ─────────────────────────────
const readFileForAI = (filePath, mimeType) => {
  try {
    if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
      // Return base64 for image/PDF (multimodal)
      const data = fs.readFileSync(filePath);
      return { base64: data.toString('base64'), mimeType };
    } else if (mimeType === 'text/plain' || filePath.endsWith('.txt')) {
      // Return text content directly
      const text = fs.readFileSync(filePath, 'utf8');
      return { text };
    }
    return null;
  } catch (e) {
    console.error('File read error for AI:', e.message);
    return null;
  }
};

// ─── GET TASKS ────────────────────────────────────────────────────────────────
export const getTasks = async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;
    
    // Enforce company boundary: Fetch projects in the user's company
    const myProjects = await Project.find({ company: req.user.company }).select('_id');
    const myProjectIds = myProjects.map(p => p._id);

    let query = {};
    if (projectId) {
      // Ensure the requested project belongs to the user's company
      const isMyProject = myProjectIds.some(id => id.toString() === projectId.toString());
      if (!isMyProject) {
        return res.status(403).json({ message: 'Not authorized to access tasks for this project' });
      }
      query.project = projectId;
    } else {
      query.project = { $in: myProjectIds };
    }
    
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('assignees', 'name email avatar skills')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'title status')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET SINGLE TASK ──────────────────────────────────────────────────────────
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignees', 'name email avatar skills')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'title status company');

    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Enforce company boundary
    if (task.project && task.project.company !== req.user.company) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── CREATE TASK ──────────────────────────────────────────────────────────────
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignees, tags, requiredSkills } = req.body;

    const projectExists = await Project.findById(project);
    if (!projectExists) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title,
      description,
      status: status || 'Pending',
      priority: priority || 'medium',
      dueDate,
      project,
      assignees: assignees || [],
      tags: tags || [],
      requiredSkills: requiredSkills || [],
      createdBy: req.user._id
    });

    // If assignees provided, increment their workload
    if (assignees && Array.isArray(assignees)) {
      await User.updateMany(
        { _id: { $in: assignees } },
        { $inc: { currentWorkload: 1 } }
      );
    }

    const populatedTask = await Task.findById(task._id)
      .populate('assignees', 'name email avatar skills')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'title status');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE TASK ──────────────────────────────────────────────────────────────
export const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignees, tags, requiredSkills } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignees = assignees !== undefined ? assignees : task.assignees;
    task.tags = tags || task.tags;
    task.requiredSkills = requiredSkills !== undefined ? requiredSkills : task.requiredSkills;

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignees', 'name email avatar skills')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'title status');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE TASK STATUS ───────────────────────────────────────────────────────
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE TASK ──────────────────────────────────────────────────────────────
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ─── CONFIRM TASK ────────────────────────────────────────────────────────────
// @route   PUT /api/tasks/:id/confirm
// @access  Private (Assignee)
export const confirmTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Auth check
    const isAssignee = task.assignees.some(a => a.toString() === req.user._id.toString());
    if (!isAssignee) {
      return res.status(403).json({ message: 'Only assignees can confirm tasks' });
    }

    task.confirmedByMember = true;
    task.status = 'In-Progress';
    await task.save();

    res.json({ message: 'Task confirmed successfully', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── COMPLETE TASK (Autonomous) ──────────────────────────────────────────────
// @route   PUT /api/tasks/:id/complete
// @access  Private (Assignee)
export const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Auth check
    const isAssignee = task.assignees.some(a => a.toString() === req.user._id.toString());
    if (!isAssignee) {
      return res.status(403).json({ message: 'Only assignees can complete tasks' });
    }

    task.status = 'Completed';
    
    // Decrement workload
    if (task.assignees && task.assignees.length > 0) {
      await User.updateMany(
        { _id: { $in: task.assignees } },
        { $inc: { currentWorkload: -1 } }
      );
    }

    await task.save();
    res.json({ message: 'Task marked as completed', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── SUBMIT TASK WITH FILE + AI EVALUATION ───────────────────────────────────
// @route   POST /api/tasks/:id/submit
// @access  Private (Assignee or Admin)
export const submitTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Auth check
    const isAssignee = task.assignees.some(a => a.toString() === req.user._id.toString());
    if (!isAssignee && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to submit this task' });
    }

    const { description } = req.body;
    const submittedFile = req.file;

    // Build submission record
    task.submission = {
      description: description || '',
      fileUrl: submittedFile ? `/uploads/submissions/${submittedFile.filename}` : '',
      fileName: submittedFile ? submittedFile.originalname : '',
      fileType: submittedFile ? submittedFile.mimetype : '',
      submittedAt: new Date()
    };
    task.validationStatus = 'pending';
    task.status = 'Under-Review';

    // ── AI Evaluation ──────────────────────────────────────────────────────
    try {
      let fileData = null;
      if (submittedFile) {
        fileData = readFileForAI(submittedFile.path, submittedFile.mimetype);
      }

      const submissionContent = description || (submittedFile ? `File uploaded: ${submittedFile.originalname}` : 'No content');
      const evaluation = await evaluateTaskSubmission(task.description, submissionContent, fileData);

      // Store AI evaluation
      task.aiEvaluation = {
        feedback: evaluation.feedback,
        confidence: evaluation.confidence || (evaluation.perfect ? 0.9 : 0.4),
        score: evaluation.score || (evaluation.perfect ? 90 : 40),
        evaluatedAt: new Date()
      };
      
      task.aiScore = evaluation.score || (evaluation.perfect ? 90 : 40);

      if (evaluation.perfect || (evaluation.score && evaluation.score >= 80)) {
        task.validationStatus = 'approved';
        task.status = 'Completed';
        
        // Decrement workload for all assignees
        if (task.assignees && task.assignees.length > 0) {
          await User.updateMany(
            { _id: { $in: task.assignees } },
            { $inc: { currentWorkload: -1 } }
          );
        }
      } else {
        task.status = 'Rework-Required';
      }
    } catch (aiError) {
      console.error('AI Evaluation Error during submission:', aiError);
    }

    await task.save();

    const isAutoCompleted = task.status === 'Completed';
    res.json({
      message: isAutoCompleted
        ? '✅ Task automatically completed by AI evaluation!'
        : '⏳ Task submitted successfully and is under review.',
      autoCompleted: isAutoCompleted,
      aiEvaluation: task.aiEvaluation,
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── AUTO-ASSIGN TASK USING AI ────────────────────────────────────────────────
// @route   POST /api/tasks/:id/auto-assign
// @access  Private (Admin / Project Owner)
export const autoAssignTaskController = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Get project team members with their skills
    const project = await Project.findById(task.project._id || task.project).populate('team.user', 'name email avatar skills role');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Also include all users as fallback if project team is small
    let teamMembers = (project.team || []).map(member => member.user).filter(Boolean);
    if (teamMembers.length === 0) {
      console.warn('Project has no team, fetching all users as fallback');
      teamMembers = await User.find({}).select('name email avatar skills role');
    }

    if (teamMembers.length === 0) {
      return res.json({
        assigned: false,
        noMatch: true,
        requiredSkills: task.requiredSkills,
        message: 'No team members available in the system.'
      });
    }

    // Call AI to find best match
    const assignment = await aiAutoAssign(
      task.title,
      task.description,
      task.requiredSkills,
      teamMembers
    );

    if (!assignment) {
      // No suitable match found
      return res.json({
        assigned: false,
        noMatch: true,
        requiredSkills: task.requiredSkills,
        message: `No qualified team member found for skills: ${(task.requiredSkills || []).join(', ') || 'unknown'}`
      });
    }

    // Assign the user
    const assignedMember = teamMembers.find(m => m._id.toString() === assignment.assignedUserId);
    if (!assignedMember) {
      return res.json({
        assigned: false,
        noMatch: true,
        requiredSkills: task.requiredSkills,
        message: 'AI suggested member not found in team.'
      });
    }

    // Update task
    task.assignees = [assignedMember._id];
    task.autoAssignReasoning = assignment.reasoning;
    await task.save();

    // Increment workload for the assigned member
    await User.findByIdAndUpdate(assignedMember._id, { $inc: { currentWorkload: 1 } });

    const populatedTask = await Task.findById(task._id)
      .populate('assignees', 'name email avatar skills')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'title status');

    res.json({
      assigned: true,
      noMatch: false,
      assignedUser: {
        id: assignedMember._id,
        name: assignedMember.name,
        email: assignedMember.email,
        avatar: assignedMember.avatar
      },
      matchConfidence: assignment.matchConfidence,
      reasoning: assignment.reasoning,
      task: populatedTask
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── VERIFY TASK SUBMISSION (Admin Manual Override) ───────────────────────────
// @route   POST /api/tasks/:id/verify
// @access  Private (Admin / Project Owner)
export const verifyTask = async (req, res) => {
  try {
    const { status, feedback } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.project);
    if (project.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to verify tasks for this project' });
    }

    task.validationStatus = status;
    if (status === 'approved') {
      task.status = 'Completed';
      
      // Decrement workload
      if (task.assignees && task.assignees.length > 0) {
        await User.updateMany(
          { _id: { $in: task.assignees } },
          { $inc: { currentWorkload: -1 } }
        );
      }
    } else if (status === 'rejected') {
      task.status = 'Rework-Required';
      if (feedback) {
        // Append feedback to AI evaluation
        task.aiEvaluation = {
          ...task.aiEvaluation?.toObject?.() || {},
          feedback: feedback,
          evaluatedAt: new Date()
        };
      }
    }

    await task.save();
    res.json({ message: `Task submission ${status}`, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
