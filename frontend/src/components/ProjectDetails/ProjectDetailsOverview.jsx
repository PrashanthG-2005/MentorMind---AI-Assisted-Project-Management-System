import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Brain,
  Zap
} from "lucide-react";
import { calculateMatchScore } from "../../utils/skillMatcher.js";

const ProjectDetailsOverview = ({ project }) => {
  const team = project.team || [];
  const requiredRoles = project.requiredRoles || [];
  
  // Calculate readiness
  const completedAssessments = team.filter(m => m.assessmentStatus === 'Completed').length;
  const totalRequired = requiredRoles.reduce((acc, current) => acc + current.count, 0);
  const readinessPercent = totalRequired > 0 ? Math.round((completedAssessments / totalRequired) * 100) : 0;

  // Calculate Average Skill Fit
  const teamFitScores = team.map(m => {
    const person = m.user?._id ? m.user : (m.user || m);
    return calculateMatchScore(person.skills, m.role).score;
  });
  const averageSkillFit = teamFitScores.length > 0 
    ? Math.round(teamFitScores.reduce((a, b) => a + b, 0) / teamFitScores.length) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Readiness & Personnel Target */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Mission Readiness</h3>
              <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Assessment Status</p>
            </div>
          </div>
          <div className="flex items-center gap-8 text-right">
            <div>
              <span className="text-3xl font-black tracking-tighter">{readinessPercent}%</span>
              <p className="text-[10px] font-black uppercase text-white/50">Fully Validated</p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <div className="flex items-center gap-1.5 justify-end">
                <Zap className="w-4 h-4 text-amber-400 fill-current" />
                <span className="text-3xl font-black tracking-tighter">{averageSkillFit}%</span>
              </div>
              <p className="text-[10px] font-black uppercase text-white/50">Skill Strength</p>
            </div>
          </div>
        </div>

        <div className="h-4 bg-white/10 rounded-full overflow-hidden mb-6 ring-1 ring-white/20">
          <div 
            className="h-full bg-white rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            style={{ width: `${readinessPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {requiredRoles.map((req, i) => {
            const filledCount = team.filter(m => m.role === req.role && m.assessmentStatus === 'Completed').length;
            const isDone = filledCount >= req.count;
            return (
              <div key={i} className={`p-3 rounded-2xl border transition-all ${
                isDone ? "bg-white/10 border-white/20" : "bg-black/20 border-white/10 opacity-70"
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black truncate pr-1">{req.role}</span>
                  {isDone ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-amber-400" />}
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg font-black">{filledCount}</span>
                    {req.description && (
                      <p className="text-[7px] text-white/50 leading-tight mt-1 line-clamp-2 max-w-xs">{req.description}</p>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-white/40 mb-1">/ {req.count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Description */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-black text-gray-900 dark:text-white">Mission Briefing</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-[1.8] font-medium">{project?.description}</p>
      </div>

      {/* Progress & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Technical Execution</h3>
            <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black">{project?.progress}%</span>
          </div>
          <div className="h-3 bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700"
              style={{ width: `${project?.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
            <span>Tasks Analysis</span>
            <span>{project?.stats?.completed || 0} / {project?.stats?.total || 0}</span>
          </div>
        </div>

        {/* Dates & Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Timeline Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <Calendar className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inception</p>
                <p className="text-sm font-black text-gray-900 dark:text-gray-100">
                  {project?.startDate ? new Date(project.startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Pending'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <Clock className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Final Strike</p>
                <p className="text-sm font-black text-gray-900 dark:text-gray-100">
                  {project?.dueDate ? new Date(project.dueDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsOverview;
