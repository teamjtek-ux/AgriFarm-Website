/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo } from 'react';
import { ActiveTab } from '../types';
import { PUBLIC_PLATFORM_ASSETS } from '../data/mockData';
import { useTranslation } from '../context/LanguageContext';
import { useAppSelector } from '../store/hooks';
import { selectAuthUser, selectIsAuthenticated } from '../store/slices/authSlice';
import {
  LayoutDashboard,
  Sprout,
  Calendar,
  BookOpen,
  TrendingUp,
  Activity,
  CloudSun,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAiChat: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = memo(({
  activeTab,
  setActiveTab,
  onOpenAiChat,
  mobileMenuOpen,
  setMobileMenuOpen,
  unreadCount = 0,
}) => {
  const { t } = useTranslation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'overview',
      label: t('nav.overview'),
      icon: <LayoutDashboard className="w-[18px] h-[18px]" />,
    },
    {
      id: 'my-crops',
      label: t('nav.myCrops'),
      icon: <Sprout className="w-[18px] h-[18px]" />,
      badge: t('nav.cycloneAlertBadge'),
    },
    {
      id: 'crop-calendar',
      label: t('nav.cropCalendar'),
      icon: <Calendar className="w-[18px] h-[18px]" />,
      badge: isAuthenticated ? t('nav.tasksBadge') : undefined,
    },
    {
      id: 'diseases-library',
      label: t('nav.diseasesLibrary'),
      icon: <BookOpen className="w-[18px] h-[18px]" />,
    },
    {
      id: 'market-prices',
      label: t('nav.marketPrices'),
      icon: <TrendingUp className="w-[18px] h-[18px]" />,
      badge: t('nav.liveBadge'),
    },
    {
      id: 'crop-doctor',
      label: t('nav.cropDoctor'),
      icon: <Activity className="w-[18px] h-[18px]" />,
    },
    {
      id: 'weather',
      label: t('nav.weather'),
      icon: <CloudSun className="w-[18px] h-[18px]" />,
      badge: t('nav.cycloneAlertBadge'),
    },
    {
      id: 'notifications',
      label: t('nav.notifications'),
      icon: <MessageSquare className="w-[18px] h-[18px]" />,
      badge: unreadCount > 0 ? `${unreadCount} ${t('common.unread')}` : undefined,
    },
    {
      id: 'landing',
      label: t('nav.platformOverview'),
      icon: <Sparkles className="w-[18px] h-[18px] text-[#e5b54f]" />,
    },
  ];

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        aria-label="Sidebar navigation"
        className={`fixed lg:sticky top-16 left-0 bottom-0 z-40 w-64 lg:w-64 bg-[#f3f6f1] border-r border-[#e1e8de] lg:border-none px-4 py-6 flex flex-col justify-between overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Workspace Section */}
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 block mb-2">
              {t('nav.workspace')}
            </span>
            <nav key={isAuthenticated ? 'auth' : 'guest'} className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  activeTab === item.id ||
                  ((item.id === 'my-crops' || item.id === 'crops') &&
                    (activeTab === 'my-crops' || activeTab === 'crops')) ||
                  ((item.id === 'crop-calendar' || item.id === 'calendar') &&
                    (activeTab === 'crop-calendar' || activeTab === 'calendar')) ||
                  ((item.id === 'diseases-library' || item.id === 'diseases') &&
                    (activeTab === 'diseases-library' || activeTab === 'diseases')) ||
                  ((item.id === 'market-prices' || item.id === 'market') &&
                    (activeTab === 'market-prices' || activeTab === 'market')) ||
                  ((item.id === 'crop-doctor' || item.id === 'doctor') &&
                    (activeTab === 'crop-doctor' || activeTab === 'doctor'));
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-[#175638] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#113e2e] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-emerald-300' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badge.includes('Alert') ||
                          item.badge.includes('अलर्ट') ||
                          item.badge.includes('హెచ్చరిక')
                            ? 'bg-rose-100 text-rose-700 font-extrabold'
                            : isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* AI Assistant Promo Box */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-[#bcd3c3] rounded-2xl p-4 text-xs text-slate-700 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-2 mb-1.5 text-[#113e2e] font-bold">
              <span className="material-symbols-outlined notranslate text-[#1f6e4d] text-lg" translate="no">psychology</span>
              <span>{t('nav.needAdvice')}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
              {t('nav.askDostAiSub')}
            </p>
            <button
              onClick={() => {
                onOpenAiChat();
                setMobileMenuOpen(false);
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#144232] hover:text-[#0b241b] hover:underline"
            >
              {t('nav.startChat')} <span>→</span>
            </button>
          </div>

          {/* Sidebar Decorative Card */}
          <div className="pt-4 border-t border-slate-200/60 text-center">
            <div className="w-7 h-7 mx-auto mb-1.5 text-[#1b6f49] opacity-80">
              <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"></path>
              </svg>
            </div>
            <p className="text-[10px] font-bold text-[#113e2e] leading-snug">
              {t('nav.quote1')}
              <br />
              {t('nav.quote2')}
              <br />
              <span className="text-[#2f855a]">{t('nav.quote3')}</span>
            </p>
            <div className="mt-3 rounded-xl overflow-hidden shadow-inner h-24 border border-[#bcd3c3] relative">
              <img
                alt="Scenic green terraced landscape"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                src={user?.landscape || PUBLIC_PLATFORM_ASSETS.landscape}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-2">
                <span
                  key={isAuthenticated ? 'auth-loc' : 'guest-loc'}
                  className="text-[9px] font-bold text-white tracking-wide"
                >
                  {isAuthenticated && user ? user.location : 'Andhra & Telangana Basin'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
});
