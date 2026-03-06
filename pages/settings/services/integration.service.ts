import { config } from "../../../config/backendConfig";
import {
  IntegrationDetail,
  IntegrationListResponse,
  IntegrationType,
} from "../types/settings.types";

const getHeaders = () => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});


export const integrationService = {

  async getIntegration(projectId: number, integrationId:number) : Promise<IntegrationDetail> {
    const res = await fetch(
      `${config.baseUrl}/autoanalysis/projects/${projectId}/integrations/${integrationId}/`,
      { headers: getHeaders() }
    );

    const json = await res.json();
    if (!res.ok) throw new Error(json?.data?.error || "Failed to fetch integrations");

    return json?.data?.integration;
  },

  async createIntegration(
  projectId: number,
  payload: any
): Promise<IntegrationDetail> {
  const res = await fetch(
    `${config.baseUrl}/autoanalysis/projects/${projectId}/integrations/`,
    {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw {
      message: json?.data?.error || "Failed to create integration",
      errors: json?.data?.errors || null,
      raw: json,
    };
  }

  return json?.data?.integration;
},



  async list(projectId: number): Promise<IntegrationListResponse> {
    const res = await fetch(
      `${config.baseUrl}/autoanalysis/projects/${projectId}/integrations/`,
      { headers: getHeaders() }
    );

    const json = await res.json();
    if (!res.ok) throw new Error(json?.data?.error || "Failed to fetch integrations");

    return json;
  },

  async delete(projectId: number, integrationId: number) {
    const res = await fetch(
      `${config.baseUrl}/autoanalysis/projects/${projectId}/integrations/${integrationId}/`,
      { method: "DELETE", headers: getHeaders() }
    );

    const json = await res.json();
    if (!res.ok) throw new Error(json?.data?.error || "Delete failed");

    return json;
  },
};
