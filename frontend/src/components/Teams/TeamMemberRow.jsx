import { Edit, Trash2 } from "lucide-react";

const TeamMemberRow = ({ member, onEdit, onRemove }) => {
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Project Manager":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "Senior Developer":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "UI/UX Designer":
        return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "away":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-10 h-10 rounded-full"
            />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusDotColor(member.status)}`}></div>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {member.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {member.email}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClass(member.role)}`}>
          {member.role}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(member.status)}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(member.status)}`}></span>
          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
        {member.projects}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">
        {member.tasks}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {member.location}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(member)}
            className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(member._id)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TeamMemberRow;
