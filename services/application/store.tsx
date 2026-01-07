interface Application {
  id: number;
  project: number;
  name: string;
  description: string;
  created_on: string;
}

interface ProjectState {
  id: number;
  name: string;
  description: string;
  created_on: string;
  applications: Application[];
}

interface ProjectSliceState {
  currentProject: ProjectState | null;
}
