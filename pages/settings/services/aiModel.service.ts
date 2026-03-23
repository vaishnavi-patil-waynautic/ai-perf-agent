const API_BASE = "http://127.0.0.1:8000/api/v1/users/ai-model";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Authentication token not found");

  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const aiModelService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE}/`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.detail || "Failed to fetch models");
    }

    return data;
  },

  create: async (payload: any) => {

    console.log(payload);
    const response = await fetch(`${API_BASE}/`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.detail || "Failed to create model");
    }

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