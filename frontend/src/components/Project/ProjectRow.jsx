import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  Edit2,
  Trash2
} from "lucide-react";

const ProjectRow = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/project/${project._id}`);
  };

  return (
    <tr 
      className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group"
    >
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {project.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-xs">
            {project.description}
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
          project.status === "On Track" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
          project.status === "At Risk" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
          project.status === "Delayed" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        }`}>
          {project.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-24 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {project.progress}%
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex -space-x-2">
          {project.team?.slice(0, 4).map((member, idx) => (
            <img
              key={idx}
              src={member.avatar}
              alt={member.name}
              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
              title={member.name}
            />
          ))}
          {project.team?.length > 4 && (
            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
              +{project.team.length - 4}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
        {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleView}
            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(project)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(project._id)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProjectRow;
