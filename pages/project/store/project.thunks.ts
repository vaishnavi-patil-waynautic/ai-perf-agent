// pages/project/store/project.thunks.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '../services/project.service';
import { Project, Application } from '../types/project.types';

/**
 * Temporary dummy projects
 * Used until "getAllProjects" API is ready
 */
// const DUMMY_PROJECTS: Project[] = [
//   { id: 1, name: 'Waynautic-1', description: 'AI Tool' },
//   { id: 2, name: 'Waynautic-2', description: 'AI Tool' },
//   { id: 3, name: 'Waynautic-3', description: 'AI Tool' },
// ];

export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async () => { 

    return await projectService.getAllProjects();
  });

/**
 * Load project + applications by projectId
 */
// export const fetchProjectById = createAsyncThunk(

//   'project/fetchProjectById',
//   async (projectId: number) => {
//     const res = await projectService.getProjectById(projectId);
//     const data = res.data;


//     console.log('Fetched project data:', data);

//     return {
//       project: {
//         id: projectId,
//         name: data.name,
//         description: data.description,
//       } as Project,
//       applications: data.applications as Application[],
//     };
//   }
// );


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

