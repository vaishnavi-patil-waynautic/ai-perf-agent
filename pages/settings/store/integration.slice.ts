import { createSlice } from "@reduxjs/toolkit";
import { fetchIntegrations, deleteIntegration } from "./integration.thunk";
import { Integration, IntegrationType } from "../types/settings.types";

const ALL_TYPES: IntegrationType[] = [
  "github",
  "blazemeter",
  "ado",
  "jira",
  "datadog",
];

interface State {
  list: Integration[];
  loading: boolean;
}

const initialState: State = {
  list: ALL_TYPES.map(type => ({
    id: null,
    type,
    name: type.toUpperCase(),
    status: "inactive",
  })),
  loading: false,
};

const IntegrationSlice = createSlice({
  name: "integration",
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder

      .addCase(fetchIntegrations.pending, state => {
        state.loading = true;
      })

      .addCase(fetchIntegrations.fulfilled, (state, action) => {
        state.loading = false;

        const apiList = action.payload;

        state.list = ALL_TYPES.map(type => {
          const found = apiList.find(i => i.integration_type === type);

          if (!found) {
            return {
              id: null,
              type,
              name: type.toUpperCase(),
              status: "inactive",
            };
          }

          return {
            id: found.id,
            type,
            name: found.integration_type_display,
            status: found.is_active ? "active" : "inactive",
          };
        });
      })

      .addCase(deleteIntegration.fulfilled, (state, action) => {
        const id = action.payload;

        const item = state.list.find(i => i.id === id);
        if (item) {
          item.id = null;
          item.status = "inactive";
        }
      });
  },
});

export default IntegrationSlice.reducer;
