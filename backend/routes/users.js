import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateProfile, 
  updatePassword,
  deleteUser,
  createEmployee,
  addMemberWithResume
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';
import { resumeUpload } from '../middleware/upload.js';

const router = express.Router();

// Move this to the top to ensure no shadowing
router.post('/add-with-resume', protect, admin, resumeUpload.single('resume'), addMemberWithResume);

router.use(protect); // All routes require authentication

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.post('/create-employee', admin, createEmployee);
router.delete('/:id', admin, deleteUser);

export default router;
