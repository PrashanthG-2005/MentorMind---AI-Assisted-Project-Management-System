import ProjectStats from "./ProjectStats";

const ProjectHeader = ({ stats }) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Title Section */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Projects
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage and track all your projects in one place
            </p>
          </div>

          {/* Stats Cards */}
          <ProjectStats stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
