// pages/project/services/project.service.ts

/**
 * Project & Application APIs
 * --------------------------
 * Only getProjectById exists today
 * getAllProjects will be added later
 */

// const API_BASE = 'http://127.0.0.1:8000/api/v1';
import { config } from '../../../config/backendConfig';

export const projectService = {
  /**
   * Fetch project by ID (REAL API)
   * Returns project + applications
   */
  async getProjectById(projectId: number) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Missing access token');

    const res = await fetch(`${config.baseUrl}/users/project/${projectId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch project');
    }

    return res.json(); // { status, data }
  },

  /**
   * FUTURE API (NOT AVAILABLE YET)
   * ------------------------------
   * async getAllProjects() {
   *   const res = await fetch(`${API_BASE}/projects`);
   *   return res.json();
   * }
   */
};
