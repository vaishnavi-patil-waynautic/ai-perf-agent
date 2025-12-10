import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../services/mockService';
import { Application, AppConfiguration, JmxScriptOption } from '../types';

interface AutoAnalysisState {
  applications: Application[];
  currentApp: AppConfiguration | null;
  jmxOptions: JmxScriptOption[];
  loading: boolean;
  error: string | null;
}

const initialState: AutoAnalysisState = {
  applications: [],
  currentApp: null,
  jmxOptions: [],
  loading: false,
  error: null,
};

export const fetchApps = createAsyncThunk('autoAnalysis/fetchApps', api.fetchApplications);
export const addApp = createAsyncThunk('autoAnalysis/addApp', async (data: any) => await api.createApplication(data));
export const removeApp = createAsyncThunk('autoAnalysis/removeApp', async (id: string) => {
  await api.deleteApplication(id);
  return id;
});
export const fetchConfig = createAsyncThunk('autoAnalysis/fetchConfig', async (id: string) => await api.fetchAppDetails(id));
export const fetchJmx = createAsyncThunk('autoAnalysis/fetchJmx', api.fetchJmxOptions);

const autoAnalysisSlice = createSlice({
  name: 'autoAnalysis',
  initialState,
  reducers: {
    clearCurrentApp: (state) => {
      state.currentApp = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Apps
      .addCase(fetchApps.pending, (state) => { state.loading = true; })
      .addCase(fetchApps.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      // Add App
      .addCase(addApp.fulfilled, (state, action) => {
        state.applications.push(action.payload);
      })
      // Remove App
      .addCase(removeApp.fulfilled, (state, action) => {
        state.applications = state.applications.filter(a => a.id !== action.payload);
      })
      // Fetch Config
      .addCase(fetchConfig.fulfilled, (state, action) => {
        state.currentApp = action.payload;
      })
      // Fetch JMX
      .addCase(fetchJmx.fulfilled, (state, action) => {
        state.jmxOptions = action.payload;
      });
  },
});

export const { clearCurrentApp } = autoAnalysisSlice.actions;
export default autoAnalysisSlice.reducer;