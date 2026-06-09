import { Mail, MapPin, Edit, Trash2, MessageSquare, Eye, MoreVertical } from "lucide-react";

const TeamMemberCard = ({ member, onEdit, onRemove }) => {
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Project Manager":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "Senior Developer":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "UI/UX Designer":
        return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400";
      case "Backend Developer":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "DevOps Engineer":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "QA Engineer":
        return "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1">
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        <div className={`w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(member.status)}`}></div>
      </div>

      {/* Member Avatar & Info */}
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
          />
          <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-gray-700 ${getStatusColor(member.status)}`}></div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {member.name}
        </h3>
        
        <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClass(member.role)}`}>
          {member.role}
        </span>

        {/* Skills Preview */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {(member.skills || []).slice(0, 3).map((skill, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-gray-50 dark:bg-gray-700/50 text-[10px] font-bold text-gray-500 dark:text-gray-400 rounded-md border border-gray-100 dark:border-gray-600/50">
              {skill}
            </span>
          ))}
          {(member.skills || []).length > 3 && (
            <span className="text-[10px] font-bold text-gray-400 mt-1">+{member.skills.length - 3}</span>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Mail className="w-4 h-4" />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>{member.location}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center justify-center gap-4 py-3 border-t border-b border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{member.projects}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Projects</p>
        </div>
        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{member.tasks}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Tasks</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(member)}
          className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onRemove(member._id)}
          className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </button>
      </div>

      {/* Quick Actions (Always Visible) */}
      <div className="mt-3 flex justify-center gap-2">
        <button 
          onClick={() => window.location.href = `/messages?userId=${member._id}`}
          className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" 
          title="Message"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
        <button 
          onClick={() => window.location.href = `/profile/${member._id}`}
          className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" 
          title="View Profile"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors" title="More Options">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TeamMemberCard;
