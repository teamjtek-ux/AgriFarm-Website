/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import weatherReducer from './slices/weatherSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    weather: weatherReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
