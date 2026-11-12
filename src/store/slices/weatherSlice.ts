/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CurrentWeatherData,
  DailyForecastItem,
  HourlyForecastItem,
  WeatherLocation,
  WeatherMeta,
} from '../../types';
import {
  DEFAULT_WEATHER_LOCATION,
  fetchCurrentWeatherApi,
  fetchForecastWeatherApi,
  fetchHourlyWeatherApi,
  formatLocationLabel,
  geocodeAddressText,
  getStoredWeatherLocation,
  saveWeatherLocationStorage,
} from '../../services/weatherApi';
import { getStoredUser } from '../../utils/jwt';
import { registerUser, verifyOtp } from './authSlice';

const WEATHER_CACHE_TTL_MS = 5 * 60 * 1000;

export interface WeatherState {
  location: WeatherLocation;
  isLocationModalOpen: boolean;
  meta: WeatherMeta | null;
  current: CurrentWeatherData | null;
  forecast: DailyForecastItem[];
  hourly: HourlyForecastItem[];
  loading: boolean;
  error: string | null;
  lastFetchedKey: string | null;
  inFlightKey: string | null;
  lastFetchedAt: number;
  lastGeocodedAddressKey: string | null;
  pendingAddressQuery: string | null;
}

function normalizeOptionalUserId(userId?: string): string | undefined {
  const cleaned = (userId || '').replace(/^farmer-/, '').trim();
  return cleaned || undefined;
}

export function buildWeatherFetchKey(
  userId: string | undefined,
  latitude: number,
  longitude: number
): string {
  return `${normalizeOptionalUserId(userId) || 'guest'}|${latitude.toFixed(4)}|${longitude.toFixed(4)}`;
}

function getInitialLocation(): WeatherLocation {
  const storedLoc = getStoredWeatherLocation();
  if (storedLoc) return storedLoc;

  const storedUser = getStoredUser();
  if (storedUser) {
    const label = formatLocationLabel({
      village: storedUser.village,
      district: storedUser.district,
      state: storedUser.state,
      country: storedUser.country,
      latitude: storedUser.latitude,
      longitude: storedUser.longitude,
    });
    if (
      typeof storedUser.latitude === 'number' &&
      Number.isFinite(storedUser.latitude) &&
      typeof storedUser.longitude === 'number' &&
      Number.isFinite(storedUser.longitude)
    ) {
      return {
        latitude: storedUser.latitude,
        longitude: storedUser.longitude,
        label,
        state: storedUser.state,
        district: storedUser.district,
        village: storedUser.village,
        pincode: storedUser.pincode,
        source: 'profile',
      };
    }
    if (storedUser.village || storedUser.district || storedUser.state) {
      return {
        ...DEFAULT_WEATHER_LOCATION,
        label,
        state: storedUser.state,
        district: storedUser.district,
        village: storedUser.village,
        pincode: storedUser.pincode,
        source: 'profile',
      };
    }
  }

  return DEFAULT_WEATHER_LOCATION;
}

const initialState: WeatherState = {
  location: getInitialLocation(),
  isLocationModalOpen: false,
  meta: null,
  current: null,
  forecast: [],
  hourly: [],
  loading: false,
  error: null,
  lastFetchedKey: null,
  inFlightKey: null,
  lastFetchedAt: 0,
  lastGeocodedAddressKey: null,
  pendingAddressQuery: null,
};

interface FetchWeatherArgs {
  userId?: string;
  latitude: number;
  longitude: number;
  force?: boolean;
}

interface FetchWeatherResult {
  key: string;
  current: CurrentWeatherData;
  forecast: DailyForecastItem[];
  hourly: HourlyForecastItem[];
  meta: WeatherMeta;
}

/**
 * Fetches current weather, 7-day forecast, and 24-hour hourly forecast in parallel.
 * Built-in condition guard prevents duplicate network calls when views mount/switch.
 */
export const fetchWeatherBundle = createAsyncThunk<
  FetchWeatherResult,
  FetchWeatherArgs,
  { state: { weather: WeatherState }; rejectValue: string }
>(
  'weather/fetchBundle',
  async ({ userId, latitude, longitude }, { rejectWithValue, signal }) => {
    const effectiveUserId = normalizeOptionalUserId(userId);
    const key = buildWeatherFetchKey(effectiveUserId, latitude, longitude);

    try {
      const [currentRes, forecastRes, hourlyRes] = await Promise.all([
        fetchCurrentWeatherApi(effectiveUserId, latitude, longitude, signal),
        fetchForecastWeatherApi(effectiveUserId, latitude, longitude, 7, signal),
        fetchHourlyWeatherApi(effectiveUserId, latitude, longitude, signal),
      ]);

      return {
        key,
        current: currentRes.current,
        forecast: forecastRes.forecast,
        hourly: hourlyRes.hourly,
        meta: currentRes.meta || forecastRes.meta || hourlyRes.meta,
      };
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return rejectWithValue('Weather request cancelled.');
      }
      return rejectWithValue(
        err instanceof Error && err.message ? err.message : 'Unable to load weather telemetry.'
      );
    }
  },
  {
    condition: ({ userId, latitude, longitude, force }, { getState }) => {
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return false;
      const { weather } = getState();
      const effectiveUserId = normalizeOptionalUserId(userId);
      const key = buildWeatherFetchKey(effectiveUserId, latitude, longitude);

      // Avoid parallel duplicate calls (e.g. StrictMode double-invoke or rapid tab switch)
      if (weather.loading && weather.inFlightKey === key) return false;

      // Return cached weather cleanly within TTL unless forced or coords changed
      if (
        !force &&
        weather.lastFetchedKey === key &&
        weather.current &&
        weather.forecast.length > 0 &&
        weather.hourly.length > 0 &&
        Date.now() - weather.lastFetchedAt < WEATHER_CACHE_TTL_MS
      ) {
        return false;
      }

      return true;
    },
  }
);

/**
 * Forward-geocodes a manually typed registration address into latitude/longitude once.
 */
export const resolveManualAddressCoords = createAsyncThunk<
  WeatherLocation | null,
  {
    addressQuery: string;
    state?: string;
    district?: string;
    village?: string;
    pincode?: string;
    country?: string;
  },
  { state: { weather: WeatherState } }
>(
  'weather/resolveManualAddress',
  async ({ addressQuery, state, district, village, pincode, country }) => {
    const geocoded = await geocodeAddressText(addressQuery);
    if (!geocoded) return null;

    const merged: WeatherLocation = {
      latitude: geocoded.latitude,
      longitude: geocoded.longitude,
      state: state || geocoded.state,
      district: district || geocoded.district,
      village: village || geocoded.village,
      pincode: pincode || geocoded.pincode,
      label: formatLocationLabel({
        village: village || geocoded.village,
        district: district || geocoded.district,
        state: state || geocoded.state,
        country,
        latitude: geocoded.latitude,
        longitude: geocoded.longitude,
      }),
      source: 'profile',
    };
    saveWeatherLocationStorage(merged);
    return merged;
  },
  {
    condition: ({ addressQuery }, { getState }) => {
      const clean = addressQuery.trim().toLowerCase();
      if (!clean) return false;
      const { weather } = getState();
      return weather.lastGeocodedAddressKey !== clean;
    },
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeatherLocation(state, action: PayloadAction<WeatherLocation>) {
      const next = action.payload;
      const sameCoords =
        Math.abs(state.location.latitude - next.latitude) < 0.0001 &&
        Math.abs(state.location.longitude - next.longitude) < 0.0001;

      state.location = next;
      state.pendingAddressQuery = null;
      saveWeatherLocationStorage(next);

      if (!sameCoords) {
        state.error = null;
      }
    },
    openLocationModal(state) {
      state.isLocationModalOpen = true;
    },
    closeLocationModal(state) {
      state.isLocationModalOpen = false;
    },
    clearWeatherError(state) {
      if (state.error) state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherBundle.pending, (state, action) => {
        const { userId, latitude, longitude } = action.meta.arg;
        const effectiveUserId = normalizeOptionalUserId(userId);
        state.loading = true;
        state.error = null;
        state.inFlightKey = buildWeatherFetchKey(effectiveUserId, latitude, longitude);
      })
      .addCase(fetchWeatherBundle.fulfilled, (state, action) => {
        // Ignore stale response if user switched coordinates mid-flight
        const currentPrefix = `|${state.location.latitude.toFixed(4)}|${state.location.longitude.toFixed(4)}`;
        if (!action.payload.key.endsWith(currentPrefix)) {
          return;
        }
        state.loading = false;
        state.error = null;
        state.inFlightKey = null;
        state.lastFetchedKey = action.payload.key;
        state.lastFetchedAt = Date.now();
        state.current = action.payload.current;
        state.forecast = action.payload.forecast;
        state.hourly = action.payload.hourly;
        state.meta = action.payload.meta;
      })
      .addCase(fetchWeatherBundle.rejected, (state, action) => {
        const { userId, latitude, longitude } = action.meta.arg;
        const effectiveUserId = normalizeOptionalUserId(userId);
        const rejectedKey = buildWeatherFetchKey(effectiveUserId, latitude, longitude);
        if (state.inFlightKey && state.inFlightKey !== rejectedKey) {
          return;
        }
        state.loading = false;
        state.inFlightKey = null;
        if (!action.meta.condition) {
          state.error = action.payload || 'Unable to load weather telemetry.';
        }
      })
      .addCase(resolveManualAddressCoords.pending, (state, action) => {
        state.lastGeocodedAddressKey = action.meta.arg.addressQuery.trim().toLowerCase();
      })
      .addCase(resolveManualAddressCoords.fulfilled, (state, action) => {
        if (action.payload && state.location.source !== 'gps') {
          state.location = action.payload;
          state.pendingAddressQuery = null;
        }
      })
      // Sync weather location when a user completes registration with GPS coords or address
      .addCase(registerUser.fulfilled, (state, action) => {
        if (action.payload.outcome === 'otp_required') {
          const reg = action.payload.registerData;
          const label = formatLocationLabel({
            village: reg.village,
            district: reg.district,
            state: reg.state,
            country: reg.country,
            latitude: reg.latitude,
            longitude: reg.longitude,
          });
          if (
            typeof reg.latitude === 'number' &&
            Number.isFinite(reg.latitude) &&
            typeof reg.longitude === 'number' &&
            Number.isFinite(reg.longitude)
          ) {
            state.location = {
              latitude: reg.latitude,
              longitude: reg.longitude,
              label,
              state: reg.state,
              district: reg.district,
              village: reg.village,
              pincode: reg.pincode,
              source: 'gps',
            };
            state.pendingAddressQuery = null;
            saveWeatherLocationStorage(state.location);
          } else if (state.location.source !== 'gps' && (reg.village || reg.district || reg.state)) {
            state.location = {
              ...state.location,
              label,
              state: reg.state,
              district: reg.district,
              village: reg.village,
              pincode: reg.pincode,
              source: 'profile',
            };
            state.pendingAddressQuery = [reg.village, reg.district, reg.state, reg.country]
              .filter(Boolean)
              .join(', ');
            saveWeatherLocationStorage(state.location);
          }
        } else if (action.payload.outcome === 'authenticated') {
          const u = action.payload.user;
          const label = formatLocationLabel({
            village: u.village,
            district: u.district,
            state: u.state,
            country: u.country,
            latitude: u.latitude,
            longitude: u.longitude,
          });
          if (typeof u.latitude === 'number' && typeof u.longitude === 'number') {
            state.location = {
              latitude: u.latitude,
              longitude: u.longitude,
              label,
              state: u.state,
              district: u.district,
              village: u.village,
              pincode: u.pincode,
              source: 'gps',
            };
            saveWeatherLocationStorage(state.location);
          } else if (state.location.source === 'default' && (u.village || u.district || u.state)) {
            state.location = {
              ...state.location,
              label,
              state: u.state,
              district: u.district,
              village: u.village,
              pincode: u.pincode,
              source: 'profile',
            };
            state.pendingAddressQuery = [u.village, u.district, u.state, u.country]
              .filter(Boolean)
              .join(', ');
            saveWeatherLocationStorage(state.location);
          }
        }
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        const u = action.payload.user;
        if (typeof u.latitude === 'number' && typeof u.longitude === 'number') {
          const nextLoc: WeatherLocation = {
            latitude: u.latitude,
            longitude: u.longitude,
            label: formatLocationLabel({
              village: u.village,
              district: u.district,
              state: u.state,
              country: u.country,
              latitude: u.latitude,
              longitude: u.longitude,
            }),
            state: u.state,
            district: u.district,
            village: u.village,
            pincode: u.pincode,
            source: 'gps',
          };
          state.location = nextLoc;
          saveWeatherLocationStorage(nextLoc);
        } else if (state.location.source === 'default' && (u.village || u.district || u.state)) {
          const nextLabel = formatLocationLabel({
            village: u.village,
            district: u.district,
            state: u.state,
            country: u.country,
          });
          state.location = {
            ...state.location,
            label: nextLabel,
            state: u.state,
            district: u.district,
            village: u.village,
            pincode: u.pincode,
            source: 'profile',
          };
          state.pendingAddressQuery = [u.village, u.district, u.state, u.country]
            .filter(Boolean)
            .join(', ');
          saveWeatherLocationStorage(state.location);
        }
      });
  },
});

export const {
  setWeatherLocation,
  openLocationModal,
  closeLocationModal,
  clearWeatherError,
} = weatherSlice.actions;

// Primitive & memoized selectors prevent unnecessary re-renders
export const selectWeatherLocationLabel = (state: { weather: WeatherState }) =>
  state.weather.location.label;

export const selectWeatherLatitude = (state: { weather: WeatherState }) =>
  state.weather.location.latitude;

export const selectWeatherLongitude = (state: { weather: WeatherState }) =>
  state.weather.location.longitude;

export const selectWeatherLocationSource = (state: { weather: WeatherState }) =>
  state.weather.location.source;

export const selectIsLocationModalOpen = (state: { weather: WeatherState }) =>
  state.weather.isLocationModalOpen;

export const selectPendingAddressQuery = (state: { weather: WeatherState }) =>
  state.weather.pendingAddressQuery;

export const selectWeatherLocation = (state: { weather: WeatherState }) => state.weather.location;

export const selectWeatherUi = createSelector(
  [
    (state: { weather: WeatherState }) => state.weather.location,
    (state: { weather: WeatherState }) => state.weather.meta,
    (state: { weather: WeatherState }) => state.weather.current,
    (state: { weather: WeatherState }) => state.weather.forecast,
    (state: { weather: WeatherState }) => state.weather.hourly,
    (state: { weather: WeatherState }) => state.weather.loading,
    (state: { weather: WeatherState }) => state.weather.error,
    (state: { weather: WeatherState }) => state.weather.lastFetchedAt,
  ],
  (location, meta, current, forecast, hourly, loading, error, lastFetchedAt) => ({
    location,
    meta,
    current,
    forecast,
    hourly,
    loading,
    error,
    lastFetchedAt,
  })
);

export default weatherSlice.reducer;
