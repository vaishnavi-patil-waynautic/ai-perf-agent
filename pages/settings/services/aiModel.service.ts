import { config } from "@/config/backendConfig";

const API_BASE = `${config.baseUrl}/users/ai-model`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Authentication token not found");

  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const aiModelService = {
  getAll: async (projectId: Number) => {
    const response = await fetch(`${API_BASE}?project_id=${projectId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.log("Fetching models are not ok!!!", response)
      throw new Error(data?.detail || "Failed to fetch models");
    }

    return data;
  },

  create: async (payload: any, projectId: Number) => {

    const updatedPayload = {
      ...payload,
      project_id: Number(projectId),
    };

    const response = await fetch(`${API_BASE}/`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        project_id: projectId,
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {

      console.log("__________Error found__________ : ", data?.data?.error);
      throw new Error(data?.detail || data?.error || data?.data?.error || "Failed to create model");
    }

    console.log("created new model : ", data)

    return data;
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE}/${id}/`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete model");
    }

    return id;
  },
};