/**
 * Skill Matcher Utility for MentorMind V2.0
 * Provides role-to-skill mappings and scoring logic for AI-driven team matching.
 */

export const ROLE_SKILLS = {
  "Frontend Developer": ["React", "Vue", "CSS", "Tailwind", "HTML", "JavaScript", "TypeScript", "Next.js", "Vite", "Figma"],
  "Backend Developer": ["Node.js", "Express", "MongoDB", "SQL", "Python", "Java", "Docker", "REST API", "GraphQL", "Microservices"],
  "UI/UX Designer": ["Figma", "Adobe XD", "Sketch", "Prototyping", "Design Systems", "Color Theory", "User Research"],
  "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins", "Terraform", "Linux", "Nginx", "GitHub Actions"],
  "Senior Developer": ["System Design", "Architecture", "Mentoring", "Code Review", "Agile", "TypeScript", "Node.js", "React"],
  "QA Engineer": ["Jest", "Selenium", "Cypress", "Automated Testing", "Manual Testing", "Postman", "Bug Reporting"],
  "Data Analyst": ["Python", "R", "SQL", "Tableau", "PowerBI", "Statistics", "Machine Learning", "Excel"],
  "Project Manager": ["Agile", "Scrum", "Jira", "Stakeholder Management", "Budgeting", "Risk Analysis", "Roadmap Planning"],
  "Product Owner": ["Backlog Management", "User Stories", "Product Strategy", "Market Research", "Agile", "Stakeholder Management"],
  "Security Engineer": ["Penetration Testing", "Encryption", "Firewalls", "Compliance", "Security Auditing", "Network Security"],
  "Developer": ["JavaScript", "HTML", "CSS", "Git", "Problem Solving", "Debugging"],
  "Team Lead": ["Leadership", "Project Management", "Technical Mentoring", "Resource Allocation", "Conflict Resolution"]
};

/**
 * Calculates the match score between a user's skills and a target role's requirements.
 * @param {string[]} userSkills - Array of skills from the user profile.
 * @param {string} targetRole - The project role being assigned.
 * @returns {object} { score: number, missing: string[] }
 */
export const calculateMatchScore = (userSkills = [], targetRole = "") => {
  const roleRequirements = ROLE_SKILLS[targetRole] || ROLE_SKILLS["Developer"];
  
  if (!userSkills.length) return { score: 0, missing: roleRequirements.slice(0, 3) };

  const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());
  const normalizedRoleSkills = roleRequirements.map(s => s.toLowerCase().trim());

  const matchingSkills = normalizedRoleSkills.filter(skill => 
    normalizedUserSkills.includes(skill)
  );

  const missingSkills = roleRequirements.filter((_, idx) => 
    !normalizedUserSkills.includes(normalizedRoleSkills[idx])
  );

  const score = Math.round((matchingSkills.length / roleRequirements.length) * 100);

  return {
    score,
    missing: missingSkills.slice(0, 3) // Return top 3 missing skills
  };
};

/**
 * Returns a color class based on the match score.
 * @param {number} score 
 * @returns {string} Tailwind color class
 */
export const getScoreColor = (score) => {
  if (score >= 80) return "text-emerald-500";
  if (score >= 40) return "text-amber-500";
  return "text-rose-500";
};
