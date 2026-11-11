/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { ActiveTab } from './types';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectIsAuthenticated } from './store/slices/authSlice';
import {
  setActiveTab,
  setAiChatOpen,
  setCustomTaskModalOpen,
  setMobileMenuOpen,
  setReportModalOpen,
  setScanModalOpen,
} from './store/slices/uiSlice';
import { NOTIFICATIONS_DATA } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DostAiModal } from './components/DostAiModal';
import { ScanCropModal } from './components/ScanCropModal';
import { CustomTaskModal } from './components/CustomTaskModal';
import { ReportOutbreakModal } from './components/ReportOutbreakModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { AuthModal } from './components/AuthModal';

import { OverviewView } from './views/OverviewView';
import { MyCropsView } from './views/MyCropsView';
import { CropCalendarView } from './views/CropCalendarView';
import { DiseasesLibraryView } from './views/DiseasesLibraryView';
import { MarketPricesView } from './views/MarketPricesView';
import { CropDoctorView } from './views/CropDoctorView';
import { WeatherView } from './views/WeatherView';
import { NotificationsView } from './views/NotificationsView';
import { LandingPageView } from './views/LandingPageView';

function AppContent() {
  const dispatch = useAppDispatch();
  const { t, language } = useTranslation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const {
    activeTab,
    mobileMenuOpen,
    isAiChatOpen,
    isScanModalOpen,
    isCustomTaskModalOpen,
    isReportModalOpen,
  } = useAppSelector((state) => state.ui);

  const handleSetActiveTab = (tab: ActiveTab) => dispatch(setActiveTab(tab));
  const handleSetMobileMenuOpen = (open: boolean) => dispatch(setMobileMenuOpen(open));

  // Unread notifications depend on auth state: hide personal alerts when logged out
  const unreadCount = useMemo(() => {
    return NOTIFICATIONS_DATA.filter(
      (item) => item.isUnread && (isAuthenticated || !item.isPersonal)
    ).length;
  }, [isAuthenticated]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewView
            onNavigateTab={handleSetActiveTab}
            onOpenDostAi={() => dispatch(setAiChatOpen(true))}
            onOpenScanCrop={() => dispatch(setScanModalOpen(true))}
            onOpenReportOutbreak={() => dispatch(setReportModalOpen(true))}
          />
        );

      case 'my-crops':
      case 'crops':
        return (
          <MyCropsView
            onNavigateTab={handleSetActiveTab}
            onOpenDostAi={() => dispatch(setAiChatOpen(true))}
            onOpenScanCrop={() => dispatch(setScanModalOpen(true))}
          />
        );

      case 'crop-calendar':
      case 'calendar':
        return (
          <CropCalendarView
            onOpenCustomTaskModal={() => dispatch(setCustomTaskModalOpen(true))}
            onOpenDostAi={() => dispatch(setAiChatOpen(true))}
          />
        );

      case 'diseases-library':
      case 'diseases':
        return (
          <DiseasesLibraryView
            onOpenScanModal={() => dispatch(setScanModalOpen(true))}
            onOpenReportModal={() => dispatch(setReportModalOpen(true))}
            onOpenDostAi={() => dispatch(setAiChatOpen(true))}
          />
        );

      case 'market-prices':
      case 'market':
        return (
          <MarketPricesView
            onOpenDostAi={() => dispatch(setAiChatOpen(true))}
          />
        );

      case 'crop-doctor':
      case 'doctor':
        return (
          <CropDoctorView
            onOpenScanModal={() => dispatch(setScanModalOpen(true))}
            onOpenDostAi={() => dispatch(setAiChatOpen(true))}
            onNavigateTab={handleSetActiveTab}
          />
        );

      case 'weather':
        return (
          <WeatherView
            onOpenDostAi={() => dispatch(setAiChatOpen(true))}
            onNavigateTab={handleSetActiveTab}
          />
        );

      case 'notifications':
        return (
          <NotificationsView
            onNavigateTab={handleSetActiveTab}
            onOpenReportModal={() => dispatch(setReportModalOpen(true))}
            onOpenScanModal={() => dispatch(setScanModalOpen(true))}
          />
        );

      case 'landing':
        return (
          <LandingPageView
            onEnterWorkspace={(tab) => handleSetActiveTab(tab || 'overview')}
            onOpenDostAi={() => dispatch(setAiChatOpen(true))}
          />
        );

      default:
        return (
          <OverviewView
            onNavigateTab={handleSetActiveTab}
            onOpenDostAi={() => dispatch(setAiChatOpen(true))}
            onOpenScanCrop={() => dispatch(setScanModalOpen(true))}
            onOpenReportOutbreak={() => dispatch(setReportModalOpen(true))}
          />
        );
    }
  };

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
          {renderActiveView()}
        </main>
      ) : (
        <div className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={handleSetActiveTab}
            onOpenAiChat={() => dispatch(setAiChatOpen(true))}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={handleSetMobileMenuOpen}
            unreadCount={unreadCount}
          />

          {/* Center Main Content Area */}
          <main key={isAuthenticated ? 'auth' : 'guest'} className="flex-1 min-w-0 pb-16">
            {renderActiveView()}
          </main>
        </div>
      )}

      {/* Floating Action Button for Dost AI Assistant */}
      <button
        onClick={() => dispatch(setAiChatOpen(true))}
        className="fixed bottom-6 right-6 z-40 p-3 sm:px-4 sm:py-3 rounded-full bg-[#113E2E] hover:bg-[#0a291f] text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2.5 border border-emerald-400/40 group hover:scale-105"
        title={t('modals.dostAiTitle')}
        aria-label={t('modals.dostAiTitle')}
      >
        <div className="relative">
          <span className="material-symbols-outlined notranslate text-2xl text-[#E5B54F]" translate="no">psychology</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#3FB968] absolute -top-0.5 -right-0.5 border-2 border-[#113E2E] animate-pulse"></span>
        </div>
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          {t('modals.dostAiTitle')}
        </span>
      </button>

      {/* Interactive Modals */}
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
          handleSetActiveTab('crop-doctor');
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
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
