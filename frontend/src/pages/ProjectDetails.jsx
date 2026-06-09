import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Import API services
import { getProjectById } from "../services/projectService";
import { getTasks, createTask as apiCreateTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from "../services/taskService";
import { useAuth } from "../context/AuthContext";

// Import ProjectDetails components
import ProjectDetailsHeader from "../components/ProjectDetails/ProjectDetailsHeader";
import ProjectDetailsStats from "../components/ProjectDetails/ProjectDetailsStats";
import ProjectDetailsTabs from "../components/ProjectDetails/ProjectDetailsTabs";
import ProjectDetailsOverview from "../components/ProjectDetails/ProjectDetailsOverview";
import ProjectDetailsTasks from "../components/ProjectDetails/ProjectDetailsTasks";
import ProjectDetailsTeam from "../components/ProjectDetails/ProjectDetailsTeam";
import ProjectDetailsActivity from "../components/ProjectDetails/ProjectDetailsActivity";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const isAdmin = user?.isAdmin || false;

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const [projectData, tasksData] = await Promise.all([
          getProjectById(id),
          getTasks(id) // fetch tasks by projectId
        ]);
        setProject({
            ...projectData,
            stats: { ...projectData.tasks, budget: "$0", timeSpent: "0h" },
            activities: [] // Activities can be implemented later or fetched from an audit log
        });
        setTasks(tasksData);
      } catch (error) {
        console.error("Failed to load project details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 gap-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Project Not Found</h2>
        <button onClick={() => navigate("/project")} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Go Back</button>
      </div>
    );
  }

  const teamMembers = project.team || [];

  // Filter tasks: Employees only see their own assigned tasks
  const visibleTasks = isAdmin 
    ? tasks 
    : tasks.filter(task => task.assignees?.some(a => a.name === user?.name || a.email === user?.email || a._id === user?._id));

  // Handler for creating new task
  const handleCreateTask = async (newTask) => {
    try {
      const created = await apiCreateTask({ ...newTask, project: id });
      setTasks((prev) => [created, ...prev]);
    } catch (err) {
      alert("Error creating task: " + err);
    }
  };

  // Handler for editing task
  const handleEditTask = async (updatedTask) => {
    try {
      const updated = await apiUpdateTask(updatedTask._id, updatedTask);
      setTasks((prev) => prev.map(t => t._id === updated._id ? updated : t));
    } catch (err) {
      alert("Error updating task: " + err);
    }
  };

  // Handler for deleting task
  const handleDeleteTask = async (taskId) => {
    try {
      await apiDeleteTask(taskId);
      setTasks((prev) => prev.filter(t => t._id !== taskId));
    } catch (err) {
      alert("Error deleting task: " + err);
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProjectDetailsOverview project={project} />;
      case "tasks":
        return (
          <ProjectDetailsTasks 
            tasks={visibleTasks} 
            onAddTask={handleCreateTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            projectId={project._id}
            onTasksAutoAssigned={(newTasks) => setTasks([...newTasks, ...tasks])}
          />
        );
      case "team":
        return <ProjectDetailsTeam team={teamMembers} />;
      case "activity":
        return <ProjectDetailsActivity activities={project.activities || []} />;
      default:
        return <ProjectDetailsOverview project={project} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Component */}
      <ProjectDetailsHeader project={project} />

      {/* Stats Component */}
      <div className="px-6 py-6">
        <ProjectDetailsStats stats={project.stats} />
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-300 font-medium">Overall Progress</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{project.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs Component */}
      <ProjectDetailsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
