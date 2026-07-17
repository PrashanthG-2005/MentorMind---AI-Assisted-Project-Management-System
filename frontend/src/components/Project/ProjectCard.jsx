import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  CheckCircle2,
  Calendar,
  Eye,
  Edit2
} from "lucide-react";

const ProjectCard = ({ project, onEdit }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/project/${project._id}`);
  };

  return (
    <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
          project.status === "On Track" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
          project.status === "At Risk" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
          project.status === "Delayed" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        }`}>
          {project.status}
        </span>
      </div>

      {/* Project Info */}
      <div className="pr-16">
        <h3 className="h-15 text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-300 font-medium">Progress</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Tasks Summary */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>{project.tasks?.completed || 0} completed</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>{project.tasks?.pending || 0} pending</span>
        </div>
      </div>

      {/* Team & Due Date */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex -space-x-2">
          {project.team?.slice(0, 4).map((member, idx) => (
            <img
              key={idx}
              src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`}
              alt={member.name}
              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 ring-2 ring-transparent"
              title={member.name}
            />
          ))}
          {project.team?.length > 4 && (
            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
              +{project.team.length - 4}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleView}
          className="flex-1 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={() => onEdit(project)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
