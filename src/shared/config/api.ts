/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Uses VITE_API_BASE_URL from .env when set, otherwise defaults to the backend API.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://20.12.240.74:7000'
).replace(/\/$/, '');

export const DEFAULT_API_HEADERS: HeadersInit = {
  accept: '*/*',
  'Content-Type': 'application/json',
};
