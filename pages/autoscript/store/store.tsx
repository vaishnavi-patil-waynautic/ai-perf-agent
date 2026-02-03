import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JMXRecord } from "../types/type";
import { autoScriptService } from "../services/service";

interface AutoScriptState {
  history: JMXRecord[];
  loading: boolean;
  error: string | null;
  generating: boolean;
}

const initialState: AutoScriptState = {
  history: [],
  loading: false,
  error: null,
  generating: false,
};

/* -------------------- THUNKS -------------------- */

// Load history
export const fetchHistory = createAsyncThunk(
  "autoscript/fetchHistory",
  async (projectId: number, { rejectWithValue }) => {
    try {
      return await autoScriptService.getHistory(projectId);
    } catch (e: any) {
      return rejectWithValue("Failed to load history");
    }
  }
);

// Generate JMX
export const generateJmx = createAsyncThunk(
  "autoscript/generateJmx",
  async (
    { file1, file2, projectId, applicationId }: { file1: File; file2: File, projectId: number; applicationId?: number },
    // TODO: add project id and application id
    { rejectWithValue }
  ) => {
    try {
      await autoScriptService.generate(file1, file2, projectId, applicationId);
      return await autoScriptService.getHistory(projectId);
    } catch (e: any) {
      return rejectWithValue("Generation failed");
    }
  }
);

// Delete JMX
export const deleteJmx = createAsyncThunk(
  "autoscript/deleteJmx",
  async (id: number, { rejectWithValue }) => {
    try {
      await autoScriptService.deleteJmx(id);
      return id;
    } catch {
      return rejectWithValue("Delete failed");
    }
  }
);

/* -------------------- SLICE -------------------- */

const autoscriptSlice = createSlice({
  name: "autoscript",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder

      /* Fetch history */
      .addCase(fetchHistory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchHistory.fulfilled,
        (state, action: PayloadAction<JMXRecord[]>) => {
          state.loading = false;
          state.history = action.payload;
        }
      )
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* Generate */
      .addCase(generateJmx.pending, state => {
        state.generating = true;
        state.error = null;
      })
      .addCase(
        generateJmx.fulfilled,
        (state, action: PayloadAction<JMXRecord[]>) => {
          state.generating = false;
          state.history = action.payload;
        }
      )
      .addCase(generateJmx.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload as string;
      })

      /* Delete */
      .addCase(
        deleteJmx.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.history = state.history.filter(
            item => item.id !== action.payload
          );
        }
      )
      .addCase(deleteJmx.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = autoscriptSlice.actions;
export default autoscriptSlice.reducer;
