const ProjectDetailsActivity = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Activity</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{activities.length} activities</span>
      </div>
      <div className="p-4">
        <div className="relative">
          {activities.map((activity, index) => (
            <div key={activity._id} className="flex gap-4 pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                </div>
                {index < activities.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-gray-800 dark:text-white">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-gray-500 dark:text-gray-400">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsActivity;
