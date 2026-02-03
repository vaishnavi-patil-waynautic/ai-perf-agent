// pages/project/types/project.types.ts

export interface Project {
  id: number;
  name: string;
  description?: string;
  applications?: Application[];
}


export interface Application {
  id: number;
  project: number;
  name: string;
  description?: string;
}

export interface ProjectState {
  projects: Project[];
  applications: Application[];
  selectedProject: Project | null;
  selectedApp: Application | null;
  loading: boolean; // ✅ REQUIRED
}

