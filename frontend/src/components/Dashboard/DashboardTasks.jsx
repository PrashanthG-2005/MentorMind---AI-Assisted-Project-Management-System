const DashboardTasks = ({ tasks }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200/50";
      case "medium": return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200/50";
      case "low": return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200/50";
      default: return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 border-gray-200/50";
    }
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden relative">
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Active Tasks</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Things to focus on</p>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
          <ClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </button>
      </div>
      
      <div className="space-y-4 relative z-10">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div 
              key={index}
              className="group flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-900/40 rounded-2xl border border-gray-100/50 dark:border-gray-700/30 hover:shadow-lg hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
            >
              <div className="pt-1">
                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                  task.status === 'Completed' || task.completed
                    ? "bg-indigo-500 border-indigo-500 scale-110 shadow-lg shadow-indigo-500/30"
                    : "border-gray-300 dark:border-gray-600 group-hover:border-indigo-500 group-hover:scale-110"
                }`}>
                  {(task.status === 'Completed' || task.completed) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-gray-900 dark:text-white truncate transition-all duration-300 ${
                  task.status === 'Completed' || task.completed ? "opacity-50 line-through scale-[0.98]" : "group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                }`}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-widest font-black border ${getPriorityColor(task.priority)}`}>
                    {task.priority || 'Medium'}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 italic">All caught up! No active tasks.</div>
        )}
      </div>
      
      <button className="w-full mt-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5">
        Add New Task
      </button>
    </div>
  );
};

import { CheckCircle, ClipboardList, Clock } from "lucide-react";

export default DashboardTasks;
