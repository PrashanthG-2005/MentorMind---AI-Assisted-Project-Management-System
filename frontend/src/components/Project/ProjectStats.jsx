import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  FolderKanban
} from "lucide-react";

const ProjectStats = ({ stats }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-white/80" />
          <span className="text-white font-semibold">{stats.total}</span>
          <span className="text-white font-semibold text-sm">Total</span>
        </div>
      </div>
      <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-white/80" />
          <span className="text-white font-semibold">{stats.onTrack}</span>
          <span className="text-white font-semibold text-sm">On Track</span>
        </div>
      </div>
      <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/30">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-white/80" />
          <span className="text-white font-semibold">{stats.atRisk}</span>
          <span className="text-white font-semibold text-sm">At Risk</span>
        </div>
      </div>
      <div className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl shadow-lg shadow-violet-500/30">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-white/80" />
          <span className="text-white font-semibold">{stats.completed}</span>
          <span className="text-white font-semibold text-sm">Completed</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectStats;
