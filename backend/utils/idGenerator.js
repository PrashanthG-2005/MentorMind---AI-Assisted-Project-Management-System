/**
 * Generates a unique employee ID based on company name and current date.
 * Format: [PREFIX]-[YYYYMMDD]-[RANDOM_4_CHARS]
 * 
 * @param {string} companyName - The name of the company.
 * @returns {string} - The generated unique employee ID.
 */
export const generateEmployeeId = (companyName) => {
  // Get company prefix (first 3 letters, uppercase)
  // Handle cases where company name is shorter than 3 letters or has spaces
  const cleanName = (companyName || 'MM').replace(/[^a-zA-Z]/g, '').toUpperCase();
  const prefix = cleanName.substring(0, 3).padEnd(3, 'X');

  // Get current date in YYYYMMDD format
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  // Generate 4 random alphanumeric characters for uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${prefix}-${dateStr}-${randomSuffix}`;
};
