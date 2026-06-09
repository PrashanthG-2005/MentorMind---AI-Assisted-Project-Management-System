import ReportMetricCard from "./ReportMetricCard";
import ReportTable from "./ReportTable";

const ReportOverview = ({ stats, projectData, monthlyData, taskDistribution, getStatusColor }) => {
  const totalTasks = projectData.reduce((acc, p) => acc + p.tasks, 0);
  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.completed, d.created)));

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportMetricCard 
          type="projects" 
          title="Total Projects" 
          value={stats.totalProjects} 
          progress={75}
          change="12%"
          changeType="positive"
        />
        <ReportMetricCard 
          type="completed" 
          title="Tasks Completed" 
          value={stats.completedTasks} 
          progress={(stats.completedTasks / stats.totalTasks) * 100}
          change="8%"
          changeType="positive"
        />
        <ReportMetricCard 
          type="inProgress" 
          title="In Progress" 
          value={stats.inProgressTasks} 
          progress={35}
          change="5%"
          changeType="positive"
        />
        <ReportMetricCard 
          type="overdue" 
          title="Overdue Tasks" 
          value={stats.overdueTasks} 
          progress={10}
          change="3%"
          changeType="negative"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Monthly Performance</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-violet-500"></span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-fuchsia-500"></span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 h-48 items-end">
                  <div 
                    className="flex-1 bg-gradient-to-t from-violet-500 to-violet-400 rounded-t-lg transition-all duration-300 hover:from-violet-600 hover:to-violet-500"
                    style={{ height: `${(data.completed / maxValue) * 100}%` }}
                    title={`Completed: ${data.completed}`}
                  ></div>
                  <div 
                    className="flex-1 bg-gradient-to-t from-fuchsia-500 to-fuchsia-400 rounded-t-lg transition-all duration-300 hover:from-fuchsia-600 hover:to-fuchsia-500"
                    style={{ height: `${(data.created / maxValue) * 100}%` }}
                    title={`Created: ${data.created}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6">Task Distribution</h3>
          
          <div className="flex items-center gap-8">
            {/* Pie Chart Visualization */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {taskDistribution.reduce((acc, item, index) => {
                  const percentage = item.value / taskDistribution.reduce((a, b) => a + b.value, 0) * 100;
                  const dashArray = percentage * 2.51;
                  const dashOffset = 251 - acc;
                  const colors = ['#22c55e', '#3b82f6', '#eab308', '#ef4444'];
                  acc += dashArray;
                  return (
                    <>
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={colors[index]}
                        strokeWidth="12"
                        strokeDasharray={`${dashArray} 251`}
                        strokeDashoffset={dashOffset}
                        className="transition-all duration-300"
                      />
                    </>
                  );
                }, 0)}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalTasks}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3">
              {taskDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.value}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({Math.round(item.value / totalTasks * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Progress Table */}
      <ReportTable projectData={projectData} getStatusColor={getStatusColor} />
    </div>
  );
};

export default ReportOverview;
