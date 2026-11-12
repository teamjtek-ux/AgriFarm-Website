/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/store/authSlice';
import uiReducer from './uiSlice';
import weatherReducer from '../../features/weather/store/weatherSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    weather: weatherReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
