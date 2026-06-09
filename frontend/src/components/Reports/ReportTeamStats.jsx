import { Users, CheckCircle, TrendingUp } from "lucide-react";

const ReportTeamStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.teamMembers}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Team Members</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.onTimeDelivery}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">On-Time Delivery</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">87%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Efficiency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTeamStats;
