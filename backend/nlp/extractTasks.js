import { analyzeRequirements } from '../services/aiService.js';

/**
 * Parses project requirements text and returns an array of suggested tasks.
 * Uses advanced AI analysis from the aiService.
 * @param {string} text - The project requirements or document text.
 * @returns {Promise<Array>} - Array of objects with { title, description, requiredSkills, priority }
 */
export const extractTasksFromText = async (text) => {
  if (!text) return [];
  
  // Call the AI analysis service (has its own fallback)
  return await analyzeRequirements(text);
};
