import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  User,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define navigation items - some are admin only
  const adminNavItems = [
    { name: "Teams", path: "/teams", icon: <Users size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 size={18} /> },
  ];

  const regularNavItems = [
    { name: "Calendar", path: "/calendar", icon: <Calendar size={18} /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
  ];

  const baseNavItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Projects", path: "/project", icon: <FolderKanban size={18} /> },
    { name: "My Tasks", path: "/tasks", icon: <CheckSquare size={18} /> },
  ];

  // Combine nav items based on user role
  const navItems = [
    ...baseNavItems,
    ...(user?.isAdmin ? adminNavItems : []),
    ...regularNavItems,
  ];

  // Handle window resize to auto-toggle sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Desktop: open sidebar
        setIsOpen(true);
      } else {
        // Mobile: close sidebar
        setIsOpen(false);
      }
    };

    // Set initial state based on current window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  // Close sidebar when clicking on overlay (mobile)
  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  // Close sidebar when navigation link is clicked (mobile)
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed md:static top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 w-full px-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-30"
          onClick={handleOverlayClick}
        />
      )}
    </>
  );
};

export default Sidebar;
