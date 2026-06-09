import express from 'express';
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject,
  getProjectTasks,
  autoAssignTasks,
  initiateSkillAssessments,
  submitAssessmentResponse,
  analyzeProjectRequirements,
  simulateProjectPipeline
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// AI Requirement Analysis (Isolated Route)
router.post('/analyze-mission', protect, analyzeProjectRequirements);
router.post('/simulate-pipeline', protect, simulateProjectPipeline);

// Global Protection for CRUD
router.use(protect);

router.route('/')
  .get(getProjects)
  .post(upload.single('file'), createProject);

router.route('/:id')
  .get(getProjectById)
  .put(upload.single('file'), updateProject)
  .delete(deleteProject);

router.post('/:id/auto-assign', autoAssignTasks);

router.get('/:id/tasks', getProjectTasks);

router.post('/:id/assessments', initiateSkillAssessments);
router.post('/:id/assessments/submit', submitAssessmentResponse);

export default router;
