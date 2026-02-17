import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../services/mockService';
import { Application, AppConfiguration, AppDetails, JmxScriptOption } from '../types';

interface AutoAnalysisState {
  applications: Application[];
  currentApp: AppDetails | null;
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

export const fetchApps = createAsyncThunk<
  Application[],      // return type
  number               // argument type (projectId)
>(
  'autoAnalysis/fetchApps',
  async (projectId, thunkAPI) => {
    try {
      return await api.fetchApplications(projectId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// export const addApp = createAsyncThunk('autoAnalysis/addApp', async (data: any) => await api.createApplication(data));
// export const removeApp = createAsyncThunk('autoAnalysis/removeApp', async (id: string) => {
//   await api.deleteApplication(id);
//   return id;
// });

// export const fetchConfig = createAsyncThunk<
//   AppDetails,
//   { projectId: number; appId: number }
// >(
//   'autoAnalysis/fetchConfig',
//   async ({ projectId, appId }, thunkAPI) => {
//     try {
//       return await api.fetchAppDetails(projectId, appId);
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(err.message);
//     }
//   }
// );

export const fetchConfig = createAsyncThunk<
  AppDetails,
  { projectId: number; appId: number }
>(
  'autoAnalysis/fetchConfig',
  async ({ projectId, appId }, thunkAPI) => {

    console.log("THUNK STARTED:", projectId, appId);

    try {
      const result = await api.fetchAppDetails(projectId, appId);

      console.log("THUNK RESULT:", result);

      return result;

    } catch (err: any) {
      console.log("THUNK ERROR:", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


  



export const fetchJmx = 
createAsyncThunk<
[],
number
>('autoAnalysis/fetchJmx',

  async (appId , thunkAPI) => {

    console.log("THUNK STARTED:",  appId);

    try {
      const result = await api.getScriptsByAppId(appId);

      console.log("THUNK RESULT:", result);

      return result;

    } catch (err: any) {
      console.log("THUNK ERROR:", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  });

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
      // .addCase(addApp.fulfilled, (state, action) => {
      //   state.applications.push(action.payload);
      // })
      // // Remove App
      // .addCase(removeApp.fulfilled, (state, action) => {
      //   state.applications = state.applications.filter(
      //     app => app.id !== action.payload
      //   );
      // })

      // Fetch Config
      .addCase(fetchConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConfig.fulfilled, (state, action) => {
        console.log("REDUCER HIT:", action.payload);
        state.loading = false;
        state.currentApp = action.payload;
      })
      .addCase(fetchConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch JMX
      .addCase(fetchJmx.fulfilled, (state, action) => {
        state.jmxOptions = action.payload;
      });
},
});

export const { clearCurrentApp } = autoAnalysisSlice.actions;
export default autoAnalysisSlice.reducer;