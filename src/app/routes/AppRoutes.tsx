/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useCallback, useEffect, useRef } from 'react';
import { ActiveTab } from '../../shared/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  normalizeActiveTab,
  persistActiveTab,
  readTabFromUrl,
  setActiveTab,
  setAiChatOpen,
  setCustomTaskModalOpen,
  setReportModalOpen,
  setScanModalOpen,
} from '../store/uiSlice';

import { OverviewView } from '../../features/overview';
import { MyCropsView, CropCalendarView } from '../../features/crops';
import { DiseasesLibraryView } from '../../features/diseases';
import { MarketPricesView } from '../../features/market';
import { CropDoctorView } from '../../features/crop-doctor';
import { WeatherView } from '../../features/weather';
import { NotificationsView } from '../../features/notifications';
import { LandingPageView } from '../../features/landing';

export const AppRoutes: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);

  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  // Sync URL hash and storage whenever activeTab updates
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const targetTab = normalizeActiveTab(activeTab) || 'overview';
    const expectedHash = `#/${targetTab}`;
    const currentHashTab = normalizeActiveTab(window.location.hash);

    if (!window.location.hash) {
      window.history.replaceState(null, '', expectedHash);
    } else if (currentHashTab !== targetTab) {
      window.history.pushState(null, '', expectedHash);
    }
    persistActiveTab(targetTab);
  }, [activeTab]);

  // Listen for browser Back/Forward and manual URL hash edits
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncFromUrl = () => {
      const nextTab = readTabFromUrl();
      if (nextTab && nextTab !== activeTabRef.current) {
        dispatch(setActiveTab(nextTab));
      }
    };
    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('hashchange', syncFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('hashchange', syncFromUrl);
    };
  }, [dispatch]);

  const handleNavigateTab = useCallback(
    (tab: ActiveTab) => dispatch(setActiveTab(tab)),
    [dispatch]
  );
  const handleEnterWorkspace = useCallback(
    (tab?: ActiveTab) => dispatch(setActiveTab(tab || 'overview')),
    [dispatch]
  );
  const handleOpenDostAi = useCallback(() => dispatch(setAiChatOpen(true)), [dispatch]);
  const handleOpenScanCrop = useCallback(() => dispatch(setScanModalOpen(true)), [dispatch]);
  const handleOpenReportOutbreak = useCallback(
    () => dispatch(setReportModalOpen(true)),
    [dispatch]
  );
  const handleOpenCustomTask = useCallback(
    () => dispatch(setCustomTaskModalOpen(true)),
    [dispatch]
  );

  switch (activeTab) {
    case 'overview':
      return (
        <OverviewView
          onNavigateTab={handleNavigateTab}
          onOpenDostAi={handleOpenDostAi}
          onOpenScanCrop={handleOpenScanCrop}
          onOpenReportOutbreak={handleOpenReportOutbreak}
        />
      );

    case 'my-crops':
    case 'crops':
      return (
        <MyCropsView
          onNavigateTab={handleNavigateTab}
          onOpenDostAi={handleOpenDostAi}
          onOpenScanCrop={handleOpenScanCrop}
        />
      );

    case 'crop-calendar':
    case 'calendar':
      return (
        <CropCalendarView
          onOpenCustomTaskModal={handleOpenCustomTask}
          onOpenDostAi={handleOpenDostAi}
        />
      );

    case 'diseases-library':
    case 'diseases':
      return (
        <DiseasesLibraryView
          onOpenScanModal={handleOpenScanCrop}
          onOpenReportModal={handleOpenReportOutbreak}
          onOpenDostAi={handleOpenDostAi}
        />
      );

    case 'market-prices':
    case 'market':
      return <MarketPricesView onOpenDostAi={handleOpenDostAi} />;

    case 'crop-doctor':
    case 'doctor':
      return (
        <CropDoctorView
          onOpenScanModal={handleOpenScanCrop}
          onOpenDostAi={handleOpenDostAi}
          onNavigateTab={handleNavigateTab}
        />
      );

    case 'weather':
      return (
        <WeatherView
          onOpenDostAi={handleOpenDostAi}
          onNavigateTab={handleNavigateTab}
        />
      );

    case 'notifications':
      return (
        <NotificationsView
          onNavigateTab={handleNavigateTab}
          onOpenReportModal={handleOpenReportOutbreak}
          onOpenScanModal={handleOpenScanCrop}
        />
      );

    case 'landing':
      return (
        <LandingPageView
          onEnterWorkspace={handleEnterWorkspace}
          onOpenDostAi={handleOpenDostAi}
        />
      );

    default:
      return (
        <OverviewView
          onNavigateTab={handleNavigateTab}
          onOpenDostAi={handleOpenDostAi}
          onOpenScanCrop={handleOpenScanCrop}
          onOpenReportOutbreak={handleOpenReportOutbreak}
        />
      );
  }
});
