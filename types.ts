export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface Application {
  id: string;
  projectId: string;
  name: string;
}

export interface JMXRecord {
  id: string;
  fileName: string;
  generatedAt: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface ProjectState {
  projects: Project[];
  applications: Application[];
  selectedProject: Project | null;
  selectedApp: Application | null;
}
