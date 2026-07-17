import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import TeamGridView from "../Teams/TeamGridView";
import TeamListView from "../Teams/TeamListView";
import { getUsers } from "../../services/userService";

const EmpTeam = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const u = await getUsers();
        setMembers(u);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Loading team...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Employee Specific Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">My Organization Team</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total {members.length} members across Organization
            </p>
          </div>
        </div>
      </div>

      {/* Team Directory */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Team Directory</h3>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "grid" 
                  ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" 
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "list" 
                  ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" 
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {viewMode === "grid" ? (
            <TeamGridView members={members} onEdit={() => {}} onRemove={() => {}} />
          ) : (
            <TeamListView members={members} onEdit={() => {}} onRemove={() => {}} />
          )}

          {members.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No team members found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpTeam;
