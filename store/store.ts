import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import projectReducer from '../pages/project/store/project.slice';

import nfrListReducer from '../pages/NFR/slices/nfrListSlice';
import nfrWizardReducer from '../pages/NFR/slices/nfrWizardSlice';
import { autoAnalysisReducer } from '../pages/autoanalysis';
import IntegrationSlice from "../pages/settings/store/integration.slice";
import userReducer from "../pages/settings/store/user.slice"



export const store = configureStore({
  reducer: {
    // project: projectReducer,
    auth: authReducer,
    project: projectReducer,
    nfrList: nfrListReducer,
    nfrWizard: nfrWizardReducer,
    autoAnalysis: autoAnalysisReducer,
    integration: IntegrationSlice,
    user: userReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


