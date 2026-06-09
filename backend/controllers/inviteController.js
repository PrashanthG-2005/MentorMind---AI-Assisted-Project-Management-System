import crypto from 'crypto';
import Invite from '../models/Invite.js';
import User from '../models/User.js';

// @desc Create an invite token (Admin only)
// @route POST /api/auth/invite
// @access Private/Admin
export const createInvite = async (req, res) => {
  try {
    const { email, role, skills, expiresInDays } = req.body;

    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = expiresInDays ? new Date(Date.now() + Number(expiresInDays) * 24 * 60 * 60 * 1000) : null;

    const invite = await Invite.create({
      token,
      email,
      role: role || 'Employee',
      skills: Array.isArray(skills) ? skills : (skills ? [skills] : []),
      createdBy: req.user._id,
      expiresAt
    });

    res.status(201).json({ token: invite.token, expiresAt: invite.expiresAt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Validate invite token (used by frontend to prefill)
// @route GET /api/auth/invite/:token
// @access Public
export const getInvite = async (req, res) => {
  try {
    const invite = await Invite.findOne({ token: req.params.token }).populate('createdBy', 'company');
    if (!invite) return res.status(404).json({ message: 'Invite not found' });
    if (invite.used) return res.status(400).json({ message: 'Invite already used' });
    if (invite.expiresAt && invite.expiresAt < new Date()) return res.status(400).json({ message: 'Invite expired' });
    res.json({ email: invite.email, role: invite.role, skills: invite.skills, company: invite.createdBy?.company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc List invites (Admin)
// @route GET /api/auth/invites
// @access Private/Admin
export const listInvites = async (req, res) => {
  try {
    const usersInCompany = await User.find({ company: req.user.company }).select('_id');
    const userIds = usersInCompany.map(u => u._id);

    const invites = await Invite.find({ createdBy: { $in: userIds } })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    res.json(invites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Revoke (delete) an invite
// @route DELETE /api/auth/invite/:id
// @access Private/Admin
export const revokeInvite = async (req, res) => {
  try {
    const usersInCompany = await User.find({ company: req.user.company }).select('_id');
    const userIds = usersInCompany.map(u => u._id.toString());

    const invite = await Invite.findById(req.params.id);
    if (!invite) return res.status(404).json({ message: 'Invite not found' });
    
    // Enforce company boundary
    if (!userIds.includes(invite.createdBy.toString())) {
      return res.status(403).json({ message: 'Not authorized to revoke this invite' });
    }

    await invite.deleteOne();
    res.json({ message: 'Invite revoked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
