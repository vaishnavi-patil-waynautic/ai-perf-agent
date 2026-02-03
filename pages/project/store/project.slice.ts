// // pages/project/store/project.slice.ts

// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { ProjectState, Project, Application } from '../types/project.types';
// import { fetchProjectById, fetchProjects } from './project.thunks';

// const initialState: ProjectState = {
//   projects: [],          // dummy for now
//   applications: [],
//   selectedProject: null,
//   selectedApp: null,
//   loading: false,
// };

// const projectSlice = createSlice({
//   name: 'project',
//   initialState,

//   reducers: {
//     selectProject: (state, action: PayloadAction<number>) => {
//       const project = state.projects.find(p => p.id === action.payload) || null;
//       state.selectedProject = project;
//       state.selectedApp = null;

//       if (project) {
//         localStorage.setItem('selectedProjectId', String(project.id));
//       }

//     },

//     selectApplication: (state, action: PayloadAction<number>) => {
//       state.selectedApp =
//         state.applications.find(a => a.id === action.payload) || null;
//     },

//     resetProjectState: () => initialState,
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProjects.fulfilled, (state, action) => {
//         state.projects = action.payload;

//         const storedId = localStorage.getItem('selectedProjectId');
//         if (storedId && !state.selectedProject) {
//           const project = action.payload.find(
//             p => p.id === Number(storedId)
//           );
//           if (project) {
//             state.selectedProject = project;
//           }
//         }
//       })
//       .addCase(fetchProjectById.pending, (state) => {
//         state.loading = true;
//       })

//       .addCase(fetchProjectById.fulfilled, (state, action) => {
//         const { project, applications } = action.payload;

//         state.loading = false;
//         state.selectedProject = project;
//         state.applications = applications;
//         state.selectedApp = applications?.[0] ?? null;
//       })
//       .addCase(fetchProjectById.rejected, (state) => {
//         state.loading = false;
//       });
//   },
// });

// export const {
//   selectProject,
//   selectApplication,
//   resetProjectState,
// } = projectSlice.actions;

// export default projectSlice.reducer;


import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectState } from '../types/project.types';
import { fetchProjectById, fetchProjects } from './project.thunks';

const initialState: ProjectState = {
  projects: [],
  applications: [],
  selectedProject: null,
  selectedApp: null,
  loading: false,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,

  reducers: {

    // ONLY store ID + reset dependent state
    selectProject: (state, action: PayloadAction<number>) => {

      localStorage.setItem('selectedProjectId', String(action.payload));

      // Reset dependent data until fetchProjectById finishes
      state.selectedProject = null;
      state.applications = [];
      state.selectedApp = null;
    },

    selectApplication: (state, action: PayloadAction<number>) => {
      state.selectedApp =
        state.applications.find(a => a.id === action.payload) || null;
    },

    resetProjectState: () => initialState,
  },

  extraReducers: (builder) => {

    builder

      // Load all projects list
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;

        const storedId = localStorage.getItem('selectedProjectId');

        // Auto-restore selected project after refresh
        if (storedId) {
          state.loading = true;
        }
      })

      // Fetch single project with applications
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchProjectById.fulfilled, (state, action) => {

  const { project, applications } = action.payload;

  state.loading = false;

  state.selectedProject = project;
  state.applications = applications;
  state.selectedApp = applications[0] ?? null;
})


      .addCase(fetchProjectById.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  selectProject,
  selectApplication,
  resetProjectState,
} = projectSlice.actions;

export default projectSlice.reducer;
