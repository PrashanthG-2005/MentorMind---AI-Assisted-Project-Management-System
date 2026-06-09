/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { 
  X, 
  Calendar,
  Users,
  FileText,
  Plus,
  Trash2,
  Upload,
  Trophy,
  Target,
  Clock,
  Briefcase,
  Layers,
  CheckCircle2,
  FileUp,
  AlertCircle,
  Zap,
  Brain,
  Sparkles
} from "lucide-react";
import { calculateMatchScore, getScoreColor, ROLE_SKILLS } from "../../utils/skillMatcher.js";
import { analyzeProjectRoles, simulateProjectPipeline } from "../../services/projectService.js";

const ProjectModal = ({ isOpen, onClose, onSave, project, teamOptions }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    status: project?.status || "Not Started",
    category: project?.category || "Web Development",
    priority: project?.priority || "Medium",
    startDate: project?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    dueDate: project?.dueDate?.split('T')[0] || "",
    team: project?.team || [],
    requiredRoles: project?.requiredRoles || [{ role: 'Developer', count: 1 }],
    tags: project?.tags?.join(', ') || "",
    documentText: ""
  });
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [mode, setMode] = useState("manual"); // 'manual' or 'auto'
  const fileInputRef = useRef(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [aiVerificationResult, setAiVerificationResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "documentText" || name === "description") setAiVerificationResult(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Mission Briefing must be under 5MB ❌");
      return;
    }

    setSelectedFile(file);
    setMode("auto"); // Auto-switch to AI mode 🔥
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure we have a description even in auto-mode to satisfy backend validation
    const finalDescription = mode === 'auto' && !formData.description 
      ? `AI-extracted project from briefing: ${selectedFile?.name || 'input'}` 
      : formData.description;

    const submissionData = { 
      ...formData,
      description: finalDescription,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "")
    };
    
    if (selectedFile) {
      submissionData.file = selectedFile;
    }
    
    onSave(submissionData, formData.documentText);
  };

  const toggleTeamMember = (member) => {
    setFormData(prev => {
      const exists = prev.team.find(m => (m.user?._id || m._id) === member._id);
      if (exists) {
        return { ...prev, team: prev.team.filter(m => (m.user?._id || m._id) !== member._id) };
      }
      return { ...prev, team: [...prev.team, { ...member, user: member, role: 'Member' }] };
    });
    setAiVerificationResult(null);
  };

  const addRequiredRole = () => {
    setFormData(prev => ({
      ...prev,
      requiredRoles: [...prev.requiredRoles, { role: 'Frontend Developer', count: 1, description: '' }]
    }));
  };

  const removeRequiredRole = (index) => {
    setFormData(prev => ({
      ...prev,
      requiredRoles: prev.requiredRoles.filter((_, i) => i !== index)
    }));
  };

  const updateRequiredRole = (index, field, value) => {
    setFormData(prev => {
      const newRoles = [...prev.requiredRoles];
      newRoles[index] = { ...newRoles[index], [field]: value };
      return { ...prev, requiredRoles: newRoles };
    });
  };

  const handleAIAnalyze = async () => {
    if (!formData.description && !formData.documentText) {
      alert("Please provide a project description or mission briefing in Step 1 first.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const briefing = formData.documentText || formData.description;
      const suggestions = await analyzeProjectRoles(briefing);
      
      if (suggestions && suggestions.length > 0) {
        setFormData(prev => ({
          ...prev,
          requiredRoles: suggestions
        }));
      }
    } catch (error) {
      console.error("AI Analysis Error:", error);
      alert("AI Analysis failed. Please try manual entry.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateMemberRole = (memberId, newRole) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.map(m => (m.user?._id || m._id) === memberId ? { ...m, role: newRole } : m)
    }));
  };

  const handleVerifyProject = async () => {
    const briefing = formData.documentText || formData.description;
    if (!briefing) {
      alert("Please provide a mission briefing or description in Step 1.");
      return;
    }
    if (formData.team.length === 0) {
      alert("Please assign at least one team member.");
      return;
    }

    setIsVerifying(true);
    try {
      const result = await simulateProjectPipeline(briefing, formData.team);
      setAiVerificationResult(result);
    } catch (error) {
      console.error("AI Verification Error:", error);
      alert("Verification failed: " + error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Validation Logic
  const getRoleCounts = () => {
    const counts = {};
    formData.team.forEach(m => {
      counts[m.role] = (counts[m.role] || 0) + 1;
    });
    return counts;
  };

  const roleCounts = getRoleCounts();
  const missingRoles = formData.requiredRoles.filter(req => (roleCounts[req.role] || 0) < req.count);
  const isPerfectMatch = missingRoles.length === 0 && formData.team.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 left-0 md:left-64 right-0 bottom-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col border border-white/20 dark:border-gray-700/50">
        {/* Decorative Header Background */}
        <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 w-full" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
              <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {project ? 'Refine Project' : 'Launch New Project'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {project ? 'Update your project roadmap and team' : 'Define your vision and build your team'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all duration-200 border border-gray-200/50 dark:border-gray-600"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form Body - Scrollable Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Progress Stepper */}
          <div className="px-8 pt-6">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step >= s 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                  }`}>
                    {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-500 ${
                      step > s ? "bg-indigo-600" : "bg-gray-100 dark:bg-gray-700"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
              <span>Blueprint</span>
              <span>Requirements</span>
              <span>Assembly</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="p-8 space-y-6">
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <Target className="w-4 h-4 text-indigo-500" /> Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Next-Gen Mobile App"
                  required
                  className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="w-4 h-4 text-indigo-500" /> Mission Briefing (AI will extract tasks)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Describe your project in detail. Mention if it involves a website, AI, authentication, etc. The system will auto-generate and assign tasks based on this description."
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm">
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs" />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Deadline</label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-xs" />
                </div>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <p className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300 leading-relaxed">
                  <strong>Intelligent Project Launch:</strong> Upon submission, MentorMind's AI will automatically decompose your briefing into actionable tasks and assign them to the most qualified team members based on their resumes.
                </p>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-gray-600">
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-10 py-3 rounded-xl text-sm font-black transition-all bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95"
                >
                  Launch Project & Auto-Assign
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
