import { Target, CheckCircle, Clock, TrendingUp } from "lucide-react";

const ReportStats = ({ stats }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl shadow-lg shadow-violet-500/30">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-white/80" />
          <span className="text-white font-semibold">{stats.totalProjects}</span>
          <span className="text-white font-semibold text-sm">Projects</span>
        </div>
      </div>
      <div className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-500/30">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-white/80" />
          <span className="text-white font-semibold">{stats.completedTasks}</span>
          <span className="text-white font-semibold text-sm">Completed</span>
        </div>
      </div>
      <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/30">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/80" />
          <span className="text-white font-semibold">{stats.overdueTasks}</span>
          <span className="text-white font-semibold text-sm">Overdue</span>
        </div>
      </div>
      <div className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-white/80" />
          <span className="text-white font-semibold">{stats.avgProgress}%</span>
          <span className="text-white font-semibold text-sm">Progress</span>
        </div>
      </div>
    </div>
  );
};

export default ReportStats;
