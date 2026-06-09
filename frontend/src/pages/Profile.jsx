import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks } from "../services/taskService";
import { getProjects } from "../services/projectService";

// Import Profile components
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileStats from "../components/Profile/ProfileStats";
import ProfileTabs from "../components/Profile/ProfileTabs";
import ProfileInfo from "../components/Profile/ProfileInfo";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projectsCompleted: "0",
    tasksCompleted: "0",
    hoursWorked: "0h",
    teamMembers: "0"
  });
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      setIsLoading(true);
      try {
        const [allTasks, allProjects] = await Promise.all([
          getTasks(),
          getProjects()
        ]);

        // Filter tasks assigned to user
        const userTasks = allTasks.filter(task => 
          task.assignees?.some(a => (a._id || a) === user._id)
        );

        // Filter projects involving user
        const userProjects = allProjects.filter(project => 
          (project.owner?._id || project.owner) === user._id || 
          project.team?.some(t => (t.user?._id || t.user || t._id || t) === user._id)
        );

        const completedProjects = userProjects.filter(p => p.status === 'Completed' || p.status === 'completed').length;
        
        setStats({
          projectsCompleted: completedProjects.toString(),
          tasksCompleted: userTasks.filter(t => t.status === 'Completed').length.toString(),
          hoursWorked: "124h", // Mock or from user data if exists
          teamMembers: userProjects.reduce((acc, p) => acc + (p.team?.length || 0), 0).toString()
        });

        // Generate activity from tasks
        const recentActivity = userTasks
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5)
          .map(task => ({
            type: 'task',
            action: task.status === 'Completed' ? 'completed task' : 'updated task',
            target: task.title,
            time: new Date(task.updatedAt).toLocaleDateString()
          }));
        
        setActivity(recentActivity);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  // Render content based on active tab
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <ProfileInfo user={user} />
            
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {activity.length > 0 ? (
                  activity.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-xl transition-colors">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.type === 'task' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                        item.type === 'comment' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {item.type === 'task' ? '✓' : item.type === 'comment' ? '📝' : '📁'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 dark:text-gray-100">
                          <span className="font-semibold">{user.name}</span> {item.action}{" "}
                          <span className="text-blue-600 dark:text-blue-400 font-medium">{item.target}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent activity found.</p>
                )}
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Notification Preferences</h3>
            {[
              { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
              { key: "push", label: "Push Notifications", desc: "Receive push notifications" },
              { key: "weekly", label: "Weekly Digest", desc: "Weekly summary of activities" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{item.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                <button className="w-12 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                  <div className="w-5 h-5 bg-white rounded-full transform translate-x-6"></div>
                </button>
              </div>
            ))}
          </div>
        );
      case "security":
        return (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Add extra security to your account</p>
                </div>
                <button className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg font-medium">
                  Enabled
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/30 transition-colors">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">Change Password</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update your password regularly</p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700 p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">General Settings</h3>
            <p className="text-gray-500 dark:text-gray-400">Configure your global application preferences.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">Language</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred display language</p>
                </div>
                <select className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 text-sm dark:text-white">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">Timezone</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Automatic detection enabled</p>
                </div>
                <span className="text-sm text-gray-500">GMT+5:30</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ProfileHeader />
      <div className="px-6 py-4">
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="p-6">
        {activeTab === "profile" && !isLoading && <ProfileStats stats={stats} />}
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;
