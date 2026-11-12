/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { ActiveTab, NotificationItem } from '../../../shared/types';
import { NOTIFICATIONS } from '../../../shared/data/mockData';
import { useTranslation } from '../../../shared/i18n';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import {
  maskPhoneNumber,
  openAuthModal,
  selectAuthUser,
  selectIsAuthenticated,
} from '../../auth';

interface NotificationsViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenReportModal: () => void;
  onOpenScanModal: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  onNavigateTab,
  onOpenReportModal,
  onOpenScanModal,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [channels, setChannels] = useState({
    sms: true,
    whatsapp: true,
    push: true,
    voice: true,
  });

  const items = useMemo<NotificationItem[]>(() => {
    return NOTIFICATIONS.filter(
      (n) => (isAuthenticated || !n.isPersonal) && !dismissedIds.includes(n.id)
    ).map((n) => (readIds.includes(n.id) ? { ...n, read: true, isUnread: false } : n));
  }, [isAuthenticated, dismissedIds, readIds]);

  const isItemRead = (item: NotificationItem) => item.read !== undefined ? item.read : !item.isUnread;
  const getItemText = (item: NotificationItem) => item.message || item.description || '';
  const getItemType = (item: NotificationItem) => item.type || item.category || 'general';
  const getItemSeverity = (item: NotificationItem) => item.severity || (item.severityTag ? 'high' : 'normal');
  const getItemAction = (item: NotificationItem) => item.actionPath || item.actionUrlTab;

  const unreadCount = items.filter(n => !isItemRead(n)).length;

  const markAllAsRead = () => {
    setReadIds(items.map((n) => n.id));
  };

  const markAsRead = (id: string) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const dismissNotification = (id: string) => {
    setDismissedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const filteredItems = items.filter(item => {
    const isRead = isItemRead(item);
    const itemType = getItemType(item);
    if (activeFilter === 'unread' && isRead) return false;
    if (activeFilter !== 'all' && activeFilter !== 'unread') {
      if (activeFilter === 'crop' && (itemType === 'crops' || itemType === 'crop')) {
        // match
      } else if (itemType !== activeFilter) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || getItemText(item).toLowerCase().includes(q);
    }
    return true;
  });

  const todayItems = filteredItems.filter(item => item.group === 'today' || item.time.toLowerCase().includes('today') || item.time.toLowerCase().includes('am') || item.time.toLowerCase().includes('pm'));
  const olderItems = filteredItems.filter(item => !todayItems.includes(item));

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 pb-1">
            <span>{t('nav.workspace')}</span>
            <span>/</span>
            <span className="text-[#113E2E] font-bold">{t('notif.title')}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#113E2E]">{t('notif.title')}</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                {unreadCount} {t('common.unread')}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              <span>{t('notif.markAllRead')}</span>
            </button>
          )}
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 rounded-xl bg-[#113E2E] text-white hover:bg-[#0a291f] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#E5B54F]">report_problem</span>
            <span>{t('notif.reportOutbreak')}</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scroll">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-[#113E2E] text-white'
                : 'bg-white border border-[#DFEBDE] text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{t('common.all')}</span>
            <span className="text-[10px] opacity-80">({items.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeFilter === 'unread'
                ? 'bg-[#113E2E] text-white'
                : 'bg-white border border-[#DFEBDE] text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{t('common.unread')}</span>
            <span className="text-[10px] opacity-80">({unreadCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('weather')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeFilter === 'weather'
                ? 'bg-[#113E2E] text-white'
                : 'bg-white border border-[#DFEBDE] text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-sm text-sky-600">thunderstorm</span>
            <span>{t('notif.weatherFilter')}</span>
          </button>
          <button
            onClick={() => setActiveFilter('crop')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeFilter === 'crop'
                ? 'bg-[#113E2E] text-white'
                : 'bg-white border border-[#DFEBDE] text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-sm text-emerald-600">spa</span>
            <span>{t('notif.cropsFilter')}</span>
          </button>
          <button
            onClick={() => setActiveFilter('mandi')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeFilter === 'mandi'
                ? 'bg-[#113E2E] text-white'
                : 'bg-white border border-[#DFEBDE] text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-sm text-amber-600">trending_up</span>
            <span>{t('notif.mandiFilter')}</span>
          </button>
          <button
            onClick={() => setActiveFilter('govt')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeFilter === 'govt'
                ? 'bg-[#113E2E] text-white'
                : 'bg-white border border-[#DFEBDE] text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-sm text-blue-600">account_balance</span>
            <span>{t('notif.govtFilter')}</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full lg:w-80 shrink-0">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by crop, pest, or date..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-[#DFEBDE] text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#113E2E]"
          />
        </div>
      </div>

      {/* Main Content Layout (Feed + Right Rail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Notifications Feed: 8 Columns */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {!isAuthenticated && (
            <div className="p-4 rounded-xl bg-white border border-[#d5e7db] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <p className="text-xs font-bold text-[#113E2E]">Showing public regional advisories</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Sign in with your mobile number to receive personal mandi stock updates, DBT receipts, and field scan alerts.
                </p>
              </div>
              <button
                onClick={() => dispatch(openAuthModal())}
                className="px-4 py-2 rounded-xl bg-[#113E2E] hover:bg-[#0a291f] text-white text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t('auth.signIn')}
              </button>
            </div>
          )}

          {/* Section: Today */}
          {todayItems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900">Today</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#113E2E] text-[10px] font-bold">
                    {todayItems.filter(i => !isItemRead(i)).length} New
                  </span>
                </div>
                <span className="text-xs text-slate-500">Wednesday, 29 October</span>
              </div>

              {todayItems.map(item => {
                const read = isItemRead(item);
                const type = getItemType(item);
                const text = getItemText(item);
                const sev = getItemSeverity(item);
                const act = getItemAction(item);

                return (
                  <article
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={`group relative p-4 rounded-xl border transition-all shadow-xs flex flex-col sm:flex-row gap-4 items-start cursor-pointer ${
                      !read
                        ? 'bg-white border-emerald-300 ring-1 ring-emerald-500/10'
                        : 'bg-[#F8FAF7] border-[#DFEBDE] opacity-90'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      sev === 'high' ? 'bg-red-100 text-red-600' :
                      type === 'mandi' ? 'bg-amber-100 text-amber-700' :
                      type === 'govt' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-[#113E2E]'
                    }`}>
                      <span className="material-symbols-outlined text-2xl">
                        {type === 'weather' ? 'thunderstorm' :
                         type === 'mandi' ? 'trending_up' :
                         type === 'govt' ? 'account_balance' : 'warning'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            sev === 'high' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {type} Warning
                          </span>
                          <span className="text-xs text-slate-400">• {item.time}</span>
                        </div>
                        {!read && <div className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 mt-1"></div>}
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 mt-1 leading-snug">{item.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{text}</p>

                      {type === 'weather' && (
                        <div className="mt-2.5 p-2.5 rounded-lg bg-[#F8FAF7] border border-[#E7EFE7] flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-700 text-base">air</span>
                            <span className="text-xs text-slate-700 font-bold">Gust Velocity: 42 km/h</span>
                            <span className="text-[11px] text-slate-500">• Tenali Corridor</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                              <div className="bg-red-600 w-3/4 h-full"></div>
                            </div>
                            <span className="text-[11px] font-bold text-red-600">78% Severity</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-3 flex-wrap">
                        {act && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateTab(act as ActiveTab);
                            }}
                            className="px-3 py-1 rounded-lg bg-[#113E2E] text-white text-xs font-bold hover:bg-[#0a291f] transition-colors"
                          >
                            View Details
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(item.id);
                          }}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {olderItems.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-base font-bold text-slate-900">Earlier This Week</span>
                <span className="text-xs text-slate-500">24-27 October</span>
              </div>

              {olderItems.map(item => {
                const read = isItemRead(item);
                const type = getItemType(item);
                const text = getItemText(item);
                const act = getItemAction(item);

                return (
                  <article
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={`group relative p-4 rounded-xl border transition-all shadow-xs flex flex-col sm:flex-row gap-4 items-start cursor-pointer ${
                      !read
                        ? 'bg-white border-emerald-300'
                        : 'bg-[#F8FAF7] border-[#DFEBDE] opacity-85'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      type === 'govt' ? 'bg-blue-100 text-blue-700' :
                      type === 'mandi' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      <span className="material-symbols-outlined text-2xl">
                        {type === 'govt' ? 'account_balance' :
                         type === 'mandi' ? 'payments' : 'info'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                            {type}
                          </span>
                          <span className="text-xs text-slate-400">• {item.time}</span>
                        </div>
                        {!read && <div className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 mt-1"></div>}
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 mt-1">{item.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{text}</p>

                      <div className="flex items-center gap-2 pt-3">
                        {act && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateTab(act as ActiveTab);
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#113E2E] text-xs font-bold transition-colors"
                          >
                            Review
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(item.id);
                          }}
                          className="px-3 py-1 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-semibold"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8">
              <span className="material-symbols-outlined text-slate-300 text-5xl">notifications_off</span>
              <p className="font-bold text-slate-700 text-base mt-2">No alerts match your filter</p>
              <p className="text-xs text-slate-400 mt-1">All clear across your parcels and market tickers.</p>
              <button
                onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                className="mt-4 px-4 py-2 bg-[#113E2E] text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Right Rail: Channel Preferences & Hotline */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-xl">tune</span>
                <h3 className="font-bold text-sm text-slate-900">Alert Delivery Channels</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Preferences</span>
            </div>

            <div className="space-y-3.5 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">SMS Alerts</p>
                  {isAuthenticated && user ? (
                    <p className="text-[11px] text-slate-500 tabular-nums">{maskPhoneNumber(user.phone)}</p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => dispatch(openAuthModal())}
                      className="text-[11px] font-semibold text-[#113E2E] hover:underline cursor-pointer"
                    >
                      {t('auth.signInToEnableSms')}
                    </button>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={isAuthenticated && channels.sms}
                  onChange={(e) => {
                    if (!isAuthenticated) {
                      dispatch(openAuthModal());
                      return;
                    }
                    setChannels((c) => ({ ...c, sms: e.target.checked }));
                  }}
                  className="rounded text-[#113E2E] focus:ring-0"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">WhatsApp Morning Digest</p>
                  <p className="text-[11px] text-slate-500">7:00 AM daily mandi rates</p>
                </div>
                <input
                  type="checkbox"
                  checked={channels.whatsapp}
                  onChange={(e) => setChannels(c => ({ ...c, whatsapp: e.target.checked }))}
                  className="rounded text-[#113E2E] focus:ring-0"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">App Push Notifications</p>
                  <p className="text-[11px] text-slate-500">Real-time disease &amp; rain alerts</p>
                </div>
                <input
                  type="checkbox"
                  checked={channels.push}
                  onChange={(e) => setChannels(c => ({ ...c, push: e.target.checked }))}
                  className="rounded text-[#113E2E] focus:ring-0"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Automated IVR Voice Call</p>
                  <p className="text-[11px] text-slate-500">Only for Severe Cyclone &amp; Pest outbreaks</p>
                </div>
                <input
                  type="checkbox"
                  checked={channels.voice}
                  onChange={(e) => setChannels(c => ({ ...c, voice: e.target.checked }))}
                  className="rounded text-[#113E2E] focus:ring-0"
                />
              </div>
            </div>
          </div>

          {/* Critical Farm Contacts Dock */}
          <div className="bg-[#F8FAF7] rounded-2xl p-6 border border-[#DFEBDE]">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/60">
              <span className="material-symbols-outlined text-amber-600 text-xl">contact_phone</span>
              <h3 className="font-bold text-sm text-slate-900">24x7 Kisan Helplines</h3>
            </div>

            <div className="space-y-3 pt-4 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#E7EFE7]">
                <p className="font-bold text-slate-800">National Kisan Call Centre (Toll-Free)</p>
                <p className="text-emerald-700 font-bold text-sm mt-0.5">📞 1800-180-1551</p>
                <p className="text-[10px] text-slate-500">Free advice in Telugu, Hindi &amp; English</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E7EFE7]">
                <p className="font-bold text-slate-800">Guntur Agricultural Officer</p>
                <p className="text-slate-900 font-bold mt-0.5">K. Prasad: +91 863 223 9100</p>
                <p className="text-[10px] text-slate-500">Available Mon-Sat 9AM-5PM</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E7EFE7]">
                <p className="font-bold text-slate-800">State Disaster Management Cell</p>
                <p className="text-red-700 font-bold mt-0.5">APSDMA Emergency: 1070</p>
                <p className="text-[10px] text-slate-500">Cyclone relief &amp; water pump deployment</p>
              </div>
            </div>

            <button
              onClick={onOpenScanModal}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#113E2E] text-white text-xs font-bold hover:bg-[#0a291f] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-base text-[#E5B54F]">document_scanner</span>
              <span>Launch Quick Camera Scan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
