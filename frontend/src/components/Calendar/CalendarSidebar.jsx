import { Plus, Calendar, Clock, Flag, Star, ChevronRight, Sparkles } from "lucide-react";

const CalendarSidebar = ({ selectedDate, events, onCreateEvent, onEventClick }) => {
  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventTypeStyle = (type) => {
    switch (type) {
      case "meeting":
        return {
          bg: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10",
          border: "border-l-4 border-l-blue-500",
          icon: "text-blue-500",
          badge: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
          gradient: "from-blue-400 to-blue-500"
        };
      case "deadline":
        return {
          bg: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10",
          border: "border-l-4 border-l-red-500",
          icon: "text-red-500",
          badge: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400",
          gradient: "from-red-400 to-red-500"
        };
      case "event":
        return {
          bg: "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10",
          border: "border-l-4 border-l-emerald-500",
          icon: "text-emerald-500",
          badge: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
          gradient: "from-emerald-400 to-emerald-500"
        };
      case "reminder":
        return {
          bg: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10",
          border: "border-l-4 border-l-amber-500",
          icon: "text-amber-500",
          badge: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
          gradient: "from-amber-400 to-amber-500"
        };
      default:
        return {
          bg: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10",
          border: "border-l-4 border-l-purple-500",
          icon: "text-purple-500",
          badge: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400",
          gradient: "from-purple-400 to-purple-500"
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-emerald-500";
      default: return "text-gray-500";
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const dayEvents = getEventsForDate(selectedDate);
  
  // Get upcoming events
  const upcomingEvents = events.slice(0, 5);

  // Get next 7 days
  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      days.push(day);
    }
    return days;
  };
  
  const next7Days = getNext7Days();

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full rounded-l-2xl shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long' }) : 'Select a date'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
            </p>
          </div>
          <button
            onClick={onCreateEvent}
            className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/30 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 bg-white dark:bg-gray-700/50 rounded-xl p-3 text-center shadow-sm">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              {dayEvents.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Events</div>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-700/50 rounded-xl p-3 text-center shadow-sm">
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              {events.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total</div>
          </div>
        </div>
      </div>

      {/* 7 Days Preview */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          Next 7 Days
        </h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {next7Days.map((day, idx) => {
            const dayEventsCount = getEventsForDate(day).length;
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
            
            return (
              <button
                key={idx}
                onClick={() => {
                  const fakeEvent = { date: day.toISOString().split('T')[0] };
                  onCreateEvent(fakeEvent);
                }}
                className={`
                  flex-shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center gap-1 transition-all
                  ${isToday 
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30" 
                    : isSelected
                      ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500"
                      : "bg-gray-50 dark:bg-gray-700/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-600 dark:text-gray-400"}
                `}
              >
                <span className="text-xs font-medium opacity-80">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-lg font-bold">
                  {day.getDate()}
                </span>
                {dayEventsCount > 0 && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-indigo-500'}`}></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {dayEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-indigo-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-semibold">No events scheduled</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Click + to add a new event</p>
          </div>
        ) : (
          dayEvents.map((event) => {
            const style = getEventTypeStyle(event.type);
            return (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className={`
                  p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl
                  bg-gradient-to-br ${style.bg} dark:bg-gray-700/30 ${style.border}
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${style.badge}`}>
                        {event.type}
                      </span>
                      {isToday(new Date(event.date)) && (
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                      )}
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-white truncate text-lg">{event.title}</h4>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className={`w-4 h-4 ${style.icon}`} />
                        {event.time}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <Flag className={`w-5 h-5 ${getPriorityColor(event.priority)} flex-shrink-0 mt-1`} />
                </div>
                {event.assignees && event.assignees.length > 0 && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-600">
                    <div className="flex -space-x-2">
                      {event.assignees.slice(0, 3).map((assignee, idx) => (
                        <img
                          key={idx}
                          src={assignee.avatar}
                          alt={assignee.name}
                          className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800"
                        />
                      ))}
                    </div>
                    {event.assignees.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        +{event.assignees.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Upcoming Events Section */}
        {!selectedDate && upcomingEvents.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ChevronRight className="w-3 h-3" />
              Upcoming Events
            </h4>
            <div className="space-y-2">
              {upcomingEvents.map((event) => {
                const style = getEventTypeStyle(event.type);
                return (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${style.gradient}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {event.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarSidebar;
