// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import {  Integration } from "../types/settings.types";

// interface SettingsState {
//     integrations: Integration[];
// }

// const initialState: SettingsState = {
    
//     integrations: [
//         { type: "github", name: "GitHub", connected: true, token: "ghp_xxx" },
//         { type: "datadog", name: "Datadog", connected: false, token: "" },
//         { type: "jira", name: "Jira", connected: false, token: "" },
//         { type: "ado", name: "Azure DevOps", connected: true, token: "ghp_xxx" },
//         { type: "blazemeter", name: "BlazeMeter", connected: true, token: "ghp_xxx" },
//     ]
// };

// const settingsSlice = createSlice({
//     name: "settings",
//     initialState,
//     reducers: {
//         // updateIntegration(
//         //     state,
//         //     action: PayloadAction<{ id: string; token: string }>
//         // ) {
//         //     state.integrations[action.payload.id] = {
//         //         connected: true,
//         //         token: action.payload.token
//         //     };
//         // }

//         updateIntegration: (
//   state,
//   action: PayloadAction<{ type: string; token: string }>
// ) => {
//   const integration = state.integrations.find(
//     i => i.type === action.payload.type
//   );

//   if (integration) {
//     integration.connected = true;
//     integration.token = action.payload.token;
//   }
// },



//     }
// });

// export const {  updateIntegration } = settingsSlice.actions;
// export default settingsSlice.reducer;
