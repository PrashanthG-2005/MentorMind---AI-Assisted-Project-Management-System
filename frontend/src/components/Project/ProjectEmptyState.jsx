import { FolderKanban, Plus } from "lucide-react";

const ProjectEmptyState = ({ onCreateClick }) => {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
        <FolderKanban className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No projects found</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
      >
        <Plus className="w-5 h-5" />
        Create New Project
      </button>
    </div>
  );
};

export default ProjectEmptyState;
