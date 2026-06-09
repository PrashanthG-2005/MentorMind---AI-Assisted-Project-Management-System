/**
 * AI Task Generator Service
 * Generates tasks based on project description
 */
export const generateTasksFromDescription = (description) => {
  const tasks = [];
  const descLower = description.toLowerCase();

  if (descLower.includes("website") || descLower.includes("web app")) {
    tasks.push({ 
      title: "Design System & UI Components", 
      description: "Create a consistent design system and implement core UI components.",
      requiredSkills: ["React", "UI/UX", "Tailwind"] 
    });
    tasks.push({ 
      title: "Backend API Development", 
      description: "Develop RESTful APIs and integrate with the database.",
      requiredSkills: ["Node", "Express", "MongoDB"] 
    });
  }

  if (descLower.includes("ai") || descLower.includes("machine learning") || descLower.includes("intelligence")) {
    tasks.push({ 
      title: "ML Model Implementation", 
      description: "Implement and train the machine learning models as per requirements.",
      requiredSkills: ["Python", "ML", "Data Analysis"] 
    });
  }

  if (descLower.includes("auth") || descLower.includes("login") || descLower.includes("security")) {
    tasks.push({ 
      title: "Authentication & Authorization System", 
      description: "Implement secure login, registration and role-based access control.",
      requiredSkills: ["Node", "JWT", "Security"] 
    });
  }

  if (descLower.includes("deploy") || descLower.includes("cloud") || descLower.includes("devops")) {
    tasks.push({ 
      title: "Infrastructure & Deployment Pipeline", 
      description: "Setup CI/CD pipelines and deploy the application to cloud provider.",
      requiredSkills: ["Docker", "AWS", "DevOps"] 
    });
  }

  // If no specific tasks were generated, add a generic one
  if (tasks.length === 0) {
    tasks.push({
      title: "Project Initial Setup",
      description: "Basic environment setup and initial code structure.",
      requiredSkills: ["JavaScript"]
    });
  }

  return tasks;
};
