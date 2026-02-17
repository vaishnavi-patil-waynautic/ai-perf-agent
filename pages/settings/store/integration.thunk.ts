import { createAsyncThunk } from "@reduxjs/toolkit";
import { integrationService } from "../services/integration.service";
import { IntegrationType, IntegrationDetailResponse } from "../types/settings.types";

export const fetchIntegrations = createAsyncThunk(
  "integration/fetch",
  async (projectId: number) => {
    const res = await integrationService.list(projectId);
    return res.data.integrations;
  }
);

export const deleteIntegration = createAsyncThunk(
  "integration/delete",
  async ({ projectId, id }: { projectId: number; id: number }) => {
    await integrationService.delete(projectId, id);
    return id;
  }
);

export const fetchIntegrationDetail = createAsyncThunk(
  "integration/fetchDetail",
  async (
    { projectId, integrationId }: { projectId: number; integrationId: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `/autoanalysis/projects/${projectId}/integrations/${integrationId}/`,
         {
           method: "GET",
          headers : {Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,}
          
         }
      );

      const json = await res.json();

      return json.data.integration;
      
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Failed to fetch integration");
    }
  }
);
