import express from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { createInvite, getInvite, listInvites, revokeInvite } from '../controllers/inviteController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/invite', protect, admin, createInvite);
router.get('/invite/:token', getInvite);
router.get('/invites', protect, admin, listInvites);
router.delete('/invite/:id', protect, admin, revokeInvite);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
