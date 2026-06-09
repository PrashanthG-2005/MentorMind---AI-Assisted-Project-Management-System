import { 
  Bell, 
  Shield, 
  Eye, 
  Palette, 
  Globe 
} from "lucide-react";

const SettingsSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "security", label: "Security", icon: Shield, description: "Passwords and authentication" },
    { id: "notifications", label: "Notifications", icon: Bell, description: "Email and push preferences" },
    { id: "appearance", label: "Appearance", icon: Palette, description: "Themes and visual styles" },
    { id: "privacy", label: "Privacy", icon: Eye, description: "Data and visibility settings" },
    { id: "language", label: "Language", icon: Globe, description: "Regional and language options" },
  ];

  return (
    <div className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 text-left ${
              isActive
                ? "bg-white dark:bg-gray-800 shadow-lg shadow-indigo-500/10 border border-indigo-100 dark:border-indigo-900/50"
                : "hover:bg-white/50 dark:hover:bg-gray-800/50"
            }`}
          >
            <div className={`p-2 rounded-xl ${
              isActive 
                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400" 
                : "bg-gray-100 text-gray-500 dark:bg-gray-700/50"
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className={`font-semibold text-sm ${
                isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"
              }`}>
                {item.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                {item.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SettingsSidebar;
