/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../types';

export const JWT_STORAGE_KEY = 'kd_jwt_token';
export const USER_STORAGE_KEY = 'kd_user_profile';

export interface JwtPayload {
  sub?: string;
  phone?: string;
  name?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

/**
 * Safely decodes the middle payload section of a standard JWT token.
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Checks whether a JWT token has an expired `exp` claim.
 */
export function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) return true;
  if (typeof payload.exp === 'number') {
    return Date.now() >= payload.exp * 1000;
  }
  return false;
}

/**
 * Creates a standard 3-part demo JWT string for local preview before backend APIs are plugged in.
 */
export function createLocalJwt(payload: JwtPayload): string {
  const encodeBase64Url = (obj: object) => {
    const str = JSON.stringify(obj);
    const utf8Bytes = new TextEncoder().encode(str);
    let binary = '';
    utf8Bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const header = encodeBase64Url({ alg: 'HS256', typ: 'JWT' });
  const body = encodeBase64Url(payload);
  const signature = encodeBase64Url({ sig: 'local-preview-signature' });
  return `${header}.${body}.${signature}`;
}

export function getStoredJwt(): string | null {
  try {
    const token = localStorage.getItem(JWT_STORAGE_KEY);
    if (!token) return null;
    if (isJwtExpired(token)) {
      clearAuthStorage();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function getStoredUser(): UserProfile | null {
  try {
    const token = getStoredJwt();
    if (!token) return null;
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveAuthStorage(token: string, user: UserProfile): void {
  try {
    localStorage.setItem(JWT_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage quota / sandbox restrictions
  }
}

export function clearAuthStorage(): void {
  try {
    localStorage.removeItem(JWT_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    // Ignore storage restrictions
  }
}

/**
 * Use this helper in authenticated API requests once backend endpoints are integrated.
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getStoredJwt();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return '';
  const cleaned = phone.trim();
  if (cleaned.length <= 4) return cleaned;
  const lastTwo = cleaned.slice(-2);
  const prefix = cleaned.slice(0, Math.min(9, cleaned.length - 4));
  return `${prefix} ••••${lastTwo}`;
}
