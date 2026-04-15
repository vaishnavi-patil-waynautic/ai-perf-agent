import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

// Automatically attach Project Header for global filtering at the DB level
apiClient.interceptors.request.use((config) => {
  const currentProject = localStorage.getItem('selectedProject');
  if (currentProject) {
    config.headers['X-Project-ID'] = currentProject;
  }
  return config;
});

export default apiClient;