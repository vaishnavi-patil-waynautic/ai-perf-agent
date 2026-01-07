import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import projectReducer from '../pages/project/store/project.slice';

import nfrListReducer from '../pages/NFR/slices/nfrListSlice';
import nfrWizardReducer from '../pages/NFR/slices/nfrWizardSlice';
import { autoAnalysisReducer } from '../pages/autoanalysis';
import settingsReducer from "../pages/settings/store/settings.store";



export const store = configureStore({
  reducer: {
    // project: projectReducer,
    auth: authReducer,
    project: projectReducer,
    nfrList: nfrListReducer,
    nfrWizard: nfrWizardReducer,
    autoAnalysis: autoAnalysisReducer,
    settings: settingsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


