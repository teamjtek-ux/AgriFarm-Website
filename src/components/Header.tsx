/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { memo, useState } from 'react';
import { ActiveTab, Language } from '../types';
import { useTranslation } from '../context/LanguageContext';
import UserIcon from "../Assets/AppAssets/account.png";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  logout,
  openAuthModal,
  selectAuthUser,
  selectIsAuthenticated,
} from '../store/slices/authSlice';
import {
  Globe,
  Bell,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  LogIn,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language?: Language;
  setLanguage?: (lang: Language) => void;
  unreadCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = memo(({
  activeTab,
  setActiveTab,
  unreadCount,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { t, currentLanguage, setIsLanguageModalOpen } = useTranslation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#f3f6f1] border-b border-[#e1e8de] sticky top-0 z-40 px-4 sm:px-6 lg:px-12 py-3 transition-all backdrop-blur-md bg-opacity-95">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden rounded-xl bg-white border border-[#d5e7db] text-[#113e2e] hover:bg-[#e7f2e8] transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#113e2e] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined notranslate text-[24px] text-[#e5b54f]" translate="no">agriculture</span>
            </div>
            <div>
              <span className="text-xl font-bold font-serif text-[#113e2e] tracking-tight block leading-tight">
                {t('common.appName')}
              </span>
              <span className="text-[10px] font-sans font-semibold text-[#467a59] tracking-wider uppercase block">
                {t('common.tagline')}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Mode Switcher: Dashboard vs Marketing Showcase */}
        <div className="hidden md:flex items-center gap-1.5 p-1 bg-white/80 border border-[#d6e5d8] rounded-xl shadow-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab !== 'landing'
                ? 'bg-[#113e2e] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#113e2e]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t('header.farmWorkspace')}</span>
          </button>
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'landing'
                ? 'bg-[#113e2e] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#113e2e]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e5b54f]" />
            <span>{t('header.platformOverview')}</span>
          </button>
        </div>

        {/* Right Controls: Language, Notifications, Auth / Farmer Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dynamic Language Selector */}
          <div className="relative notranslate" translate="no">
            <button
              onClick={() => setIsLanguageModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#f0f7f2] border border-[#d5e7db] hover:border-emerald-400 rounded-full text-xs font-semibold text-[#1b3d2b] hover:bg-white transition cursor-pointer shadow-xs group notranslate"
              aria-label="Change Language across 70+ Regional and Country Languages"
              title="Click to switch language (Telugu, Hindi, Tamil, Kannada, Marathi, Spanish, etc.)"
              translate="no"
            >
              <Globe className="w-3.5 h-3.5 text-[#467a59] group-hover:rotate-12 transition-transform" />
              <span className="text-sm shrink-0 notranslate" translate="no">{currentLanguage.flag || '🌐'}</span>
              <span className="font-bold max-w-[100px] sm:max-w-[140px] truncate notranslate" translate="no">
                {currentLanguage.nativeName}
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded-full font-mono uppercase font-bold notranslate" translate="no">
                {currentLanguage.code}
              </span>
              <ChevronDown className="w-3 h-3 text-[#467a59]" />
            </button>
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`relative p-2 text-[#467a59] hover:text-[#113e2e] hover:bg-[#eaf4ed] rounded-full transition-colors ${
              activeTab === 'notifications' ? 'bg-[#eaf4ed] text-[#113e2e]' : ''
            }`}
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#f3f6f1]" />
            )}
          </button>

          {/* Show User Profile only after Login; otherwise show Sign In CTA */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 pl-2 border-l border-[#d5e7db] cursor-pointer hover:opacity-90 transition text-left"
              >
                <img
                  src={user.avatar || UserIcon}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (e.currentTarget.src !== UserIcon) {
                      e.currentTarget.src = UserIcon;
                    }
                  }}
                  className="w-9 h-9 rounded-full object-cover bg-[#e7f2e8] ring-2 ring-[#2f855a]/30 shadow-xs"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-[#113e2e] leading-tight whitespace-nowrap">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-[#557b64] tabular-nums whitespace-nowrap">
                    {user.phone}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#557b64]" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-68 bg-white rounded-2xl shadow-xl border border-[#d5e7db] p-3 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#eef4ee]">
                    <img
                      src={user.avatar || UserIcon}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (e.currentTarget.src !== UserIcon) {
                          e.currentTarget.src = UserIcon;
                        }
                      }}
                      className="w-10 h-10 rounded-full object-cover bg-[#e7f2e8] ring-2 ring-emerald-500"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#113e2e] truncate">{user.name}</div>
                      <div className="text-xs text-slate-500 truncate">{user.location}</div>
                      <div className="text-[11px] font-semibold text-emerald-700 tabular-nums mt-0.5">
                        {user.phone}
                      </div>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between py-1 px-2 rounded-lg bg-[#f8faf8]">
                      <span className="text-slate-500">Farm Holding:</span>
                      <span className="font-bold text-[#113e2e]">{user.holding}</span>
                    </div>
                    <div className="flex justify-between py-1 px-2 rounded-lg bg-[#f8faf8]">
                      <span className="text-slate-500">IoT Station:</span>
                      <span className="font-bold text-emerald-700 truncate max-w-[140px]">
                        {user.station || 'Active'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 px-2 rounded-lg bg-[#f8faf8]">
                      <span className="text-slate-500">Kisan ID:</span>
                      <span className="font-mono text-[11px] text-slate-600">{user.kisanId}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#eef4ee] flex flex-col gap-1">
                    <button
                      onClick={() => {
                        setActiveTab('my-crops');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-[#113e2e] hover:bg-[#f0f7f2] transition"
                    >
                      {t('nav.myCrops')}
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('weather');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-[#113e2e] hover:bg-[#f0f7f2] transition"
                    >
                      {t('nav.weather')}
                    </button>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        dispatch(logout());
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-red-700 hover:bg-red-50 transition flex items-center gap-2 mt-1 border-t border-[#eef4ee] pt-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('auth.signOut')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => dispatch(openAuthModal())}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#113e2e] hover:bg-[#0a291f] text-white text-xs font-bold shadow-xs transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-[#e5b54f]" />
              <span>{t('auth.signIn')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
});
