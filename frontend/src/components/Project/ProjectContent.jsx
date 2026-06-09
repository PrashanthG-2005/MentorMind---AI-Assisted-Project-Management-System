import ProjectGridView from "./ProjectGridView";
import ProjectListView from "./ProjectListView";
import ProjectEmptyState from "./ProjectEmptyState";

const ProjectContent = ({ 
  viewMode, 
  projects, 
  onEdit, 
  onDelete,
  onCreateClick 
}) => {
  // Show empty state if no projects
  if (projects.length === 0) {
    return <ProjectEmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <>
      {/* Grid View */}
      {viewMode === "grid" && (
        <ProjectGridView
          projects={projects}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      {/* List View */}
      {viewMode === "list" && (
        <ProjectListView
          projects={projects}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default ProjectContent;
