/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DetectedAddress } from '../types';

/**
 * Requests browser geolocation permission, captures lat/lon, and reverse-geocodes coordinates into address fields.
 */
export async function detectCurrentAddress(): Promise<DetectedAddress> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    throw new Error('Location access is not supported by your browser.');
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0,
    });
  }).catch((geoErr: GeolocationPositionError) => {
    if (geoErr?.code === 1) {
      throw new Error(
        'Location permission denied. Please allow location access or enter your address manually.'
      );
    }
    if (geoErr?.code === 3) {
      throw new Error('Location request timed out. Please try again or enter your address manually.');
    }
    throw new Error('Unable to detect your location. Please enter your address manually.');
  });

  const latitude = Number(position.coords.latitude.toFixed(6));
  const longitude = Number(position.coords.longitude.toFixed(6));

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
    // Fall back to secondary reverse-geocoding endpoint below
  }

  if (!state && !district && !village && !pincode) {
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
      // Coordinates alone still remain valid below
    }
  }

  const labelParts = [village, district, state].filter(Boolean);
  const label =
    labelParts.slice(0, 2).join(', ') ||
    `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

  return {
    latitude,
    longitude,
    label,
    state,
    district,
    village,
    pincode,
    country,
  };
}
