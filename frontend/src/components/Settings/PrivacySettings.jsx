import { Eye, EyeOff, UserCheck, ShieldQuest } from "lucide-react";

const PrivacySettings = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Visibility */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Profile Visibility</h3>
            <p className="text-sm text-gray-500">Control who can see your profile and activity.</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border-2 border-indigo-600 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900 dark:text-white">Public (Team Only)</p>
              <p className="text-xs text-gray-500">Your colleagues and admins can see your profile details.</p>
            </div>
            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 flex items-center gap-4 transition-all">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900 dark:text-white">Private</p>
              <p className="text-xs text-gray-500">Only admins can view your full profile and performance metrics.</p>
            </div>
            <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Data Sharing */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Data Collection</h3>
          <p className="text-sm text-gray-500">How we use your data to improve performance.</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">Performance Analytics</p>
              <p className="text-xs text-gray-500">Allow AI analysis of task completion patterns.</p>
            </div>
            <button className="relative w-12 h-6 rounded-full bg-indigo-600">
              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">Error Logs</p>
              <p className="text-xs text-gray-500">Send anonymous crash reports to our dev team.</p>
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

export default PrivacySettings;
