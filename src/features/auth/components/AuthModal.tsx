/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  UserPlus,
  ArrowRight,
  Loader2,
  ArrowLeft,
  Info,
  MapPin,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import {
  clearAuthMessages,
  closeAuthModal,
  fetchCropList,
  OtpOrigin,
  registerUser,
  selectAuthModalUi,
  selectCropOptionsUi,
  sendOtp,
  setAuthStep,
  verifyOtp,
} from '../store/authSlice';
import {
  COUNTRY_OPTIONS,
  DEFAULT_COUNTRY_ISO,
  extractNationalDigits,
  findCountryByDialCode,
  findCountryByIso,
  formatPhoneForDisplay,
  isValidNationalMobile,
  normalizeFullPhone,
  REGISTRATION_CROP_OPTIONS,
} from '../services/authApi';
import { detectCurrentAddress } from '../../../shared/services/geolocation';
import { setWeatherLocation } from '../../weather/store/weatherSlice';
import { formatCoords, formatLocationLabel } from '../../weather/services/weatherApi';
import { RegisterRequestPayload } from '../../../shared/types';
import { useTranslation } from '../../../shared/i18n';

interface MobileStepProps {
  initialPhone: string;
  initialCountryIso: string;
  sendingOtp: boolean;
  serverError: string | null;
  statusMessage: string | null;
  onSwitchToRegister: (fullPhone: string, countryIso: string) => void;
}

const MobileStepForm = memo<MobileStepProps>(
  ({
    initialPhone,
    initialCountryIso,
    sendingOtp,
    serverError,
    statusMessage,
    onSwitchToRegister,
  }) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [countryIso, setCountryIso] = useState(
      () => initialCountryIso || DEFAULT_COUNTRY_ISO
    );
    const [mobileInput, setMobileInput] = useState(() =>
      extractNationalDigits(initialPhone, initialCountryIso)
    );
    const [localError, setLocalError] = useState<string | null>(null);
    const [googleNotice, setGoogleNotice] = useState(false);
    const mobileInputRef = useRef<HTMLInputElement | null>(null);

    const selectedCountry = useMemo(() => findCountryByIso(countryIso), [countryIso]);

    useEffect(() => {
      if (initialCountryIso) {
        setCountryIso(initialCountryIso);
      }
      if (initialPhone) {
        setMobileInput(extractNationalDigits(initialPhone, initialCountryIso));
      }
    }, [initialPhone, initialCountryIso]);

    useEffect(() => {
      const timer = setTimeout(() => mobileInputRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    }, []);

    const activeError = localError || serverError;

    const handleCountryCodeChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextIso = e.target.value;
        const nextCountry = findCountryByIso(nextIso);
        setCountryIso(nextIso);
        setMobileInput((prev) => prev.slice(0, nextCountry.maxDigits));
        if (localError) setLocalError(null);
        if (serverError) dispatch(clearAuthMessages());
      },
      [dispatch, localError, serverError]
    );

    const handleMobileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        let cleaned = raw.replace(/\D/g, '');
        let activeCountry = selectedCountry;

        if (raw.trim().startsWith('+') && cleaned.length > 0) {
          const matched = findCountryByDialCode(`+${cleaned}`, countryIso);
          const dialDigits = matched.dialCode.slice(1);
          if (cleaned.startsWith(dialDigits)) {
            cleaned = cleaned.slice(dialDigits.length);
            activeCountry = matched;
            if (matched.iso !== countryIso) {
              setCountryIso(matched.iso);
            }
          }
        } else if (
          cleaned.length > selectedCountry.maxDigits &&
          cleaned.startsWith(selectedCountry.dialCode.slice(1))
        ) {
          cleaned = cleaned.slice(selectedCountry.dialCode.slice(1).length);
        }

        setMobileInput(cleaned.slice(0, activeCountry.maxDigits));
        if (localError) setLocalError(null);
        if (serverError) dispatch(clearAuthMessages());
      },
      [countryIso, dispatch, localError, selectedCountry, serverError]
    );

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        setGoogleNotice(false);
        const cleanDigits = mobileInput.replace(/\D/g, '');
        if (!isValidNationalMobile(cleanDigits, countryIso)) {
          setLocalError(
            selectedCountry.minDigits === selectedCountry.maxDigits
              ? `Please enter a valid ${selectedCountry.minDigits}-digit mobile number for ${selectedCountry.name}.`
              : `Please enter a valid ${selectedCountry.minDigits}-${selectedCountry.maxDigits} digit mobile number for ${selectedCountry.name}.`
          );
          return;
        }
        setLocalError(null);
        const fullPhone = normalizeFullPhone(cleanDigits, countryIso);
        dispatch(sendOtp({ mobile: fullPhone, countryIso }));
      },
      [countryIso, dispatch, mobileInput, selectedCountry]
    );

    return (
      <div className="space-y-5">
        {statusMessage && !activeError && (
          <div
            key="mobile-status"
            className="flex items-start gap-2.5 text-xs font-medium text-[#113E2E] bg-[#F0F7F2] border border-[#cbe1d2] rounded-xl px-3.5 py-2.5"
          >
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#175638]" />
            <span key={statusMessage}>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="auth-mobile-input"
              className="block text-xs font-bold text-[#1A2821] mb-1.5"
            >
              <span>{t('auth.mobileLabel')}</span>
            </label>
            <div className="flex items-center rounded-xl border border-[#d5e7db] bg-[#F8FAF7] focus-within:border-[#113E2E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#113E2E]/15 transition overflow-hidden">
              <select
                id="auth-mobile-country-code"
                aria-label="Country code"
                value={countryIso}
                onChange={handleCountryCodeChange}
                className="pl-3 pr-2 py-3 text-xs sm:text-sm font-bold text-[#113E2E] border-r border-[#d5e7db] bg-[#F0F7F2] focus:outline-none cursor-pointer shrink-0 tabular-nums notranslate"
                translate="no"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.iso} value={c.iso}>
                    {`${c.iso} (${c.dialCode})`}
                  </option>
                ))}
              </select>
              <input
                ref={mobileInputRef}
                id="auth-mobile-input"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={selectedCountry.maxDigits + 4}
                value={mobileInput}
                onChange={handleMobileChange}
                placeholder={
                  selectedCountry.iso === 'IN'
                    ? 'Enter 10-digit mobile number'
                    : t('auth.mobilePlaceholder')
                }
                className="w-full px-3.5 py-3 bg-transparent text-sm font-semibold text-[#1A2821] placeholder:text-slate-400 focus:outline-none tabular-nums"
              />
            </div>
          </div>

          {activeError && (
            <p
              key="mobile-error"
              role="alert"
              className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
            >
              <span key={activeError}>{activeError}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={sendingOtp}
            className="w-full py-3 px-5 rounded-xl bg-[#113E2E] hover:bg-[#0a291f] disabled:opacity-60 text-white text-sm font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {sendingOtp ? (
              <span key="sending" className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('auth.sendingOtp')}</span>
              </span>
            ) : (
              <span key="idle" className="inline-flex items-center gap-2">
                <span>{t('auth.sendOtp')}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Hairline Divider */}
        <div className="relative flex items-center py-0.5">
          <div className="flex-grow border-t border-[#e1e8de]" />
          <span className="shrink-0 mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>{t('auth.orContinueWith')}</span>
          </span>
          <div className="flex-grow border-t border-[#e1e8de]" />
        </div>

        {/* Static Google Login Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setGoogleNotice(true)}
            className="w-full py-2.5 px-5 rounded-xl bg-white hover:bg-slate-50 border border-[#d5e7db] text-[#1A2821] text-sm font-semibold transition flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
              />
            </svg>
            <span>{t('auth.continueWithGoogle')}</span>
          </button>

          {googleNotice && (
            <p
              key="google-notice"
              className="text-xs text-slate-600 bg-[#F8FAF7] border border-[#e1e8de] rounded-xl px-3.5 py-2 text-center"
            >
              <span>{t('auth.googleComingSoon')}</span>
            </p>
          )}
        </div>

        {/* Direct Registration Switch */}
        <div className="pt-2 border-t border-[#e9efe7] text-center">
          <button
            type="button"
            onClick={() => {
              const digits = mobileInput.replace(/\D/g, '');
              onSwitchToRegister(
                digits ? normalizeFullPhone(digits, countryIso) : '',
                countryIso
              );
            }}
            className="text-xs font-bold text-[#175638] hover:text-[#113E2E] hover:underline cursor-pointer"
          >
            <span>{t('auth.newHereRegister')}</span>
          </button>
        </div>
      </div>
    );
  }
);

interface PrimaryCropSelectProps {
  value: number;
  disabled?: boolean;
  onChange: (cropId: number) => void;
  label: string;
  loadingText: string;
}

const PrimaryCropSelect = memo<PrimaryCropSelectProps>(
  ({ value, disabled, onChange, label, loadingText }) => {
    const dispatch = useAppDispatch();
    const { crops, cropsLoading, cropsLoaded, cropsError } = useAppSelector(selectCropOptionsUi);

    useEffect(() => {
      if (!cropsLoaded && !cropsLoading && !cropsError) {
        dispatch(fetchCropList());
      }
    }, [dispatch, cropsLoaded, cropsLoading, cropsError]);

    const options = useMemo(
      () => (crops.length > 0 ? crops : REGISTRATION_CROP_OPTIONS),
      [crops]
    );

    useEffect(() => {
      if (crops.length > 0 && !crops.some((c) => c.id === value)) {
        onChange(crops[0].id);
      }
    }, [crops, value, onChange]);

    const effectiveValue = options.some((c) => c.id === value)
      ? value
      : (options[0]?.id ?? 1);

    return (
      <div>
        <label htmlFor="reg-crop" className="block text-xs font-bold text-[#1A2821] mb-1">
          <span>{label}</span>
        </label>
        <select
          id="reg-crop"
          value={effectiveValue}
          disabled={disabled || (cropsLoading && crops.length === 0)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2.5 rounded-xl border border-[#d5e7db] bg-[#F8FAF7] focus:bg-white focus:border-[#113E2E] focus:ring-2 focus:ring-[#113E2E]/15 focus:outline-none text-xs sm:text-sm font-medium text-[#1A2821] disabled:opacity-70"
        >
          {cropsLoading && crops.length === 0 ? (
            <option value={effectiveValue}>{loadingText}</option>
          ) : (
            options.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.label}
              </option>
            ))
          )}
        </select>
        {cropsError && crops.length === 0 && (
          <div
            key="crop-retry"
            className="mt-1 flex items-center justify-between gap-2 text-[11px] text-amber-800"
          >
            <span>Showing default crops</span>
            <button
              type="button"
              onClick={() => dispatch(fetchCropList({ force: true }))}
              className="font-bold text-[#113E2E] hover:underline cursor-pointer"
            >
              <span>Retry</span>
            </button>
          </div>
        )}
      </div>
    );
  }
);

interface RegisterStepProps {
  initialPhone: string;
  initialCountryIso: string;
  initialRegisterData: RegisterRequestPayload | null;
  registering: boolean;
  serverError: string | null;
  statusMessage: string | null;
  onBackToMobile: (fullPhone: string, countryIso: string) => void;
}

const RegisterStepForm = memo<RegisterStepProps>(
  ({
    initialPhone,
    initialCountryIso,
    initialRegisterData,
    registering,
    serverError,
    statusMessage,
    onBackToMobile,
  }) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const resolvedInitIso = useMemo(() => {
      if (initialRegisterData?.mobile) {
        return findCountryByDialCode(initialRegisterData.mobile, initialCountryIso).iso;
      }
      if (initialPhone?.trim().startsWith('+')) {
        return findCountryByDialCode(initialPhone, initialCountryIso).iso;
      }
      return initialCountryIso || DEFAULT_COUNTRY_ISO;
    }, [initialCountryIso, initialPhone, initialRegisterData]);

    const [phoneCountryIso, setPhoneCountryIso] = useState(resolvedInitIso);
    const [mobileDigits, setMobileDigits] = useState(() =>
      extractNationalDigits(initialRegisterData?.mobile || initialPhone, resolvedInitIso)
    );
    const [fullName, setFullName] = useState(initialRegisterData?.full_name || '');
    const [cropId, setCropId] = useState<number>(initialRegisterData?.crop_id || 1);
    const [stateName, setStateName] = useState(() => {
      if (initialRegisterData?.state) return initialRegisterData.state;
      const initName = initialRegisterData?.country || findCountryByIso(resolvedInitIso).name;
      return initName === 'India' ? 'Telangana' : '';
    });
    const [district, setDistrict] = useState(initialRegisterData?.district || '');
    const [village, setVillage] = useState(initialRegisterData?.village || '');
    const [pincode, setPincode] = useState(initialRegisterData?.pincode || '');
    const [capturedCoords, setCapturedCoords] = useState<{
      latitude: number;
      longitude: number;
      label: string;
      state?: string;
      district?: string;
      village?: string;
      pincode?: string;
    } | null>(() => {
      if (
        typeof initialRegisterData?.latitude === 'number' &&
        Number.isFinite(initialRegisterData.latitude) &&
        typeof initialRegisterData?.longitude === 'number' &&
        Number.isFinite(initialRegisterData.longitude)
      ) {
        return {
          latitude: initialRegisterData.latitude,
          longitude: initialRegisterData.longitude,
          label: formatLocationLabel({
            village: initialRegisterData.village,
            district: initialRegisterData.district,
            state: initialRegisterData.state,
            country: initialRegisterData.country,
            latitude: initialRegisterData.latitude,
            longitude: initialRegisterData.longitude,
          }),
          state: initialRegisterData.state,
          district: initialRegisterData.district,
          village: initialRegisterData.village,
          pincode: initialRegisterData.pincode,
        };
      }
      return null;
    });
    const [locatingAddress, setLocatingAddress] = useState(false);
    const [locationFeedback, setLocationFeedback] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    const nameInputRef = useRef<HTMLInputElement | null>(null);
    const selectedPhoneCountry = useMemo(
      () => findCountryByIso(phoneCountryIso),
      [phoneCountryIso]
    );
    const isIndiaSelected = selectedPhoneCountry.iso === 'IN';

    useEffect(() => {
      if (initialPhone) {
        const nextIso = initialPhone.trim().startsWith('+')
          ? findCountryByDialCode(initialPhone, initialCountryIso).iso
          : initialCountryIso || DEFAULT_COUNTRY_ISO;
        setPhoneCountryIso(nextIso);
        setMobileDigits(extractNationalDigits(initialPhone, nextIso));
      } else if (initialCountryIso) {
        setPhoneCountryIso(initialCountryIso);
      }
    }, [initialPhone, initialCountryIso]);

    useEffect(() => {
      const timer = setTimeout(() => nameInputRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    }, []);

    const activeError = localError || serverError;

    const clearErr = useCallback(() => {
      if (localError) setLocalError(null);
      if (serverError) dispatch(clearAuthMessages());
    }, [dispatch, localError, serverError]);

    const handlePhoneCountryChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextIso = e.target.value;
        const nextCountryObj = findCountryByIso(nextIso);
        setPhoneCountryIso(nextIso);
        setMobileDigits((prev) => prev.slice(0, nextCountryObj.maxDigits));
        if (nextCountryObj.iso !== 'IN' && stateName === 'Telangana') {
          setStateName('');
        } else if (nextCountryObj.iso === 'IN' && !stateName) {
          setStateName('Telangana');
        }
        clearErr();
      },
      [clearErr, stateName]
    );

    const handleRegMobileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        let cleaned = raw.replace(/\D/g, '');
        let activeCountry = selectedPhoneCountry;

        if (raw.trim().startsWith('+') && cleaned.length > 0) {
          const matched = findCountryByDialCode(`+${cleaned}`, phoneCountryIso);
          const dialDigits = matched.dialCode.slice(1);
          if (cleaned.startsWith(dialDigits)) {
            cleaned = cleaned.slice(dialDigits.length);
            activeCountry = matched;
            if (matched.iso !== phoneCountryIso) {
              setPhoneCountryIso(matched.iso);
            }
          }
        } else if (
          cleaned.length > selectedPhoneCountry.maxDigits &&
          cleaned.startsWith(selectedPhoneCountry.dialCode.slice(1))
        ) {
          cleaned = cleaned.slice(selectedPhoneCountry.dialCode.slice(1).length);
        }

        setMobileDigits(cleaned.slice(0, activeCountry.maxDigits));
        clearErr();
      },
      [clearErr, phoneCountryIso, selectedPhoneCountry]
    );

    const handleCropChange = useCallback(
      (nextCropId: number) => {
        setCropId(nextCropId);
        clearErr();
      },
      [clearErr]
    );

    const handleUseCurrentAddress = useCallback(async () => {
      if (locatingAddress || registering) return;
      clearErr();
      setLocationFeedback(null);
      setLocatingAddress(true);

      try {
        const detected = await detectCurrentAddress();
        if (detected.state) setStateName(detected.state);
        if (detected.district) setDistrict(detected.district);
        if (detected.village) setVillage(detected.village);
        let normalizedPin = '';
        if (detected.pincode) {
          normalizedPin = isIndiaSelected
            ? detected.pincode.replace(/\D/g, '').slice(0, 6)
            : detected.pincode.slice(0, 10);
          if (normalizedPin) setPincode(normalizedPin);
        }

        const resolvedLabel =
          detected.label ||
          formatLocationLabel({
            village: detected.village,
            district: detected.district,
            state: detected.state,
            country: detected.country,
            latitude: detected.latitude,
            longitude: detected.longitude,
          });

        setCapturedCoords({
          latitude: detected.latitude,
          longitude: detected.longitude,
          label: resolvedLabel,
          state: detected.state || undefined,
          district: detected.district || undefined,
          village: detected.village || undefined,
          pincode: normalizedPin || undefined,
        });

        // Immediately persist and fetch weather telemetry for captured GPS coords
        dispatch(
          setWeatherLocation({
            latitude: detected.latitude,
            longitude: detected.longitude,
            label: resolvedLabel,
            state: detected.state || undefined,
            district: detected.district || undefined,
            village: detected.village || undefined,
            pincode: normalizedPin || undefined,
            source: 'gps',
          })
        );

        setLocationFeedback(t('auth.addressDetected'));
      } catch (err) {
        const message =
          err instanceof Error && err.message
            ? err.message
            : 'Unable to detect your current location.';
        setLocalError(message);
      } finally {
        setLocatingAddress(false);
      }
    }, [clearErr, dispatch, isIndiaSelected, locatingAddress, registering, t]);

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        const cleanDigits = mobileDigits.replace(/\D/g, '');
        if (!isValidNationalMobile(cleanDigits, phoneCountryIso)) {
          setLocalError(
            selectedPhoneCountry.minDigits === selectedPhoneCountry.maxDigits
              ? `Please enter a valid ${selectedPhoneCountry.minDigits}-digit mobile number for ${selectedPhoneCountry.name}.`
              : `Please enter a valid ${selectedPhoneCountry.minDigits}-${selectedPhoneCountry.maxDigits} digit mobile number for ${selectedPhoneCountry.name}.`
          );
          return;
        }
        if (!fullName.trim()) {
          setLocalError('Please enter your full name.');
          return;
        }

        const hasGpsCoords = Boolean(capturedCoords);
        let finalState = stateName.trim();
        let finalDistrict = district.trim();
        let finalVillage = village.trim();
        const trimmedPin = pincode.trim();
        let finalPin = trimmedPin;

        if (hasGpsCoords && capturedCoords) {
          finalState =
            finalState ||
            capturedCoords.state ||
            (isIndiaSelected ? 'Telangana' : 'Current Region');
          finalDistrict =
            finalDistrict ||
            capturedCoords.district ||
            finalVillage ||
            'Current Location';
          finalVillage =
            finalVillage ||
            capturedCoords.village ||
            finalDistrict ||
            capturedCoords.label;

          if (trimmedPin) {
            if (isIndiaSelected) {
              const cleanPin = trimmedPin.replace(/\D/g, '');
              if (cleanPin.length !== 6) {
                setLocalError('Please enter a valid 6-digit Indian pincode.');
                return;
              }
              finalPin = cleanPin;
            } else if (!/^[A-Za-z0-9\s-]{3,10}$/.test(trimmedPin)) {
              setLocalError('Please enter a valid postal code (3-10 characters).');
              return;
            }
          } else {
            finalPin = capturedCoords.pincode || (isIndiaSelected ? '500001' : '00000');
          }
        } else {
          if (!finalState || !finalDistrict || !finalVillage) {
            setLocalError(
              'Please enter your state, district, and village, or tap "Use my current location".'
            );
            return;
          }
          if (isIndiaSelected) {
            const cleanPin = trimmedPin.replace(/\D/g, '');
            if (cleanPin.length !== 6) {
              setLocalError('Please enter a valid 6-digit Indian pincode.');
              return;
            }
            finalPin = cleanPin;
          } else if (!/^[A-Za-z0-9\s-]{3,10}$/.test(trimmedPin)) {
            setLocalError('Please enter a valid postal code (3-10 characters).');
            return;
          }
        }

        setLocalError(null);
        const fullPhone = normalizeFullPhone(cleanDigits, phoneCountryIso);
        dispatch(
          registerUser({
            mobile: fullPhone,
            full_name: fullName.trim(),
            crop_id: Number(cropId) || 1,
            country: selectedPhoneCountry.name || 'India',
            district: finalDistrict,
            state: finalState,
            pincode: finalPin,
            village: finalVillage,
            ...(capturedCoords
              ? {
                  latitude: capturedCoords.latitude,
                  longitude: capturedCoords.longitude,
                }
              : {}),
          })
        );
      },
      [
        capturedCoords,
        cropId,
        dispatch,
        district,
        fullName,
        isIndiaSelected,
        mobileDigits,
        phoneCountryIso,
        pincode,
        selectedPhoneCountry,
        stateName,
        village,
      ]
    );

    return (
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {statusMessage && !activeError && (
          <div
            key="reg-status"
            className="flex items-start gap-2.5 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5"
          >
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
            <span key={statusMessage}>{statusMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Mobile Number with Country Code Selector */}
          <div className="sm:col-span-2">
            <label htmlFor="reg-mobile" className="block text-xs font-bold text-[#1A2821] mb-1">
              <span>{t('auth.mobileLabel')}</span>
            </label>
            <div className="flex items-center rounded-xl border border-[#d5e7db] bg-[#F8FAF7] focus-within:border-[#113E2E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#113E2E]/15 transition overflow-hidden">
              <select
                id="reg-mobile-country-code"
                aria-label="Registration country code"
                value={phoneCountryIso}
                onChange={handlePhoneCountryChange}
                className="pl-2.5 pr-1.5 py-2.5 text-xs font-bold text-[#113E2E] border-r border-[#d5e7db] bg-[#F0F7F2] focus:outline-none cursor-pointer shrink-0 tabular-nums notranslate"
                translate="no"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.iso} value={c.iso}>
                    {`${c.iso} (${c.dialCode})`}
                  </option>
                ))}
              </select>
              <input
                id="reg-mobile"
                type="tel"
                inputMode="numeric"
                maxLength={selectedPhoneCountry.maxDigits + 4}
                value={mobileDigits}
                onChange={handleRegMobileChange}
                placeholder={isIndiaSelected ? '9553737309' : 'Mobile number'}
                className="w-full px-3 py-2.5 bg-transparent text-xs sm:text-sm font-semibold text-[#1A2821] placeholder:text-slate-400 focus:outline-none tabular-nums"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="reg-fullname" className="block text-xs font-bold text-[#1A2821] mb-1">
              <span>{t('auth.fullNameLabel')}</span>
            </label>
            <input
              ref={nameInputRef}
              id="reg-fullname"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                clearErr();
              }}
              placeholder={t('auth.fullNamePlaceholder')}
              className="w-full px-3 py-2.5 rounded-xl border border-[#d5e7db] bg-[#F8FAF7] focus:bg-white focus:border-[#113E2E] focus:ring-2 focus:ring-[#113E2E]/15 focus:outline-none text-xs sm:text-sm font-medium text-[#1A2821]"
            />
          </div>

          {/* Primary Crop (Dynamic API via Redux) */}
          <PrimaryCropSelect
            value={cropId}
            disabled={registering}
            onChange={handleCropChange}
            label={t('auth.cropLabel')}
            loadingText={t('auth.loadingCrops')}
          />

          {/* Use Current Address CTA before Farm Address Fields */}
          <div className="sm:col-span-2 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#1A2821]">
                <span>{t('auth.farmAddressLabel')}</span>
              </span>
              <button
                type="button"
                onClick={handleUseCurrentAddress}
                disabled={locatingAddress || registering}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F0F7F2] hover:bg-[#e1efe6] border border-[#cbe1d2] text-xs font-bold text-[#113E2E] transition disabled:opacity-60 cursor-pointer"
              >
                {locatingAddress ? (
                  <span key="locating" className="inline-flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#175638]" />
                    <span>{t('auth.detectingAddress')}</span>
                  </span>
                ) : (
                  <span key="locate-idle" className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#175638]" />
                    <span>{t('auth.useCurrentAddress')}</span>
                  </span>
                )}
              </button>
            </div>
            {(locationFeedback || capturedCoords) && !activeError && (
              <div
                key="gps-captured"
                className="mt-1.5 text-[11px] font-medium text-[#175638] bg-[#F0F7F2] border border-[#cbe1d2] rounded-lg px-2.5 py-1.5 flex flex-wrap items-center justify-between gap-2"
              >
                <span key={locationFeedback || 'captured'}>
                  {locationFeedback || t('auth.addressDetected')}
                </span>
                {capturedCoords && (
                  <span
                    className="font-mono text-[10px] font-bold text-[#113E2E] tabular-nums notranslate"
                    translate="no"
                  >
                    {formatCoords(capturedCoords.latitude, capturedCoords.longitude)}
                  </span>
                )}
              </div>
            )}
            <p className="mt-1 text-[11px] text-slate-500">
              <span>Enter address fields below or use current location only to set weather coordinates.</span>
            </p>
          </div>

          {/* State */}
          <div>
            <label htmlFor="reg-state" className="block text-xs font-bold text-[#1A2821] mb-1">
              <span>{t('auth.stateLabel')}</span>
            </label>
            <input
              id="reg-state"
              type="text"
              value={stateName}
              onChange={(e) => {
                setStateName(e.target.value);
                clearErr();
              }}
              placeholder={isIndiaSelected ? 'Telangana' : 'State / Province'}
              className="w-full px-3 py-2.5 rounded-xl border border-[#d5e7db] bg-[#F8FAF7] focus:bg-white focus:border-[#113E2E] focus:ring-2 focus:ring-[#113E2E]/15 focus:outline-none text-xs sm:text-sm font-medium text-[#1A2821]"
            />
          </div>

          {/* District */}
          <div>
            <label htmlFor="reg-district" className="block text-xs font-bold text-[#1A2821] mb-1">
              <span>{t('auth.districtLabel')}</span>
            </label>
            <input
              id="reg-district"
              type="text"
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                clearErr();
              }}
              placeholder={isIndiaSelected ? 'Hyderabad' : 'District / County'}
              className="w-full px-3 py-2.5 rounded-xl border border-[#d5e7db] bg-[#F8FAF7] focus:bg-white focus:border-[#113E2E] focus:ring-2 focus:ring-[#113E2E]/15 focus:outline-none text-xs sm:text-sm font-medium text-[#1A2821]"
            />
          </div>

          {/* Village */}
          <div>
            <label htmlFor="reg-village" className="block text-xs font-bold text-[#1A2821] mb-1">
              <span>{t('auth.villageLabel')}</span>
            </label>
            <input
              id="reg-village"
              type="text"
              value={village}
              onChange={(e) => {
                setVillage(e.target.value);
                clearErr();
              }}
              placeholder={isIndiaSelected ? 'Madhapur' : 'City / Village'}
              className="w-full px-3 py-2.5 rounded-xl border border-[#d5e7db] bg-[#F8FAF7] focus:bg-white focus:border-[#113E2E] focus:ring-2 focus:ring-[#113E2E]/15 focus:outline-none text-xs sm:text-sm font-medium text-[#1A2821]"
            />
          </div>

          {/* Pincode / Postal Code */}
          <div>
            <label htmlFor="reg-pincode" className="block text-xs font-bold text-[#1A2821] mb-1">
              <span>{t('auth.pincodeLabel')}</span>
            </label>
            <input
              id="reg-pincode"
              type="text"
              inputMode={isIndiaSelected ? 'numeric' : 'text'}
              maxLength={isIndiaSelected ? 6 : 10}
              value={pincode}
              onChange={(e) => {
                const val = isIndiaSelected
                  ? e.target.value.replace(/\D/g, '').slice(0, 6)
                  : e.target.value.slice(0, 10);
                setPincode(val);
                clearErr();
              }}
              placeholder={isIndiaSelected ? '500081' : 'Postal code'}
              className="w-full px-3 py-2.5 rounded-xl border border-[#d5e7db] bg-[#F8FAF7] focus:bg-white focus:border-[#113E2E] focus:ring-2 focus:ring-[#113E2E]/15 focus:outline-none text-xs sm:text-sm font-medium text-[#1A2821] tabular-nums"
            />
          </div>
        </div>

        {activeError && (
          <p
            key="reg-error"
            role="alert"
            className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
          >
            <span key={activeError}>{activeError}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={registering}
          className="w-full py-3 px-5 rounded-xl bg-[#113E2E] hover:bg-[#0a291f] disabled:opacity-60 text-white text-sm font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {registering ? (
            <span key="registering" className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('auth.registering')}</span>
            </span>
          ) : (
            <span key="register-idle" className="inline-flex items-center gap-2">
              <span>{t('auth.createAccountAndSendOtp')}</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </button>

        <div className="pt-2 border-t border-[#e9efe7] text-center">
          <button
            type="button"
            onClick={() => {
              const digits = mobileDigits.replace(/\D/g, '');
              onBackToMobile(
                digits ? normalizeFullPhone(digits, phoneCountryIso) : '',
                phoneCountryIso
              );
            }}
            className="text-xs font-bold text-[#175638] hover:text-[#113E2E] hover:underline cursor-pointer"
          >
            <span>{t('auth.alreadyHaveAccount')}</span>
          </button>
        </div>
      </form>
    );
  }
);

interface OtpStepProps {
  pendingPhone: string;
  pendingCountryIso: string;
  otpOrigin: OtpOrigin;
  pendingRegisterData: RegisterRequestPayload | null;
  sendingOtp: boolean;
  registering: boolean;
  verifyingOtp: boolean;
  serverError: string | null;
  statusMessage: string | null;
}

const OtpStepForm = memo<OtpStepProps>(
  ({
    pendingPhone,
    pendingCountryIso,
    otpOrigin,
    pendingRegisterData,
    sendingOtp,
    registering,
    verifyingOtp,
    serverError,
    statusMessage,
  }) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
    const [localError, setLocalError] = useState<string | null>(null);
    const [resendSeconds, setResendSeconds] = useState(30);
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
      setOtpDigits(['', '', '', '', '', '']);
      setResendSeconds(30);
      setLocalError(null);
      const timer = setTimeout(() => otpInputRefs.current[0]?.focus(), 60);
      return () => clearTimeout(timer);
    }, [pendingPhone]);

    // Timer stays isolated inside OtpStepForm so parent modal/app never re-render per second
    useEffect(() => {
      if (resendSeconds <= 0) return;
      const timer = setInterval(() => {
        setResendSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }, [resendSeconds]);

    const activeError = localError || serverError;

    const handleOtpDigitChange = useCallback(
      (index: number, rawVal: string) => {
        const clean = rawVal.replace(/\D/g, '');
        if (localError) setLocalError(null);
        if (serverError) dispatch(clearAuthMessages());

        if (!clean) {
          setOtpDigits((prev) => {
            const next = [...prev];
            next[index] = '';
            return next;
          });
          return;
        }

        if (clean.length === 2 && otpDigits[index].length === 1) {
          const replacement = clean[0] === otpDigits[index] ? clean[1] : clean[0];
          setOtpDigits((prev) => {
            const next = [...prev];
            next[index] = replacement;
            return next;
          });
          if (index < 5) {
            otpInputRefs.current[index + 1]?.focus();
          }
          return;
        }

        if (clean.length > 1) {
          const chars = clean.slice(0, 6).split('');
          setOtpDigits((prev) => {
            if (clean.length >= 6 || index === 0) {
              const next = ['', '', '', '', '', ''];
              chars.forEach((ch, idx) => {
                next[idx] = ch;
              });
              return next;
            }
            const next = [...prev];
            chars.forEach((ch, offset) => {
              if (index + offset < 6) {
                next[index + offset] = ch;
              }
            });
            return next;
          });
          const focusIndex =
            clean.length >= 6 || index === 0
              ? Math.min(chars.length, 5)
              : Math.min(index + chars.length, 5);
          otpInputRefs.current[focusIndex]?.focus();
          return;
        }

        setOtpDigits((prev) => {
          const next = [...prev];
          next[index] = clean;
          return next;
        });
        if (index < 5) {
          otpInputRefs.current[index + 1]?.focus();
        }
      },
      [dispatch, localError, otpDigits, serverError]
    );

    const handleOtpKeyDown = useCallback(
      (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
          if (localError) setLocalError(null);
          if (serverError) dispatch(clearAuthMessages());
          setOtpDigits((prev) => {
            const next = [...prev];
            next[index - 1] = '';
            return next;
          });
          otpInputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
          otpInputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
          otpInputRefs.current[index + 1]?.focus();
        }
      },
      [dispatch, localError, otpDigits, serverError]
    );

    const handleOtpPaste = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        e.preventDefault();
        if (localError) setLocalError(null);
        if (serverError) dispatch(clearAuthMessages());
        const next = ['', '', '', '', '', ''];
        pasted.split('').forEach((ch, idx) => {
          next[idx] = ch;
        });
        setOtpDigits(next);
        otpInputRefs.current[Math.min(pasted.length, 5)]?.focus();
      },
      [dispatch, localError, serverError]
    );

    const handleVerify = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        const code = otpDigits.join('');
        if (code.length !== 6) {
          setLocalError('Please enter all 6 digits of your OTP.');
          return;
        }
        setLocalError(null);
        dispatch(verifyOtp({ mobile: pendingPhone, otp: code }));
      },
      [dispatch, otpDigits, pendingPhone]
    );

    const handleResend = useCallback(async () => {
      if (resendSeconds > 0 || sendingOtp || registering || !pendingPhone) return;
      setLocalError(null);
      setOtpDigits(['', '', '', '', '', '']);

      if (otpOrigin === 'register' && pendingRegisterData) {
        const result = await dispatch(registerUser(pendingRegisterData));
        if (registerUser.fulfilled.match(result)) {
          setResendSeconds(30);
          setTimeout(() => otpInputRefs.current[0]?.focus(), 50);
        }
      } else {
        const result = await dispatch(
          sendOtp({ mobile: pendingPhone, countryIso: pendingCountryIso, force: true })
        );
        if (sendOtp.fulfilled.match(result)) {
          setResendSeconds(30);
          setTimeout(() => otpInputRefs.current[0]?.focus(), 50);
        }
      }
    }, [
      dispatch,
      otpOrigin,
      pendingCountryIso,
      pendingPhone,
      pendingRegisterData,
      registering,
      resendSeconds,
      sendingOtp,
    ]);

    const resending = sendingOtp || registering;

    return (
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() =>
              dispatch(
                setAuthStep({
                  step: otpOrigin === 'register' ? 'register' : 'mobile',
                  mobile: pendingPhone,
                  countryIso: pendingCountryIso,
                })
              )
            }
            className="inline-flex items-center gap-1 font-bold text-[#113E2E] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('auth.changeNumber')}</span>
          </button>
          <span
            className="font-semibold text-slate-500 tabular-nums notranslate"
            translate="no"
          >
            {formatPhoneForDisplay(pendingPhone, pendingCountryIso)}
          </span>
        </div>

        {statusMessage && !activeError && (
          <div
            key="otp-status"
            className="flex items-start gap-2 text-xs font-medium text-[#113E2E] bg-[#F0F7F2] border border-[#cbe1d2] rounded-xl px-3.5 py-2.5"
          >
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#175638]" />
            <span key={statusMessage}>{statusMessage}</span>
          </div>
        )}

        {/* 6-digit OTP Boxes */}
        <div className="grid grid-cols-6 gap-2 sm:gap-2.5 notranslate" translate="no">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                otpInputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={6}
              value={digit}
              onChange={(e) => handleOtpDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              onPaste={handleOtpPaste}
              aria-label={`OTP digit ${index + 1}`}
              className="w-full h-12 sm:h-13 text-center text-lg font-bold text-[#113E2E] bg-[#F8FAF7] border border-[#d5e7db] rounded-xl focus:bg-white focus:border-[#113E2E] focus:ring-2 focus:ring-[#113E2E]/15 focus:outline-none transition tabular-nums"
            />
          ))}
        </div>

        {activeError && (
          <p
            key="otp-error"
            role="alert"
            className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
          >
            <span key={activeError}>{activeError}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={verifyingOtp || otpDigits.join('').length !== 6}
          className="w-full py-3 px-5 rounded-xl bg-[#113E2E] hover:bg-[#0a291f] disabled:opacity-60 text-white text-sm font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {verifyingOtp ? (
            <span key="verifying" className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('auth.verifyingOtp')}</span>
            </span>
          ) : (
            <span key="verify-idle" className="inline-flex items-center gap-2">
              <span>{t('auth.verifyAndLogin')}</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </button>

        <div className="flex items-center justify-center pt-1 text-xs text-slate-500">
          {resendSeconds > 0 ? (
            <span key="countdown" className="tabular-nums inline-flex items-center gap-1">
              <span>{t('auth.resendIn')}</span>
              <strong className="text-[#113E2E] notranslate" translate="no">
                {resendSeconds}s
              </strong>
            </span>
          ) : (
            <button
              key="resend-btn"
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-bold text-[#113E2E] hover:underline cursor-pointer"
            >
              {resending ? (
                <span key="resending">{t('auth.sendingOtp')}</span>
              ) : (
                <span key="resend-label">{t('auth.resendOtp')}</span>
              )}
            </button>
          )}
        </div>
      </form>
    );
  }
);

export const AuthModal: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const {
    isAuthModalOpen,
    authStep,
    otpOrigin,
    pendingPhone,
    pendingCountryIso,
    pendingRegisterData,
    sendingOtp,
    registering,
    verifyingOtp,
    statusMessage,
    error,
  } = useAppSelector(selectAuthModalUi);

  useEffect(() => {
    if (!isAuthModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(closeAuthModal());
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAuthModalOpen, dispatch]);

  const handleClose = useCallback(() => dispatch(closeAuthModal()), [dispatch]);
  const handleSwitchToRegister = useCallback(
    (fullPhone: string, countryIso: string) =>
      dispatch(setAuthStep({ step: 'register', mobile: fullPhone, countryIso })),
    [dispatch]
  );
  const handleBackToMobile = useCallback(
    (fullPhone: string, countryIso: string) =>
      dispatch(setAuthStep({ step: 'mobile', mobile: fullPhone, countryIso })),
    [dispatch]
  );

  if (!isAuthModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#d5e7db] transition-all ${
          authStep === 'register' ? 'max-w-lg' : 'max-w-md'
        }`}
      >
        {/* Top Header */}
        <div className="bg-[#113E2E] text-white px-6 py-5 flex items-start justify-between gap-4 shrink-0">
          <div key={`header-${authStep}`} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
              {authStep === 'mobile' && <Phone className="w-5 h-5 text-[#E5B54F]" />}
              {authStep === 'register' && <UserPlus className="w-5 h-5 text-[#E5B54F]" />}
              {authStep === 'otp' && <ShieldCheck className="w-5 h-5 text-[#E5B54F]" />}
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-lg font-bold font-serif leading-tight">
                {authStep === 'mobile' && <span>{t('auth.loginTitle')}</span>}
                {authStep === 'register' && <span>{t('auth.registerTitle')}</span>}
                {authStep === 'otp' && <span>{t('auth.verifyTitle')}</span>}
              </h2>
              <p className="text-xs text-emerald-200/90 mt-0.5 leading-snug">
                {authStep === 'mobile' && <span>{t('auth.loginSubtitle')}</span>}
                {authStep === 'register' && <span>{t('auth.registerSubtitle')}</span>}
                {authStep === 'otp' && (
                  <span className="inline-flex flex-wrap items-center gap-1">
                    <span>{t('auth.otpSentTo')}</span>
                    <span className="notranslate tabular-nums" translate="no">
                      {formatPhoneForDisplay(pendingPhone, pendingCountryIso)}
                    </span>
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition"
            aria-label="Close sign in dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div key={`body-${authStep}`} className="p-6 overflow-y-auto">
          {authStep === 'mobile' && (
            <MobileStepForm
              initialPhone={pendingPhone}
              initialCountryIso={pendingCountryIso}
              sendingOtp={sendingOtp}
              serverError={error}
              statusMessage={statusMessage}
              onSwitchToRegister={handleSwitchToRegister}
            />
          )}

          {authStep === 'register' && (
            <RegisterStepForm
              initialPhone={pendingPhone}
              initialCountryIso={pendingCountryIso}
              initialRegisterData={pendingRegisterData}
              registering={registering}
              serverError={error}
              statusMessage={statusMessage}
              onBackToMobile={handleBackToMobile}
            />
          )}

          {authStep === 'otp' && (
            <OtpStepForm
              pendingPhone={pendingPhone}
              pendingCountryIso={pendingCountryIso}
              otpOrigin={otpOrigin}
              pendingRegisterData={pendingRegisterData}
              sendingOtp={sendingOtp}
              registering={registering}
              verifyingOtp={verifyingOtp}
              serverError={error}
              statusMessage={statusMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
});
