import { useState, useMemo, useEffect } from "react";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { 
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

// Defined columns inline
const taskColumns = [
  { id: 'Awaiting-Confirmation', title: 'Awaiting Confirmation', color: '#6B7280' },
  { id: 'In-Progress', title: 'In Progress', color: '#3B82F6' },
  { id: 'Completed', title: 'Completed', color: '#10B981' }
];

// Import split components
import TaskHeader from '../components/Task/TaskHeader';
import TaskColumn from '../components/Task/TaskColumn';
import TaskModal from '../components/Task/TaskModal';
import TaskListView from '../components/Task/TaskListView';
import { useAuth } from "../context/AuthContext";
import { getTasks, updateTaskStatus } from "../services/taskService";
import { getUsers } from "../services/userService";
import { getProjects } from "../services/projectService";

// Main Task Component
const Task = () => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin || false;

  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [columns] = useState(taskColumns);
  const [viewMode, setViewMode] = useState('board');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskStatus, setNewTaskStatus] = useState('todo');
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedTasks, fetchedUsers, fetchedProjects] = await Promise.all([
          getTasks(),
          getUsers(),
          getProjects()
        ]);
        setTasks(fetchedTasks);
        setTeamMembers(fetchedUsers);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === '' || 
                         task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === '' || task.priority === priorityFilter;
    const matchesProject = selectedProject === '' || (task.project?._id || task.project) === selectedProject;
    
    // Core Idea: Employees only view assigned tasks
    let matchesAssignee = true;
    if (!isAdmin) {
      matchesAssignee = task.assignees?.some(a => 
        a.name === user?.name || a.email === user?.email || a._id === user?._id
      );
    }

    return matchesSearch && matchesPriority && matchesProject && matchesAssignee;
  });

  const tasksByColumn = useMemo(() => {
    const grouped = {};
    columns.forEach(col => {
      grouped[col.id] = filteredTasks.filter(t => t.status === col.id);
    });
    return grouped;
  }, [filteredTasks, columns]);

  const taskStats = {
    total: tasks.length,
    awaiting: tasks.filter(t => t.status === 'Awaiting-Confirmation').length,
    inProgress: tasks.filter(t => t.status === 'In-Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
  };

  const handleDragStart = (event) => {
    if (!isAdmin) return; // Prevent employees from dragging
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    if (!isAdmin) return;
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const activeTask = tasks.find(t => t._id === active.id);
      
      if (activeTask && activeTask.status !== over.id) {
        // Find if dropping into empty column or another task
        const isColumnDrop = columns.find(c => c.id === over.id);
        const overTask = tasks.find(t => t._id === over.id);
        const newStatus = isColumnDrop ? over.id : (overTask ? overTask.status : activeTask.status);

        if (activeTask.status !== newStatus) {
           const previousStatus = activeTask.status;
           
           // Optimistic update
           setTasks(tasks.map(t => 
             t._id === active.id 
               ? { ...t, status: newStatus }
               : t
           ));

           try {
             await updateTaskStatus(active.id, newStatus);
           } catch (error) {
             alert("Failed to update status on server: " + error);
             setTasks(tasks.map(t => 
               t._id === active.id 
                 ? { ...t, status: previousStatus }
                 : t
             ));
           }
        }
      }
    }
  };

  const handleDragOver = (event) => {
    if (!isAdmin) return;
    const { active, over } = event;
    
    if (!over) return;

    const activeTask = tasks.find(t => t._id === active.id);
    const overTask = tasks.find(t => t._id === over.id);

    if (activeTask && overTask && activeTask.status !== overTask.status) {
      setTasks(tasks.map(t => 
        t._id === active.id 
          ? { ...t, status: overTask.status }
          : t
      ));
    }
  };

  const openTaskDetails = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const openCreateModal = (status = 'Pending') => {
    setSelectedTask(null);
    setNewTaskStatus(status);
    setShowTaskModal(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const getActiveTask = () => {
    return tasks.find(t => t._id === activeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header Component */}
      <TaskHeader
        taskStats={taskStats}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        projects={projects}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onNewTask={openCreateModal}
        isAdmin={isAdmin}
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex-1 p-6">
          {viewMode === 'board' ? (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
            >
              <div className="flex gap-6 overflow-x-auto pb-4 h-full">
                {columns.map(column => (
                  <TaskColumn 
                    key={column.id} 
                    column={column} 
                    tasks={tasksByColumn[column.id] || []}
                    onTaskClick={openTaskDetails}
                    onEditTask={openEditModal}
                    onAddTask={openCreateModal}
                  />
                ))}
              </div>
              <DragOverlay>
                {activeId ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-2xl border-2 border-blue-500 rotate-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {getActiveTask()?.title}
                      </span>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            // List View Component
            <TaskListView 
              filteredTasks={filteredTasks}
              onTaskClick={openTaskDetails}
              onEditTask={openEditModal}
            />
          )}
        </div>
      )}

      {/* Task Modal Component */}
      <TaskModal 
        showTaskModal={showTaskModal}
        setShowTaskModal={setShowTaskModal}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        columns={columns}
        teamMembers={teamMembers}
        isAdmin={isAdmin}
        defaultStatus={newTaskStatus}
        // Need to pass a refresh trigger down if modal edits tasks, but the page handles state
        onTaskSave={async () => {
           const fetchedTasks = await getTasks();
           setTasks(fetchedTasks);
        }}
      />
    </div>
  );
};

export default Task;
