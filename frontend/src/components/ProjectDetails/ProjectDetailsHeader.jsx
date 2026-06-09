import { ArrowLeft, MoreVertical, Share2, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectDetailsHeader = ({ project }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "On Track": return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case "At Risk": return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      case "Delayed": return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Completed": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{project?.title}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project?.status)}`}>
                  {project?.status}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Created on {project?.createdAt}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsHeader;
