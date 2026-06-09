import { useState, useEffect } from "react";
import { X, UserPlus, Mail, ShieldCheck, AlertTriangle, FileText, Upload } from "lucide-react";
import { addMemberWithResume } from "../../services/userService";

const TeamModal = ({ isOpen, onClose, onSubmit, requiredSkills }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [resume, setResume] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  // When requiredSkills changes (URL-driven), pre-fill
  useEffect(() => {
    if (requiredSkills) {
      setFormData(prev => ({ ...prev, skills: requiredSkills }));
    }
  }, [requiredSkills]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      alert("Please upload a resume");
      return;
    }

    setIsUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("resume", resume);

      const response = await addMemberWithResume(formDataToSend);
      setExtractedData(response.user);
      alert("Member added successfully! AI extracted their profile.");
      
      // If we have extracted data, maybe show it or just close
      setTimeout(() => {
        onSubmit(response.user);
        onClose();
      }, 2000);
    } catch (error) {
      alert("Error: " + error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed top-16 left-0 md:left-64 right-0 bottom-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all duration-300">
      <div className="bg-white/90 dark:bg-gray-900/90 w-full max-w-xl p-8 rounded-[2rem] shadow-2xl relative border border-white/20 dark:border-gray-700/30 backdrop-blur-xl transform transition-all scale-100">
        
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-center mb-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <UserPlus size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Add Team Member</h2>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-0.5">Scale your capabilities</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-rose-500 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Required skills alert banner */}
        {requiredSkills && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2 relative z-10">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              <strong>AI Auto-Assign needs help!</strong> No existing team member matched the required skills: <strong>{requiredSkills}</strong>. The skills below have been pre-filled.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <UserPlus size={14} className="text-emerald-500" /> Full Name
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe" 
                  className="w-full pl-4 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Mail size={14} className="text-emerald-500" /> Work Email
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@company.com" 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText size={14} className="text-emerald-500" /> Resume Upload (PDF)
              </label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden" 
                  id="resume-upload"
                />
                <label 
                  htmlFor="resume-upload"
                  className="w-full flex flex-col items-center justify-center px-4 py-8 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all cursor-pointer group"
                >
                  <Upload size={24} className="text-gray-400 group-hover:text-emerald-500 mb-2 transition-colors" />
                  <span className="text-xs font-bold text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {resume ? resume.name : "Click to select or drag resume PDF"}
                  </span>
                </label>
              </div>
            </div>

            {extractedData && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 animate-in fade-in slide-in-from-top-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">AI Extracted Profile</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Suggested Role</label>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{extractedData.role}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Experience Level</label>
                    <p className="text-sm font-black text-gray-900 dark:text-white">Lvl {extractedData.experienceLevel}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Extracted Skills</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {extractedData.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-white dark:bg-gray-800 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-6 gap-4">
             <button 
               type="button" 
               onClick={onClose} 
               className="px-6 py-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isUploading}
                className={`flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-sm font-bold hover:brightness-110 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ShieldCheck size={18} />
                )}
                {isUploading ? "AI Extracting..." : "Add & AI Profile Member"}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;
