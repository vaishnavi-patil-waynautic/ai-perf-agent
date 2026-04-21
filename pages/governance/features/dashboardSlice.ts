import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dashboard, GlobalFilters } from '../types';
import {
  fetchRoiOverview,
  fetchLlmSummary,
  fetchLlmUsageList,
} from '../store/dashboard.thunks';

interface DashboardState {
  currentDashboard: Dashboard | null;
  filters: GlobalFilters;
  isSidebarOpen: boolean;

  roi: {
    kpis: Record<string, any>;
    charts: Record<string, any>;
    models: any[]; // derived from llm.byModel
    selectedModel: string | null;
    llm: {
      totalTokens: number;
      totalCost: number;
      byModel: any[];
    };
    loading: boolean;
  };

  llmUsageList: any[];
  error: any;
}

const initialState: DashboardState = {
  currentDashboard: null,
  filters: {
    projectId: 'waynautic-1',
    dateRange: [null, null],
    environment: 'production',
  },
  isSidebarOpen: true,

  roi: {
    kpis: {},
    charts: {},
    models: [],
    selectedModel: null,
    llm: {
      totalTokens: 0,
      totalCost: 0,
      byModel: [],
    },
    loading: false,
  },

  llmUsageList: [],
  error: null,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<GlobalFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    updateLayout: (state, action: PayloadAction<any[]>) => {
      if (state.currentDashboard) {
        state.currentDashboard.widgets = state.currentDashboard.widgets.map(w => {
          const layout = action.payload.find(l => l.i === w.id);
          return layout
            ? { ...w, gridSettings: { x: layout.x, y: layout.y, w: layout.w, h: layout.h } }
            : w;
        });
      }
    },

    addWidget: (state, action: PayloadAction<any>) => {
      state.currentDashboard?.widgets.push(action.payload);
    },

    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.roi.selectedModel = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🔥 ROI OVERVIEW
      .addCase(fetchRoiOverview.pending, (state) => {
        state.roi.loading = true;
      })

      .addCase(fetchRoiOverview.fulfilled, (state, action) => {
        state.roi.loading = false;

        // ✅ Correct mapping
        state.roi.kpis = action.payload.kpis;
        state.roi.charts = action.payload.charts;
        state.roi.llm = action.payload.llm;

        // 🔥 derive models from llm.byModel
        state.roi.models = action.payload.llm?.byModel || [];

        // ✅ default model
        if (!state.roi.selectedModel && state.roi.models.length) {
          state.roi.selectedModel = state.roi.models[0].id;
        }
      })

      .addCase(fetchRoiOverview.rejected, (state, action) => {
        state.roi.loading = false;
        state.error = action.error;
      })

      // 🔥 LLM USAGE LIST
      .addCase(fetchLlmUsageList.fulfilled, (state, action) => {
        state.llmUsageList = action.payload.results;
      })

      // 🔥 OPTIONAL SUMMARY
      .addCase(fetchLlmSummary.fulfilled, (state, action) => {
        // keep for future
      });
  },
});

export const {
  setFilters,
  updateLayout,
  addWidget,
  setSelectedModel,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;