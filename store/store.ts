import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

// Reducers
import authReducer from './authSlice';
import projectReducer from '../pages/project/store/project.slice';
import nfrListReducer from '../pages/NFR/slices/nfrListSlice';
import nfrWizardReducer from '../pages/NFR/slices/nfrWizardSlice';
import { autoAnalysisReducer } from '../pages/autoanalysis';
import IntegrationSlice from '../pages/settings/store/integration.slice';
import userReducer from '../pages/settings/store/user.slice';
import chatReducer from '../pages/aichat/store/slices/chat.slice';
import appSnackbarReducer from './snackbarStore';
import aiModelReducer from '../pages/settings/store/aiModel.slice';
import dashboardReducer from '../pages/governance/features/dashboardSlice';
import fileReducer from '../pages/governance/features/fileSlice';
// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  nfrList: nfrListReducer,
  nfrWizard: nfrWizardReducer,
  autoAnalysis: autoAnalysisReducer,
  integration: IntegrationSlice,
  user: userReducer,
  chat: chatReducer,
  appSnackbar: appSnackbarReducer,
  aiModel: aiModelReducer,
  dashboard: dashboardReducer,
  files: fileReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage: storageSession,
  whitelist: [
    'auth',
    'project',
    'nfrList',
    "nfrWizard",
    'autoAnalysis',
    'chat',
    'user',
    'integration',
    'aiModel',
    'appSnackbar',
    'dashboard',
    'files',
  ],
};

// Wrap root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
      immutableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// ✅ Define RootState from the original rootReducer
export type RootState = ReturnType<typeof rootReducer>;

// Dispatch type
export type AppDispatch = typeof store.dispatch;


