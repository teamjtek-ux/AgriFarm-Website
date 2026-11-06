/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { Language, LanguageOption } from '../types';
import { getTranslation, ALL_LANGUAGES, findLanguage } from '../i18n';

interface LanguageContextType {
  language: Language;
  currentLanguage: LanguageOption;
  setLanguage: (langCode: string) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  allLanguages: LanguageOption[];
  regionalLanguages: LanguageOption[];
  globalLanguages: LanguageOption[];
  popularLanguages: LanguageOption[];
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'kd_language_pref';

/**
 * Programmatically triggers Google Translate engine in the DOM
 * without page reload.
 */
function applyDomTranslation(targetCode: string): boolean {
  const code = targetCode.toLowerCase();
  const domain = window.location.hostname;

  // 1. Set Google Translate cookies
  const cookieValue = code === 'en' ? '' : `/en/${code}`;
  const expireDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();

  if (code === 'en') {
    // Delete cookies to restore English
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    const parts = domain.split('.');
    if (parts.length > 2) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${parts.slice(1).join('.')};`;
    }
  } else {
    document.cookie = `googtrans=${cookieValue}; expires=${expireDate}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; expires=${expireDate}; path=/; domain=${domain};`;
    const parts = domain.split('.');
    if (parts.length > 2) {
      document.cookie = `googtrans=${cookieValue}; expires=${expireDate}; path=/; domain=.${parts.slice(1).join('.')};`;
    }
  }

  // 2. Select in the hidden Google Translate dropdown if available
  const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (combo) {
    combo.value = code;
    combo.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  return false;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return stored.toLowerCase();
      }
    } catch {
      // LocalStorage error fallback
    }
    // Default to Telugu for local Indian farmers or English
    return 'te';
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const currentLanguage = useMemo(() => findLanguage(language), [language]);

  const regionalLanguages = useMemo(
    () => ALL_LANGUAGES.filter((l) => l.category === 'regional_india'),
    []
  );

  const globalLanguages = useMemo(
    () => ALL_LANGUAGES.filter((l) => l.category === 'global'),
    []
  );

  const popularLanguages = useMemo(
    () => ALL_LANGUAGES.filter((l) => l.popular),
    []
  );

  const setLanguage = useCallback((newLangCode: string) => {
    const code = newLangCode.toLowerCase();
    setLanguageState(code);
    setIsTranslating(true);

    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Ignore storage errors
    }

    // Apply translation to DOM
    const applied = applyDomTranslation(code);
    if (!applied) {
      // If the google translate dropdown wasn't loaded yet, retry shortly
      const timer = setInterval(() => {
        if (applyDomTranslation(code)) {
          clearInterval(timer);
        }
      }, 300);
      setTimeout(() => clearInterval(timer), 3000);
    }

    setTimeout(() => {
      setIsTranslating(false);
    }, 600);
  }, []);

  // Initialize translation engine on mount
  useEffect(() => {
    if (language && language !== 'en') {
      const timer = setInterval(() => {
        if (applyDomTranslation(language)) {
          clearInterval(timer);
        }
      }, 400);
      const timeout = setTimeout(() => clearInterval(timer), 4000);
      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    }
  }, [language]);

  const t = useCallback(
    (path: string, params?: Record<string, string | number>) => {
      return getTranslation(language, path, params);
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      currentLanguage,
      setLanguage,
      t,
      allLanguages: ALL_LANGUAGES,
      regionalLanguages,
      globalLanguages,
      popularLanguages,
      isLanguageModalOpen,
      setIsLanguageModalOpen,
      isTranslating,
    }),
    [
      language,
      currentLanguage,
      setLanguage,
      t,
      regionalLanguages,
      globalLanguages,
      popularLanguages,
      isLanguageModalOpen,
      isTranslating,
    ]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export const useTranslation = useLanguage;
