// pages/project/store/project.thunks.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '../services/project.service';
import { Project, Application } from '../types/project.types';


export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async () => { 

    return await projectService.getAllProjects();
  });



export const fetchProjectById = createAsyncThunk(
  'project/fetchProjectById',
  async (projectId: number) => {

    const data = await projectService.getProjectById(projectId);

    return {
      project: {
        id: projectId,
        name: data.name,
        description: data.description,
      } as Project,
      applications: data.applications as Application[],
    };
  }
);

// ➕ CREATE
export const createApplication = createAsyncThunk(
  'project/createApplication',
  async (
    payload: { projectId: number; name: string; description?: string },
    { rejectWithValue }
  ) => {
    try {
      return await projectService.createApplication(
        payload.projectId,
        payload.name,
        payload.description
      );
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ✏️ UPDATE
export const updateApplication = createAsyncThunk(
  'project/updateApplication',
  async (
    payload: { appId: number; name?: string; description?: string },
    { rejectWithValue }
  ) => {
    try {
      return await projectService.updateApplication(payload.appId, payload);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// 🗑 DELETE
export const deleteApplication = createAsyncThunk(
  'project/deleteApplication',
  async (appId: number, { rejectWithValue }) => {
    try {
      await projectService.deleteApplication(appId);
      return appId;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
