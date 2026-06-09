const DashboardActivities = ({ activities }) => {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-gray-700/30 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Real-time updates from your team</p>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
          <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </button>
      </div>
      
      <div className="space-y-6 relative z-10">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="flex gap-4 relative">
              {index !== activities.length - 1 && (
                <div className="absolute left-6 top-12 bottom-[-24px] w-0.5 bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-700" />
              )}
              <div className="relative">
                <img
                  src={activity.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activity.user)}&background=random`}
                  alt={activity.user}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-gray-700 shadow-sm relative z-10"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center z-20 border border-gray-100 dark:border-gray-700">
                   <div className="w-2 h-2 rounded-full bg-indigo-500" />
                </div>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                  <span className="font-bold hover:text-indigo-600 cursor-pointer transition-colors">{activity.user}</span>
                  {" "}<span className="text-gray-500 dark:text-gray-400">{activity.action}</span>{" "}
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">{activity.target}</span>
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 italic">No recent activities to show.</div>
        )}
      </div>
      
      <button className="w-full mt-6 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 transition-all duration-300">
        All Activity Logs
      </button>
    </div>
  );
};

import { Activity } from "lucide-react";

export default DashboardActivities;
