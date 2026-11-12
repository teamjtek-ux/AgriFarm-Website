/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAuthUser, selectIsAuthenticated } from '../store/slices/authSlice';
import {
  fetchWeatherBundle,
  resolveManualAddressCoords,
  selectPendingAddressQuery,
  selectWeatherLatitude,
  selectWeatherLocation,
  selectWeatherLongitude,
} from '../store/slices/weatherSlice';

/**
 * Isolated zero-DOM controller that keeps weather telemetry synchronized with
 * the active coordinates, manual registration address, and logged-in user ID.
 */
export const WeatherSyncController = memo(() => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const latitude = useAppSelector(selectWeatherLatitude);
  const longitude = useAppSelector(selectWeatherLongitude);
  const pendingAddressQuery = useAppSelector(selectPendingAddressQuery);
  const location = useAppSelector(selectWeatherLocation);

  const rawUserId =
    isAuthenticated && user
      ? (user.rawId || user.id.replace(/^farmer-/, '')).trim() || undefined
      : undefined;

  useEffect(() => {
    dispatch(
      fetchWeatherBundle({
        userId: rawUserId,
        latitude,
        longitude,
      })
    );
  }, [dispatch, rawUserId, latitude, longitude]);

  useEffect(() => {
    if (!pendingAddressQuery) return;
    dispatch(
      resolveManualAddressCoords({
        addressQuery: pendingAddressQuery,
        state: location.state,
        district: location.district,
        village: location.village,
        pincode: location.pincode,
        country: user?.country,
      })
    );
  }, [
    dispatch,
    pendingAddressQuery,
    location.state,
    location.district,
    location.village,
    location.pincode,
    user?.country,
  ]);

  return null;
});
