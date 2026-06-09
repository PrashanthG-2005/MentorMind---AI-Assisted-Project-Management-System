import ReportProjectCard from "./ReportProjectCard";

const ReportProjects = ({ projectData, getStatusColor }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projectData.map((project) => (
          <ReportProjectCard 
            key={project.id} 
            project={project} 
            getStatusColor={getStatusColor} 
          />
        ))}
      </div>
    </div>
  );
};

export default ReportProjects;
