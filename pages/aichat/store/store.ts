import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chat.slice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore timestamp fields
        ignoredActions: ['chat/sendMessage/fulfilled', 'chat/addUserMessage'],
        ignoredPaths: ['chat.messages'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;