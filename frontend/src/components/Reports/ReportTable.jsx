const ReportTable = ({ projectData, getStatusColor }) => {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Project Progress</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tasks
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {projectData.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{project.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{project.tasks} total tasks</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          project.progress >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                          project.progress >= 50 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                          'bg-gradient-to-r from-red-500 to-red-400'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{project.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {project.completed}/{project.tasks}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2">
                    {Array(Math.min(project.team, 3)).fill().map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-white font-medium">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    {project.team > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 font-medium">
                        +{project.team - 3}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status === "on-track" ? "On Track" : 
                     project.status === "at-risk" ? "At Risk" : 
                     project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;
