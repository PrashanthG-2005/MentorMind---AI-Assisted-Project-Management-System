import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus
} from "lucide-react";

const CalendarWeekView = ({ currentDate, setCurrentDate, events, onEventClick, onCreateEvent }) => {
  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  const getEventsForDateAndHour = (date, hour) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      const eventHour = parseInt(event.time.split(':')[0]);
      return eventDate.toDateString() === date.toDateString() && eventHour === hour;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    if (setCurrentDate) {
      setCurrentDate(newDate);
    }
    return newDate;
  };

  const weekDays = getWeekDays(currentDate);
  const hours = getHours();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];

  const getEventStyle = (type) => {
    switch (type) {
      case "meeting":
        return "bg-gradient-to-r from-blue-400 to-blue-500 border-l-4 border-blue-600";
      case "deadline":
        return "bg-gradient-to-r from-red-400 to-red-500 border-l-4 border-red-600";
      case "event":
        return "bg-gradient-to-r from-emerald-400 to-emerald-500 border-l-4 border-emerald-600";
      case "reminder":
        return "bg-gradient-to-r from-amber-400 to-amber-500 border-l-4 border-amber-600";
      default:
        return "bg-gradient-to-r from-purple-400 to-purple-500 border-l-4 border-purple-600";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Week Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white ml-2">
            {monthNames[weekDays[0].getMonth()]} {weekDays[0].getDate()} - {monthNames[weekDays[6].getMonth()]} {weekDays[6].getDate()}, {weekDays[0].getFullYear()}
          </h2>
        </div>
        <button
          onClick={onCreateEvent}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/30"
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-8 border-b border-gray-100 dark:border-gray-700">
        <div className="w-16 border-r border-gray-100 dark:border-gray-700"></div>
        {weekDays.map((day, index) => (
          <div 
            key={index}
            className={`
              flex flex-col items-center justify-center py-3 border-r border-gray-100 dark:border-gray-700 last:border-r-0
              ${isToday(day) ? "bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30" : ""}
            `}
          >
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            <span className={`
              w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mt-1
              ${isToday(day) 
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/40" 
                : "text-gray-800 dark:text-gray-100"}
            `}>
              {day.getDate()}
            </span>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="max-h-[600px] overflow-y-auto">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-50 dark:border-gray-700/50">
            <div className="w-16 py-4 px-1 text-xs text-gray-400 dark:text-gray-500 border-r border-gray-100 dark:border-gray-700 text-right pr-2">
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </div>
            {weekDays.map((day, dayIndex) => {
              const hourEvents = getEventsForDateAndHour(day, hour);
              return (
                <div 
                  key={dayIndex}
                  className={`
                    min-h-[60px] p-1 border-r border-gray-50 dark:border-gray-700/50 last:border-r-0 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors cursor-pointer
                    ${isToday(day) ? "bg-indigo-50/30 dark:bg-indigo-900/10" : ""}
                  `}
                  onClick={() => {
                    const fakeEvent = { date: day.toISOString().split('T')[0], time: `${hour.toString().padStart(2, '0')}:00` };
                    onCreateEvent(fakeEvent);
                  }}
                >
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={`
                        ${getEventStyle(event.type)} text-white text-xs p-1.5 rounded-lg mb-1 cursor-pointer hover:scale-[1.02] transition-transform shadow-md
                      `}
                    >
                      <div className="font-semibold truncate">{event.title}</div>
                      <div className="flex items-center gap-1 opacity-90 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWeekView;
