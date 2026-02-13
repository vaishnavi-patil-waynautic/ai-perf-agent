
import { config } from '../../../config/backendConfig';

export const projectService = {
  async getProjectById(projectId: number) {

    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Missing access token');

    const res = await fetch(`${config.baseUrl}/users/project/${projectId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch project');

    const json = await res.json();
    return json.data;
  },


  async getAllProjects() {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Missing access token');

    const res = await fetch(`${config.baseUrl}/users/project`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch projects');
    }

    const json = await res.json();

    console.log("RAW PROJECT API:", json);

    // unwrap backend envelope
    return json.data;
  },


  // ➕ CREATE APPLICATION
  async createApplication(projectId: number, name: string, description?: string) {

    console.log("[API] Create Application →", { projectId, name, description });
    const token = localStorage.getItem('access_token');


    const res = await fetch(`${config.baseUrl}/users/application/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        project: projectId,
        name,
        description: description ?? ""
      }),
    });

    const json = await res.json();
    console.log("[API] Create Application Response:", json);

    if (!res.ok) {
      const err =
        json?.data?.error?.name?.[0] ||
        json?.data?.error?.project?.[0] ||
        "Failed to create application";

      throw new Error(err);
    }

    return json.data;
  },

  // ✏️ UPDATE APPLICATION
  async updateApplication(
    appId: number,
    payload: { name?: string; description?: string }
  ) {

    const token = localStorage.getItem("access_token");

  const body = {
    id: appId,
    ...payload
  };

  console.log("[PUT] Request Body:", body);

  const res = await fetch(`${config.baseUrl}/users/application/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

    const json = await res.json();
    console.log("[API] Update Application Response:", json);

    if (!res.ok) {
      const err =
        json?.data?.error?.name?.[0] ||
        "Failed to update application";

      throw new Error(err);
    }

    return json.data;
  },

  // 🗑 DELETE APPLICATION
  async deleteApplication(appId: number) {

    console.log("[API] Delete Application →", appId);
    const token = localStorage.getItem('access_token');


    const res = await fetch(`${config.baseUrl}/users/application/${appId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("[API] Delete Application Status:", res.status);

    if (!res.ok) {
      throw new Error("Failed to delete application");
    }

    return true;
  },

};
