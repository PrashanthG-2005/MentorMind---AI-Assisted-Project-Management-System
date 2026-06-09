import { CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react";

const ProjectDetailsStats = ({ stats }) => {
  const statItems = [
    { label: "Total Tasks", value: stats.total, icon: CheckCircle2, color: "from-blue-500 to-cyan-500" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "from-yellow-500 to-orange-500" },
    { label: "Overdue", value: stats.overdue, icon: AlertCircle, color: "from-red-500 to-pink-500" },
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

export default ProjectDetailsStats;
