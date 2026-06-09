import { Search, Filter, Grid, List, UserPlus } from "lucide-react";

const TeamControls = ({ 
  searchTerm, 
  setSearchTerm, 
  roleFilter, 
  setRoleFilter, 
  viewMode, 
  setViewMode, 
  roles,
  onAddClick 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
        />
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center gap-3">
        {/* Role Filter */}
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer hover:border-emerald-400 transition-all"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              viewMode === "grid"
                ? "bg-white dark:bg-gray-600 shadow-md text-emerald-600 dark:text-emerald-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            title="Grid view"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              viewMode === "list"
                ? "bg-white dark:bg-gray-600 shadow-md text-emerald-600 dark:text-emerald-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            title="List view"
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {/* Add Button */}
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <UserPlus className="w-5 h-5" />
          Add Member
        </button>
      </div>
    </div>
  );
};

export default TeamControls;
