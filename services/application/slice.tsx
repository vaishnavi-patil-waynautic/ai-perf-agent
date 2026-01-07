import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

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

const initialState: ProjectSliceState = {
  currentProject: null,
};

// Async thunk to fetch project + apps
export const fetchProject = createAsyncThunk(
  "project/fetchProject",
  async (projectId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Missing token");

    const res = await fetch(`http://127.0.0.1:8000/api/v1/users/project/${projectId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch project");

    const json = await res.json();
    return json.data as ProjectState;
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject(state, action: PayloadAction<ProjectState>) {
      state.currentProject = action.payload;
    },
    clearProject(state) {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProject.fulfilled, (state, action: PayloadAction<ProjectState>) => {
      state.currentProject = action.payload;
    });
  },
});

export const { setProject, clearProject } = projectSlice.actions;
export default projectSlice.reducer;
