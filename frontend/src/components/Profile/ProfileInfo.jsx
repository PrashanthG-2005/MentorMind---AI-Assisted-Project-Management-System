import { User, Mail, Phone, MapPin, Calendar, Briefcase, Edit, Camera, Building2, Globe, Link2 } from "lucide-react";

const ProfileInfo = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
          <button className="absolute bottom-3 right-3 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
            <Camera className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="px-6 pb-6">
          <div className="relative -mt-16 mb-4">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff&size=150`}
              alt={user?.name || "User"}
              className="w-28 h-28 rounded-2xl border-4 border-white dark:border-gray-800 object-cover"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-indigo-500 text-white rounded-xl shadow-lg hover:bg-indigo-600 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user?.name || "Member Name"}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user?.role || "Team Member"}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.bio || "No bio added yet."}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors">
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <Mail className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm text-gray-800 dark:text-gray-100">{user?.email || "Not provided"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <Phone className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
              <p className="text-sm text-gray-800 dark:text-gray-100">{user?.phone || "Not linked"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <MapPin className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
              <p className="text-sm text-gray-800 dark:text-gray-100">{user?.location || "Global"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <Building2 className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Company</p>
              <p className="text-sm text-gray-800 dark:text-gray-100">{user?.company || "MentorMind"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Additional Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              <span className="text-gray-600 dark:text-gray-400">Department</span>
            </div>
            <span className="text-gray-800 dark:text-gray-100">{user?.department || "Engineering"}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <span className="text-gray-600 dark:text-gray-400">Join Date</span>
            </div>
            <span className="text-gray-800 dark:text-gray-100">{user?.joinDate || user?.joinedAt?.split('T')[0] || "Recent"}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-indigo-500" />
              <span className="text-gray-600 dark:text-gray-400">Website</span>
            </div>
            <span className="text-gray-800 dark:text-gray-100">{user?.website || "mentormind.ai"}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Link2 className="w-5 h-5 text-indigo-500" />
              <span className="text-gray-600 dark:text-gray-400">LinkedIn</span>
            </div>
            <span className="text-gray-800 dark:text-gray-100">{user?.linkedin || "linkedin.com/in/user"}</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {user?.skills?.length > 0 ? user.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium"
            >
              {skill}
            </span>
          )) : (
            <span className="text-sm text-gray-500">No skills added.</span>
          )}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {user?.languages?.length > 0 ? user.languages.map((language, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm"
            >
              {language}
            </span>
          )) : (
            <span className="text-sm text-gray-500">English</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
