/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useCallback, useMemo, useState } from 'react';
import { ActiveTab } from '../../../shared/types';
import { useTranslation } from '../../../shared/i18n';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import {
  selectAuthUser,
  selectIsAuthenticated,
} from '../../auth/store/authSlice';
import {
  fetchWeatherBundle,
  openLocationModal,
  selectWeatherUi,
  setWeatherLocation,
} from '../store/weatherSlice';
import { detectCurrentAddress } from '../../../shared/services/geolocation';
import {
  degreesToCompass,
  describeWmoCode,
  formatCoords,
  formatForecastDate,
  formatIsoTimeShort,
} from '../services/weatherApi';

interface WeatherViewProps {
  onOpenDostAi: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

function classifyHourlySpray(wind: number, prob: number, precip: number): {
  status: string;
  badgeBg: string;
  note: string;
} {
  if (precip > 0.1 || prob >= 50 || wind > 22) {
    return {
      status: 'Do Not Spray',
      badgeBg: 'bg-red-100 text-red-800',
      note: precip > 0.1 || prob >= 50 ? 'Rain washout risk' : 'High wind drift',
    };
  }
  if (wind > 16) {
    return {
      status: 'Drift Risk',
      badgeBg: 'bg-amber-100 text-amber-900',
      note: 'Use drift nozzles',
    };
  }
  if (wind > 12 || prob >= 25) {
    return {
      status: 'Marginal',
      badgeBg: 'bg-amber-100 text-amber-900',
      note: 'Monitor gusts',
    };
  }
  return {
    status: 'Optimal',
    badgeBg: 'bg-emerald-100 text-[#113E2E]',
    note: 'Calm drift profile',
  };
}

function buildHourlySparklinePath(temps: number[]): string {
  if (temps.length === 0) return 'M0,16 L100,16';
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const span = max - min || 1;
  return temps
    .map((val, idx) => {
      const x = temps.length === 1 ? 50 : (idx / (temps.length - 1)) * 100;
      const y = 20 - ((val - min) / span) * 16;
      return `${idx === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export const WeatherView: React.FC<WeatherViewProps> = memo(({
  onOpenDostAi,
  onNavigateTab,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const { location, meta, current, forecast, hourly, loading, error, lastFetchedAt } =
    useAppSelector(selectWeatherUi);

  const [locatingGps, setLocatingGps] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const rawUserId =
    isAuthenticated && user
      ? (user.rawId || user.id.replace(/^farmer-/, '')).trim() || undefined
      : undefined;

  const handleRefreshSensors = useCallback(() => {
    setGpsError(null);
    dispatch(
      fetchWeatherBundle({
        userId: rawUserId,
        latitude: location.latitude,
        longitude: location.longitude,
        force: true,
      })
    );
  }, [dispatch, rawUserId, location.latitude, location.longitude]);

  const handleUseCurrentLocation = useCallback(async () => {
    if (locatingGps) return;
    setGpsError(null);
    setActionNotice(null);
    setLocatingGps(true);
    try {
      const detected = await detectCurrentAddress();
      const nextLabel =
        detected.label || `${detected.latitude.toFixed(4)}, ${detected.longitude.toFixed(4)}`;
      dispatch(
        setWeatherLocation({
          latitude: detected.latitude,
          longitude: detected.longitude,
          label: nextLabel,
          state: detected.state || undefined,
          district: detected.district || undefined,
          village: detected.village || undefined,
          pincode: detected.pincode || undefined,
          source: 'gps',
        })
      );
      setActionNotice(
        `Weather location updated to ${nextLabel} (${formatCoords(
          detected.latitude,
          detected.longitude
        )}).`
      );
    } catch (err) {
      setGpsError(
        err instanceof Error && err.message
          ? err.message
          : 'Unable to detect your current GPS location.'
      );
    } finally {
      setLocatingGps(false);
    }
  }, [dispatch, locatingGps]);

  const todayForecast = forecast[0] || null;
  const currentWmo = useMemo(
    () => (current ? describeWmoCode(current.weather_code, current.is_day) : describeWmoCode(0, 1)),
    [current]
  );

  // Derived operational insights & chart geometry from live API telemetry
  const telemetry = useMemo(() => {
    const temps = hourly.map((h) => h.temperature_2m);
    const minHourlyTemp = temps.length > 0 ? Math.min(...temps) : null;
    const maxHourlyTemp = temps.length > 0 ? Math.max(...temps) : null;
    const avgWind =
      hourly.length > 0
        ? Math.round((hourly.reduce((s, h) => s + h.wind_speed_10m, 0) / hourly.length) * 10) / 10
        : current?.wind_speed_10m ?? 0;

    const sparkPath = buildHourlySparklinePath(temps);
    const lastTempPointY =
      temps.length > 0 && maxHourlyTemp !== null && minHourlyTemp !== null
        ? 20 - ((temps[temps.length - 1] - minHourlyTemp) / (maxHourlyTemp - minHourlyTemp || 1)) * 16
        : 16;

    const daylightSlots = hourly.filter((h) => {
      const hr = Number(h.time.split('T')[1]?.slice(0, 2) ?? -1);
      return hr >= 5 && hr <= 18;
    });
    const optimalSprayHours = daylightSlots.filter(
      (s) => s.wind_speed_10m <= 14 && s.precipitation_probability <= 25 && s.precipitation <= 0.1
    );

    const sprayRatio =
      daylightSlots.length > 0
        ? Math.round((optimalSprayHours.length / daylightSlots.length) * 100)
        : 50;

    let sprayTitle = 'Restricted';
    let sprayBadge = 'High Risk';
    let sprayBadgeCls = 'bg-red-100 text-red-900';
    let sprayDesc = 'Excessive wind or precipitation risk during daylight hours.';

    if (optimalSprayHours.length >= 4) {
      sprayTitle = `Open ${formatIsoTimeShort(optimalSprayHours[0].time)} – ${formatIsoTimeShort(
        optimalSprayHours[optimalSprayHours.length - 1].time
      )}`;
      sprayBadge = 'Optimal';
      sprayBadgeCls = 'bg-emerald-100 text-emerald-900';
      sprayDesc = `${optimalSprayHours.length} calm daylight hours (avg wind ${avgWind} km/h). Minimal foliar drift hazard.`;
    } else if (optimalSprayHours.length >= 1) {
      sprayTitle = `${formatIsoTimeShort(optimalSprayHours[0].time)} – ${formatIsoTimeShort(
        optimalSprayHours[optimalSprayHours.length - 1].time
      )}`;
      sprayBadge = 'Caution • Narrow';
      sprayBadgeCls = 'bg-amber-100 text-amber-900';
      sprayDesc = `Limited ${optimalSprayHours.length}h spray window; monitor afternoon gust velocity.`;
    }

    const threeDayRainMm = forecast
      .slice(0, 3)
      .reduce((acc, d) => acc + (Number.isFinite(d.precipitation_sum) ? d.precipitation_sum : 0), 0);
    const twoDayProb = forecast
      .slice(0, 2)
      .reduce((max, d) => Math.max(max, d.precipitation_probability_max), 0);

    const irrigationHighRain = threeDayRainMm >= 10 || twoDayProb >= 60;
    const irrigationBadge = irrigationHighRain ? 'Halt 48–72 Hours' : 'Schedule Normally';
    const irrigationBadgeCls = irrigationHighRain
      ? 'bg-sky-100 text-sky-900'
      : 'bg-emerald-100 text-emerald-900';
    const irrigationHeadline = irrigationHighRain
      ? 'Zero Deficit (Rain Expected)'
      : current && current.relative_humidity_2m < 40
        ? 'Light Surface Demand'
        : 'Balanced Soil Plan';
    const irrigationDesc = irrigationHighRain
      ? `${threeDayRainMm.toFixed(1)} mm rainfall expected in next 72h (${twoDayProb}% max prob). Conserve pump energy.`
      : `Dry outlook (${threeDayRainMm.toFixed(1)} mm over 72h, RH ${current?.relative_humidity_2m ?? '--'}%). Irrigate at critical root stages.`;

    const fertHighRisk = threeDayRainMm >= 8 || twoDayProb >= 55;
    const fertBadge = fertHighRisk ? 'Leaching Risk' : 'Low Washout Risk';
    const fertBadgeCls = fertHighRisk
      ? 'bg-red-100 text-red-900'
      : 'bg-emerald-100 text-emerald-900';
    const fertHeadline = fertHighRisk ? 'Postpone Top Dressing' : 'Safe to Apply Basal/Urea';
    const fertDesc = fertHighRisk
      ? 'Forecast rainfall may trigger nitrogen runoff. Hold granular broadcast.'
      : 'Low 48h precipitation probability supports efficient nutrient uptake.';

    const severeWeather =
      (current && (current.weather_code >= 95 || current.wind_gusts_10m >= 45 || current.rain >= 15)) ||
      forecast.some((d) => d.precipitation_sum >= 35 || d.wind_speed_10m_max >= 42);

    const peakRainDay = forecast.reduce(
      (best, item) => (item.precipitation_sum > best.precipitation_sum ? item : best),
      forecast[0] || {
        date: '',
        precipitation_sum: 0,
        wind_speed_10m_max: 0,
      }
    );

    const harvestUnsafe = Boolean(severeWeather || (current && current.precipitation > 0.5));
    const harvestBadge = harvestUnsafe ? 'Delay Cutting' : 'Active Harvest';
    const harvestBadgeCls = harvestUnsafe
      ? 'bg-amber-100 text-amber-900'
      : 'bg-emerald-100 text-emerald-900';
    const harvestHeadline = harvestUnsafe
      ? 'Protect Cut Produce'
      : todayForecast?.sunset
        ? `Clear Till ${formatIsoTimeShort(todayForecast.sunset)}`
        : 'Dry Field Access';
    const harvestDesc = harvestUnsafe
      ? 'Moisture/squall activity detected. Cover threshed grain and open field drainage.'
      : `Dry surface conditions (${current?.temperature_2m ?? '--'}°C, cloud ${
          current?.cloud_cover ?? '--'
        }%). Suitable for combine harvesting & sun drying.`;

    return {
      minHourlyTemp,
      maxHourlyTemp,
      avgWind,
      sparkPath,
      lastTempPointY,
      sprayRatio,
      sprayTitle,
      sprayBadge,
      sprayBadgeCls,
      sprayDesc,
      irrigationBadge,
      irrigationBadgeCls,
      irrigationHeadline,
      irrigationDesc,
      irrigationBarPct: irrigationHighRain ? 88 : 48,
      fertBadge,
      fertBadgeCls,
      fertHeadline,
      fertDesc,
      fertBarPct: fertHighRisk ? 18 : 82,
      severeWeather,
      peakRainDay,
      harvestBadge,
      harvestBadgeCls,
      harvestHeadline,
      harvestDesc,
      harvestBarPct: harvestUnsafe ? 25 : 85,
    };
  }, [current, forecast, hourly, todayForecast]);

  const hourlyCards = useMemo(
    () =>
      hourly.map((slot) => {
        const desc = describeWmoCode(slot.weather_code, 1);
        const spray = classifyHourlySpray(
          slot.wind_speed_10m,
          slot.precipitation_probability,
          slot.precipitation
        );
        return {
          ...slot,
          timeLabel: formatIsoTimeShort(slot.time),
          icon: desc.icon,
          spray,
        };
      }),
    [hourly]
  );

  const dailyRows = useMemo(
    () =>
      forecast.map((item, idx) => {
        const { day, date } = formatForecastDate(item.date, idx);
        const desc = describeWmoCode(item.weather_code, 1);
        let advice = 'Normal field operations & irrigation';
        let adviceStyle = 'bg-emerald-50 text-[#113E2E] border-emerald-200/60';

        if (item.precipitation_sum >= 15 || item.precipitation_probability_max >= 70) {
          advice = 'Halt spraying & keep drainage channels open';
          adviceStyle = 'bg-red-50 text-red-800 border-red-200/60';
        } else if (item.precipitation_sum >= 2 || item.precipitation_probability_max >= 40) {
          advice = 'Avoid foliar spray; postpone fertilizer top-dress';
          adviceStyle = 'bg-amber-50 text-amber-900 border-amber-200/60';
        } else if (item.wind_speed_10m_max >= 20) {
          advice = 'Use low-drift nozzles during calm morning hours';
          adviceStyle = 'bg-amber-50 text-amber-900 border-amber-200/60';
        } else if (item.wind_speed_10m_max <= 12 && item.precipitation_probability_max <= 15) {
          advice = 'Optimal calm sky for spraying, harvest & drying';
        }

        return {
          dateKey: item.date,
          day,
          date,
          icon: desc.icon,
          condition: desc.label,
          tempHi: Math.round(item.temperature_2m_max),
          tempLo: Math.round(item.temperature_2m_min),
          rainProb: item.precipitation_probability_max,
          rainMm: item.precipitation_sum,
          windMax: item.wind_speed_10m_max,
          advice,
          adviceStyle,
        };
      }),
    [forecast]
  );

  const syncedTimeLabel = useMemo(() => {
    if (current?.time) return formatIsoTimeShort(current.time);
    if (lastFetchedAt) {
      return new Date(lastFetchedAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return 'Syncing';
  }, [current?.time, lastFetchedAt]);

  return (
    <div className="flex-1 flex flex-col gap-6">
      {(actionNotice || gpsError) && (
        <div
          key={gpsError || actionNotice || 'notice'}
          role={gpsError ? 'alert' : 'status'}
          className={`px-4 py-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
            gpsError
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-[#edf6ef] border-[#bcd8c4] text-[#113e2e]'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            <span
              className={`material-symbols-outlined notranslate text-base ${
                gpsError ? 'text-red-700' : 'text-emerald-700'
              }`}
              translate="no"
            >
              {gpsError ? 'error' : 'check_circle'}
            </span>
            <span key={gpsError || actionNotice || ''}>{gpsError || actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setActionNotice(null);
              setGpsError(null);
            }}
            className="text-slate-500 hover:text-slate-800 px-1.5 py-0.5 rounded-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div
          key="weather-api-error"
          role="alert"
          className="px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined notranslate text-base text-red-700" translate="no">
              cloud_off
            </span>
            <span key={error}>{error}</span>
          </div>
          <button
            type="button"
            onClick={handleRefreshSensors}
            className="px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-800 font-bold hover:bg-red-100 transition cursor-pointer"
          >
            Retry Weather Sync
          </button>
        </div>
      )}

      {/* Top Bar with Active Weather Location & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pb-1">
            <span>{t('nav.workspace')}</span>
            <span>/</span>
            <span>{t('nav.weather')}</span>
            <span>/</span>
            <span className="text-[#113E2E] font-bold">
              <span key={location.label}>{location.label}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#113E2E]">{t('weather.title')}</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {t('weather.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap max-w-full">
          <div className="flex items-center gap-2 flex-wrap max-w-full px-3.5 py-2 rounded-2xl sm:rounded-full bg-white border border-[#DFEBDE] text-slate-700 text-xs shadow-xs tabular-nums">
            <span className="material-symbols-outlined notranslate text-sm text-[#175638]" translate="no">
              location_on
            </span>
            <span className="text-slate-500">{t('weather.showingWeatherFor')}:</span>
            <span className="font-bold text-slate-900">
              <span key={location.label}>{location.label}</span>
            </span>
            <span className="text-slate-500 font-mono text-[11px] notranslate" translate="no">
              ({formatCoords(location.latitude, location.longitude)})
            </span>
            <span className="text-slate-400 notranslate" translate="no">
              · {syncedTimeLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={handleRefreshSensors}
            disabled={loading}
            className="p-2 rounded-full bg-white border border-[#DFEBDE] text-slate-600 hover:text-emerald-900 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
            title="Refresh Live Weather"
            aria-label="Refresh live weather"
          >
            <span
              className={`material-symbols-outlined notranslate text-lg ${loading ? 'animate-spin' : ''}`}
              translate="no"
            >
              sync
            </span>
          </button>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locatingGps}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#cbe1d2] text-[#113E2E] text-xs font-semibold shadow-xs hover:bg-[#F0F7F2] whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
          >
            <span
              className={`material-symbols-outlined notranslate text-sm ${
                locatingGps ? 'animate-spin' : ''
              }`}
              translate="no"
            >
              {locatingGps ? 'progress_activity' : 'my_location'}
            </span>
            <span>{locatingGps ? 'Detecting GPS...' : t('weather.useCurrentLocation')}</span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(openLocationModal())}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#113E2E] text-white text-xs font-semibold shadow-xs hover:bg-[#0a291f] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined notranslate text-sm text-[#E5B54F]" translate="no">
              edit_location_alt
            </span>
            <span>{t('weather.changeLocation')}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Weather Advisory Banner */}
      {telemetry.severeWeather ? (
        <div
          key="weather-severe-banner"
          className="p-4 rounded-2xl bg-amber-500/15 border-2 border-[#E5B54F] text-amber-950 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#DF9B12] text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined notranslate text-2xl animate-pulse" translate="no">
                warning
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-md">
                  Severe Weather Watch • {location.label}
                </span>
                <span className="text-xs text-amber-800 font-bold tabular-nums notranslate" translate="no">
                  Peak Wind: {telemetry.peakRainDay?.wind_speed_10m_max ?? '--'} km/h · Precip:{' '}
                  {telemetry.peakRainDay?.precipitation_sum ?? 0} mm
                </span>
              </div>
              <p className="text-sm font-bold text-amber-950 mt-1">
                High rainfall or gust velocity detected in forecast for {location.label}.
              </p>
              <p className="text-xs text-amber-900/90 mt-0.5">
                Clear field drainage furrows, suspend foliar spraying, and anchor shade nets before peak squalls.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('my-crops')}
            className="px-4 py-2 rounded-xl bg-[#113E2E] hover:bg-[#0a291f] text-white text-xs font-bold whitespace-nowrap self-end md:self-auto shadow-sm cursor-pointer"
          >
            Open Crop Defense Checklist
          </button>
        </div>
      ) : (
        <div
          key="weather-calm-banner"
          className="p-4 rounded-2xl bg-[#F0F7F2] border border-[#cbe1d2] text-[#113E2E] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#113E2E] text-[#E5B54F] flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined notranslate text-2xl" translate="no">
                {currentWmo.icon}
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#175638]">
                <span>Live Ag-Weather Briefing</span>
                <span aria-hidden="true">·</span>
                <span key={location.label}>{location.label}</span>
                {meta && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono notranslate" translate="no">
                      {meta.timezone} ({meta.timezone_abbreviation})
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm font-bold text-[#113E2E] mt-1">
                <span>{currentWmo.label}</span>
                <span className="notranslate" translate="no">
                  {' '}
                  · {current ? `${current.temperature_2m}°C` : '--°C'}
                </span>
                <span> · Spraying: {telemetry.sprayTitle}</span>
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                <span>{telemetry.irrigationDesc}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('crop-calendar')}
            className="px-4 py-2 rounded-xl bg-[#113E2E] hover:bg-[#0a291f] text-white text-xs font-bold whitespace-nowrap self-end md:self-auto shadow-xs cursor-pointer"
          >
            Sync Crop Calendar Tasks
          </button>
        </div>
      )}

      {/* Top Agronomic Decision Matrix (4 Cards Driven by Live APIs) */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <span className="material-symbols-outlined notranslate text-xl" translate="no">pest_control</span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${telemetry.sprayBadgeCls}`}>
              <span key={telemetry.sprayBadge}>{telemetry.sprayBadge}</span>
            </span>
          </div>
          <div className="my-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Spraying Window</span>
            <span className="text-base font-bold text-slate-900 block mt-1 tabular-nums notranslate" translate="no">
              {telemetry.sprayTitle}
            </span>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              <span>{telemetry.sprayDesc}</span>
            </p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${telemetry.sprayRatio}%` }}></div>
          </div>
        </div>

        <div className="bg-white border border-sky-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200">
              <span className="material-symbols-outlined notranslate text-xl" translate="no">water_drop</span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${telemetry.irrigationBadgeCls}`}>
              <span key={telemetry.irrigationBadge}>{telemetry.irrigationBadge}</span>
            </span>
          </div>
          <div className="my-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Irrigation Needs</span>
            <span className="text-base font-bold text-slate-900 block mt-1">
              <span key={telemetry.irrigationHeadline}>{telemetry.irrigationHeadline}</span>
            </span>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              <span>{telemetry.irrigationDesc}</span>
            </p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-sky-600 h-full rounded-full transition-all" style={{ width: `${telemetry.irrigationBarPct}%` }}></div>
          </div>
        </div>

        <div className="bg-white border border-emerald-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <span className="material-symbols-outlined notranslate text-xl" translate="no">science</span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${telemetry.fertBadgeCls}`}>
              <span key={telemetry.fertBadge}>{telemetry.fertBadge}</span>
            </span>
          </div>
          <div className="my-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Fertilizer Application</span>
            <span className="text-base font-bold text-slate-900 block mt-1">
              <span key={telemetry.fertHeadline}>{telemetry.fertHeadline}</span>
            </span>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              <span>{telemetry.fertDesc}</span>
            </p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${telemetry.fertBarPct}%` }}></div>
          </div>
        </div>

        <div className="bg-white border border-emerald-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <span className="material-symbols-outlined notranslate text-xl" translate="no">agriculture</span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${telemetry.harvestBadgeCls}`}>
              <span key={telemetry.harvestBadge}>{telemetry.harvestBadge}</span>
            </span>
          </div>
          <div className="my-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Harvest Operations</span>
            <span className="text-base font-bold text-slate-900 block mt-1">
              <span key={telemetry.harvestHeadline}>{telemetry.harvestHeadline}</span>
            </span>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              <span>{telemetry.harvestDesc}</span>
            </p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${telemetry.harvestBarPct}%` }}></div>
          </div>
        </div>
      </div> */}

      {/* Bento Grid: Live Telemetry & Microclimate Radar */}
      <div className="gap-6">
        {/* Left Column: 6 Live Weather Telemetry Cards */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE]">
            <div className="flex items-center justify-between mb-6 gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  <span>Live Weather Telemetry — </span>
                  <span key={location.label}>{location.label}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="font-mono notranslate" translate="no">
                    {formatCoords(location.latitude, location.longitude)}
                  </span>
                  {meta && (
                    <>
                      <span>·</span>
                      <span className="notranslate" translate="no">
                        Elev {meta.elevation}m ({meta.timezone_abbreviation})
                      </span>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => dispatch(openLocationModal())}
                    className="text-[#175638] font-bold hover:underline ml-1 cursor-pointer"
                  >
                    {t('weather.changeLocation')}
                  </button>
                </p>
              </div>
              <span className="material-symbols-outlined notranslate text-emerald-700 text-2xl shrink-0" translate="no">
                sensors
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {/* 1. Air Temp */}
              <div className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-sm" translate="no">thermostat</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {t('weather.airTemp')}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums notranslate" translate="no">
                  {current ? `${current.temperature_2m}°C` : '--°C'}
                </div>
                <div className="text-xs text-slate-500 mt-1 tabular-nums notranslate" translate="no">
                  {current
                    ? `Feels ${current.apparent_temperature}°C${
                        todayForecast
                          ? ` • ${Math.round(todayForecast.temperature_2m_max)}°/${Math.round(
                              todayForecast.temperature_2m_min
                            )}°`
                          : ''
                      }`
                    : 'Syncing current temp...'}
                </div>
              </div>

              {/* 2. Relative Humidity */}
              <div className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-sm" translate="no">humidity_percentage</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {t('weather.relHumidity')}
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#1B6F49] tabular-nums notranslate" translate="no">
                  {current ? `${current.relative_humidity_2m}%` : '--%'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {current
                    ? current.relative_humidity_2m < 35
                      ? 'Dry canopy air profile'
                      : current.relative_humidity_2m > 75
                        ? 'High fungal moisture watch'
                        : 'Balanced vapor pressure'
                    : 'Loading humidity...'}
                </div>
              </div>

              {/* 3. Wind Speed & Gusts */}
              <div className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-sm" translate="no">air</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {t('weather.windSpeed')}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums notranslate" translate="no">
                  {current ? `${current.wind_speed_10m} ` : '-- '}
                  <span className="text-xs text-slate-500 font-normal">
                    {current
                      ? `km/h ${degreesToCompass(current.wind_direction_10m)}`
                      : 'km/h'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 tabular-nums notranslate" translate="no">
                  {current
                    ? `Gusts ${current.wind_gusts_10m} km/h (${current.wind_direction_10m}°)`
                    : 'Syncing wind vector...'}
                </div>
              </div>

              {/* 4. Cloud Cover & Sky */}
              <div className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-sm" translate="no">{currentWmo.icon}</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {t('weather.cloudCover')}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums notranslate" translate="no">
                  {current ? `${current.cloud_cover}%` : '--%'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  <span>{currentWmo.label}</span>
                  <span> · {current?.is_day === 0 ? 'Night' : 'Daylight'}</span>
                </div>
              </div>

              {/* 5. Precipitation */}
              <div className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-sm" translate="no">rainy</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {t('weather.precipitation')}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums notranslate" translate="no">
                  {current ? `${current.precipitation} mm` : '-- mm'}
                </div>
                <div className="text-xs text-slate-500 mt-1 tabular-nums notranslate" translate="no">
                  {todayForecast
                    ? `Rain prob: ${todayForecast.precipitation_probability_max}% · 24h: ${todayForecast.precipitation_sum} mm`
                    : `Rain: ${current?.rain ?? 0} mm`}
                </div>
              </div>

              {/* 6. Sunrise / Sunset */}
              <div className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-sm" translate="no">wb_twilight</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {t('weather.sunCycle')}
                  </span>
                </div>
                <div className="text-base font-bold text-slate-900 tabular-nums notranslate mt-1" translate="no">
                  {todayForecast
                    ? `${formatIsoTimeShort(todayForecast.sunrise)} / ${formatIsoTimeShort(
                        todayForecast.sunset
                      )}`
                    : '-- / --'}
                </div>
                <div className="text-xs text-slate-500 mt-1 tabular-nums notranslate" translate="no">
                  {todayForecast
                    ? `Max wind today ${todayForecast.wind_speed_10m_max} km/h`
                    : 'Solar window'}
                </div>
              </div>
            </div>

            {/* Live 24h Temperature Stability Profile Sparkline */}
            <div className="mt-6 pt-5 border-t border-slate-100 bg-[#F8FAF7] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#113E2E]">
                  <span className="material-symbols-outlined notranslate text-lg" translate="no">ssid_chart</span>
                </div>
                <div>
                  <span className="text-xs text-slate-900 font-bold block">24h Air Temperature Curve</span>
                  <span className="text-[11px] text-slate-500 tabular-nums notranslate" translate="no">
                    {telemetry.minHourlyTemp !== null && telemetry.maxHourlyTemp !== null
                      ? `Min ${telemetry.minHourlyTemp}°C · Max ${telemetry.maxHourlyTemp}°C · Avg Wind ${telemetry.avgWind} km/h`
                      : 'Syncing 24-hour curve...'}
                  </span>
                </div>
              </div>
              <div className="w-48 h-8 text-[#1B6F49]">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 24">
                  <path
                    d={telemetry.sparkPath}
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />
                  <circle cx="100" cy={telemetry.lastTempPointY} fill="currentColor" r="3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Root Zone Moisture Estimate */}
          {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('weather.rootZoneTitle')}</h3>
                <p className="text-xs text-slate-500">
                  Estimated root moisture balance adjusted for {location.label}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                {isAuthenticated ? 'Active Farm Profile' : 'Regional Profile'}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">0–10 cm (Topsoil Layer)</span>
                  <span className="font-bold text-[#113E2E] tabular-nums notranslate" translate="no">
                    {current && current.precipitation > 0 ? '72% VWC · Moist' : '58% VWC · Draining'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#113E2E] h-2 rounded-full"
                    style={{ width: current && current.precipitation > 0 ? '72%' : '58%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">15–30 cm (Active Root Zone)</span>
                  <span className="font-bold text-emerald-700 tabular-nums notranslate" translate="no">
                    64% VWC · Optimal
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#1B6F49] h-2 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">45–60 cm (Subsoil Reserve)</span>
                  <span className="font-bold text-slate-800 tabular-nums notranslate" translate="no">
                    51% VWC · Adequate
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-teal-600 h-2 rounded-full" style={{ width: '51%' }}></div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* 24-Hour Spray Drift & Wind Matrix (/api/weather/hourly) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t('weather.sprayIndexTitle')} · <span key={location.label}>{location.label}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Live 24-hour drift hazard assessment from hourly wind speed, precipitation probability, and humidity
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-slate-700">Optimal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-700">Marginal / Drift Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span className="text-slate-700">Do Not Spray</span>
            </div>
          </div>
        </div>

        {/* Scrollable 24-hour strip */}
        <div className="overflow-x-auto pb-2 custom-scroll">
          {hourlyCards.length > 0 ? (
            <div className="flex gap-3 min-w-max">
              {hourlyCards.map((slot) => (
                <div
                  key={slot.time}
                  className="w-32 shrink-0 bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-3.5 flex flex-col justify-between items-center text-center"
                >
                  <span className="text-xs font-semibold text-slate-600 tabular-nums notranslate" translate="no">
                    {slot.timeLabel}
                  </span>
                  <span className="material-symbols-outlined notranslate text-emerald-800 text-2xl my-2" translate="no">
                    {slot.icon}
                  </span>
                  <span className="text-base font-bold text-slate-900 tabular-nums notranslate" translate="no">
                    {slot.temperature_2m}°C
                  </span>
                  <span className="text-xs text-slate-600 mt-1 tabular-nums notranslate" translate="no">
                    {slot.wind_speed_10m} km/h
                  </span>
                  <span className={`mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${slot.spray.badgeBg}`}>
                    {slot.spray.status}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 tabular-nums notranslate" translate="no">
                    RH {slot.relative_humidity_2m}% · {slot.precipitation_probability}%
                  </span>
                </div>
              ))}
            </div>
          ) : loading ? (
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-32 h-40 shrink-0 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 bg-[#F8FAF7] rounded-xl border border-[#DFEBDE]">
              <span>Hourly forecast unavailable right now.</span>
            </div>
          )}
        </div>
      </div>

      {/* 7-Day Agronomic Forecast Table (/api/weather/forecast) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE]">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t('weather.tenDayTitle')} · <span key={location.label}>{location.label}</span>
            </h2>
            <p className="text-xs text-slate-500">
              7-day daily surface outlook synchronized with location coordinates
            </p>
          </div>
          <button
            onClick={onOpenDostAi}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-[#113E2E] text-xs font-bold border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined notranslate text-sm" translate="no">psychology</span>
            <span>Ask Dost AI Weather Advisory</span>
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Day &amp; Date</th>
                <th className="pb-3">Sky Condition</th>
                <th className="pb-3">Temp (Hi / Lo)</th>
                <th className="pb-3">Precip Prob &amp; Vol</th>
                <th className="pb-3">Max Wind</th>
                <th className="pb-3 pr-2">Actionable Field Advisory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dailyRows.length > 0 ? (
                dailyRows.map((item) => (
                  <tr key={item.dateKey} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pl-2 font-bold text-slate-900">
                      <div>{item.day}</div>
                      <div className="text-[10px] font-normal text-slate-500 notranslate" translate="no">
                        {item.date}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined notranslate text-slate-700 text-lg" translate="no">
                          {item.icon}
                        </span>
                        <span className="text-slate-700 font-medium">{item.condition}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-bold text-slate-800 tabular-nums notranslate" translate="no">
                      {item.tempHi}° / {item.tempLo}°
                    </td>
                    <td className="py-3.5 tabular-nums notranslate" translate="no">
                      <span className={`font-bold ${item.rainProb > 50 ? 'text-blue-600' : 'text-slate-700'}`}>
                        {item.rainProb}%
                      </span>
                      <span className="text-slate-400 pl-1.5">({item.rainMm} mm)</span>
                    </td>
                    <td className="py-3.5 font-medium text-slate-700 tabular-nums notranslate" translate="no">
                      {item.windMax} km/h
                    </td>
                    <td className="py-3.5 pr-2">
                      <span className={`px-2.5 py-1 rounded-lg font-medium border block w-fit ${item.adviceStyle}`}>
                        {item.advice}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                    {loading ? 'Loading 7-day forecast...' : 'Forecast unavailable. Tap Refresh above to retry.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});
