import { User } from "lucide-react";

const ProfileHeader = () => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Manage your account and preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
