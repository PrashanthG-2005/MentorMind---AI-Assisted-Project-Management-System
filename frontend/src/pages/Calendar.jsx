import { useState, useEffect } from "react";
import { getTasks } from "../services/taskService";
import { getUsers } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import TaskModal from "../components/Task/TaskModal";

import CalendarHeader from "../components/Calendar/CalendarHeader";
import CalendarGrid from "../components/Calendar/CalendarGrid";
import CalendarWeekView from "../components/Calendar/CalendarWeekView";
import CalendarSidebar from "../components/Calendar/CalendarSidebar";

const taskColumns = [
  { id: 'Awaiting-Confirmation', title: 'Awaiting Confirmation', color: '#6B7280' },
  { id: 'In-Progress', title: 'In Progress', color: '#3B82F6' },
  { id: 'Completed', title: 'Completed', color: '#10B981' }
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // "month" or "week"
  const { user } = useAuth();
  const isAdmin = user?.isAdmin || false;
  
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchData = async () => {
    try {
      const [fetchedTasks, fetchedUsers] = await Promise.all([
        getTasks(),
        getUsers()
      ]);
      setTasks(fetchedTasks);
      setTeamMembers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format mapping: Calendar events from tasks
  const calendarEvents = tasks.map(t => {
     let type = 'task';
     if (t.priority === 'high') type = 'meeting';
     if (t.title.toLowerCase().includes('deadline')) type = 'deadline';
     return {
         id: t._id,
         title: t.title,
         type: type,
         date: t.dueDate ? t.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
         time: "12:00 PM",
         description: t.description,
         priority: t.priority,
         assignees: t.assignees,
         task: t // Keep the original task object
     };
  });

  const handleEventClick = (event) => {
    setSelectedTask(event.task);
    setShowTaskModal(true);
  };

  const handleCreateEvent = (fakeEvent) => {
    const newDueDate = fakeEvent?.date || selectedDate.toISOString().split('T')[0];
    setSelectedTask({ dueDate: newDueDate });
    setShowTaskModal(true);
  };

  if (loading) {
     return <div className="p-6 text-gray-500">Loading Calendar...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
      <div className="p-6">
        {/* Header navigation bar */}
        <div className="mb-6">
          <CalendarHeader 
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Grid View */}
          <div className="flex-1">
            {viewMode === "month" ? (
              <CalendarGrid 
                currentDate={currentDate}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                events={calendarEvents}
                onEventClick={handleEventClick}
                onCreateEvent={handleCreateEvent}
              />
            ) : (
              <CalendarWeekView 
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                events={calendarEvents}
                onEventClick={handleEventClick}
                onCreateEvent={handleCreateEvent}
              />
            )}
          </div>

          {/* Sidebar Section */}
          <div className="w-full lg:w-80 shrink-0">
            <CalendarSidebar 
              selectedDate={selectedDate}
              events={calendarEvents}
              onCreateEvent={handleCreateEvent}
              onEventClick={handleEventClick}
            />
          </div>
        </div>
      </div>

      {/* Task Modal Integration */}
      <TaskModal 
        showTaskModal={showTaskModal}
        setShowTaskModal={setShowTaskModal}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        columns={taskColumns}
        teamMembers={teamMembers}
        isAdmin={isAdmin}
        onTaskSave={async () => {
           await fetchData();
        }}
        isEventMode={true}
      />
    </div>
  );
};

export default Calendar;
