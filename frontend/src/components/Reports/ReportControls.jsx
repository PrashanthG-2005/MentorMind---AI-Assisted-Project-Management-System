import { Grid, BarChart3, Users, Calendar, Search, Download } from "lucide-react";

const ReportControls = ({ 
  viewMode, 
  setViewMode, 
  dateRange, 
  setDateRange, 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* View Toggle */}
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
        <button
          onClick={() => setViewMode("overview")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === "overview"
              ? "bg-white dark:bg-gray-600 shadow-md text-violet-600 dark:text-violet-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4" />
            Overview
          </div>
        </button>
        <button
          onClick={() => setViewMode("projects")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === "projects"
              ? "bg-white dark:bg-gray-600 shadow-md text-violet-600 dark:text-violet-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Projects
          </div>
        </button>
        <button
          onClick={() => setViewMode("team")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            viewMode === "team"
              ? "bg-white dark:bg-gray-600 shadow-md text-violet-600 dark:text-violet-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team
          </div>
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center gap-3">
        {/* Date Range */}
        <div className="relative">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer hover:border-violet-400 transition-all"
          >
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
          </select>
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>

        {/* Download Button */}
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-violet-500/30 transition-all transform hover:-translate-y-0.5">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
};

export default ReportControls;
