import { config } from "../../../config/backendConfig";
import {
  IntegrationListResponse,
  IntegrationType,
} from "../types/settings.types";

const getHeaders = () => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const integrationService = {
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
