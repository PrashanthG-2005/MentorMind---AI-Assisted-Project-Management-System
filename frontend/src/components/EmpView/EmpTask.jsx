import { useState, useEffect, useCallback } from "react";
import { ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import TaskListView from "../Task/TaskListView";
import TaskModal from "../Task/TaskModal";
import { getTasks } from "../../services/taskService";
import { getUsers } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

const taskColumns = [
  { id: 'Awaiting-Confirmation', title: 'Awaiting Confirmation', color: 'bg-gray-100', dot: 'bg-gray-400' },
  { id: 'In-Progress', title: 'In Progress', color: 'bg-blue-100', dot: 'bg-blue-400' },
  { id: 'Completed', title: 'Completed', color: 'bg-emerald-100', dot: 'bg-emerald-400' },
];

const EmpTask = () => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  const fetchTasks = useCallback(async () => {
    try {
      const [t, u] = await Promise.all([getTasks(), getUsers()]);
      // Employees only see their own tasks
      let myTasks = t;
      if (!user?.isAdmin) {
        myTasks = t.filter((task) => 
          task.assignees?.some(a => (a._id || a) === user?._id || a.email === user?.email)
        );
      }
      setTasks(myTasks);
      setTeamMembers(u);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Employee Specific Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          My Tasks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {tasks.filter(t => t.status === 'Completed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {tasks.filter(t => t.status !== 'Completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden p-6">
        <TaskListView 
          filteredTasks={tasks} 
          columns={taskColumns} 
          onTaskClick={handleTaskClick} 
          onEditTask={handleTaskClick} 
        />
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          showTaskModal={showModal}
          setShowTaskModal={setShowModal}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          columns={taskColumns}
          teamMembers={teamMembers}
          isAdmin={false}
          onTaskSave={fetchTasks}
        />
      )}
    </div>
  );
};

export default EmpTask;
