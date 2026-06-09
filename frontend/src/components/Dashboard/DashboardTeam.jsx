const DashboardTeam = ({ members }) => {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden relative">
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Team Members</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Collaboration network</p>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
          <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </button>
      </div>
      
      <div className="space-y-5 relative z-10">
        {members.length > 0 ? (
          members.map((member, index) => (
            <div key={index} className="group flex items-center gap-4 p-2 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all duration-300 cursor-pointer">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-sm scale-110" />
                <img
                  src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                  alt={member.name}
                  className="relative w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                />
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 shadow-sm ${
                  member.status === "online" ? "bg-emerald-500" : 
                  member.status === "away" ? "bg-amber-500" : "bg-slate-400"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {member.name}
                </h4>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide truncate">
                  {member.role}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 italic">No members found.</div>
        )}
      </div>
      
      <button className="w-full mt-6 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 transition-all duration-300">
        Manage All Members
      </button>
    </div>
  );
};

import { Users } from "lucide-react";

export default DashboardTeam;
