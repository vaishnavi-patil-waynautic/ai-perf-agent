import { createAsyncThunk } from "@reduxjs/toolkit";
import { integrationService } from "../services/integration.service";
import { IntegrationType } from "../types/settings.types";

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
