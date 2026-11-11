/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActiveTab } from '../../types';

export interface UiState {
  activeTab: ActiveTab;
  mobileMenuOpen: boolean;
  isAiChatOpen: boolean;
  isScanModalOpen: boolean;
  isCustomTaskModalOpen: boolean;
  isReportModalOpen: boolean;
}

const initialState: UiState = {
  activeTab: 'overview',
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
      state.activeTab = action.payload;
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
