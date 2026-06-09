/**
 * Simple Resume Parser Service
 * Extracts skills, role, and experience level from text
 */
export const extractProfileFromResume = (text) => {
  const skillsDB = ["React", "Node", "MongoDB", "Python", "ML", "UI/UX", "JavaScript", "Express", "Tailwind", "Docker", "Kubernetes", "AWS", "SQL"];
  
  const foundSkills = skillsDB.filter(skill =>
    text.toLowerCase().includes(skill.toLowerCase())
  );

  let role = "Developer";
  if (foundSkills.includes("UI/UX")) role = "UI/UX Designer";
  if (foundSkills.includes("ML")) role = "ML Engineer";
  if (foundSkills.includes("Node") || foundSkills.includes("Express")) role = "Backend Developer";
  if (foundSkills.includes("React") && !foundSkills.includes("Node")) role = "Frontend Developer";

  // Basic experience level estimation (1-5) based on skill count
  const experienceLevel = Math.min(Math.max(1, Math.floor(foundSkills.length / 2)), 5);

  return {
    skills: foundSkills,
    role,
    experienceLevel
  };
};
