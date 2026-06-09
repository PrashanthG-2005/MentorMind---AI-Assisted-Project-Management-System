import { useNavigate } from "react-router-dom";

const DashboardRecentProjects = ({ projects }) => {
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
      case "On Track": return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Review":
      case "At Risk": return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
      case "Completed": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "Delayed": return "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400";
      default: return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-gray-700/30 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Projects</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your latest project developments</p>
        </div>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-indigo-600 dark:text-indigo-400 text-sm font-bold transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div 
              key={index} 
              onClick={() => navigate(`/project/${project._id}`)}
              className="group flex flex-col md:flex-row md:items-center gap-4 p-5 bg-white/50 dark:bg-gray-900/40 rounded-2xl border border-gray-100/50 dark:border-gray-700/30 hover:shadow-lg hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                {(project.name || project.title || "?").charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 dark:text-white text-lg truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {project.name || project.title}
                </h4>
                <div className="flex items-center gap-4 mt-1.5 font-medium">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] uppercase tracking-widest ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'TBD'}
                  </span>
                </div>
              </div>
              <div className="w-full md:w-32 flex flex-col items-end gap-2">
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full group-hover:brightness-110 transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-sm font-black text-gray-700 dark:text-gray-300">{project.progress}%</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">No recent projects found.</div>
        )}
      </div>
    </div>
  );
};

export default DashboardRecentProjects;
