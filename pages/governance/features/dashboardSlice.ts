import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dashboard, GlobalFilters } from '../types';

interface DashboardState {
  currentDashboard: Dashboard | null;
  filters: GlobalFilters;
  isSidebarOpen: boolean;
}

const initialState: DashboardState = {
  currentDashboard: null,
  filters: {
    projectId: 'waynautic-1',
    dateRange: [null, null],
    environment: 'production',
  },
  isSidebarOpen: true,
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
          return layout ? { ...w, gridSettings: { x: layout.x, y: layout.y, w: layout.w, h: layout.h } } : w;
        });
      }
    },
    addWidget: (state, action: PayloadAction<any>) => {
      state.currentDashboard?.widgets.push(action.payload);
    },
  },
});