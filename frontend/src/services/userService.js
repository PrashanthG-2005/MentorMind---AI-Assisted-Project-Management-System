import axios from "axios";

const API_URL = "http://localhost:5001/api/users";

// Helper to attach token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// GET ALL USERS (for project team, assign tasks, etc.)
export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch users";
  }
};

// UPDATE PROFILE (name, photo, password, etc.)
export const updateProfile = async (updatedData) => {
  try {
    const response = await axios.put(
      `${API_URL}/profile`,
      updatedData,
      getAuthHeader()
    );

    // Optional: update stored user in localStorage
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update profile";
  }
};

// GET USER BY ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user";
  }
};

// ADMIN: CREATE EMPLOYEE
export const createEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${API_URL}/create-employee`, employeeData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create employee";
  }
};

// ADMIN: DELETE USER
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete user";
  }
};

// ADMIN: ADD MEMBER WITH RESUME
export const addMemberWithResume = async (formData) => {
  try {
    const config = getAuthHeader();
    config.headers['Content-Type'] = 'multipart/form-data';
    const response = await axios.post(`${API_URL}/add-with-resume`, formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to add member with resume";
  }
};

// UPDATE PASSWORD
export const updatePassword = async (passwordData) => {
  try {
    const response = await axios.put(
      `${API_URL}/password`,
      passwordData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update password";
  }
};
