/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab } from './types';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DostAiModal } from './components/DostAiModal';
import { ScanCropModal } from './components/ScanCropModal';
import { CustomTaskModal } from './components/CustomTaskModal';
import { ReportOutbreakModal } from './components/ReportOutbreakModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';

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
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Modal States
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [isCustomTaskModalOpen, setIsCustomTaskModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const [unreadCount] = useState<number>(3);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewView
            onNavigateTab={setActiveTab}
            onOpenDostAi={() => setIsAiChatOpen(true)}
            onOpenScanCrop={() => setIsScanModalOpen(true)}
            onOpenReportOutbreak={() => setIsReportModalOpen(true)}
          />
        );

      case 'my-crops':
      case 'crops':
        return (
          <MyCropsView
            onNavigateTab={setActiveTab}
            onOpenDostAi={() => setIsAiChatOpen(true)}
            onOpenScanCrop={() => setIsScanModalOpen(true)}
          />
        );

      case 'crop-calendar':
      case 'calendar':
        return (
          <CropCalendarView
            onOpenCustomTaskModal={() => setIsCustomTaskModalOpen(true)}
            onOpenDostAi={() => setIsAiChatOpen(true)}
          />
        );

      case 'diseases-library':
      case 'diseases':
        return (
          <DiseasesLibraryView
            onOpenScanModal={() => setIsScanModalOpen(true)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenDostAi={() => setIsAiChatOpen(true)}
          />
        );

      case 'market-prices':
      case 'market':
        return (
          <MarketPricesView
            onOpenDostAi={() => setIsAiChatOpen(true)}
          />
        );

      case 'crop-doctor':
      case 'doctor':
        return (
          <CropDoctorView
            onOpenScanModal={() => setIsScanModalOpen(true)}
            onOpenDostAi={() => setIsAiChatOpen(true)}
            onNavigateTab={setActiveTab}
          />
        );

      case 'weather':
        return (
          <WeatherView
            onOpenDostAi={() => setIsAiChatOpen(true)}
            onNavigateTab={setActiveTab}
          />
        );

      case 'notifications':
        return (
          <NotificationsView
            onNavigateTab={setActiveTab}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onOpenScanModal={() => setIsScanModalOpen(true)}
          />
        );

      case 'landing':
        return (
          <LandingPageView
            onEnterWorkspace={(tab) => setActiveTab(tab || 'overview')}
            onOpenDostAi={() => setIsAiChatOpen(true)}
          />
        );

      default:
        return (
          <OverviewView
            onNavigateTab={setActiveTab}
            onOpenDostAi={() => setIsAiChatOpen(true)}
            onOpenScanCrop={() => setIsScanModalOpen(true)}
            onOpenReportOutbreak={() => setIsReportModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F3F6F1] text-[#1A2821] selection:bg-[#2F855A] selection:text-white antialiased">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Container */}
      {activeTab === 'landing' ? (
        <main className="flex-1 w-full">
          {renderActiveView()}
        </main>
      ) : (
        <div className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAiChat={() => setIsAiChatOpen(true)}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            unreadCount={unreadCount}
          />

          {/* Center Main Content Area */}
          <main className="flex-1 min-w-0 pb-16">
            {renderActiveView()}
          </main>
        </div>
      )}

      {/* Floating Action Button for Dost AI Assistant */}
      <button
        onClick={() => setIsAiChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3 sm:px-4 sm:py-3 rounded-full bg-[#113E2E] hover:bg-[#0a291f] text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2.5 border border-emerald-400/40 group hover:scale-105"
        title={t('modals.dostAiTitle')}
        aria-label={t('modals.dostAiTitle')}
      >
        <div className="relative">
          <span className="material-symbols-outlined text-2xl text-[#E5B54F]">psychology</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#3FB968] absolute -top-0.5 -right-0.5 border-2 border-[#113E2E] animate-pulse"></span>
        </div>
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          {t('modals.dostAiTitle')}
        </span>
      </button>

      {/* Interactive Modals */}
      <DostAiModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        language={language}
        onOpenScan={() => {
          setIsAiChatOpen(false);
          setIsScanModalOpen(true);
        }}
      />

      <ScanCropModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onDiagnosed={() => {
          setIsScanModalOpen(false);
          setActiveTab('crop-doctor');
        }}
      />

      <CustomTaskModal
        isOpen={isCustomTaskModalOpen}
        onClose={() => setIsCustomTaskModalOpen(false)}
        onTaskCreated={() => {
          setIsCustomTaskModalOpen(false);
        }}
      />

      <ReportOutbreakModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <LanguageSelectorModal />
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
