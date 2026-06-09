import { BarChart3 } from "lucide-react";

const ReportProjectCard = ({ project, getStatusColor }) => {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status === "on-track" ? "On Track" : 
           project.status === "at-risk" ? "At Risk" : 
           project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{project.name}</h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-gray-400">Progress</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">{project.progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Tasks</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{project.completed}/{project.tasks}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Team</span>
          <div className="flex -space-x-1">
            {Array(Math.min(project.team, 3)).fill().map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border border-white dark:border-gray-800"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportProjectCard;
