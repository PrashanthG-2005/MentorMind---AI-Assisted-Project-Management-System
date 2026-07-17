import { CheckCircle, Clock, FileText, Plus, Edit2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { autoAssignTasks } from "../../services/projectService";
import { getUsers } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import TaskModal from "../Task/TaskModal";

const taskColumns = [
  { id: 'Pending', title: 'Pending' },
  { id: 'In-Progress', title: 'In Progress' },
  { id: 'Under-Review', title: 'Under Review' },
  { id: 'Completed', title: 'Completed' },
  { id: 'Rework-Required', title: 'Rework Required' }
];

const ProjectDetailsTasks = ({ tasks, projectId, onTasksAutoAssigned }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.isAdmin || false;

  const { id } = useParams();
  const [showAutoAssign, setShowAutoAssign] = useState(false);
  const [documentText, setDocumentText] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [unassignedTasks, setUnassignedTasks] = useState([]);
  const [showUnassignedSummary, setShowUnassignedSummary] = useState(false);

  // Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setTeamMembers(users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleAutoAssign = async () => {
    if (!documentText.trim()) return;
    setIsAssigning(true);
    try {
      const response = await autoAssignTasks(id, documentText);
      
      if (response.unassignedTasks && response.unassignedTasks.length > 0) {
        setUnassignedTasks(response.unassignedTasks);
        setShowUnassignedSummary(true);
      } else {
        alert("All tasks successfully assigned!");
      }
      
      setShowAutoAssign(false);
      setDocumentText("");
      if (onTasksAutoAssigned) onTasksAutoAssigned(); 
    } catch (error) {
      alert("Error: " + error);
    } finally {
      setIsAssigning(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "In-Progress": return <Clock className="w-5 h-5 text-blue-500" />;
      case "Under-Review": return <Clock className="w-5 h-5 text-amber-500" />;
      case "Rework-Required": return <Clock className="w-5 h-5 text-red-500" />;
      default: return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      case "medium": return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low": return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Tasks</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">{tasks?.length || 0} tasks</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">{tasks?.length || 0} tasks</span>
          {isAdmin && (
            <>
              <button 
                onClick={() => setShowAutoAssign(!showAutoAssign)}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-lg transition-colors text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                AI
              </button>
              <button 
                onClick={() => { setSelectedTask(null); setShowTaskModal(true); }}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </>
          )}
        </div>
      </div>

      {showAutoAssign && (
        <div className="p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-900/20 dark:via-gray-800 dark:to-purple-900/20 border-b border-indigo-100 dark:border-indigo-800/30 relative overflow-hidden">
           {/* AI logic here (omitted for brevity but kept functional) */}
           <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">AI Task Generation</h4>
              </div>
            </div>
            <textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Paste requirements..."
              className="w-full h-32 p-3 text-sm border border-indigo-100 dark:border-indigo-800/50 rounded-xl bg-white/80 dark:bg-gray-900/80 dark:text-white resize-none"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAutoAssign}
                disabled={isAssigning || !documentText.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg"
              >
                {isAssigning ? "Processing..." : "Generate Tasks"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUnassignedSummary && (
        <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">New Talent Needed</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI identified {unassignedTasks.length} tasks that require skills not currently in your team.</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            {unassignedTasks.map((t, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-amber-100 dark:border-amber-800/30">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t.title}</span>
                <div className="flex flex-wrap gap-1">
                  {t.requiredSkills.map((s, si) => (
                    <span key={si} className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-bold uppercase">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => {
                const skills = Array.from(new Set(unassignedTasks.flatMap(t => t.requiredSkills))).join(',');
                navigate(`/teams?requiredSkills=${skills}`);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20"
            >
              Add Capable Members
            </button>
            <button 
              onClick={() => setShowUnassignedSummary(false)}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-bold"
            >
              Later
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {tasks.map((task) => (
          <div key={task._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
            <div className="flex items-start gap-3">
              {getStatusIcon(task.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800 dark:text-white truncate">{task.title}</h4>
                  <button 
                    onClick={() => { setSelectedTask(task); setShowTaskModal(true); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Due: {formatDate(task.dueDate)}
                  </span>
                  {task.assignees && task.assignees.length > 0 && (
                    <div className="flex -space-x-2">
                      {task.assignees.map((assignee, idx) => (
                        <img
                          key={idx}
                          src={assignee.avatar || "https://i.pravatar.cc/150"}
                          alt={assignee.name}
                          className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TaskModal 
        showTaskModal={showTaskModal}
        setShowTaskModal={setShowTaskModal}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        columns={taskColumns}
        teamMembers={teamMembers}
        isAdmin={isAdmin}
        onTaskSave={() => {
          if (onTasksAutoAssigned) onTasksAutoAssigned([]); // Trigger refresh in parent
        }}
        fixedProjectId={projectId}
      />
    </div>
  );
};

export default ProjectDetailsTasks;
