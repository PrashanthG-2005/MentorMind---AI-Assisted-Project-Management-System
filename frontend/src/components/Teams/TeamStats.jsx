import { UserCheck, Activity, Clock, Briefcase } from "lucide-react";

const TeamStats = ({ stats }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-white/80" />
          <span className="text-white font-semibold">{stats.total}</span>
          <span className="text-white font-semibold text-sm">Members</span>
        </div>
      </div>
      <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-white/80" />
          <span className="text-white font-semibold">{stats.online}</span>
          <span className="text-white font-semibold text-sm">Online</span>
        </div>
      </div>
      <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/30">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/80" />
          <span className="text-white font-semibold">{stats.away}</span>
          <span className="text-white font-semibold text-sm">Away</span>
        </div>
      </div>
      <div className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl shadow-lg shadow-violet-500/30">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-white/80" />
          <span className="text-white font-semibold">{stats.totalProjects}</span>
          <span className="text-white font-semibold text-sm">Projects</span>
        </div>
      </div>
    </div>
  );
};

export default TeamStats;
