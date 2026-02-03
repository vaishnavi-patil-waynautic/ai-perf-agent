// pages/project/store/project.selectors.ts

import { RootState } from '../../../store/store';

export const selectProjects = (state: RootState) =>
  state.project.projects;

export const selectSelectedProject = (state: RootState) =>
  state.project.selectedProject;

export const selectApplications = (state: RootState) =>
  state.project.applications;

export const selectSelectedApplication = (state: RootState) =>
  state.project.selectedApp;

export const selectProjectLoading = (state: RootState) =>
  state.project.loading;


