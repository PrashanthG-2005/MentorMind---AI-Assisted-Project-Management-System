import axios from "axios";

const API_URL = "http://localhost:5001/api/tasks";

// Helper for auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// GET TASKS (optionally by projectId)
export const getTasks = async (projectId) => {
  try {
    const response = await axios.get(
      projectId ? `${API_URL}?projectId=${projectId}` : API_URL,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch tasks";
  }
};

// CREATE TASK
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(API_URL, taskData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create task";
  }
};

// UPDATE TASK
export const updateTask = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update task";
  }
};

// DELETE TASK
export const deleteTask = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete task";
  }
};

// UPDATE TASK STATUS (for drag and drop)
export const updateTaskStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status }, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update task status";
  }
};

// GET TASK BY ID
export const getTaskById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch task";
  }
};

// SUBMIT TASK — supports file uploads (FormData) + description text
export const submitTask = async (id, { description, file }) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    if (description) formData.append("description", description);
    if (file) formData.append("submissionFile", file);

    const response = await axios.post(`${API_URL}/${id}/submit`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to submit task";
  }
};

// VERIFY TASK (Admin manual override)
export const verifyTask = async (id, verificationData) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/verify`, verificationData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to verify task";
  }
};

// AUTO-ASSIGN TASK via AI
export const autoAssignTask = async (taskId) => {
  try {
    const response = await axios.post(`${API_URL}/${taskId}/auto-assign`, {}, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to auto-assign task";
  }
};
// CONFIRM TASK (Member)
export const confirmTask = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/confirm`, {}, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to confirm task";
  }
};

// COMPLETE TASK (Member - Autonomous)
export const completeTask = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/complete`, {}, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to complete task";
  }
};
