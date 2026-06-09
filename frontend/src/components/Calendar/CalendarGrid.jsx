import { 
  Plus,
  Star,
  Sparkles
} from "lucide-react";

const CalendarGrid = ({ currentDate, selectedDate, setSelectedDate, events, onEventClick, onCreateEvent }) => {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getEventTypeStyle = (type, index) => {
    const styles = [
      { bg: "from-blue-400 to-blue-500", shadow: "shadow-blue-500/30", border: "border-blue-600" },
      { bg: "from-red-400 to-red-500", shadow: "shadow-red-500/30", border: "border-red-600" },
      { bg: "from-emerald-400 to-emerald-500", shadow: "shadow-emerald-500/30", border: "border-emerald-600" },
      { bg: "from-amber-400 to-amber-500", shadow: "shadow-amber-500/30", border: "border-amber-600" },
      { bg: "from-purple-400 to-purple-500", shadow: "shadow-purple-500/30", border: "border-purple-600" },
      { bg: "from-pink-400 to-pink-500", shadow: "shadow-pink-500/30", border: "border-pink-600" },
      { bg: "from-cyan-400 to-cyan-500", shadow: "shadow-cyan-500/30", border: "border-cyan-600" },
    ];
    return styles[index % styles.length];
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];

  // Get current month stats
  const currentMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentDate.getMonth() && 
           eventDate.getFullYear() === currentDate.getFullYear();
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Calendar Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              {isToday(currentDate) && (
                <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3" fill="currentColor" />
                  Today
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onCreateEvent}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:scale-105"
          >
            <Plus size={18} />
            Add Event
          </button>
        </div>
        
        {/* Month Stats */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>{currentMonthEvents.length} events this month</span>
          </div>
        </div>
      </div>
      
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b-2 border-gray-100 dark:border-gray-700">
        {weekDays.map((day, index) => (
          <div 
            key={day} 
            className={`
              text-center text-sm font-bold py-4 uppercase tracking-wider
              ${index === 0 || index === 6 
                ? "text-red-500 dark:text-red-400" 
                : "text-gray-600 dark:text-gray-400"}
            `}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Days */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day.date);
          
          return (
            <div
              key={index}
              onClick={() => setSelectedDate(day.date)}
              className={`
                min-h-[130px] p-2 border-r border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-300
                ${day.isCurrentMonth ? "bg-white dark:bg-gray-800" : "bg-gray-50/50 dark:bg-gray-800/50"}
                ${isSelected(day.date) 
                  ? "bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 ring-2 ring-inset ring-indigo-500" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/30 hover:scale-[1.02] transition-transform"}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`
                  w-8 h-8 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300
                  ${isToday(day.date) 
                    ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/40 transform scale-110" 
                    : day.isCurrentMonth 
                      ? "text-gray-800 dark:text-gray-100" 
                      : "text-gray-300 dark:text-gray-600"
                  }
                  ${isSelected(day.date) && !isToday(day.date)
                    ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                    : ""
                  }
                `}>
                  {day.day}
                </span>
                {dayEvents.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></span>
                )}
              </div>
              
              <div className="space-y-1.5">
                {dayEvents.slice(0, 3).map((event, eventIndex) => {
                  const eventStyle = getEventTypeStyle(event.type, eventIndex);
                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={`
                        px-2 py-1.5 rounded-lg text-xs font-semibold truncate cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
                        bg-gradient-to-r ${eventStyle.bg} ${eventStyle.shadow} text-white
                      `}
                    >
                      {event.title}
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 px-2 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors cursor-pointer flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
