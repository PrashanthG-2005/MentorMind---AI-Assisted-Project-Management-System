import { X, Calendar, Clock, Flag, Users, FileText, Tag, Sparkles, ChevronRight } from "lucide-react";

const CalendarModal = ({ isOpen, onClose, event, onSave, selectedDate }) => {
  if (!isOpen) return null;

  const priorities = [
    { value: "high", label: "High", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
    { value: "medium", label: "Medium", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { value: "low", label: "Low", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  ];

  const eventTypes = [
    { value: "meeting", label: "Meeting", color: "from-blue-400 to-blue-500", icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" },
    { value: "deadline", label: "Deadline", color: "from-red-400 to-red-500", icon: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400" },
    { value: "event", label: "Event", color: "from-emerald-400 to-emerald-500", icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" },
    { value: "reminder", label: "Reminder", color: "from-amber-400 to-amber-500", icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400" },
  ];

  const teamMembers = [
    { name: "Suresh", avatar: "https://i.pravatar.cc/150?u=suresh", role: "Manager" },
    { name: "Arun", avatar: "https://i.pravatar.cc/150?u=arun", role: "Developer" },
    { name: "Priya", avatar: "https://i.pravatar.cc/150?u=priya", role: "Designer" },
    { name: "Kumar", avatar: "https://i.pravatar.cc/150?u=kumar", role: "Developer" },
  ];

  return (
    <div className="fixed top-16 left-0 md:left-64 right-0 bottom-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          
          <div className="relative p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {event ? 'Edit Event' : 'Create New Event'}
                </h2>
                <p className="text-white/80 text-sm">
                  {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a date'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* Wave decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-4">
            <svg viewBox="0 0 1440 48" className="absolute bottom-0 w-full">
              <path fill="#ffffff" d="M0,32L48,37.3C96,43,192,53,288,53.3C384,53,480,43,576,37.3C672,32,768,32,864,37.3C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,48L1392,48C1344,48,1248,48,1152,48C1056,48,960,48,864,48C768,48,672,48,576,48C480,48,384,48,288,48C192,48,96,48,48,48L0,48Z"></path>
            </svg>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Event Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Event Title
            </label>
            <input 
              type="text"
              defaultValue={event?.title || ''}
              placeholder="Enter event title"
              className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 border-2 border-transparent outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all text-lg font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="w-4 h-4 text-purple-500" />
              Description
            </label>
            <textarea 
              rows={2}
              defaultValue={event?.description || ''}
              placeholder="Enter event description (optional)"
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 border-2 border-transparent outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all resize-none"
            />
          </div>

          {/* Date & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Date
              </label>
              <input 
                type="date"
                defaultValue={event?.date || selectedDate?.toISOString().split('T')[0] || ''}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 border-2 border-transparent outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all font-medium"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="w-4 h-4 text-pink-500" />
                Event Type
              </label>
              <select 
                defaultValue={event?.type || 'meeting'}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 border-2 border-transparent outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all font-medium cursor-pointer"
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                Start Time
              </label>
              <input 
                type="time"
                defaultValue={event?.time || '09:00'}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 border-2 border-transparent outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all font-medium"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 text-amber-500" />
                End Time
              </label>
              <input 
                type="time"
                defaultValue={event?.endTime || '10:00'}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100 border-2 border-transparent outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all font-medium"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              <Flag className="w-4 h-4 text-red-500" />
              Priority Level
            </label>
            <div className="flex gap-3">
              {priorities.map((priority) => (
                <label 
                  key={priority.value}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl cursor-pointer transition-all
                    ${priority.bg}
                    ${event?.priority === priority.value || (!event && priority.value === 'medium') 
                      ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800' 
                      : 'hover:scale-105'}
                  `}
                >
                  <Flag className={`w-4 h-4 ${priority.color}`} />
                  <input 
                    type="radio" 
                    name="priority" 
                    value={priority.value} 
                    defaultChecked={event?.priority === priority.value || (!event && priority.value === 'medium')}
                    className="w-4 h-4 text-indigo-600" 
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{priority.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Users className="w-4 h-4 text-violet-500" />
              Team Members
              <span className="text-xs font-normal text-gray-400">(Optional)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {teamMembers.map((member) => (
                <label 
                  key={member.name}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-all"
                >
                  <input type="checkbox" className="w-4 h-4 rounded text-indigo-600" />
                  <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{member.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-2 border-gray-200 dark:border-gray-600"
          >
            Cancel
          </button>
          <button 
            onClick={onSave}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:scale-105 flex items-center gap-2"
          >
            {event ? 'Save Changes' : 'Create Event'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
