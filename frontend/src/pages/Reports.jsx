import { useState, useEffect } from "react";
import { getProjects } from "../services/projectService";
import { getTasks } from "../services/taskService";
import { getUsers } from "../services/userService";

// Import Reports components
import ReportHeader from "../components/Reports/ReportHeader";
import ReportStats from "../components/Reports/ReportStats";
import ReportControls from "../components/Reports/ReportControls";
import ReportOverview from "../components/Reports/ReportOverview";
import ReportProjects from "../components/Reports/ReportProjects";
import ReportTeam from "../components/Reports/ReportTeam";

const Reports = () => {
  const [dateRange, setDateRange] = useState("this-month");
  const [viewMode, setViewMode] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [p, t, u] = await Promise.all([
          getProjects(),
          getTasks(),
          getUsers()
        ]);
        setProjects(p);
        setTasks(t);
        setUsers(u);
      } catch (error) {
        console.error("Error fetching reports data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Derived data for components
  const projectData = projects.map(p => ({
    id: p._id,
    name: p.title,
    progress: p.progress || 0,
    tasks: tasks.filter(t => t.project?._id === p._id || t.project === p._id).length,
    completed: tasks.filter(t => (t.project?._id === p._id || t.project === p._id) && t.status === 'Completed').length,
    team: p.team?.length || 0,
    status: p.status || "On Track"
  }));

  const teamPerformance = users.map(u => {
    const userTasks = tasks.filter(t => t.assignees?.some(a => (a._id || a) === u._id));
    const completed = userTasks.filter(t => t.status === 'Completed').length;
    return {
      id: u._id,
      name: u.name,
      role: u.role,
      tasksCompleted: completed,
      onTime: completed > 0 ? 90 : 0, // Mock on-time for now as we don't have historical tracking
      efficiency: completed > 0 ? 85 : 0 // Mock efficiency
    };
  });

  const taskDistribution = [
    { name: "Completed", value: tasks.filter(t => t.status === 'Completed').length, color: "bg-green-500" },
    { name: "In Progress", value: tasks.filter(t => t.status === 'In-Progress').length, color: "bg-blue-500" },
    { name: "Awaiting Confirmation", value: tasks.filter(t => t.status === 'Awaiting-Confirmation' || t.status === 'Pending').length, color: "bg-yellow-500" },
  ];

  // Helper for monthly trends (last 6 months)
  const getLast6Months = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      result.push({
        month: months[d.getMonth()],
        completed: 0,
        created: 0,
        monthIndex: d.getMonth(),
        year: d.getFullYear()
      });
    }
    return result;
  };

  const monthlyData = getLast6Months().map(m => {
    const createdCount = tasks.filter(t => {
      const dt = new Date(t.createdAt);
      return dt.getMonth() === m.monthIndex && dt.getFullYear() === m.year;
    }).length;
    const completedCount = tasks.filter(t => {
      const dt = new Date(t.updatedAt);
      return t.status === 'Completed' && dt.getMonth() === m.monthIndex && dt.getFullYear() === m.year;
    }).length;
    return { ...m, created: createdCount, completed: completedCount };
  });

  // Calculate stats
  const stats = {
    totalProjects: projects.length,
    completedProjects: projects.filter(p => p.status === "Completed" || p.status === "completed").length,
    atRiskProjects: projects.filter(p => p.status === "At Risk" || p.status === "at-risk").length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'Completed').length,
    inProgressTasks: tasks.filter(t => t.status === 'In-Progress').length,
    overdueTasks: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length,
    avgProgress: projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length) : 0,
    teamMembers: users.length,
    onTimeDelivery: 95,
  };

  const getStatusColor = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s === "completed") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (s === "on track" || s === "on-track") return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (s === "at risk" || s === "at-risk") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <ReportHeader />
            <ReportStats stats={stats} />
          </div>
        </div>

        {/* Controls Bar */}
        <div className="px-6 pb-6">
          <ReportControls 
            viewMode={viewMode}
            setViewMode={setViewMode}
            dateRange={dateRange}
            setDateRange={setDateRange}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {viewMode === "overview" && (
          <ReportOverview 
            stats={stats}
            projectData={projectData}
            monthlyData={monthlyData}
            taskDistribution={taskDistribution}
            getStatusColor={getStatusColor}
          />
        )}

        {viewMode === "projects" && (
          <ReportProjects 
            projectData={projectData}
            getStatusColor={getStatusColor}
          />
        )}

        {viewMode === "team" && (
          <ReportTeam 
            stats={stats}
            teamPerformance={teamPerformance}
          />
        )}
      </div>
    </div>
  );
};

export default Reports;
