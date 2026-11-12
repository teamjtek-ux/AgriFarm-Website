/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CurrentWeatherData,
  DailyForecastItem,
  HourlyForecastItem,
  WeatherLocation,
  WeatherMeta,
} from '../types';
import { AUTH_API_BASE_URL } from './authApi';

export const WEATHER_ENDPOINTS = {
  CURRENT: '/api/weather/current',
  FORECAST: '/api/weather/forecast',
  HOURLY: '/api/weather/hourly',
} as const;

export const WEATHER_LOCATION_STORAGE_KEY = 'kd_weather_location';

export const DEFAULT_WEATHER_LOCATION: WeatherLocation = {
  latitude: 17.385,
  longitude: 78.4867,
  label: 'Hyderabad, Telangana',
  state: 'Telangana',
  district: 'Hyderabad',
  village: 'Hyderabad',
  pincode: '500001',
  source: 'default',
};

export const QUICK_AG_HUBS: WeatherLocation[] = [
  {
    latitude: 17.385,
    longitude: 78.4867,
    label: 'Hyderabad, Telangana',
    state: 'Telangana',
    district: 'Hyderabad',
    village: 'Hyderabad',
    pincode: '500001',
    source: 'manual',
  },
  {
    latitude: 16.3067,
    longitude: 80.4365,
    label: 'Guntur, Andhra Pradesh',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    village: 'Guntur',
    pincode: '522001',
    source: 'manual',
  },
  {
    latitude: 16.5062,
    longitude: 80.648,
    label: 'Vijayawada, Andhra Pradesh',
    state: 'Andhra Pradesh',
    district: 'NTR',
    village: 'Vijayawada',
    pincode: '520001',
    source: 'manual',
  },
  {
    latitude: 17.9689,
    longitude: 79.5941,
    label: 'Warangal, Telangana',
    state: 'Telangana',
    district: 'Warangal',
    village: 'Warangal',
    pincode: '506002',
    source: 'manual',
  },
  {
    latitude: 18.4386,
    longitude: 79.1288,
    label: 'Karimnagar, Telangana',
    state: 'Telangana',
    district: 'Karimnagar',
    village: 'Karimnagar',
    pincode: '505001',
    source: 'manual',
  },
  {
    latitude: 17.6868,
    longitude: 83.2185,
    label: 'Visakhapatnam, Andhra Pradesh',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    village: 'Visakhapatnam',
    pincode: '530001',
    source: 'manual',
  },
];

export function formatLocationLabel(parts: {
  village?: string;
  district?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}): string {
  const unique: string[] = [];
  for (const raw of [parts.village, parts.district, parts.state]) {
    const val = (raw || '').trim();
    if (val && !unique.some((u) => u.toLowerCase() === val.toLowerCase())) {
      unique.push(val);
    }
    if (unique.length >= 2) break;
  }
  if (unique.length > 0) return unique.join(', ');
  if (parts.country && parts.country.trim()) return parts.country.trim();
  if (typeof parts.latitude === 'number' && typeof parts.longitude === 'number') {
    return `${parts.latitude.toFixed(4)}, ${parts.longitude.toFixed(4)}`;
  }
  return DEFAULT_WEATHER_LOCATION.label;
}

export function formatCoords(lat: number, lng: number): string {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
}

export function getStoredWeatherLocation(): WeatherLocation | null {
  try {
    const raw = localStorage.getItem(WEATHER_LOCATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.latitude === 'number' &&
      Number.isFinite(parsed.latitude) &&
      typeof parsed.longitude === 'number' &&
      Number.isFinite(parsed.longitude) &&
      typeof parsed.label === 'string' &&
      parsed.label.trim().length > 0
    ) {
      return parsed as WeatherLocation;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveWeatherLocationStorage(location: WeatherLocation): void {
  try {
    localStorage.setItem(WEATHER_LOCATION_STORAGE_KEY, JSON.stringify(location));
  } catch {
    // Ignore storage quota or sandbox restrictions
  }
}

export function degreesToCompass(deg?: number): string {
  if (typeof deg !== 'number' || !Number.isFinite(deg)) return '';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return dirs[idx];
}

export interface WmoDescriptor {
  label: string;
  icon: string;
  tone: 'emerald' | 'amber' | 'blue' | 'slate';
}

export function describeWmoCode(code: number, isDay = 1): WmoDescriptor {
  if (code === 0) {
    return {
      label: 'Clear Sky',
      icon: isDay ? 'wb_sunny' : 'nights_stay',
      tone: 'emerald',
    };
  }
  if (code === 1) {
    return {
      label: 'Mainly Clear',
      icon: isDay ? 'wb_sunny' : 'nights_stay',
      tone: 'emerald',
    };
  }
  if (code === 2) {
    return {
      label: 'Partly Cloudy',
      icon: 'partly_cloudy_day',
      tone: 'slate',
    };
  }
  if (code === 3) {
    return {
      label: 'Overcast',
      icon: 'cloud',
      tone: 'slate',
    };
  }
  if (code === 45 || code === 48) {
    return {
      label: 'Foggy / Mist',
      icon: 'foggy',
      tone: 'amber',
    };
  }
  if (code >= 51 && code <= 57) {
    return {
      label: 'Light Drizzle',
      icon: 'grain',
      tone: 'blue',
    };
  }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      label: code >= 65 || code === 82 ? 'Heavy Rain' : 'Rain Showers',
      icon: 'rainy',
      tone: 'blue',
    };
  }
  if (code >= 71 && code <= 77) {
    return {
      label: 'Snow / Frost',
      icon: 'ac_unit',
      tone: 'blue',
    };
  }
  if (code >= 95) {
    return {
      label: 'Thunderstorm',
      icon: 'thunderstorm',
      tone: 'amber',
    };
  }
  return {
    label: 'Fair Sky',
    icon: isDay ? 'partly_cloudy_day' : 'nights_stay',
    tone: 'slate',
  };
}

export function formatIsoTimeShort(isoStr?: string): string {
  if (!isoStr) return '--';
  const parts = isoStr.split('T');
  const hhmm = parts[1] || isoStr;
  const [hStr, mStr = '00'] = hhmm.split(':');
  const h = Number(hStr);
  if (!Number.isFinite(h)) return isoStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${mStr.slice(0, 2)} ${ampm}`;
}

export function formatForecastDate(isoDate: string, idx: number): { day: string; date: string } {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { day: idx === 0 ? 'Today' : isoDate, date: isoDate };
  }
  const weekday = parsed.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNum = parsed.toLocaleDateString('en-US', { day: '2-digit' });
  const month = parsed.toLocaleDateString('en-US', { month: 'short' });
  return {
    day: idx === 0 ? `Today (${weekday})` : weekday,
    date: `${dayNum} ${month}`,
  };
}

export async function reverseGeocodeCoordinates(
  latitude: number,
  longitude: number
): Promise<{
  state: string;
  district: string;
  village: string;
  pincode: string;
  country: string;
  label: string;
}> {
  let state = '';
  let district = '';
  let village = '';
  let pincode = '';
  let country = '';

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
        latitude
      )}&lon=${encodeURIComponent(longitude)}&addressdetails=1&accept-language=en`,
      { headers: { accept: 'application/json' } }
    );
    if (res.ok) {
      const json = await res.json();
      const addr = json?.address || {};
      const rawDistrict =
        addr.state_district ||
        addr.county ||
        addr.district ||
        addr.city_district ||
        addr.city ||
        '';
      district = String(rawDistrict).replace(/\s+District$/i, '').trim();
      state = String(addr.state || addr.region || '').trim();
      village = String(
        addr.village ||
          addr.town ||
          addr.suburb ||
          addr.neighbourhood ||
          addr.hamlet ||
          addr.city ||
          addr.locality ||
          ''
      ).trim();
      pincode = String(addr.postcode || '').replace(/\s+/g, '').trim();
      country = String(addr.country || '').trim();
    }
  } catch {
    // Fall through to secondary reverse geocoder
  }

  if (!state && !district && !village) {
    try {
      const bdcRes = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(
          latitude
        )}&longitude=${encodeURIComponent(longitude)}&localityLanguage=en`,
        { headers: { accept: 'application/json' } }
      );
      if (bdcRes.ok) {
        const bdc = await bdcRes.json();
        const admins: Array<{ name?: string; description?: string; adminLevel?: number }> =
          Array.isArray(bdc?.localityInfo?.administrative)
            ? bdc.localityInfo.administrative
            : [];
        const districtEntry =
          admins.find((a) => /district/i.test(a.description || a.name || '')) ||
          admins.find((a) => a.adminLevel === 5);
        district = String(districtEntry?.name || '')
          .replace(/\s+District$/i, '')
          .trim();
        state = String(bdc?.principalSubdivision || '').trim();
        village = String(bdc?.city || bdc?.locality || '').trim();
        pincode = String(bdc?.postcode || '').replace(/\s+/g, '').trim();
        country = String(bdc?.countryName || '').trim();
      }
    } catch {
      // Coordinate fallback below
    }
  }

  const label = formatLocationLabel({
    village,
    district,
    state,
    country,
    latitude,
    longitude,
  });

  return { state, district, village, pincode, country, label };
}

export async function searchLocationsByQuery(query: string): Promise<WeatherLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
      trimmed
    )}&addressdetails=1&limit=5&accept-language=en`,
    { headers: { accept: 'application/json' } }
  );
  if (!res.ok) {
    throw new Error('Location search service unavailable.');
  }
  const items = await res.json();
  if (!Array.isArray(items)) return [];

  return items
    .map((item: any): WeatherLocation | null => {
      const lat = Number(item?.lat);
      const lon = Number(item?.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      const addr = item?.address || {};
      const state = String(addr.state || addr.region || '').trim();
      const district = String(
        addr.state_district || addr.county || addr.district || addr.city_district || ''
      )
        .replace(/\s+District$/i, '')
        .trim();
      const village = String(
        addr.village ||
          addr.town ||
          addr.city ||
          addr.suburb ||
          addr.hamlet ||
          addr.locality ||
          item?.name ||
          ''
      ).trim();
      const pincode = String(addr.postcode || '').replace(/\s+/g, '').trim();
      const label = formatLocationLabel({
        village,
        district,
        state,
        country: addr.country,
        latitude: lat,
        longitude: lon,
      });

      return {
        latitude: Number(lat.toFixed(4)),
        longitude: Number(lon.toFixed(4)),
        label,
        state: state || undefined,
        district: district || undefined,
        village: village || undefined,
        pincode: pincode || undefined,
        source: 'manual',
      };
    })
    .filter((v): v is WeatherLocation => v !== null);
}

export async function geocodeAddressText(addressQuery: string): Promise<WeatherLocation | null> {
  try {
    const matches = await searchLocationsByQuery(addressQuery);
    return matches[0] || null;
  } catch {
    return null;
  }
}

function normalizeForecastDaily(daily: any): DailyForecastItem[] {
  if (!daily || !Array.isArray(daily.time)) return [];
  return daily.time.map((date: string, i: number): DailyForecastItem => ({
    date,
    weather_code: Number(daily.weather_code?.[i] ?? 0),
    temperature_2m_max: Number(daily.temperature_2m_max?.[i] ?? 0),
    temperature_2m_min: Number(daily.temperature_2m_min?.[i] ?? 0),
    apparent_temperature_max: Number(daily.apparent_temperature_max?.[i] ?? 0),
    apparent_temperature_min: Number(daily.apparent_temperature_min?.[i] ?? 0),
    precipitation_sum: Number(daily.precipitation_sum?.[i] ?? 0),
    precipitation_probability_max: Number(daily.precipitation_probability_max?.[i] ?? 0),
    sunrise: String(daily.sunrise?.[i] ?? ''),
    sunset: String(daily.sunset?.[i] ?? ''),
    wind_speed_10m_max: Number(daily.wind_speed_10m_max?.[i] ?? 0),
  }));
}

function normalizeHourly(hourly: any): HourlyForecastItem[] {
  if (!hourly || !Array.isArray(hourly.time)) return [];
  return hourly.time.map((time: string, i: number): HourlyForecastItem => ({
    time,
    temperature_2m: Number(hourly.temperature_2m?.[i] ?? 0),
    relative_humidity_2m: Number(hourly.relative_humidity_2m?.[i] ?? 0),
    precipitation_probability: Number(hourly.precipitation_probability?.[i] ?? 0),
    precipitation: Number(hourly.precipitation?.[i] ?? 0),
    weather_code: Number(hourly.weather_code?.[i] ?? 0),
    wind_speed_10m: Number(hourly.wind_speed_10m?.[i] ?? 0),
  }));
}

function buildMeta(data: any, fallbackLat: number, fallbackLng: number): WeatherMeta {
  return {
    latitude: Number(data?.latitude ?? fallbackLat),
    longitude: Number(data?.longitude ?? fallbackLng),
    timezone: String(data?.timezone || 'Asia/Kolkata'),
    timezone_abbreviation: String(data?.timezone_abbreviation || 'GMT+5:30'),
    elevation: Number(data?.elevation ?? 0),
  };
}

function buildWeatherQuery(
  latitude: number,
  longitude: number,
  userId?: string,
  extraParams?: Record<string, string | number>
): string {
  const params = new URLSearchParams();
  const cleanUserId = userId?.trim();
  if (cleanUserId) {
    params.set('user_id', cleanUserId);
  }
  params.set('latitude', String(latitude));
  params.set('longitude', String(longitude));
  if (extraParams) {
    for (const [key, value] of Object.entries(extraParams)) {
      params.set(key, String(value));
    }
  }
  return params.toString();
}

export async function fetchCurrentWeatherApi(
  userId: string | undefined,
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<{ current: CurrentWeatherData; meta: WeatherMeta }> {
  const query = buildWeatherQuery(latitude, longitude, userId);
  const url = `${AUTH_API_BASE_URL}${WEATHER_ENDPOINTS.CURRENT}?${query}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { accept: '*/*' },
    signal,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false || !json?.data?.current) {
    throw new Error(json?.message || 'Failed to fetch current weather.');
  }

  return {
    current: json.data.current as CurrentWeatherData,
    meta: buildMeta(json.data, latitude, longitude),
  };
}

export async function fetchForecastWeatherApi(
  userId: string | undefined,
  latitude: number,
  longitude: number,
  days = 7,
  signal?: AbortSignal
): Promise<{ forecast: DailyForecastItem[]; meta: WeatherMeta }> {
  const query = buildWeatherQuery(latitude, longitude, userId, { days });
  const url = `${AUTH_API_BASE_URL}${WEATHER_ENDPOINTS.FORECAST}?${query}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { accept: '*/*' },
    signal,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false || !json?.data?.daily) {
    throw new Error(json?.message || 'Failed to fetch weather forecast.');
  }

  return {
    forecast: normalizeForecastDaily(json.data.daily),
    meta: buildMeta(json.data, latitude, longitude),
  };
}

export async function fetchHourlyWeatherApi(
  userId: string | undefined,
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<{ hourly: HourlyForecastItem[]; meta: WeatherMeta }> {
  const query = buildWeatherQuery(latitude, longitude, userId);
  const url = `${AUTH_API_BASE_URL}${WEATHER_ENDPOINTS.HOURLY}?${query}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { accept: '*/*' },
    signal,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false || !json?.data?.hourly) {
    throw new Error(json?.message || 'Failed to fetch hourly weather.');
  }

  return {
    hourly: normalizeHourly(json.data.hourly),
    meta: buildMeta(json.data, latitude, longitude),
  };
}
