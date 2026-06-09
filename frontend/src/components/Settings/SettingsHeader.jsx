import { 
  Bell, 
  Shield, 
  Eye, 
  Palette, 
  Globe 
} from "lucide-react";

const SettingsHeader = () => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account preferences and security settings.
        </p>
      </div>
    </div>
  );
};

export default SettingsHeader;
