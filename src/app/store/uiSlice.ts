/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveTab } from '../../shared/types';

export const ACTIVE_TAB_STORAGE_KEY = 'kd_active_tab';

const VALID_TABS = new Set<string>([
  'overview',
  'my-crops',
  'crops',
  'crop-calendar',
  'calendar',
  'diseases-library',
  'diseases',
  'market-prices',
  'market',
  'crop-doctor',
  'doctor',
  'weather',
  'notifications',
  'landing',
]);

const TAB_ALIASES: Record<string, ActiveTab> = {
  crops: 'my-crops',
  calendar: 'crop-calendar',
  diseases: 'diseases-library',
  market: 'market-prices',
  doctor: 'crop-doctor',
};

export function normalizeActiveTab(raw?: string | null): ActiveTab | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/^#\/?/, '').replace(/^\/+/, '').toLowerCase();
  if (!cleaned || !VALID_TABS.has(cleaned)) return null;
  return TAB_ALIASES[cleaned] || (cleaned as ActiveTab);
}

export function readTabFromUrl(): ActiveTab | null {
  if (typeof window === 'undefined') return null;
  const fromHash = normalizeActiveTab(window.location.hash);
  if (fromHash) return fromHash;
  const fromPath = normalizeActiveTab(window.location.pathname);
  if (fromPath) return fromPath;
  return null;
}

export function persistActiveTab(tab: ActiveTab): void {
  const normalized = normalizeActiveTab(tab) || 'overview';
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(ACTIVE_TAB_STORAGE_KEY, normalized);
  } catch {
    // Ignore storage quota or private browsing errors
  }
  try {
    localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, normalized);
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

function getInitialActiveTab(): ActiveTab {
  const fromUrl = readTabFromUrl();
  if (fromUrl) {
    persistActiveTab(fromUrl);
    return fromUrl;
  }

  if (typeof window !== 'undefined') {
    try {
      const fromSession = normalizeActiveTab(sessionStorage.getItem(ACTIVE_TAB_STORAGE_KEY));
      if (fromSession) return fromSession;
    } catch {
      // Ignore storage access errors
    }
    try {
      const fromLocal = normalizeActiveTab(localStorage.getItem(ACTIVE_TAB_STORAGE_KEY));
      if (fromLocal) return fromLocal;
    } catch {
      // Ignore storage access errors
    }
  }

  return 'overview';
}

export interface UiState {
  activeTab: ActiveTab;
  mobileMenuOpen: boolean;
  isAiChatOpen: boolean;
  isScanModalOpen: boolean;
  isCustomTaskModalOpen: boolean;
  isReportModalOpen: boolean;
}

const initialState: UiState = {
  activeTab: getInitialActiveTab(),
  mobileMenuOpen: false,
  isAiChatOpen: false,
  isScanModalOpen: false,
  isCustomTaskModalOpen: false,
  isReportModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<ActiveTab>) {
      const nextTab = normalizeActiveTab(action.payload) || 'overview';
      state.activeTab = nextTab;
      persistActiveTab(nextTab);
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    },
    setAiChatOpen(state, action: PayloadAction<boolean>) {
      state.isAiChatOpen = action.payload;
    },
    setScanModalOpen(state, action: PayloadAction<boolean>) {
      state.isScanModalOpen = action.payload;
    },
    setCustomTaskModalOpen(state, action: PayloadAction<boolean>) {
      state.isCustomTaskModalOpen = action.payload;
    },
    setReportModalOpen(state, action: PayloadAction<boolean>) {
      state.isReportModalOpen = action.payload;
    },
  },
});

export const {
  setActiveTab,
  setMobileMenuOpen,
  setAiChatOpen,
  setScanModalOpen,
  setCustomTaskModalOpen,
  setReportModalOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
