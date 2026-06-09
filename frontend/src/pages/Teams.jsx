import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Import Team components
import TeamHeader from "../components/Teams/TeamHeader";
import TeamStats from "../components/Teams/TeamStats";
import TeamControls from "../components/Teams/TeamControls";
import TeamGridView from "../components/Teams/TeamGridView";
import TeamListView from "../components/Teams/TeamListView";
import TeamModal from "../components/Teams/TeamModal";
import TeamEmptyState from "../components/Teams/TeamEmptyState";

// Import APIs
import { getUsers, deleteUser } from "../services/userService";
import { getTasks } from "../services/taskService";
import { getProjects } from "../services/projectService";

const Teams = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const requiredSkillsParam = queryParams.get("requiredSkills");
  const openModalParam = queryParams.get("openModal");

  useEffect(() => {
    if (requiredSkillsParam) {
      setSearchTerm(requiredSkillsParam.split(',')[0]); // Use first skill as initial search
    }
    if (openModalParam === 'true') {
      setIsModalOpen(true); // Auto-open modal when redirected from auto-assign
    }
  }, [requiredSkillsParam, openModalParam]);

  // Fetch real users on mount
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const [users, allTasks, allProjects] = await Promise.all([
        getUsers(),
        getTasks(),
        getProjects()
      ]);
      
      // Enrich users with project/task counts
      const enrichedUsers = users.map(user => ({
        ...user,
        projects: allProjects.filter(p => p.team?.some(m => 
          (m.user?._id || m.user || m._id) === user._id
        )).length,
        tasks: allTasks.filter(t => t.assignees?.some(a => 
          (a._id || a) === user._id
        )).length,
        status: user.availability ? 'online' : 'offline'
      }));

      setTeamMembers(enrichedUsers);
      setTasks(allTasks);
      setProjects(allProjects);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Get unique roles for filter
  const roles = ["All", ...new Set(teamMembers.map(m => m.role))];

  // Filter + Search Logic
  const filteredMembers = teamMembers.filter(member => {
    const name = member.name || "";
    const email = member.email || "";
    const role = member.role || "";
    
    const matchesSearch = searchTerm === "" || 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate statistics (Simplified for now, could be more dynamic)
  const stats = {
    total: teamMembers.length,
    online: teamMembers.filter(m => m.availability).length,
    away: teamMembers.filter(m => m.currentWorkload > 3).length,
    offline: teamMembers.filter(m => !m.availability).length,
    totalProjects: projects.length,
    totalTasks: tasks.length
  };

  const handleModalSubmit = async () => {
    // When a member is added via TeamModal, the backend has already created them
    // We just need to refresh the list and provide feedback
    fetchUsers();
    closeModal();
  };

  const handleRemoveMember = async (memberId) => {
    console.log("Attempting to remove member with ID:", memberId);
    if (!window.confirm("Are you sure you want to remove this team member?")) return;
    try {
      await deleteUser(memberId);
      alert("Member removed successfully");
      fetchUsers();
    } catch (error) {
      alert("Error removing member: " + error);
    }
  };

  const openAddModal = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <TeamHeader />
            <TeamStats stats={stats} />
          </div>
        </div>

        {/* Controls Bar */}
        <div className="px-6 pb-6">
          <TeamControls 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
            roles={roles}
            onAddClick={openAddModal}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {viewMode === "grid" && (
              <TeamGridView 
                members={filteredMembers}
                onEdit={openEditModal}
                onRemove={handleRemoveMember}
              />
            )}

            {viewMode === "list" && (
              <TeamListView 
                members={filteredMembers}
                onEdit={openEditModal}
                onRemove={handleRemoveMember}
              />
            )}

            {filteredMembers.length === 0 && (
              <TeamEmptyState 
                onAddClick={openAddModal}
              />
            )}
          </>
        )}
      </div>

      {/* Team Modal */}
      <TeamModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        member={selectedMember}
        requiredSkills={requiredSkillsParam}
      />
    </div>
  );
};

export default Teams;
