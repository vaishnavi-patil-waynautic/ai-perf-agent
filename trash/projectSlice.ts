// // import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// // import { Project, Application, ProjectState } from '../types';

// // // Dummy Data
// // const MOCK_PROJECTS: Project[] = [
// //   { id: 'p1', name: 'E-Commerce Platform' },
// //   { id: 'p2', name: 'Finance Dashboard' },
// //   { id: 'p3', name: 'Logistics Tracker' },
// // ];

// // const MOCK_APPS: Application[] = [
// //   { id: 'a1', projectId: 'p1', name: 'User Service' },
// //   { id: 'a2', projectId: 'p1', name: 'Order Service' },
// //   { id: 'a3', projectId: 'p2', name: 'Payment Gateway' },
// //   { id: 'a4', projectId: 'p3', name: 'Tracking API' },
// // ];

// // const initialState: ProjectState = {
// //   projects: MOCK_PROJECTS,
// //   applications: [],
// //   selectedProject: null,
// //   selectedApp: null,
// // };

// // const projectSlice = createSlice({
// //   name: 'project',
// //   initialState,
// //   reducers: {
// //     selectProject: (state, action: PayloadAction<string>) => {
// //       const project = state.projects.find((p) => p.id === action.payload) || null;
// //       state.selectedProject = project;
// //       if (project) {
// //         state.applications = MOCK_APPS.filter((app) => app.projectId === project.id);
// //       } else {
// //         state.applications = [];
// //       }
// //       state.selectedApp = null; // Reset app selection
// //     },
// //     selectApp: (state, action: PayloadAction<string>) => {
// //       state.selectedApp = state.applications.find((a) => a.id === action.payload) || null;
// //     },
// //   },
// // });

// // export const { selectProject, selectApp } = projectSlice.actions;
// // export default projectSlice.reducer;



// import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
// import { Project, Application, ProjectState } from '../types';

// // Initial state
// const initialState: ProjectState = {
//   projects: [],              // all available projects
//   applications: [],          // applications under selected project
//   selectedProject: null,     // currently selected project
//   selectedApp: null,         // currently selected application
// };

// // -------------------- Async thunk to fetch project + apps --------------------
// export const fetchProjectById = createAsyncThunk(
//   'project/fetchProjectById',
//   async (projectId: number) => {
//     const token = localStorage.getItem('access_token');
//     if (!token) throw new Error('Missing access token');

//     const res = await fetch(`http://127.0.0.1:8000/api/v1/users/project/${projectId}`, {
//       headers: {
//         Accept: 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) throw new Error('Failed to fetch project');

//     const json = await res.json();

//     return json.data as Project & { applications: Application[] };
//   }
// );

// // -------------------- Slice --------------------
// const projectSlice = createSlice({
//   name: 'project',
//   initialState,
//   reducers: {
//     selectProject: (state, action: PayloadAction<string>) => {
//       const project = state.projects.find(p => p.id === action.payload) || null;
//       state.selectedProject = project;

//       if (project) {
//         // If applications already exist for this project in store
//         state.applications = project.applications || [];
//       } else {
//         state.applications = [];
//       }

//       state.selectedApp = null; // Reset app selection
//     },

//     selectApp: (state, action: PayloadAction<string>) => {
//       state.selectedApp = state.applications.find(a => a.id === action.payload) || null;
//     },
//   },

//   extraReducers: (builder) => {
//     builder.addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project & { applications: Application[] }>) => {
//       const project = action.payload;
//       // Add project to list if not already
//       if (!state.projects.find(p => p.id === project.id)) {
//         state.projects.push(project);
//       }

//       state.selectedProject = project;
//       state.applications = project.applications || [];
//       state.selectedApp = null;
//     });
//   },
// });

// export const { selectProject, selectApp } = projectSlice.actions;
// export default projectSlice.reducer;
