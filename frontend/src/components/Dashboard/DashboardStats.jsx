import { TrendingUp, TrendingDown } from "lucide-react";

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Background Accent Gradient */}
            <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity rounded-full blur-3xl`} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  stat.changeType === "increase" || stat.changeType === "positive"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {stat.changeType === "increase" || stat.changeType === "positive" ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {stat.change}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {stat.name || stat.title}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
