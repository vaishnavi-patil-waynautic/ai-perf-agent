import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, Application, ProjectState } from '../types';

// Dummy Data
const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'E-Commerce Platform' },
  { id: 'p2', name: 'Finance Dashboard' },
  { id: 'p3', name: 'Logistics Tracker' },
];

const MOCK_APPS: Application[] = [
  { id: 'a1', projectId: 'p1', name: 'User Service' },
  { id: 'a2', projectId: 'p1', name: 'Order Service' },
  { id: 'a3', projectId: 'p2', name: 'Payment Gateway' },
  { id: 'a4', projectId: 'p3', name: 'Tracking API' },
];

const initialState: ProjectState = {
  projects: MOCK_PROJECTS,
  applications: [],
  selectedProject: null,
  selectedApp: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    selectProject: (state, action: PayloadAction<string>) => {
      const project = state.projects.find((p) => p.id === action.payload) || null;
      state.selectedProject = project;
      if (project) {
        state.applications = MOCK_APPS.filter((app) => app.projectId === project.id);
      } else {
        state.applications = [];
      }
      state.selectedApp = null; // Reset app selection
    },
    selectApp: (state, action: PayloadAction<string>) => {
      state.selectedApp = state.applications.find((a) => a.id === action.payload) || null;
    },
  },
});

export const { selectProject, selectApp } = projectSlice.actions;
export default projectSlice.reducer;