import { Sun, Moon, Laptop, Layout } from "lucide-react";

const AppearanceSettings = () => {
  const themes = [
    { id: "light", label: "Light", icon: Sun, color: "bg-white border-gray-200" },
    { id: "dark", label: "Dark", icon: Moon, color: "bg-gray-900 border-gray-800" },
    { id: "system", label: "System", icon: Laptop, color: "bg-gradient-to-br from-white to-gray-900 border-gray-300" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Theme Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Theme Preference</h3>
          <p className="text-sm text-gray-500">Choose how the application looks for you.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon;
            return (
              <button 
                key={theme.id}
                className={`relative group h-40 rounded-2xl border-2 transition-all p-4 flex flex-col items-center justify-center gap-4 ${
                  theme.id === "dark" ? "border-indigo-600 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10" : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                } ${theme.color}`}
              >
                <div className={`p-3 rounded-full ${
                  theme.id === "dark" ? "bg-indigo-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`font-semibold ${theme.id === "dark" ? "text-white" : "text-gray-900 dark:text-white"}`}>
                  {theme.label}
                </span>
                {theme.id === "dark" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interface Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl">
            <Layout className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Interface Customization</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">Compact Sidebar</p>
              <p className="text-xs text-gray-500">Minimize the sidebar for more screen space.</p>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-indigo-600">
              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">Animations</p>
              <p className="text-xs text-gray-500">Enable smooth UI transitions and micro-animations.</p>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-indigo-600">
              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
