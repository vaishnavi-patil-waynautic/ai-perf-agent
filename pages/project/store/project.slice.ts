// pages/project/store/project.slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectState, Project, Application } from '../types/project.types';
import { fetchProjectById } from './project.thunks';

const initialState: ProjectState = {
  projects: [],          // dummy for now
  applications: [],
  selectedProject: null,
  selectedApp: null,
  loading: false,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,

  reducers: {
    selectProject: (state, action: PayloadAction<number>) => {
      const project = state.projects.find(p => p.id === action.payload) || null;
      state.selectedProject = project;
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
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        const { project, applications, dummyProjects } = action.payload;

        state.loading = false;
        state.projects = dummyProjects; // TEMP
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
