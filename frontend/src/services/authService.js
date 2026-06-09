import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

// Helper to get token
const getToken = () => localStorage.getItem("token");

// LOGIN
export const login = async (email, password, employeeId) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
      employeeId,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

// REGISTER
export const register = async (name, email, password, company, role, phone, skills, inviteToken) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      company,
      role,
      phone,
      skills,
      inviteToken
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
  }
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  try {
    const token = getToken();
    if (!token) return null;
    
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      logout();
    }
    throw error.response?.data?.message || "Failed to get current user";
  }
};

// CREATE INVITE (admin)
export const createInvite = async (invitePayload) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/invite`, invitePayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create invite";
  }
};

// LIST INVITES (admin)
export const getInvites = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/invites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch invites";
  }
};

// REVOKE INVITE (admin)
export const revokeInvite = async (id) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/invite/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to revoke invite";
  }
};

// GET INVITE BY TOKEN (public)
export const getInviteByToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/invite/${token}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to validate invite token";
  }
};
