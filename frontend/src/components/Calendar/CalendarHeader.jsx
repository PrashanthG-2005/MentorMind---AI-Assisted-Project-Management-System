import { 
  ChevronLeft, 
  ChevronRight, 
  List,
  Grid3X3
} from "lucide-react";

const CalendarHeader = ({ currentDate, setCurrentDate, viewMode, setViewMode }) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Month Navigation */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-white dark:bg-gray-700/50 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-600">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        
        <h2 className="text-lg font-bold text-gray-800 dark:text-white min-w-[200px]">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={goToToday}
          className="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
        >
          Today
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-1 p-1 bg-white dark:bg-gray-700/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
        <button
          onClick={() => setViewMode("month")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            viewMode === "month"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
        >
          <Grid3X3 size={16} />
          Month
        </button>
        <button
          onClick={() => setViewMode("week")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            viewMode === "week"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
        >
          <List size={16} />
          Week
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
