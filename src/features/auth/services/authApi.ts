/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CountryOption,
  CropOptionItem,
  RegisterRequestPayload,
  UserProfile,
} from '../../../shared/types';
import { PUBLIC_PLATFORM_ASSETS, USER_PROFILE } from '../../../shared/data/mockData';
import { API_BASE_URL, DEFAULT_API_HEADERS } from '../../../shared/config/api';
import { JwtPayload } from '../utils/jwt';

export const AUTH_API_BASE_URL = API_BASE_URL;

export const AUTH_ENDPOINTS = {
  REGISTER: '/api/auth/register',
  SEND_OTP: '/api/auth/send-otp',
  VERIFY_OTP: '/api/auth/verify-otp',
  CROP_LIST: '/api/crop/cropList',
} as const;

export const AUTH_REQUEST_HEADERS: HeadersInit = DEFAULT_API_HEADERS;

export const DEFAULT_COUNTRY_ISO = 'IN';

export const COUNTRY_OPTIONS: CountryOption[] = [
  { iso: 'IN', name: 'India', dialCode: '+91', minDigits: 10, maxDigits: 10 },
  { iso: 'US', name: 'United States', dialCode: '+1', minDigits: 10, maxDigits: 10 },
  { iso: 'GB', name: 'United Kingdom', dialCode: '+44', minDigits: 10, maxDigits: 10 },
  { iso: 'AE', name: 'United Arab Emirates', dialCode: '+971', minDigits: 9, maxDigits: 9 },
  { iso: 'SA', name: 'Saudi Arabia', dialCode: '+966', minDigits: 9, maxDigits: 9 },
  { iso: 'SG', name: 'Singapore', dialCode: '+65', minDigits: 8, maxDigits: 8 },
  { iso: 'AU', name: 'Australia', dialCode: '+61', minDigits: 9, maxDigits: 9 },
  { iso: 'CA', name: 'Canada', dialCode: '+1', minDigits: 10, maxDigits: 10 },
  { iso: 'NP', name: 'Nepal', dialCode: '+977', minDigits: 10, maxDigits: 10 },
  { iso: 'BD', name: 'Bangladesh', dialCode: '+880', minDigits: 10, maxDigits: 10 },
  { iso: 'LK', name: 'Sri Lanka', dialCode: '+94', minDigits: 9, maxDigits: 9 },
  { iso: 'MY', name: 'Malaysia', dialCode: '+60', minDigits: 9, maxDigits: 10 },
  { iso: 'ID', name: 'Indonesia', dialCode: '+62', minDigits: 9, maxDigits: 12 },
  { iso: 'TH', name: 'Thailand', dialCode: '+66', minDigits: 9, maxDigits: 9 },
  { iso: 'VN', name: 'Vietnam', dialCode: '+84', minDigits: 9, maxDigits: 10 },
  { iso: 'PH', name: 'Philippines', dialCode: '+63', minDigits: 10, maxDigits: 10 },
  { iso: 'JP', name: 'Japan', dialCode: '+81', minDigits: 10, maxDigits: 10 },
  { iso: 'KR', name: 'South Korea', dialCode: '+82', minDigits: 9, maxDigits: 10 },
  { iso: 'DE', name: 'Germany', dialCode: '+49', minDigits: 10, maxDigits: 11 },
  { iso: 'FR', name: 'France', dialCode: '+33', minDigits: 9, maxDigits: 9 },
  { iso: 'IT', name: 'Italy', dialCode: '+39', minDigits: 9, maxDigits: 10 },
  { iso: 'ES', name: 'Spain', dialCode: '+34', minDigits: 9, maxDigits: 9 },
  { iso: 'NL', name: 'Netherlands', dialCode: '+31', minDigits: 9, maxDigits: 9 },
  { iso: 'CH', name: 'Switzerland', dialCode: '+41', minDigits: 9, maxDigits: 9 },
  { iso: 'SE', name: 'Sweden', dialCode: '+46', minDigits: 7, maxDigits: 10 },
  { iso: 'QA', name: 'Qatar', dialCode: '+974', minDigits: 8, maxDigits: 8 },
  { iso: 'KW', name: 'Kuwait', dialCode: '+965', minDigits: 8, maxDigits: 8 },
  { iso: 'OM', name: 'Oman', dialCode: '+968', minDigits: 8, maxDigits: 8 },
  { iso: 'BH', name: 'Bahrain', dialCode: '+973', minDigits: 8, maxDigits: 8 },
  { iso: 'IL', name: 'Israel', dialCode: '+972', minDigits: 9, maxDigits: 9 },
  { iso: 'TR', name: 'Turkey', dialCode: '+90', minDigits: 10, maxDigits: 10 },
  { iso: 'BR', name: 'Brazil', dialCode: '+55', minDigits: 10, maxDigits: 11 },
  { iso: 'MX', name: 'Mexico', dialCode: '+52', minDigits: 10, maxDigits: 10 },
  { iso: 'ZA', name: 'South Africa', dialCode: '+27', minDigits: 9, maxDigits: 9 },
  { iso: 'KE', name: 'Kenya', dialCode: '+254', minDigits: 9, maxDigits: 9 },
  { iso: 'NG', name: 'Nigeria', dialCode: '+234', minDigits: 10, maxDigits: 10 },
  { iso: 'EG', name: 'Egypt', dialCode: '+20', minDigits: 10, maxDigits: 10 },
  { iso: 'NZ', name: 'New Zealand', dialCode: '+64', minDigits: 8, maxDigits: 10 },
  { iso: 'PK', name: 'Pakistan', dialCode: '+92', minDigits: 10, maxDigits: 10 },
  { iso: 'MM', name: 'Myanmar', dialCode: '+95', minDigits: 8, maxDigits: 10 },
  { iso: 'BT', name: 'Bhutan', dialCode: '+975', minDigits: 8, maxDigits: 8 },
];

export const REGISTRATION_CROP_OPTIONS: CropOptionItem[] = [
  { id: 1, label: 'Rice / Basmati Paddy' },
  { id: 2, label: 'Chilli (Sannam / Teja)' },
  { id: 3, label: 'Maize (Hybrid Corn)' },
  { id: 4, label: 'Groundnut' },
  { id: 5, label: 'Cotton' },
  { id: 6, label: 'Wheat / Pulses' },
];

export function findCountryByIso(iso?: string | null): CountryOption {
  if (!iso) return COUNTRY_OPTIONS[0];
  const upper = iso.trim().toUpperCase();
  return COUNTRY_OPTIONS.find((c) => c.iso === upper) || COUNTRY_OPTIONS[0];
}

export function findCountryByName(name?: string | null): CountryOption | undefined {
  if (!name) return undefined;
  const lower = name.trim().toLowerCase();
  return COUNTRY_OPTIONS.find((c) => c.name.toLowerCase() === lower);
}

/**
 * Finds the matching CountryOption from a full E.164 number using longest dial-code match.
 */
export function findCountryByDialCode(
  rawPhone: string,
  preferredIso?: string | null
): CountryOption {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return findCountryByIso(preferredIso);

  const preferred = preferredIso ? findCountryByIso(preferredIso) : null;
  const matches = COUNTRY_OPTIONS.filter((c) => digits.startsWith(c.dialCode.slice(1))).sort(
    (a, b) => b.dialCode.length - a.dialCode.length
  );

  if (matches.length === 0) return preferred || COUNTRY_OPTIONS[0];
  const topLen = matches[0].dialCode.length;
  const tied = matches.filter((c) => c.dialCode.length === topLen);

  if (preferred && tied.some((c) => c.iso === preferred.iso)) {
    return preferred;
  }
  return tied[0];
}

/**
 * Converts a local or E.164 phone input into full E.164 format with country code (e.g. "+919553737309").
 */
export function normalizeFullPhone(
  rawPhone: string,
  countryIso: string = DEFAULT_COUNTRY_ISO
): string {
  const trimmed = (rawPhone || '').trim();
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';

  if (trimmed.startsWith('+')) {
    return `+${digits}`;
  }

  const country = findCountryByIso(countryIso);
  return `${country.dialCode}${digits}`;
}

/**
 * Extracts national subscriber digits (without country dial code) for editing inside form inputs.
 */
export function extractNationalDigits(
  rawPhone: string,
  countryIso?: string | null
): string {
  const trimmed = (rawPhone || '').trim();
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';

  if (trimmed.startsWith('+')) {
    const matched = findCountryByDialCode(trimmed, countryIso);
    const dialDigits = matched.dialCode.slice(1);
    return digits.startsWith(dialDigits) ? digits.slice(dialDigits.length) : digits;
  }

  return digits;
}

export function isValidNationalMobile(
  rawDigits: string,
  countryIso: string = DEFAULT_COUNTRY_ISO
): boolean {
  const clean = rawDigits.replace(/\D/g, '');
  const country = findCountryByIso(countryIso);
  return clean.length >= country.minDigits && clean.length <= country.maxDigits;
}

export function isValidE164Mobile(phone: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test((phone || '').trim());
}

/**
 * Formats an E.164 or national mobile string nicely for display (e.g. "+91 95537 37309").
 */
export function formatPhoneForDisplay(
  rawPhone: string,
  preferredIso?: string | null
): string {
  const full = normalizeFullPhone(rawPhone, preferredIso || DEFAULT_COUNTRY_ISO);
  if (!full) return '';

  const country = findCountryByDialCode(full, preferredIso);
  const national = extractNationalDigits(full, country.iso);

  if (country.dialCode === '+91' && national.length === 10) {
    return `+91 ${national.slice(0, 5)} ${national.slice(5)}`;
  }
  return national ? `${country.dialCode} ${national}` : full;
}

/**
 * Safely extracts JWT string across standard Node/Express response shapes.
 */
export function extractJwtToken(payload: any): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const candidate =
    payload.token ||
    payload.accessToken ||
    payload.access_token ||
    payload.jwt ||
    payload.data?.token ||
    payload.data?.accessToken ||
    payload.data?.access_token ||
    payload.data?.jwt ||
    payload.tokens?.accessToken ||
    payload.data?.tokens?.accessToken;

  if (typeof candidate !== 'string') return null;
  const cleaned = candidate.replace(/^Bearer\s+/i, '').trim();
  return cleaned.length > 0 ? cleaned : null;
}

/**
 * Normalizes backend user objects (register / verify-otp / JWT claims) into UI UserProfile.
 */
export function mapApiUserToProfile(
  rawUser: any,
  mobileInput: string,
  registerFallback?: RegisterRequestPayload | null,
  decodedJwt?: JwtPayload | null
): UserProfile {
  const apiObj =
    rawUser?.user ||
    rawUser?.data?.user ||
    (rawUser?.data && typeof rawUser.data === 'object' && !Array.isArray(rawUser.data)
      ? rawUser.data
      : null) ||
    (rawUser && typeof rawUser === 'object' ? rawUser : {});

  const fullName =
    apiObj.full_name ||
    apiObj.fullName ||
    apiObj.name ||
    registerFallback?.full_name ||
    (typeof decodedJwt?.full_name === 'string' ? decodedJwt.full_name : '') ||
    (typeof decodedJwt?.name === 'string' ? decodedJwt.name : '') ||
    'Farmer';

  const rawMobile = String(apiObj.mobile || apiObj.phone || mobileInput || '');
  const detectedCountry =
    findCountryByName(apiObj.country || registerFallback?.country) ||
    findCountryByDialCode(rawMobile);

  const village = apiObj.village || registerFallback?.village || '';
  const district = apiObj.district || registerFallback?.district || '';
  const state = apiObj.state || registerFallback?.state || '';
  const country = apiObj.country || registerFallback?.country || detectedCountry.name || 'India';
  const pincode = apiObj.pincode || registerFallback?.pincode || '';
  const email = apiObj.email || registerFallback?.email || '';
  const cropId =
    typeof apiObj.crop_id === 'number' ? apiObj.crop_id : registerFallback?.crop_id;

  const latCandidate = Number(apiObj.latitude ?? registerFallback?.latitude);
  const lngCandidate = Number(apiObj.longitude ?? registerFallback?.longitude);
  const hasCoords = Number.isFinite(latCandidate) && Number.isFinite(lngCandidate);

  const locationParts = [village, district, state].filter(Boolean);
  const location =
    locationParts.length > 0
      ? locationParts.join(', ')
      : country && country !== 'India'
        ? country
        : USER_PROFILE.location;
  const stationCity = village || district || (country !== 'India' ? country : 'Guntur');
  const formattedPhone = formatPhoneForDisplay(rawMobile, detectedCountry.iso);
  const nationalDigits = extractNationalDigits(rawMobile, detectedCountry.iso);

  const rawId = apiObj.id ?? decodedJwt?.sub ?? decodedJwt?.userId ?? nationalDigits;

  return {
    id: `farmer-${rawId}`,
    rawId: String(rawId),
    name: String(fullName).trim(),
    phone: formattedPhone,
    email: email || undefined,
    role: apiObj.role || 'Farmer account',
    farmerPartner: apiObj.farmerPartner || 'Farmer Partner',
    holding: apiObj.holding || USER_PROFILE.holding,
    location,
    country,
    state: state || undefined,
    district: district || undefined,
    village: village || undefined,
    pincode: pincode || undefined,
    cropId,
    ...(hasCoords ? { latitude: latCandidate, longitude: lngCandidate } : {}),
    station: apiObj.station || `Ag-Weather Station • ${stationCity}`,
    kisanId:
      apiObj.kisanId ||
      (apiObj.id ? `KD-${String(apiObj.id).padStart(6, '0')}` : USER_PROFILE.kisanId),
    pmfbyPolicy: apiObj.pmfbyPolicy || USER_PROFILE.pmfbyPolicy,
    insuredSum: apiObj.insuredSum || USER_PROFILE.insuredSum,
    linkedBankMask: apiObj.linkedBankMask || USER_PROFILE.linkedBankMask,
    registeredParcelsCount:
      typeof apiObj.registeredParcelsCount === 'number'
        ? apiObj.registeredParcelsCount
        : USER_PROFILE.registeredParcelsCount,
    avatar:
      typeof apiObj.avatar === 'string' && apiObj.avatar.trim()
        ? apiObj.avatar.trim()
        : '',
    landscape: apiObj.landscape || PUBLIC_PLATFORM_ASSETS.landscape,
  };
}

export { detectCurrentAddress } from '../../../shared/services/geolocation';
