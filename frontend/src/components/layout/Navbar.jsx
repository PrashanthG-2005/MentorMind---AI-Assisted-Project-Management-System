import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Bell, 
  Sun, 
  Moon, 
  Search, 
  ChevronDown, 
  Settings, 
  LogOut,
  MessageSquare,
  Menu,
  X,
  CheckCircle2,
  Brain
} from "lucide-react";
import axios from "axios";
import AssessmentModal from "../Project/AssessmentModal";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const { data } = await axios.get('http://localhost:5001/api/notifications', config);
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        fetchNotifications();
      }, 0);
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [user]);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
      setNotificationsOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationSelect = async (notif) => {
    if (notif.type === 'assessment_request') {
      setSelectedNotification(notif);
      setAssessmentModalOpen(true);
    }
    
    // Mark as read
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await axios.patch(`http://localhost:5001/api/notifications/${notif._id}/read`, {}, config);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification read:", error);
    }
    setNotificationsOpen(false);
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
    setNotificationsOpen(false);
  };

  const handleNotificationsClick = (e) => {
    e.stopPropagation();
    setNotificationsOpen(!notificationsOpen);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 z-50">
      <div className="flex items-center justify-between px-4 h-full">
        
        {/* Left: Mobile Menu Toggle + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="MentorMind Logo"
              className="h-10 w-auto object-contain"
            />
            <h1 className="text-2xl serif font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              MentorMind 2.0
            </h1>
          </div>
        </div>
        
        {/* Search Bar - Hidden on mobile, visible on md and above */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative group w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search projects, tasks, team members..."
              className="w-full pl-12 pr-4 py-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle could be added here */}
          
          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all group"
            title="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-amber-500 transition-colors" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-indigo-500 transition-colors" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={handleNotificationsClick}
              className="relative p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all group"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-indigo-500 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">You have {unreadCount} unread alerts</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif._id} 
                        onClick={() => handleNotificationSelect(notif)}
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer border-b border-gray-50 dark:border-gray-800/50 transition-colors ${!notif.isRead ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            notif.type === 'assessment_request' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                            notif.type === 'task' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>
                            {notif.type === 'assessment_request' ? <Brain className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-800 dark:text-white">{notif.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{notif.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleTimeString()}</p>
                          </div>
                          {!notif.isRead && (
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Messages Button */}
          <Link to="/messages" className="relative p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all group">
            <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-purple-500 transition-colors" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              5
            </span>
          </Link>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={handleDropdownClick}
              className="flex items-center gap-2 p-1.5 pr-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all"
            >
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff&size=64`}
                alt="User"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-gray-800 dark:text-white">{user?.name || "User"}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-gray-100 dark:border-gray-800">
                  <p className="font-bold text-gray-800 dark:text-white">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || "user@email.com"}</p>
                </div>
                <div className="py-2">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" onClick={() => setDropdownOpen(false)}>
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </Link>
                </div>
                <div className="px-2 py-2 border-t border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AssessmentModal 
        isOpen={assessmentModalOpen}
        onClose={() => setAssessmentModalOpen(false)}
        notification={selectedNotification}
        onComplete={fetchNotifications}
      />
    </div>
  );
};

export default Navbar;
