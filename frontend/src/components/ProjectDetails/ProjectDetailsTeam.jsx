import { 
  Mail, 
  Phone, 
  Target, 
  Zap, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Brain
} from "lucide-react";
import { calculateMatchScore, getScoreColor } from "../../utils/skillMatcher.js";

const ProjectDetailsTeam = ({ team }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white">Elite Personnel</h3>
          <p className="text-xs text-gray-500 font-medium">Mission assignments and readiness scores</p>
        </div>
        <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-black uppercase tracking-widest">{team.length} Active</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {team.map((member, index) => {
          // Flatten user if populated, otherwise use member.user or member
          const person = member.user?._id ? member.user : (member.user || member);
          const isCompleted = member.assessmentStatus === 'Completed';
          
          return (
            <div key={index} className={`flex flex-col p-5 rounded-3xl border transition-all duration-300 ${
              isCompleted 
                ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-xl shadow-black/5" 
                : "bg-gray-50/50 dark:bg-gray-900/30 border-dashed border-gray-200 dark:border-gray-800"
            }`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img
                    src={person.avatar || `https://ui-avatars.com/api/?name=${person.name}`}
                    alt={person.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/10"
                  />
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-gray-900 dark:text-white truncate text-lg tracking-tight">{person.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {member.role || 'Personnel'}
                    </span>
                    {!isCompleted && (
                      <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">
                        Awaiting Test
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Brain className={`w-3.5 h-3.5 ${getScoreColor(calculateMatchScore(person.skills, member.role).score)}`} />
                    <span className={`text-[10px] font-black uppercase tracking-wider ${getScoreColor(calculateMatchScore(person.skills, member.role).score)}`}>
                      {calculateMatchScore(person.skills, member.role).score}% Skill Fit
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2.5 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {isCompleted ? (
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50 dark:border-gray-700">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Accuracy Score</p>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-sm font-black text-gray-900 dark:text-white">{member.assessmentScore}%</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Work Model</p>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{member.location}</span>
                    </div>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Availability Target</p>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {member.deadline ? new Date(member.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 py-6 bg-gray-50 dark:bg-gray-900/20 rounded-2xl border border-dashed border-gray-100 dark:border-gray-800 text-center">
                  <div className="flex flex-col items-center">
                    <AlertCircle className="w-5 h-5 text-gray-300 mb-2" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Waiting for response...</p>
                  </div>
                  {calculateMatchScore(person.skills, member.role).score < 50 && (
                    <div className="px-4">
                      <p className="text-[8px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 dark:bg-rose-900/10 py-1 rounded-full border border-rose-100 dark:border-rose-800">
                        Skill Gap Detected
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectDetailsTeam;
