import { BarChart3, CheckCircle, Activity, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";

const ReportMetricCard = ({ type, title, value, progress, change, changeType }) => {
  const getIconAndColors = () => {
    switch (type) {
      case 'projects':
        return {
          icon: BarChart3,
          bgGradient: 'from-violet-500 to-purple-500',
          shadowColor: 'shadow-violet-500/30',
          hoverShadow: 'hover:shadow-violet-500/10'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          bgGradient: 'from-green-500 to-emerald-500',
          shadowColor: 'shadow-green-500/30',
          hoverShadow: 'hover:shadow-green-500/10'
        };
      case 'inProgress':
        return {
          icon: Activity,
          bgGradient: 'from-blue-500 to-cyan-500',
          shadowColor: 'shadow-blue-500/30',
          hoverShadow: 'hover:shadow-blue-500/10'
        };
      case 'overdue':
        return {
          icon: AlertCircle,
          bgGradient: 'from-red-500 to-orange-500',
          shadowColor: 'shadow-red-500/30',
          hoverShadow: 'hover:shadow-red-500/10'
        };
      default:
        return {
          icon: BarChart3,
          bgGradient: 'from-violet-500 to-purple-500',
          shadowColor: 'shadow-violet-500/30',
          hoverShadow: 'hover:shadow-violet-500/10'
        };
    }
  };

  const { icon: Icon, bgGradient, shadowColor, hoverShadow } = getIconAndColors();
  const progressWidth = type === 'overdue' ? 10 : type === 'inProgress' ? 35 : type === 'completed' ? progress : 75;

  return (
    <div className={`bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-xl ${hoverShadow} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bgGradient} flex items-center justify-center ${shadowColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className={`flex items-center gap-1 text-sm font-medium ${
          changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {changeType === 'positive' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {change}
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
      <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${bgGradient} rounded-full`} 
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ReportMetricCard;
