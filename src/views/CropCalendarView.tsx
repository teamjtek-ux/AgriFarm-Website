import React, { memo } from 'react';
import { ActiveTab, CalendarTask } from '../types';
import { CALENDAR_TASKS } from '../data/mockData';
import { useTranslation } from '../context/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  openAuthModal,
  selectAuthUser,
  selectIsAuthenticated,
} from '../store/slices/authSlice';
import { openLocationModal, selectWeatherUi } from '../store/slices/weatherSlice';
import { describeWmoCode, formatForecastDate } from '../services/weatherApi';
import { setActiveTab as setActiveTabAction } from '../store/slices/uiSlice';
import {
  Calendar as CalendarIcon,
  Download,
  ChevronLeft,
  ChevronRight,
  Plus,
  Wind,
  PhoneCall,
  MessageCircle,
  Lightbulb,
  Check,
  LogIn,
  X,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

interface CropCalendarViewProps {
  setActiveTab?: (tab: ActiveTab) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  onOpenCustomTaskModal: () => void;
  onOpenAiChat?: () => void;
  onOpenDostAi?: () => void;
}

function getPublicFieldLabel(fieldLabel: string): string {
  const match = fieldLabel.match(/\(([^-]+)-/);
  if (match && match[1]) {
    return `${match[1].trim()} Benchmark`;
  }
  return 'Kharif Reference Crop';
}

const CalendarWeatherWidget = memo(() => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { location, meta, current, forecast, loading } = useAppSelector(selectWeatherUi);

  return (
    <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-[#e5ebe7] shadow-xs flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined notranslate text-amber-500 text-xl" translate="no">
              {current ? describeWmoCode(current.weather_code, current.is_day).icon : 'wb_sunny'}
            </span>
            <h3 className="font-serif font-bold text-base text-[#113e2e]">
              {t('calendar.weatherForecast')}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-[#175638]" />
              <span key={location.label}>{location.label}</span>
            </span>
            <button
              type="button"
              onClick={() => dispatch(openLocationModal())}
              className="text-[11px] font-bold text-[#175638] hover:underline cursor-pointer"
            >
              {t('weather.changeLocation')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
          {forecast.length > 0
            ? forecast.slice(0, 5).map((item, idx) => {
                const { day } = formatForecastDate(item.date, idx);
                const wmo = describeWmoCode(item.weather_code, 1);
                const rainy = item.precipitation_probability_max >= 50 || item.precipitation_sum >= 2;
                return (
                  <div
                    key={item.date}
                    className={`p-2.5 rounded-2xl border ${
                      rainy
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-[#f8faf7] border-[#e2efe0]'
                    }`}
                  >
                    <span
                      className={`text-[10px] block truncate ${
                        rainy ? 'text-blue-800 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {idx === 0 ? 'Today' : day}
                    </span>
                    <span
                      className={`material-symbols-outlined notranslate text-2xl mx-auto my-1 block ${
                        rainy ? 'text-blue-600' : 'text-amber-500'
                      }`}
                      translate="no"
                    >
                      {wmo.icon}
                    </span>
                    <span className="text-sm font-bold text-slate-900 block tabular-nums notranslate" translate="no">
                      {Math.round(item.temperature_2m_max)}°C
                    </span>
                    <span
                      className={`text-[10px] block truncate ${
                        rainy ? 'text-blue-700 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {rainy ? `${item.precipitation_probability_max}% Rain` : wmo.label}
                    </span>
                  </div>
                );
              })
            : Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-2xl bg-[#f8faf7] border border-[#e2efe0] h-28 ${
                    loading ? 'animate-pulse' : ''
                  }`}
                />
              ))}
        </div>

        <div className="p-3 rounded-2xl bg-[#f4faf2] border border-[#d2ead0] text-xs text-slate-700 flex items-center gap-2.5">
          <Wind className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            {current
              ? current.wind_speed_10m <= 14 && current.precipitation === 0
                ? `Favorable calm wind (${current.wind_speed_10m} km/h) for foliar spray at ${location.label}.`
                : `Active surface wind ${current.wind_speed_10m} km/h (gusts ${current.wind_gusts_10m} km/h) at ${location.label}.`
              : `Syncing spray & field wind outlook for ${location.label}...`}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-slate-500 text-[11px] pt-2 border-t border-slate-100 tabular-nums notranslate" translate="no">
        <span>Relative Humidity: {current ? `${current.relative_humidity_2m}%` : '--'}</span>
        <span>
          {meta ? `Elev: ${meta.elevation}m · ${meta.timezone_abbreviation}` : 'Live Synced'}
        </span>
      </div>
    </div>
  );
});

export const CropCalendarView: React.FC<CropCalendarViewProps> = ({
  setActiveTab: propSetActiveTab,
  onNavigateTab,
  onOpenCustomTaskModal,
  onOpenAiChat: propOnOpenAiChat,
  onOpenDostAi,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const setActiveTab =
    onNavigateTab || propSetActiveTab || ((tab: ActiveTab) => dispatch(setActiveTabAction(tab)));
  const onOpenAiChat = onOpenDostAi || propOnOpenAiChat || (() => {});
  const [tasks, setTasks] = React.useState<CalendarTask[]>(CALENDAR_TASKS);
  const [selectedDay, setSelectedDay] = React.useState<string>('01');
  const [recommendationApplied, setRecommendationApplied] = React.useState(false);
  const [actionNotice, setActionNotice] = React.useState<string | null>(null);

  const toggleTaskCompletion = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task))
    );
  };

  const weekDays = [
    { dayName: 'Mon', dateNum: '28', hasTask: false },
    { dayName: 'Tue', dateNum: '29', hasTask: true },
    { dayName: 'Wed', dateNum: '30', hasTask: false },
    { dayName: 'Thu', dateNum: '01', hasTask: true, isToday: true },
    { dayName: 'Fri', dateNum: '02', hasTask: true },
    { dayName: 'Sat', dateNum: '03', hasTask: true },
    { dayName: 'Sun', dateNum: '04', hasTask: false },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#e5ebe7]">
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <span onClick={() => setActiveTab('overview')} className="hover:text-emerald-900 cursor-pointer">
            {t('nav.overview')}
          </span>
          <span>/</span>
          <span className="text-[#113e2e] font-bold">{t('nav.cropCalendar')}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 tabular-nums">
          <span className="bg-white px-2.5 py-1 rounded-full border border-slate-200 font-medium text-slate-700">
            {isAuthenticated && user ? 'IoT Sensors: 8 Online' : 'Coastal Andhra Crop Grid'}
          </span>
          <span className="text-slate-400">·</span>
          <span>Telemetry Refreshed 12m ago</span>
        </div>
      </div>

      {actionNotice && (
        <div
          role="status"
          className="px-4 py-3 rounded-2xl bg-[#edf6ef] border border-[#bcd8c4] text-xs text-[#113e2e] flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-lg"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Strip */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#d2e5d7] shadow-xs">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#113e2e] tracking-tight">
              {t('calendar.title')}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
              {isAuthenticated && user ? `Kharif 2026 · ${user.location}` : 'Kharif 2026 · Coastal Andhra Zone'}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t('calendar.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-0">
          <button
            onClick={onOpenCustomTaskModal}
            className="h-10 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#113e2e] text-xs font-bold flex items-center gap-2 transition shadow-xs"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>{t('calendar.addTask')}</span>
          </button>
          <button
            onClick={() =>
              setActionNotice('Preparing official Kharif 2026 agronomic crop calendar (PDF) download.')
            }
            className="h-10 px-4 rounded-xl bg-[#113e2e] hover:bg-[#0c2a1f] text-white text-xs font-bold flex items-center gap-2 transition shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{t('common.download')} (PDF)</span>
          </button>
        </div>
      </div>

      {/* Telemetry Advisory Ribbon */}
      <div className="w-full bg-[#e8f4ec] border border-[#bcd3c3] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#113e2e] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-lg text-emerald-300">satellite_alt</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#113e2e] uppercase tracking-wider block sm:inline mr-2">
              TELEMETRY ADVISORY:
            </span>
            <span className="text-xs text-slate-800 font-medium">
              {isAuthenticated && user
                ? 'Sentinel-2 Satellite Telemetry Synced Today (10:15 AM) · Optimal moisture window for Field 1 fertigation.'
                : 'Sentinel-2 Satellite Telemetry Synced Today (10:15 AM) · Optimal moisture window for Kharif paddy fertigation.'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-[#113e2e] border border-[#bcd3c3] tabular-nums">
            Zone A: 78% VWC
          </span>
        </div>
      </div>

      {/* Active Kharif Parcels & Phenology Cards */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-lg font-bold text-[#113e2e]">
            {isAuthenticated && user
              ? 'Active Kharif Parcels & Phenology'
              : 'Regional Crop Phenology Benchmarks'}
          </h2>
          {isAuthenticated && user ? (
            <span className="text-xs font-semibold text-slate-500">
              3 of {user.registeredParcelsCount} Fields Active
            </span>
          ) : (
            <button
              type="button"
              onClick={() => dispatch(openAuthModal())}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#edf6ef] hover:bg-[#e0efe3] text-[#113e2e] text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('auth.signIn')} to sync your parcels</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Field 1 */}
          <div className="bg-white rounded-3xl p-5 border border-[#e5ebe7] shadow-xs flex flex-col justify-between hover:shadow-sm transition">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block tabular-nums">
                    {isAuthenticated ? 'FIELD 1 · 5.0 ACRES' : 'BENCHMARK · PADDY'}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#113e2e]">Samba Masuri Paddy</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tabular-nums">
                  9.2/10
                </span>
              </div>

              <div className="bg-[#f8faf8] p-3 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Vegetative Stage</span>
                  <span className="text-emerald-700">Day 45 / 135</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#113e2e] h-full rounded-full" style={{ width: '33%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Transplanted</span>
                  <span>Tillering</span>
                  <span>Panicle</span>
                  <span>Harvest</span>
                </div>
              </div>

              <div className="p-3 bg-red-50/80 rounded-2xl border border-red-200 text-xs text-red-900 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-red-700 block">
                  NEXT CRITICAL TASK
                </span>
                <p className="font-semibold leading-snug">
                  Precision Urea + DAP Top-Dressing (Due Today)
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Harvest: Dec 15 - 28</span>
              <button
                onClick={() => setActiveTab('weather')}
                className="font-bold text-[#113e2e] hover:underline"
              >
                Telemetry →
              </button>
            </div>
          </div>

          {/* Field 2 */}
          <div className="bg-white rounded-3xl p-5 border border-[#e5ebe7] shadow-xs flex flex-col justify-between hover:shadow-sm transition">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block tabular-nums">
                    {isAuthenticated ? 'FIELD 2 · 3.0 ACRES' : 'BENCHMARK · CHILLI'}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#113e2e]">Guntur Teja Chilli</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold tabular-nums">
                  8.4/10
                </span>
              </div>

              <div className="bg-[#f8faf8] p-3 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Flowering &amp; Fruit Set</span>
                  <span className="text-amber-700">Day 62 / 120</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '52%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Nursery</span>
                  <span>Vegetative</span>
                  <span>Flowering</span>
                  <span>Flushing</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-amber-800 block">
                  NEXT CRITICAL TASK
                </span>
                <p className="font-semibold leading-snug">
                  Preventive Neem Oil Spray for Thrips (Tomorrow)
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Harvest: Nov 25 - Dec 10</span>
              <button
                onClick={() => setActiveTab('diseases-library')}
                className="font-bold text-[#113e2e] hover:underline"
              >
                Pest Map →
              </button>
            </div>
          </div>

          {/* Field 3 */}
          <div className="bg-white rounded-3xl p-5 border border-[#e5ebe7] shadow-xs flex flex-col justify-between hover:shadow-sm transition">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block tabular-nums">
                    {isAuthenticated ? 'FIELD 3 · 2.5 ACRES' : 'BENCHMARK · MAIZE'}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#113e2e]">Hybrid Maize</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tabular-nums">
                  9.0/10
                </span>
              </div>

              <div className="bg-[#f8faf8] p-3 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Grain Filling Stage</span>
                  <span className="text-emerald-700">Day 58 / 105</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#113e2e] h-full rounded-full" style={{ width: '55%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Knee High</span>
                  <span>Tasseling</span>
                  <span>Grain Fill</span>
                  <span>Maturity</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-blue-800 block">
                  NEXT CRITICAL TASK
                </span>
                <p className="font-semibold leading-snug">
                  Sub-surface Drip Irrigation 2.5 Hrs (Saturday)
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Harvest: Nov 12 - 20</span>
              <button
                onClick={() => setActiveTab('weather')}
                className="font-bold text-[#113e2e] hover:underline"
              >
                Drip Valve →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Agronomic Schedule */}
      <section className="bg-white rounded-3xl border border-[#d2e5d7] p-6 lg:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#edf5eb]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#edf7ec] text-[#113e2e] flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#113e2e]">October 2026 • Week 41</h2>
              <p className="text-xs text-slate-500">
                Recommended agronomic sequence based on satellite VCI and local mandi arrivals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#f4faf2] p-1.5 rounded-2xl border border-[#dbead9]">
            <button className="w-8 h-8 rounded-xl bg-white hover:bg-[#edf6ea] border border-[#d6e7d4] flex items-center justify-center text-[#2b5333] transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-[#1a4b26] px-3">Current Week</span>
            <button className="w-8 h-8 rounded-xl bg-white hover:bg-[#edf6ea] border border-[#d6e7d4] flex items-center justify-center text-[#2b5333] transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7 Day Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {weekDays.map((day) => {
            const isSelected = selectedDay === day.dateNum;
            return (
              <button
                key={day.dateNum}
                onClick={() => setSelectedDay(day.dateNum)}
                className={`p-3 rounded-2xl text-center transition cursor-pointer border ${
                  day.isToday
                    ? 'bg-[#113e2e] text-white shadow-md ring-2 ring-emerald-300'
                    : isSelected
                    ? 'bg-[#e7f2e8] border-[#113e2e] text-[#113e2e] font-bold'
                    : 'bg-[#fafdf9] border-[#e5efe3] hover:border-emerald-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span className={`text-[10px] font-bold uppercase ${day.isToday ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {day.dayName}
                  </span>
                  {day.isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#fde047]"></span>}
                </div>
                <span className={`text-base font-extrabold block mt-0.5 ${day.isToday ? 'text-white' : 'text-slate-800'}`}>
                  {day.dateNum}
                </span>
                {day.isToday ? (
                  <span className="text-[9px] font-extrabold uppercase bg-white/20 px-1.5 py-0.5 rounded-full text-white inline-block mt-1">
                    Today
                  </span>
                ) : (
                  <span
                    className={`inline-block mt-1 w-1.5 h-1.5 rounded-full ${
                      day.hasTask ? 'bg-emerald-500' : 'bg-transparent'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Scheduled Tasks List */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isAuthenticated ? 'Tasks Scheduled For Your Fields' : 'Recommended Seasonal Operations'}
            </h3>
            <span className="text-xs font-semibold text-[#113e2e] tabular-nums">
              {tasks.filter((task) => !task.isCompleted).length} tasks pending action
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  task.isCompleted
                    ? 'bg-slate-50 border-slate-200 opacity-80'
                    : 'bg-[#fafef9] border-[#c3e6be] hover:border-emerald-500 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs text-xl ${
                      task.isCompleted ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-[#113e2e]'
                    }`}
                  >
                    {task.isCompleted ? '✓' : task.category === 'fertilizer' ? '🌱' : task.category === 'pest' ? '🛡️' : '💧'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {task.categoryLabel}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {task.timing}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {isAuthenticated ? task.field : getPublicFieldLabel(task.field)}
                      </span>
                    </div>

                    <h4
                      className={`text-base font-bold ${
                        task.isCompleted ? 'line-through text-slate-400' : 'text-[#113e2e]'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-600 max-w-2xl">{task.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {task.guideButtonText && (
                    <button
                      onClick={() =>
                        setActionNotice(`Loaded ${task.guideButtonText}: ANGRAU Kharif dosage & application SOP.`)
                      }
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition"
                    >
                      {task.guideButtonText}
                    </button>
                  )}
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 ${
                      task.isCompleted
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-[#113e2e] hover:bg-[#0a291f] text-white'
                    }`}
                  >
                    {task.isCompleted ? <Check className="w-4 h-4" /> : null}
                    <span>{task.isCompleted ? 'Completed' : task.actionButtonText}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2 Side-by-Side: 5-Day Weather Forecast & Dost Agronomist Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <CalendarWeatherWidget />

        {/* Dost Agronomist Advisory */}
        <div className="lg:col-span-6 bg-[#113e2e] text-white p-6 rounded-3xl shadow-xs flex flex-col justify-between gap-4 relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#e5b54f]" />
                <h3 className="font-serif font-bold text-base text-white">{t('calendar.dostAdvisory')}</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#e5b54f] text-[#113e2e] px-2.5 py-0.5 rounded-full">
                AI Insight
              </span>
            </div>

            <p className="text-sm text-emerald-100 leading-relaxed">
              {isAuthenticated && user ? (
                <>
                  Based on soil tests for <strong className="text-white">Field 1</strong>, splitting DAP into two split intervals will increase nutrient efficiency by <strong className="text-[#fde047]">28%</strong>.
                </>
              ) : (
                <>
                  Based on Coastal Andhra soil profiles, splitting DAP into two intervals improves nutrient efficiency by <strong className="text-[#fde047]">28%</strong>.
                </>
              )}
            </p>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs text-xs text-emerald-100 flex items-center gap-2.5 border border-white/15">
              <span>
                {isAuthenticated
                  ? "Would you like to automatically recalibrate tomorrow's tasks & update nutrient reminders?"
                  : 'Sign in with your mobile number to apply tailored fertilizer adjustments directly to your parcels.'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 relative z-10 pt-2 border-t border-emerald-800">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  dispatch(openAuthModal());
                  return;
                }
                setRecommendationApplied(true);
                setActionNotice('Recommendation applied: Tomorrow’s top-dressing schedule recalibrated for Field 1.');
              }}
              className="h-10 px-5 rounded-xl bg-[#e5b54f] hover:bg-[#d8a742] text-[#113e2e] font-bold text-xs transition shadow-xs"
            >
              {!isAuthenticated
                ? 'Sign In to Apply Schedule'
                : recommendationApplied
                ? 'Applied to Schedule ✓'
                : 'Apply Recommendation'}
            </button>
            <button
              onClick={() => onOpenAiChat()}
              className="h-10 px-4 rounded-xl bg-white/15 hover:bg-white/20 text-white font-medium text-xs transition"
            >
              Ask Dost AI More
            </button>
          </div>
        </div>
      </div>

      {/* Need Help Interpreting Strip */}
      <div className="w-full bg-white rounded-3xl p-5 border border-[#e5ebe7] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#113e2e] flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6 text-emerald-800" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#113e2e]">Need help interpreting this schedule?</h4>
            <p className="text-xs text-slate-500">
              Speak directly to Dr. Radhakrishnan (Krishi Vigyan Kendra, Guntur) regarding dosage adjustments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="tel:18001801551"
            className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <PhoneCall className="w-4 h-4 text-[#113e2e]" />
            <span>Call KVK Helpline</span>
          </a>
          <button
            onClick={() => onOpenAiChat()}
            className="h-10 px-4 rounded-xl bg-[#113e2e] hover:bg-[#0a291f] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Agri-Scientist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
