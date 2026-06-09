import { useState, useEffect } from "react";
import { Folder, Clock, CheckCircle2 } from "lucide-react";
import ProjectCard from "../Project/ProjectCard";
import ProjectRow from "../Project/ProjectRow";
import { getProjects } from "../../services/projectService";
import { useAuth } from "../../context/AuthContext";

const EmpProject = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const p = await getProjects();
        // Employee logic: Only show projects where they are in the team, UNLESS they are Admin
        let myProjects = p;
        if (!user?.isAdmin) {
          myProjects = p.filter((proj) => 
            proj.team.some((member) => (member.user?._id || member.user) === user?._id || member.user?.email === user?.email)
          );
        }
        setProjects(myProjects);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Employee Specific Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          My Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-lg">
                <Folder className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Assigned Projects</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {projects.filter(p => p.status === 'Completed').length}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {projects.filter(p => p.status !== 'Completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List with View Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Project Directory</h3>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "grid" 
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" 
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
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" 
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} onEdit={() => {}} onDelete={() => {}} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectRow key={project._id} project={project} onEdit={() => {}} onDelete={() => {}} />
              ))}
            </div>
          )}

          {projects.length === 0 && (
            <div className="text-center py-12">
              <Folder className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No projects found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">You haven't been assigned to any projects yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmpProject;
