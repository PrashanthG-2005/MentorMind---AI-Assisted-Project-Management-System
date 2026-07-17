import { useState } from "react";
import { 
  X, 
  FileText,
  Target,
  Layers,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
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
  const step = 1;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissionData = { 
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "")
    };
    
    onSave(submissionData, formData.documentText);
  };

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
