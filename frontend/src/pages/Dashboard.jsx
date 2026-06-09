import { useState, useEffect } from "react";
import { 
  LayoutDashboard,
  Users,
  Folder,
  ClipboardList,
  Search,
  Plus
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Import API services
import { getProjects } from "../services/projectService";
import { getTasks } from "../services/taskService";
import { getUsers } from "../services/userService";

// Import Dashboard components
import DashboardStats from "../components/Dashboard/DashboardStats";
import DashboardRecentProjects from "../components/Dashboard/DashboardRecentProjects";
import DashboardTeam from "../components/Dashboard/DashboardTeam";
import DashboardActivities from "../components/Dashboard/DashboardActivities";
import DashboardTasks from "../components/Dashboard/DashboardTasks";

// Import EmpView components
import EmpProject from "../components/EmpView/EmpProject";
import EmpTask from "../components/EmpView/EmpTask";
import EmpTeam from "../components/EmpView/EmpTeam";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, t, m] = await Promise.all([
          getProjects(),
          getTasks(),
          getUsers()
        ]);
        setProjects(p);
        setTasks(t);
        setMembers(m);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute stats dynamically
  const dashboardStats = [
    {
      id: 1,
      name: "Total Projects",
      value: projects.length.toString(),
      change: "+2.5%",
      changeType: "increase",
      icon: Folder,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      name: "Active Tasks",
      value: tasks.filter(t => t.status !== 'Completed').length.toString(),
      change: "-4.2%",
      changeType: "decrease",
      icon: ClipboardList,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      name: "Team Members",
      value: members.length.toString(),
      change: "+12.5%",
      changeType: "increase",
      icon: Users,
      gradient: "from-amber-500 to-orange-500"
    }
  ];

  const dashboardRecentProjects = [...projects].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const dashboardTeamMembers = members.slice(0, 5);
  const dashboardTasks = tasks.filter(t => t.status !== 'Completed').slice(0, 5);

  // Generate activities from projects and tasks
  const projectActivities = projects.map(p => ({
    user: p.owner?.name || "Admin",
    action: "created project",
    target: p.title,
    time: new Date(p.createdAt).toLocaleDateString(),
    avatar: p.owner?.avatar,
    timestamp: new Date(p.createdAt)
  }));

  const taskActivities = tasks.map(t => ({
    user: t.assignees?.[0]?.name || "Team Member",
    action: t.status === 'Completed' ? "completed task" : "updated task",
    target: t.title,
    time: new Date(t.updatedAt).toLocaleDateString(),
    avatar: t.assignees?.[0]?.avatar,
    timestamp: new Date(t.updatedAt)
  }));

  const dashboardActivities = [...projectActivities, ...taskActivities]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  // Define views based on user role
  const baseViews = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
  ];

  const employeeViews = [
    { id: "project", label: "Project", icon: Folder },
    { id: "tasks", label: "Tasks", icon: ClipboardList },
    { id: "team", label: "Team", icon: Users },
  ];

  const adminViews = [
    { id: "project", label: "Project", icon: Folder },
    { id: "tasks", label: "Tasks", icon: ClipboardList },
    { id: "team", label: "Team", icon: Users },
  ];

  const views = [
    ...baseViews,
    ...(user?.isAdmin ? adminViews : employeeViews),
  ];

  const renderViewContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (activeView) {
      case "project":
        return <EmpProject />;
      case "tasks":
        return <EmpTask />;
      case "team":
        return <EmpTeam />;
      default:
        // Overview
        return (
          <>
            <DashboardStats stats={dashboardStats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
              <div className="lg:col-span-2">
                <DashboardRecentProjects projects={dashboardRecentProjects} />
                <div className="mt-6">
                  <DashboardActivities activities={dashboardActivities} />
                </div>
              </div>
              <div className="space-y-6">
                <DashboardTeam members={dashboardTeamMembers} />
                <DashboardTasks tasks={dashboardTasks} />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Welcome back, {user?.name || "User"}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2.5 bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64"
                />
              </div>
              {user?.isAdmin && (
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5">
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
              )}
            </div>
          </div>
          <div className="mt-6">
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl w-fit">
              {views.map((view) => {
                const Icon = view.icon;
                const isActive = activeView === view.id;
                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white dark:bg-gray-600 shadow-sm text-indigo-600 dark:text-indigo-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {view.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 overflow-hidden">
        {renderViewContent()}
      </div>
    </div>
  );
};

export default Dashboard;
