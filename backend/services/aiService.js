import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini AI if key is present
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Use gemini-2.5-flash (gemini-pro is deprecated)
const MODEL = "gemini-2.5-flash";

/**
 * Extracts structured tasks from project requirement text using Gemini AI.
 * Falls back to a simulated analysis if no API key is present or on error.
 */
export const analyzeRequirements = async (text) => {
  if (!genAI) {
    console.warn("AI Service: GEMINI_API_KEY not found in .env. Using simulated AI analysis.");
    return simulateAIAnalysis(text);
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const prompt = `
      You are an expert project manager and software architect. 
      Analyze the following project requirements and break them down into a set of 5-10 actionable, granular tasks.
      
      For each task, provide:
      1. "title": A clear, concise task title (max 60 chars).
      2. "description": A detailed, professional description of what needs to be done.
      3. "requiredSkills": An array of technical skills or roles needed (e.g., ["React", "CSS", "UI/UX", "Node.js", "API", "Testing"]).
      4. "priority": One of "low", "medium", or "high".

      Format your response ONLY as a valid JSON array of objects. Do not include any other text, markdown blocks, or explanations.
      
      Requirements Text:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    
    // Clean potential markdown blocks from response
    const jsonString = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error("AI Service: Failed to parse JSON from AI response:", parseError);
      return simulateAIAnalysis(text);
    }
  } catch (error) {
    console.error("AI Service: API Error:", error.message);
    return simulateAIAnalysis(text);
  }
};

/**
 * Analyzes a project description to suggest the required roles and headcounts.
 */
export const analyzeProjectRoles = async (text) => {
  if (!genAI) {
    console.warn("AI Service: GEMINI_API_KEY not found. Using simulated role analysis.");
    return simulateRoleAnalysis(text);
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const prompt = `
      You are an expert project architect. Analyze the project description below and suggest the specific team roles, headcounts, and role descriptions needed to complete this project successfully.
      
      Requirements for each role:
      1. "role": The title of the role (e.g., "Frontend Developer", "UI/UX Designer", "Project Manager").
      2. "count": The number of people needed for this specific role (integer).
      3. "description": A 1-2 sentence description of their primary responsibilities for THIS project.

      Format your response ONLY as a valid JSON array of objects. Do not include markdown, code blocks, or preamble.
      
      Project Description:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    const jsonString = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Service: Role Analysis Error:", error.message);
    return simulateRoleAnalysis(text);
  }
};

/**
 * Matches extracted tasks with the best available team members using Gemini AI.
 */
export const matchTasksWithTeam = async (tasks, teamMembers) => {
  if (!genAI || !teamMembers || teamMembers.length === 0) {
    return tasks.map(task => ({ ...task, assignedUser: null }));
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const prompt = `
      You are an AI resource manager. Match the following tasks with the most suitable team members based on their skills.
      
      Tasks:
      ${JSON.stringify(tasks.map(t => ({ title: t.title, requiredSkills: t.requiredSkills })))}
      
      Team Members:
      ${JSON.stringify(teamMembers.map(m => ({ id: m._id, name: m.name, skills: m.skills, role: m.role })))}
      
      For each task, return:
      1. "taskTitle": The title of the task.
      2. "assignedUserId": The ID of the best matching team member, or null if no one is a good fit (at least 50% skill match).
      3. "matchConfidence": A score from 0-1.
      4. "reasoning": A brief explanation of why this member was chosen.

      Format your response ONLY as a valid JSON array of objects.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    const jsonString = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const assignments = JSON.parse(jsonString);
    
    return tasks.map(task => {
      const assignment = assignments.find(a => a.taskTitle === task.title);
      return {
        ...task,
        assignedUser: assignment ? assignment.assignedUserId : null,
        matchReasoning: assignment ? assignment.reasoning : "No suitable match found"
      };
    });
  } catch (error) {
    console.error("AI Service: Match Error:", error.message);
    return tasks.map(task => ({ ...task, assignedUser: null }));
  }
};

/**
 * Auto-assigns a single task to the best-matching team member using Gemini AI.
 * Returns { assignedUserId, matchConfidence, reasoning } or null if no suitable match.
 */
export const autoAssignTask = async (taskTitle, taskDescription, requiredSkills, teamMembers) => {
  // Fallback: simple local skill matching if no AI key
  if (!genAI) {
    return localSkillMatch(requiredSkills, teamMembers);
  }

  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const prompt = `
      You are an AI resource manager. Find the single best team member for this task based on skill overlap.
      
      Task:
      - Title: "${taskTitle}"
      - Description: "${taskDescription || 'No description provided'}"
      - Required Skills: ${JSON.stringify(requiredSkills || [])}
      
      Available Team Members:
      ${JSON.stringify(teamMembers.map(m => ({ id: m._id.toString(), name: m.name, skills: m.skills || [], role: m.role })))}
      
      Rules:
      - Prioritize members with at least 40% skill overlap.
      - If multiple members have similar skills, prioritize those with lower "currentWorkload".
      - Only consider members where "availability" is true.
      - matchConfidence should be between 0 and 1 (1 = perfect match).
      
      Return ONLY a valid JSON object with these fields:
      {
        "assignedUserId": "<user id string or null>",
        "assignedUserName": "<name or null>",
        "matchConfidence": <0-1 number>,
        "reasoning": "<brief explanation focusing on skill match and workload balance>"
      }
    `;

    const teamData = teamMembers.map(m => ({ 
      id: m._id.toString(), 
      name: m.name, 
      skills: m.skills || [], 
      role: m.role,
      currentWorkload: m.currentWorkload || 0,
      availability: m.availability !== undefined ? m.availability : true
    }));

    const result = await model.generateContent(prompt + `\n\nAvailable Team Members Data:\n${JSON.stringify(teamData)}`);
    const response = await result.response;
    const rawText = response.text();
    const jsonString = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const assignment = JSON.parse(jsonString);
    
    // If AI confidence is too low, treat as no match
    if (!assignment.assignedUserId || assignment.matchConfidence < 0.35) {
      return null;
    }
    
    return assignment;
  } catch (error) {
    console.error("AI Service: AutoAssign Error:", error.message);
    // Fall back to local matching
    return localSkillMatch(requiredSkills, teamMembers);
  }
};

/**
 * Simple local skill matching fallback (when AI is unavailable).
 */
const localSkillMatch = (requiredSkills, teamMembers) => {
  if (!requiredSkills || requiredSkills.length === 0 || !teamMembers || teamMembers.length === 0) {
    return null;
  }

  let bestMatch = null;
  let bestScore = -1;

  teamMembers.forEach(member => {
    // Check availability
    if (member.availability === false) return;

    const memberSkills = (member.skills || []).map(s => s.toLowerCase());
    const matches = requiredSkills.filter(skill => 
      memberSkills.includes(skill.toLowerCase())
    ).length;
    
    const skillScore = requiredSkills.length > 0 ? (matches / requiredSkills.length) : 0;
    
    // Core Architecture Formula: score = skillMatch * 5 + workloadFactor * 3
    const workload = member.currentWorkload || 0;
    const workloadFactor = 1 / (workload + 1);
    const combinedScore = (skillScore * 5) + (workloadFactor * 3);

    if (combinedScore > bestScore) {
      bestScore = combinedScore;
      bestMatch = {
        assignedUserId: member._id.toString(),
        assignedUserName: member.name,
        matchConfidence: skillScore,
        reasoning: `Matched ${matches} skills with a workload of ${workload}. (Formula Score: ${combinedScore.toFixed(2)})`
      };
    }
  });

  // Require at least some skill match or reasonable workload balance
  if (!bestMatch || bestScore < 1.5) return null; 
  return bestMatch;
};

/**
 * Evaluates a task submission against requirements using Gemini AI.
 * Supports text content and/or base64-encoded file data for multimodal analysis.
 */
export const evaluateTaskSubmission = async (taskDescription, submissionContent, fileData = null) => {
  if (!genAI) {
    return { perfect: true, feedback: "AI evaluation skipped: GEMINI_API_KEY missing. Submission accepted.", confidence: 1.0 };
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL });

    const parts = [];

    const textPrompt = `
      As an expert reviewer, evaluate the following task submission against the task description.
      
      Task Description:
      ${taskDescription || 'No description provided'}
      
      Submission Notes/Proof:
      ${submissionContent || 'No notes provided - file uploaded as primary evidence'}
      
      ${fileData ? 'A file has also been uploaded as evidence (see below).' : ''}
      
      Evaluate thoroughly:
      - Does the submission demonstrate completion of the task described?
      - Is the quality sufficient for professional standards?
      
      Return ONLY a valid JSON object:
      {
        "perfect": true/false,
        "score": <0-100 number based on coverage and quality>,
        "confidence": <0-1 number>,
        "feedback": "<detailed feedback or praise, 2-3 sentences>"
      }
    `;
    
    parts.push({ text: textPrompt });

    // Add file content if provided (for images / text files read as base64)
    if (fileData && fileData.base64 && fileData.mimeType) {
      parts.push({
        inlineData: {
          data: fileData.base64,
          mimeType: fileData.mimeType
        }
      });
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    const rawText = response.text();
    const jsonString = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Service: Evaluation Error:", error.message);
    return { perfect: false, confidence: 0, feedback: "AI evaluation failed due to a technical error. Please have an admin manually review." };
  }
};

/**
 * Fallback simulation for when AI is unavailable.
 */
const simulateAIAnalysis = (text) => {
  const KNOWN_SKILLS = [
    'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML', 'CSS', 
    'Python', 'UI/UX', 'Figma', 'Docker', 'AWS', 'Testing', 'QA', 'Java',
    'NLP', 'AI', 'Tailwind', 'Next.js', 'Redux', 'SQL', 'TypeScript'
  ];

  const lines = text.split(/[.!?\n]/).filter(l => l.trim().length > 15);
  const tasks = [];

  const candidates = lines
    .sort((a, b) => b.length - a.length)
    .slice(0, 6);

  candidates.forEach((sentence) => {
    const lower = sentence.toLowerCase();
    
    const skillsFound = KNOWN_SKILLS.filter(skill => 
      lower.includes(skill.toLowerCase())
    );

    let priority = "medium";
    if (lower.match(/urgent|critical|immediately|important|asap/)) priority = "high";
    if (lower.match(/later|someday|minor|optional/)) priority = "low";

    tasks.push({
      title: sentence.split(',')[0].substring(0, 50).trim() + (sentence.length > 50 ? "..." : ""),
      description: sentence.trim(),
      requiredSkills: skillsFound.length > 0 ? skillsFound : ["General Development"],
      priority: priority
    });
  });

  if (tasks.length === 0) {
    tasks.push({
      title: "Initial Project Setup",
      description: "Setup the project repository, environment variables, and basic architecture based on requirements.",
      requiredSkills: ["Git", "Deployment", "Architecture"],
      priority: "high"
    });
  }

  return tasks;
};

/**
 * Fallback simulation for role extraction.
 */
const simulateRoleAnalysis = (text) => {
  const lower = text.toLowerCase();
  const suggestions = [];

  if (lower.includes('web') || lower.includes('react') || lower.includes('frontend')) {
    suggestions.push({ role: 'Frontend Developer', count: 1, description: 'Develop and iterate on the user interface and frontend components.' });
  }
  if (lower.includes('backend') || lower.includes('api') || lower.includes('node') || lower.includes('database')) {
    suggestions.push({ role: 'Backend Developer', count: 1, description: 'Build and maintain the server-side logic and database persistence layers.' });
  }
  if (lower.includes('design') || lower.includes('ui') || lower.includes('ux') || lower.includes('figma')) {
    suggestions.push({ role: 'UI/UX Designer', count: 1, description: 'Create high-fidelity designs and ensure a premium user experience.' });
  }
  if (lower.includes('test') || lower.includes('quality') || lower.includes('qa')) {
    suggestions.push({ role: 'QA Engineer', count: 1, description: 'Implement automated and manual testing protocols for the project.' });
  }

  // Fallback if nothing specific found
  if (suggestions.length === 0) {
    suggestions.push({ role: 'Senior Developer', count: 1, description: 'Provide overall technical execution and project development.' });
    suggestions.push({ role: 'Project Manager', count: 1, description: 'Ensure the project timeline and milestones are met.' });
  }

  return suggestions;
};
