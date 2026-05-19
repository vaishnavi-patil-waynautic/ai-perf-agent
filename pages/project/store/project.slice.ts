import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectState } from '../types/project.types';
import { createApplication, deleteApplication, fetchProjectById, fetchProjects, updateApplication } from './project.thunks';

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
      })

      // ➕ CREATE
      .addCase(createApplication.fulfilled, (state, action) => {
        console.log("[SLICE] Application Created:", action.payload);
        state.applications.push(action.payload);
      })

      // ✏️ UPDATE
      .addCase(updateApplication.fulfilled, (state, action) => {
        console.log("[SLICE] Application Updated:", action.payload);

        const index = state.applications.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })

      // 🗑 DELETE
      .addCase(deleteApplication.fulfilled, (state, action) => {
        console.log("[SLICE] Application Deleted:", action.payload);

        state.applications = state.applications.filter(a => a.id !== action.payload);
      });

  },
});

export const {
  selectProject,
  selectApplication,
  resetProjectState,
} = projectSlice.actions;

export default projectSlice.reducer;
