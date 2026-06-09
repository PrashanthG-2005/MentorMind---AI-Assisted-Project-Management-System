import { Folder, CheckCircle, Clock, Users } from "lucide-react";

const ProfileStats = ({ stats }) => {
  const statItems = [
    { label: "Projects Completed", value: stats.projectsCompleted, icon: Folder, color: "from-blue-500 to-cyan-500" },
    { label: "Tasks Completed", value: stats.tasksCompleted, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
    { label: "Hours Worked", value: stats.hoursWorked, icon: Clock, color: "from-purple-500 to-pink-500" },
    { label: "Team Members", value: stats.teamMembers, icon: Users, color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg mb-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileStats;
