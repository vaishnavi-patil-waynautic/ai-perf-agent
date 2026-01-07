import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Application, Integration } from "../types/settings.types";

interface SettingsState {
    applications: Application[];
    integrations: Integration[];
}

const initialState: SettingsState = {
    applications: [
        { id: "1", name: "Trading Engine", description: "Core engine" }
    ],
    integrations: [
        { type: "github", name: "GitHub", connected: true, token: "ghp_xxx" },
        { type: "datadog", name: "Datadog", connected: false, token: "" },
        { type: "jira", name: "Jira", connected: false, token: "" },
        { type: "ado", name: "Azure DevOps", connected: true, token: "ghp_xxx" },
        { type: "blazemeter", name: "BlazeMeter", connected: true, token: "ghp_xxx" },
    ]
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        addApplication: (state, action: PayloadAction<Application>) => {
            state.applications.push(action.payload);
        },
        updateApplication: (state, action: PayloadAction<Application>) => {
            const idx = state.applications.findIndex(a => a.id === action.payload.id);
            if (idx !== -1) state.applications[idx] = action.payload;
        },
        deleteApplication: (state, action: PayloadAction<string>) => {
            state.applications = state.applications.filter(a => a.id !== action.payload);
        },
        // updateIntegration(
        //     state,
        //     action: PayloadAction<{ id: string; token: string }>
        // ) {
        //     state.integrations[action.payload.id] = {
        //         connected: true,
        //         token: action.payload.token
        //     };
        // }

        updateIntegration: (
  state,
  action: PayloadAction<{ type: string; token: string }>
) => {
  const integration = state.integrations.find(
    i => i.type === action.payload.type
  );

  if (integration) {
    integration.connected = true;
    integration.token = action.payload.token;
  }
},



    }
});

export const { addApplication, updateApplication, deleteApplication, updateIntegration } = settingsSlice.actions;
export default settingsSlice.reducer;
