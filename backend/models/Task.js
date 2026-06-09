import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['Awaiting-Confirmation', 'In-Progress', 'Completed', 'Pending', 'Under-Review', 'Rework-Required'],
    default: 'Awaiting-Confirmation'
  },
  confirmedByMember: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  autoAssignReasoning: {
    type: String,
    default: ''
  },
  submission: {
    description: String,
    fileUrl: String,
    fileName: String,
    fileType: String,
    submittedAt: Date
  },
  aiEvaluation: {
    feedback: String,
    confidence: Number,
    score: Number,
    evaluatedAt: Date
  },
  aiScore: {
    type: Number,
    default: 0
  },
  validationStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String
  }],
  comments: {
    type: Number,
    default: 0
  },
  attachments: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
