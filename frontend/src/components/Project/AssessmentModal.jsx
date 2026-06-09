import { useState } from "react";
import { 
  X, 
  Brain, 
  Target, 
  Clock, 
  MapPin, 
  Send,
  Zap,
  CheckCircle2
} from "lucide-react";
import axios from "axios";

const AssessmentModal = ({ isOpen, onClose, notification, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    abilityDetails: "",
    accuracySelfScore: 85,
    expectedDeadline: "",
    workLocation: "Remote",
    preferredTools: ""
  });

  if (!isOpen || !notification) return null;

  const project = notification.project;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      await axios.post(
        `http://localhost:5001/api/projects/${project._id}/assessments/submit`,
        formData,
        config
      );

      setSuccess(true);
      setTimeout(() => {
        onComplete();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Assessment submission failed:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden border border-white/20 dark:border-gray-700/50 flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="relative p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Skill Assessment</h2>
              <p className="text-white/70 text-sm font-medium">Mission: {project?.title}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-white/20">
              {project?.category}
            </span>
            <span className="px-3 py-1 bg-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/30">
              Required Response
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Assessment Deployed!</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Your ability profile has been matched to the project.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                  <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
                    <Target className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">Mission Target</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                    {project?.description || "No project briefing provided."}
                  </p>
                </div>

                <div className="group">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                    Ability & Experience Details
                  </label>
                  <textarea
                    name="abilityDetails"
                    required
                    value={formData.abilityDetails}
                    onChange={handleChange}
                    placeholder="Describe your specific skills that match this project's requirements..."
                    rows={4}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Self Accuracy Score (%)
                    </label>
                    <input
                      type="number"
                      name="accuracySelfScore"
                      min="0"
                      max="100"
                      value={formData.accuracySelfScore}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="group">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      Proposed Deadline
                    </label>
                    <input
                      type="date"
                      name="expectedDeadline"
                      required
                      value={formData.expectedDeadline}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Work Location
                  </label>
                  <div className="flex p-1.5 bg-gray-100 dark:bg-gray-900/80 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                    {['Remote', 'Hybrid', 'On-Site'].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, workLocation: loc }))}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                          formData.workLocation === loc 
                            ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5" 
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Assessment Response
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                This response will be reviewed by the project lead.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentModal;
