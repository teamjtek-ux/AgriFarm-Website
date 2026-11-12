/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useCallback, useMemo } from 'react';
import { ActiveTab } from '../../shared/types';
import { LanguageSelectorModal, useTranslation } from '../../shared/i18n';
import { NOTIFICATIONS_DATA } from '../../shared/data/mockData';
import { Header } from '../../shared/components/Header';
import { Sidebar } from '../../shared/components/Sidebar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setActiveTab,
  setAiChatOpen,
  setCustomTaskModalOpen,
  setMobileMenuOpen,
  setReportModalOpen,
  setScanModalOpen,
} from '../store/uiSlice';
import { AuthModal, selectIsAuthenticated } from '../../features/auth';
import { LocationModal, WeatherSyncController } from '../../features/weather';
import { DostAiModal } from '../../features/ai-assistant';
import { ScanCropModal } from '../../features/crop-doctor';
import { CustomTaskModal } from '../../features/crops';
import { ReportOutbreakModal } from '../../features/diseases';

interface MainLayoutProps {
  children: React.ReactNode;
}

const GlobalModals = memo(() => {
  const dispatch = useAppDispatch();
  const { language } = useTranslation();
  const isAiChatOpen = useAppSelector((state) => state.ui.isAiChatOpen);
  const isScanModalOpen = useAppSelector((state) => state.ui.isScanModalOpen);
  const isCustomTaskModalOpen = useAppSelector((state) => state.ui.isCustomTaskModalOpen);
  const isReportModalOpen = useAppSelector((state) => state.ui.isReportModalOpen);

  return (
    <>
      <DostAiModal
        isOpen={isAiChatOpen}
        onClose={() => dispatch(setAiChatOpen(false))}
        language={language}
        onOpenScan={() => {
          dispatch(setAiChatOpen(false));
          dispatch(setScanModalOpen(true));
        }}
      />

      <ScanCropModal
        isOpen={isScanModalOpen}
        onClose={() => dispatch(setScanModalOpen(false))}
        onDiagnosed={() => {
          dispatch(setScanModalOpen(false));
          dispatch(setActiveTab('crop-doctor'));
        }}
      />

      <CustomTaskModal
        isOpen={isCustomTaskModalOpen}
        onClose={() => dispatch(setCustomTaskModalOpen(false))}
        onTaskCreated={() => {
          dispatch(setCustomTaskModalOpen(false));
        }}
      />

      <ReportOutbreakModal
        isOpen={isReportModalOpen}
        onClose={() => dispatch(setReportModalOpen(false))}
      />

      <LanguageSelectorModal />
      <AuthModal />
      <LocationModal />
      <WeatherSyncController />
    </>
  );
});

export const MainLayout: React.FC<MainLayoutProps> = memo(({ children }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const mobileMenuOpen = useAppSelector((state) => state.ui.mobileMenuOpen);

  const handleSetActiveTab = useCallback(
    (tab: ActiveTab) => dispatch(setActiveTab(tab)),
    [dispatch]
  );
  const handleSetMobileMenuOpen = useCallback(
    (open: boolean) => dispatch(setMobileMenuOpen(open)),
    [dispatch]
  );
  const handleOpenAiChat = useCallback(() => dispatch(setAiChatOpen(true)), [dispatch]);

  // Unread notifications depend on auth state: hide personal alerts when logged out
  const unreadCount = useMemo(() => {
    return NOTIFICATIONS_DATA.filter(
      (item) => item.isUnread && (isAuthenticated || !item.isPersonal)
    ).length;
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F3F6F1] text-[#1A2821] selection:bg-[#2F855A] selection:text-white antialiased">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        unreadCount={unreadCount}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={handleSetMobileMenuOpen}
      />

      {/* Main Container */}
      {activeTab === 'landing' ? (
        <main key={isAuthenticated ? 'auth' : 'guest'} className="flex-1 w-full">
          {children}
        </main>
      ) : (
        <div className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={handleSetActiveTab}
            onOpenAiChat={handleOpenAiChat}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={handleSetMobileMenuOpen}
            unreadCount={unreadCount}
          />

          <main key={isAuthenticated ? 'auth' : 'guest'} className="flex-1 min-w-0 pb-16">
            {children}
          </main>
        </div>
      )}

      {/* Floating Action Button for Dost AI Assistant */}
      <button
        onClick={handleOpenAiChat}
        className="fixed bottom-6 right-6 z-40 p-3 sm:px-4 sm:py-3 rounded-full bg-[#113E2E] hover:bg-[#0a291f] text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2.5 border border-emerald-400/40 group hover:scale-105 cursor-pointer"
        title={t('modals.dostAiTitle')}
        aria-label={t('modals.dostAiTitle')}
      >
        <div className="relative">
          <span className="material-symbols-outlined notranslate text-2xl text-[#E5B54F]" translate="no">
            psychology
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#3FB968] absolute -top-0.5 -right-0.5 border-2 border-[#113E2E] animate-pulse" />
        </div>
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          {t('modals.dostAiTitle')}
        </span>
      </button>

      {/* Interactive Modals & Background Weather Sync */}
      <GlobalModals />
    </div>
  );
});
