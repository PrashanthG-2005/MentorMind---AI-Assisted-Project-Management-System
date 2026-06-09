import TeamMemberCard from "./TeamMemberCard";

const TeamGridView = ({ members, onEdit, onRemove }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {members.map((member) => (
        <TeamMemberCard
          key={member._id}
          member={member}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default TeamGridView;
