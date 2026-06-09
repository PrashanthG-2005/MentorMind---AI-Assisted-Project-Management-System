import ReportTeamStats from "./ReportTeamStats";
import ReportTeamTable from "./ReportTeamTable";

const ReportTeam = ({ stats, teamPerformance }) => {
  return (
    <div className="space-y-6">
      {/* Team Stats */}
      <ReportTeamStats stats={stats} />

      {/* Team Performance Table */}
      <ReportTeamTable teamPerformance={teamPerformance} />
    </div>
  );
};

export default ReportTeam;
