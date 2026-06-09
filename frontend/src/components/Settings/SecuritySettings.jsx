import { useState } from "react";
import { Lock, Smartphone, LogOut } from "lucide-react";
import { updatePassword } from "../../services/userService";

const SecuritySettings = () => {
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setError("All fields are required");
      return;
    }

    if (passwords.new.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(false);
    try {
      setLoading(true);
      await updatePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      setSuccess("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Change Password */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Change Password</h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100 dark:border-emerald-900 text-sm font-medium">
            ✅ {success}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
              <input 
                type="password"
                required
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
              <input 
                type="password"
                required
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
              <input 
                type="password"
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Password Requirements:</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                At least 6 characters long
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Include at least one uppercase letter
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                Include at least one number
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                Include one special character
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

      {/* Two-Factor Auth */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
            </div>
          </div>
          <button className="relative w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors">
            <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform"></div>
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <LogOut className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Active Sessions</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm">
                💻
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">Chrome on MacOS</p>
                <p className="text-xs text-gray-500">London, UK • Active Now</p>
              </div>
            </div>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">Current</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm">
                📱
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">Safari on iPhone 13</p>
                <p className="text-xs text-gray-500">London, UK • 2 hours ago</p>
              </div>
            </div>
            <button className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline">Revoke</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
