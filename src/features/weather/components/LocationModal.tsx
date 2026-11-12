/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  MapPin,
  Search,
  Loader2,
  X,
  Navigation,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import {
  closeLocationModal,
  selectIsLocationModalOpen,
  selectWeatherLocation,
  setWeatherLocation,
} from '../store/weatherSlice';
import { detectCurrentAddress } from '../../../shared/services/geolocation';
import {
  formatCoords,
  QUICK_AG_HUBS,
  reverseGeocodeCoordinates,
  searchLocationsByQuery,
} from '../services/weatherApi';
import { WeatherLocation } from '../../../shared/types';

const COORD_INPUT_REGEX = /^\s*(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)\s*$/;

export const LocationModal: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsLocationModalOpen);
  const currentLocation = useAppSelector(selectWeatherLocation);

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [searchResults, setSearchResults] = useState<WeatherLocation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(closeLocationModal());
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, dispatch]);

  const handleClose = useCallback(() => {
    dispatch(closeLocationModal());
  }, [dispatch]);

  const handleSelectLocation = useCallback(
    (loc: WeatherLocation) => {
      dispatch(setWeatherLocation(loc));
      dispatch(closeLocationModal());
    },
    [dispatch]
  );

  const handleUseCurrentLocation = useCallback(async () => {
    if (locating || searching) return;
    setErrorMsg(null);
    setLocating(true);
    try {
      const detected = await detectCurrentAddress();
      handleSelectLocation({
        latitude: detected.latitude,
        longitude: detected.longitude,
        label: detected.label || `${detected.latitude.toFixed(4)}, ${detected.longitude.toFixed(4)}`,
        state: detected.state || undefined,
        district: detected.district || undefined,
        village: detected.village || undefined,
        pincode: detected.pincode || undefined,
        source: 'gps',
      });
    } catch (err) {
      setErrorMsg(
        err instanceof Error && err.message
          ? err.message
          : 'Unable to detect your current location.'
      );
    } finally {
      setLocating(false);
    }
  }, [handleSelectLocation, locating, searching]);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed.length < 2) {
        setErrorMsg('Enter a village, town, district, pincode, or latitude,longitude.');
        return;
      }

      setErrorMsg(null);
      setSearching(true);
      setHasSearched(true);

      try {
        // Support direct "lat, lng" input for precision coordinates
        const coordMatch = COORD_INPUT_REGEX.exec(trimmed);
        if (coordMatch) {
          const lat = Number(coordMatch[1]);
          const lng = Number(coordMatch[2]);
          if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            const rev = await reverseGeocodeCoordinates(lat, lng);
            setSearchResults([
              {
                latitude: Number(lat.toFixed(4)),
                longitude: Number(lng.toFixed(4)),
                label: rev.label,
                state: rev.state || undefined,
                district: rev.district || undefined,
                village: rev.village || undefined,
                pincode: rev.pincode || undefined,
                source: 'manual',
              },
            ]);
            return;
          }
        }

        const results = await searchLocationsByQuery(trimmed);
        setSearchResults(results);
      } catch (err) {
        setSearchResults([]);
        setErrorMsg(
          err instanceof Error && err.message
            ? err.message
            : 'Unable to search locations right now. Pick a regional hub below.'
        );
      } finally {
        setSearching(false);
      }
    },
    [query]
  );

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#d5e7db]"
      >
        {/* Header */}
        <div className="bg-[#113E2E] text-white px-6 py-5 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#E5B54F]" />
            </div>
            <div>
              <h2 id="location-modal-title" className="text-lg font-bold font-serif leading-tight">
                <span>Change Farm Weather Location</span>
              </h2>
              <p className="text-xs text-emerald-200/90 mt-0.5 leading-snug">
                <span>Use GPS coordinates or search any village, city, or agricultural hub</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition cursor-pointer"
            aria-label="Close location dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Active Weather Location Summary */}
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#F0F7F2] border border-[#cbe1d2]">
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-[#467a59] uppercase tracking-wider block">
                <span>Active Weather Location</span>
              </span>
              <div className="text-sm font-bold text-[#113E2E] truncate mt-0.5">
                <span key={currentLocation.label}>{currentLocation.label}</span>
              </div>
              <div
                className="text-xs text-slate-600 tabular-nums font-mono mt-0.5 notranslate"
                translate="no"
              >
                {formatCoords(currentLocation.latitude, currentLocation.longitude)}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#d5e7db] text-[11px] font-bold text-[#113E2E] shrink-0 capitalize">
              <span key={currentLocation.source}>{currentLocation.source}</span>
            </span>
          </div>

          {/* Primary GPS Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating || searching}
            className="w-full py-3 px-4 rounded-xl bg-[#113E2E] hover:bg-[#0a291f] disabled:opacity-60 text-white text-sm font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {locating ? (
              <span key="locating" className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#E5B54F]" />
                <span>Detecting current GPS location...</span>
              </span>
            ) : (
              <span key="gps-idle" className="inline-flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#E5B54F]" />
                <span>Use my current location</span>
              </span>
            )}
          </button>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-2.5">
            <label
              htmlFor="location-search-input"
              className="block text-xs font-bold text-[#1A2821]"
            >
              <span>Search village, district, pincode, or coordinates</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="location-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="e.g. Guntur, 500081, or 17.385, 78.4867"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#d5e7db] bg-[#F8FAF7] focus:bg-white focus:border-[#113E2E] focus:ring-2 focus:ring-[#113E2E]/15 focus:outline-none text-xs sm:text-sm text-[#1A2821]"
                />
              </div>
              <button
                type="submit"
                disabled={searching || locating}
                className="px-4 py-2.5 rounded-xl bg-[#F0F7F2] hover:bg-[#e1efe6] border border-[#cbe1d2] text-xs font-bold text-[#113E2E] transition whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
              >
                {searching ? (
                  <span key="searching" className="inline-flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching</span>
                  </span>
                ) : (
                  <span key="search-idle">Search</span>
                )}
              </button>
            </div>
          </form>

          {errorMsg && (
            <div
              key="location-error"
              role="alert"
              className="flex items-start gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span key={errorMsg}>{errorMsg}</span>
            </div>
          )}

          {/* Search Results */}
          {hasSearched && !searching && (
            <div key="search-results" className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Search Results</span>
              </div>
              {searchResults.length > 0 ? (
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {searchResults.map((res, idx) => (
                    <button
                      key={`${res.latitude}-${res.longitude}-${idx}`}
                      type="button"
                      onClick={() => handleSelectLocation(res)}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl border border-[#e5ebe7] bg-[#F8FAF7] hover:bg-[#F0F7F2] hover:border-[#113E2E]/40 transition flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#113E2E] truncate">
                          {res.label}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {[res.district, res.state, res.pincode].filter(Boolean).join(', ') ||
                            'Selected coordinates'}
                        </div>
                      </div>
                      <span
                        className="text-[11px] font-mono text-slate-500 shrink-0 tabular-nums notranslate"
                        translate="no"
                      >
                        {res.latitude.toFixed(3)}, {res.longitude.toFixed(3)}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                !errorMsg && (
                  <p className="text-xs text-slate-500 bg-[#F8FAF7] border border-[#e5ebe7] rounded-xl px-3.5 py-2.5">
                    <span>No matching places found. Try entering a major town or lat, lng coordinates.</span>
                  </p>
                )
              )}
            </div>
          )}

          {/* Quick Agricultural Hubs */}
          <div className="space-y-2.5 pt-1 border-t border-[#e9efe7]">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Quick Agricultural Weather Hubs</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_AG_HUBS.map((hub) => {
                const isSelected =
                  Math.abs(hub.latitude - currentLocation.latitude) < 0.01 &&
                  Math.abs(hub.longitude - currentLocation.longitude) < 0.01;
                return (
                  <button
                    key={hub.label}
                    type="button"
                    onClick={() => handleSelectLocation(hub)}
                    className={`text-left px-3.5 py-2.5 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#F0F7F2] border-[#113E2E] text-[#113E2E]'
                        : 'bg-white border-[#e5ebe7] hover:bg-[#F8FAF7] text-slate-800'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{hub.village || hub.label}</div>
                      <div className="text-[11px] text-slate-500 truncate">{hub.state}</div>
                    </div>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-[#113E2E] shrink-0" />
                    ) : (
                      <span
                        className="text-[10px] font-mono text-slate-400 shrink-0 tabular-nums notranslate"
                        translate="no"
                      >
                        {hub.latitude.toFixed(2)}, {hub.longitude.toFixed(2)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
