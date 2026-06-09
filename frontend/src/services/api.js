const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

class ApiService {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Generic CRUD methods
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Project-specific methods
  async getProjects() {
    return this.get('/projects');
  }

  async getProject(id) {
    return this.get(`/projects/${id}`);
  }

  async createProject(projectData) {
    return this.post('/projects', projectData);
  }

  async updateProject(id, projectData) {
    return this.put(`/projects/${id}`, projectData);
  }

  async deleteProject(id) {
    return this.delete(`/projects/${id}`);
  }

  // Task-specific methods
  async getTasks(projectId) {
    return this.get(`/projects/${projectId}/tasks`);
  }

  async getTask(id) {
    return this.get(`/tasks/${id}`);
  }

  async createTask(projectId, taskData) {
    return this.post(`/projects/${projectId}/tasks`, taskData);
  }

  async updateTask(id, taskData) {
    return this.put(`/tasks/${id}`, taskData);
  }

  async deleteTask(id) {
    return this.delete(`/tasks/${id}`);
  }

  // User-specific methods
  async getCurrentUser() {
    return this.get('/users/me');
  }

  async updateUser(userData) {
    return this.put('/users/me', userData);
  }

  async getUser(id) {
    return this.get(`/users/${id}`);
  }

  async getUsers() {
    return this.get('/users');
  }
}

export const api = new ApiService();
export default ApiService;
