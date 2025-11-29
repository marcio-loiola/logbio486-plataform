import { configureStore } from '@reduxjs/toolkit';
import logbookReducer from './slices/logbookSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    logbook: logbookReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
