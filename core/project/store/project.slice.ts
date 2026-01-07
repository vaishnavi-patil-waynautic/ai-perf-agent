// // import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// // import { ProjectState, Project, Application } from '../types/project.types';
// // import { projectService } from '../services/project.service';

// // /**
// //  * TEMP DUMMY PROJECTS
// //  * -------------------
// //  * REMOVE once GET /projects API exists
// //  */
// // const DUMMY_PROJECTS: Project[] = [
// //   { id: 1, name: 'Waynautic-1' },
// // ];

// // export const fetchProjectApplications = createAsyncThunk(
// //   'project/fetchProjectApplications',
// //   async (projectId: number) => {
// //     const res = await projectService.getProjectById(projectId);
// //     return res.data.applications as Application[];
// //   }
// // );

// // const initialState: ProjectState = {
// //   projects: DUMMY_PROJECTS,
// //   selectedProject: DUMMY_PROJECTS[0], // project 1
// //   applications: [],
// //   selectedApplication: null,
// //   loading: false,
// // };

// // const projectSlice = createSlice({
// //   name: 'project',
// //   initialState,
// //   reducers: {
// //     selectProject(state, action: PayloadAction<Project>) {
// //       state.selectedProject = action.payload;
// //       state.selectedApplication = null;
// //       state.applications = [];
// //     },

// //     selectApplication(state, action: PayloadAction<Application>) {
// //       state.selectedApplication = action.payload;
// //     },

// //     setProjects(state, action: PayloadAction<Project[]>) {
// //       state.projects = action.payload;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(fetchProjectApplications.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(fetchProjectApplications.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.applications = action.payload;
// //       })
// //       .addCase(fetchProjectApplications.rejected, (state) => {
// //         state.loading = false;
// //       });
// //   },
// // });


// // export const {
// //   selectProject,
// //   selectApplication,
// //   setProjects,
// //    resetProjectState,
// // } = projectSlice.actions;

// // export default projectSlice.reducer;



// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Project, Application, ProjectState } from '../types/project.types';

// /**
//  * Dummy projects (until API exists)
//  */
// const DUMMY_PROJECTS: Project[] = [
//   { id: 1, name: 'Waynautic-1', description: 'AI Tool' },
// ];

// /**
//  * Dummy applications (until API exists)
//  */
// const DUMMY_APPLICATIONS: Application[] = [
//   { id: 1, project: 1, name: 'AutoScripts' },
//   { id: 2, project: 1, name: 'AutoNFR' },
//   { id: 3, project: 1, name: 'AutoAnalysis' },
//   { id: 4, project: 1, name: 'ChatBot' },
// ];

// const initialState: ProjectState = {
//   projects: DUMMY_PROJECTS,
//   applications: [],
//   selectedProject: null,
//   selectedApplication: null, // ✅ REQUIRED
//   loading: false,
// };



// const projectSlice = createSlice({
//   name: 'project',
//   initialState,
//   reducers: {
//     /**
//      * Select project → resets app → loads apps
//      */
//     selectProject: (state, action: PayloadAction<Project>) => {
//       state.selectedProject = action.payload;
//       state.selectedApplication = null;

//       // Dummy filtering (API later)
//       state.applications = DUMMY_APPLICATIONS.filter(
//         app => app.project === action.payload.id
//       );
//     },

//     /**
//      * Select application
//      */
//     selectApplication: (state, action: PayloadAction<Application>) => {
//       state.selectedApplication = action.payload;
//     },

//     /**
//      * Reset everything (logout / project switch)
//      */
//     resetProjectState: () => initialState,
//   },
// });

// export const {
//   selectProject,
//   selectApplication,
//   resetProjectState,
// } = projectSlice.actions;

// export default projectSlice.reducer;
