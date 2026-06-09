import mongoose from 'mongoose';

const inviteSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  email: { type: String },
  role: { type: String, default: 'Employee' },
  skills: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  used: { type: Boolean, default: false },
  expiresAt: { type: Date }
}, { timestamps: true });

const Invite = mongoose.model('Invite', inviteSchema);
export default Invite;
