import express from 'express';
import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask,
  updateTaskStatus,
  submitTask,
  verifyTask,
  autoAssignTaskController,
  uploadSubmissionFile,
  confirmTask,
  completeTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

// File upload middleware wraps submitTask (handles multipart/form-data)
router.post('/:id/submit', (req, res, next) => {
  uploadSubmissionFile(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, submitTask);

router.post('/:id/verify', verifyTask);
router.post('/:id/auto-assign', autoAssignTaskController);
// Member actions: confirm assigned task and mark complete
router.put('/:id/confirm', confirmTask);
router.put('/:id/complete', completeTask);

export default router;
