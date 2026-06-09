import axios from "axios";

const API_URL = "http://localhost:5001/api/projects";

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// GET ALL PROJECTS
export const getProjects = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch projects";
  }
};

// CREATE PROJECT
export const createProject = async (projectData) => {
  try {
    const formData = new FormData();
    
    // Append all text fields first
    Object.keys(projectData).forEach(key => {
      if (key !== 'file' && projectData[key] !== undefined && projectData[key] !== null) {
        if (key === 'team' || key === 'requiredRoles' || key === 'tags') {
          formData.append(key, JSON.stringify(projectData[key]));
        } else {
          formData.append(key, projectData[key]);
        }
      }
    });

    // Append file last (if it exists)
    if (projectData.file) {
      formData.append('file', projectData.file);
    }

    const response = await axios.post(
      API_URL,
      formData,
      {
        ...getAuthHeader(),
        // Let browser set content-type with boundary
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create project";
  }
};

// UPDATE PROJECT
export const updateProject = async (id, updatedData) => {
  try {
    const formData = new FormData();
    
    Object.keys(updatedData).forEach(key => {
      if (key !== 'file' && updatedData[key] !== undefined && updatedData[key] !== null) {
        if (key === 'team' || key === 'requiredRoles' || key === 'tags') {
          formData.append(key, JSON.stringify(updatedData[key]));
        } else {
          formData.append(key, updatedData[key]);
        }
      }
    });

    if (updatedData.file) {
      formData.append('file', updatedData.file);
    }

    const response = await axios.put(
      `${API_URL}/${id}`,
      formData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update project";
  }
};

// DELETE PROJECT
export const deleteProject = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete project";
  }
};

// GET PROJECT BY ID
export const getProjectById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch project";
  }
};

// GET PROJECT TASKS
export const getProjectTasks = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/${projectId}/tasks`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch project tasks";
  }
};

// AUTO ASSIGN TASKS (AI)
export const autoAssignTasks = async (id, documentText) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/auto-assign`, { documentText }, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to auto-assign tasks from document";
  }
};

// ANALYZE PROJECT ROLES (AI)
export const analyzeProjectRoles = async (documentText) => {
  try {
    const response = await axios.post("http://localhost:5001/api/projects/analyze-mission", { documentText }, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to analyze project requirements";
  }
};

// SIMULATE PROJECT PIPELINE (AI Verification)
export const simulateProjectPipeline = async (documentText, team) => {
  try {
    const response = await axios.post(`${API_URL}/simulate-pipeline`, { documentText, team }, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to simulate AI pipeline";
  }
};
