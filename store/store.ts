import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import projectReducer from './projectSlice';

import nfrListReducer from '../pages/NFR/slices/nfrListSlice';
import nfrWizardReducer from '../pages/NFR/slices/nfrWizardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    nfrList: nfrListReducer,
    nfrWizard: nfrWizardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;