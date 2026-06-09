import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject, updateProject, deleteProject } from "../services/projectService";
import { getUsers } from "../services/userService";

// New components for better organization
import ProjectHeader from "../components/Project/ProjectHeader";
import ProjectFilters from "../components/Project/ProjectFilters";
import ProjectContent from "../components/Project/ProjectContent";
import ProjectModal from "../components/Project/ProjectModal";

const Project = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [projects, setProjects] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProjects, fetchedUsers] = await Promise.all([
          getProjects(),
          getUsers()
        ]);
        setProjects(fetchedProjects);
        setTeamOptions(fetchedUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter + Search + Sort Logic
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === "" || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortBy === "progress") return b.progress - a.progress;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Calculate statistics
  const stats = {
    total: projects.length,
    onTrack: projects.filter(p => p.status === "On Track").length,
    atRisk: projects.filter(p => p.status === "At Risk").length,
    completed: projects.filter(p => p.status === "Completed").length,
    delayed: projects.filter(p => p.status === "Delayed").length,
  };

  // Handlers
  const handleCreateProject = async (newProject, documentText) => {
    try {
      // Include documentText for AI pipeline
      const projectData = { ...newProject };
      if (documentText) {
        projectData.documentText = documentText;
      }
      const createdProject = await createProject(projectData);
      
      // Show AI pipeline results summary
      const pr = createdProject.pipelineResults;
      if (pr && pr.tasksCreated > 0) {
        const gapMsg = pr.gapAlerts?.length > 0 
          ? `\n⚠️ ${pr.gapAlerts.length} task(s) need team members with missing skills.`
          : '';
        alert(
          `✅ Project created successfully!\n\n` +
          `🤖 AI Pipeline Results:\n` +
          `📋 ${pr.tasksCreated} task(s) extracted\n` +
          `👥 ${pr.tasksAssigned} task(s) auto-assigned to team members\n` +
          `📨 Notifications sent to assigned employees` +
          gapMsg
        );
      }

      // Refresh projects list
      const freshProjects = await getProjects();
      setProjects(freshProjects);
      
      // Navigate to the new project
      navigate(`/project/${createdProject._id}`);
    } catch (error) {
      alert("Error creating project: " + error);
    }
    setIsCreateModalOpen(false);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsCreateModalOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p._id !== projectId));
    } catch (error) {
      alert("Error deleting project: " + error);
    }
  };

  const handleSaveProject = async (updatedProject, documentText) => {
    if (selectedProject) {
      // Edit existing project
      try {
        await updateProject(selectedProject._id, updatedProject);
        const freshProjects = await getProjects();
        setProjects(freshProjects);
      } catch (error) {
        alert("Error updating project: " + error);
      }
    } else {
      // Create new project
      await handleCreateProject(updatedProject, documentText);
    }
    setIsCreateModalOpen(false);
    setSelectedProject(null);
  };

  const openCreateModal = () => {
    setSelectedProject(null);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <ProjectHeader stats={stats} />

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Controls Bar */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="px-6 pb-6">
          <ProjectFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onCreateClick={openCreateModal}
          />
        </div>
      </div>

      <div className="p-6">
        <ProjectContent
          viewMode={viewMode}
          projects={filteredProjects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onCreateClick={openCreateModal}
        />
      </div>
      </>
      )}

      {/* Create/Edit Modal */}
      <ProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleSaveProject}
        project={selectedProject}
        teamOptions={teamOptions}
      />
    </div>
  );
};

export default Project;
