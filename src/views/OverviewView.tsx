import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { CROPS_DATA, NOTIFICATIONS_DATA } from '../data/mockData';
import { useTranslation } from '../context/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  openAuthModal,
  selectAuthUser,
  selectIsAuthenticated,
} from '../store/slices/authSlice';
import {
  Camera,
  Search,
  Droplets,
  CloudRain,
  TrendingUp,
  CalendarCheck,
  AlertTriangle,
  Sun,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  LogIn,
  Lock,
} from 'lucide-react';

interface OverviewViewProps {
  setActiveTab?: (tab: ActiveTab) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  onOpenScanModal?: () => void;
  onOpenScanCrop?: () => void;
  onOpenAiChat?: () => void;
  onOpenDostAi?: () => void;
  onOpenReportOutbreak?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  setActiveTab: propSetActiveTab,
  onNavigateTab,
  onOpenScanModal: propOnOpenScanModal,
  onOpenScanCrop,
  onOpenAiChat: propOnOpenAiChat,
  onOpenDostAi,
  onOpenReportOutbreak,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const setActiveTab = onNavigateTab || propSetActiveTab || (() => {});
  const onOpenScanModal = onOpenScanCrop || propOnOpenScanModal || (() => {});
  const onOpenAiChat = onOpenDostAi || propOnOpenAiChat || (() => {});
  void onOpenReportOutbreak;
  const [searchQuery, setSearchQuery] = useState('');

  const visibleNotifications = NOTIFICATIONS_DATA.filter(
    (item) => isAuthenticated || !item.isPersonal
  ).slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Greeting & Search / Action Row */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Wednesday, 01 October 2026
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#14382d] flex items-baseline gap-1.5 mt-0.5">
              <span>{t('overview.greeting')},</span>
              <span key={isAuthenticated ? 'auth-name' : 'guest-name'}>
                {isAuthenticated && user ? user.name.split(' ')[0] : 'Farmer'}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{t('nav.askDostAiSub')}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.searchPlaceholder')}
                className="pl-9 pr-4 py-2 bg-white border border-[#e5ebe7] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#175638] w-48 sm:w-64 shadow-xs"
              />
            </div>

            <button
              onClick={onOpenScanModal}
              className="flex items-center gap-2 bg-[#175638] hover:bg-[#12452c] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition"
            >
              <Camera className="w-4 h-4" />
              <span>{t('overview.scanAction')}</span>
            </button>
          </div>
        </div>

        {/* Full-Width Cyclone Warning Alert Banner */}
        <div className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border-2 border-red-500/40 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-lg">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  🚨 {t('overview.cycloneBannerTitle')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {t('myCrops.cycloneEta')}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 leading-snug">
                {t('overview.cycloneBannerSub')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            <button
              onClick={() => setActiveTab('my-crops')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <span>{t('overview.openMitigation')} →</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div
          onClick={() => setActiveTab('weather')}
          className="bg-white p-4 rounded-2xl border border-[#e5ebe7] shadow-xs flex flex-col justify-between hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#175638] flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs text-slate-500">Soil moisture</span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">64%</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {isAuthenticated ? 'Optimal for your crops' : 'Optimal across regional soils'}
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => setActiveTab('weather')}
          className="bg-white p-4 rounded-2xl border border-[#e5ebe7] shadow-xs flex flex-col justify-between hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CloudRain className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
              48h Warning
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs text-slate-500">Next rainfall</span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">12 mm</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Expected in 2 days</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => setActiveTab('market-prices')}
          className="bg-white p-4 rounded-2xl border border-[#e5ebe7] shadow-xs flex flex-col justify-between hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Bullish
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs text-slate-500">Market outlook</span>
            <div className="text-2xl font-bold text-emerald-700 mt-0.5">+8.2%</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Rice prices rising</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => setActiveTab('crop-calendar')}
          className="bg-white p-4 rounded-2xl border border-[#e5ebe7] shadow-xs flex flex-col justify-between hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#175638] flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              Action Due
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xs text-slate-500">Today's task</span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">Irrigate</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Basmati rice · 6:00 PM</span>
          </div>
        </div>
      </div>

      {/* Weekly Agricultural Weather Intelligence Panel */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5ebe7] shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 shadow-xs">
              <Sun className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#e1efe6] text-[#175638]">
                  Live Ag-Weather Center
                </span>
                <span className="text-xs text-slate-400">Updated 12 mins ago</span>
              </div>
              <h2 className="text-xl font-bold font-serif text-[#14382d] mt-1">
                Weekly Agricultural Weather Intelligence
              </h2>
              <p className="text-xs text-slate-500">
                {isAuthenticated && user ? user.station : 'Regional Ag-Weather Network · Coastal Andhra'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-emerald-50/60 border border-emerald-100 p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-[#14382d]">28°C</span>
              <div className="text-left leading-tight">
                <span className="text-xs font-semibold text-slate-800 block">Partly Cloudy</span>
                <span className="text-[10px] text-slate-500">Feels like 30°C</span>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-emerald-200 hidden sm:block mx-1"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Humidity</span>
                <span className="font-bold text-slate-800">65%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Wind Speed</span>
                <span className="font-bold text-slate-800">14 km/h SW</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Rain Prob.</span>
                <span className="font-bold text-blue-600">15%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">UV Index</span>
                <span className="font-bold text-amber-600">5 Moderate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning strip */}
        <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold text-xs">
              ⚠️
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">Farming Weather Advisory &amp; Spray Window</div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Ideal spraying window: <strong>Thursday 6:00 AM – 10:00 AM</strong> (wind &lt; 9 km/h). Moderate rain expected Friday night (12 mm) — postpone fertilizer application until Saturday afternoon.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('weather')}
            className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold shadow-xs hover:bg-amber-100/50 self-start md:self-auto shrink-0"
          >
            Detailed Spray Guide
          </button>
        </div>

        {/* 7-Day Day Strip */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                7-Day Agricultural Forecast &amp; Field Suitability
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">(Plan irrigation &amp; field labor)</span>
            </div>
            <span className="text-[11px] font-semibold text-[#175638]">Next Rain Event: Friday (75%)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {/* Day 1 */}
            <div className="bg-emerald-50/70 border-2 border-emerald-500/40 rounded-xl p-3 text-center flex flex-col justify-between shadow-xs relative">
              <span className="absolute -top-2 right-2 bg-[#175638] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                Today
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1">Wed 01</span>
              <span className="text-[10px] text-slate-400">Oct</span>
              <div className="my-2 flex justify-center text-amber-500">
                <Sun className="w-7 h-7" />
              </div>
              <div className="text-sm font-bold text-slate-900">
                28° <span className="text-xs font-normal text-slate-400">/ 19°</span>
              </div>
              <div className="mt-1 text-[10px] text-blue-600 font-semibold">💧 15% · 0 mm</div>
              <span className="mt-2 px-1.5 py-1 rounded bg-[#175638] text-white text-[9px] font-bold leading-tight block">
                Optimal Weeding
              </span>
            </div>

            {/* Day 2 */}
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center flex flex-col justify-between hover:border-emerald-300 transition">
              <span className="text-xs font-bold text-slate-800">Thu 02</span>
              <span className="text-[10px] text-slate-400">Oct</span>
              <div className="my-2 flex justify-center text-amber-500">
                <Sun className="w-7 h-7" />
              </div>
              <div className="text-sm font-bold text-slate-900">
                29° <span className="text-xs font-normal text-slate-400">/ 20°</span>
              </div>
              <div className="mt-1 text-[10px] text-blue-600 font-semibold">💧 10% · 0 mm</div>
              <span className="mt-2 px-1.5 py-1 rounded bg-emerald-100 text-[#175638] text-[9px] font-bold leading-tight block">
                Ideal for Spraying
              </span>
            </div>

            {/* Day 3 */}
            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3 text-center flex flex-col justify-between hover:border-blue-400 transition">
              <span className="text-xs font-bold text-slate-800">Fri 03</span>
              <span className="text-[10px] text-slate-400">Oct</span>
              <div className="my-2 flex justify-center text-blue-500">
                <CloudRain className="w-7 h-7" />
              </div>
              <div className="text-sm font-bold text-slate-900">
                25° <span className="text-xs font-normal text-slate-400">/ 18°</span>
              </div>
              <div className="mt-1 text-[10px] text-blue-600 font-bold">💧 75% · 12 mm</div>
              <span className="mt-2 px-1.5 py-1 rounded bg-red-100 text-red-700 text-[9px] font-bold leading-tight block">
                Avoid Irrigation
              </span>
            </div>

            {/* Day 4 */}
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center flex flex-col justify-between hover:border-emerald-300 transition">
              <span className="text-xs font-bold text-slate-800">Sat 04</span>
              <span className="text-[10px] text-slate-400">Oct</span>
              <div className="my-2 flex justify-center text-blue-400">
                <CloudRain className="w-7 h-7" />
              </div>
              <div className="text-sm font-bold text-slate-900">
                27° <span className="text-xs font-normal text-slate-400">/ 18°</span>
              </div>
              <div className="mt-1 text-[10px] text-blue-600 font-semibold">💧 30% · 2 mm</div>
              <span className="mt-2 px-1.5 py-1 rounded bg-[#e1efe6] text-[#175638] text-[9px] font-bold leading-tight block">
                Post-Rain Fertilizer
              </span>
            </div>

            {/* Day 5 */}
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center flex flex-col justify-between hover:border-emerald-300 transition">
              <span className="text-xs font-bold text-slate-800">Sun 05</span>
              <span className="text-[10px] text-slate-400">Oct</span>
              <div className="my-2 flex justify-center text-amber-500">
                <Sun className="w-7 h-7" />
              </div>
              <div className="text-sm font-bold text-slate-900">
                29° <span className="text-xs font-normal text-slate-400">/ 19°</span>
              </div>
              <div className="mt-1 text-[10px] text-blue-600 font-semibold">💧 10% · 0 mm</div>
              <span className="mt-2 px-1.5 py-1 rounded bg-[#e1f3e8] text-[#175638] text-[9px] font-bold leading-tight block">
                Harvest Friendly
              </span>
            </div>

            {/* Day 6 */}
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center flex flex-col justify-between hover:border-emerald-300 transition">
              <span className="text-xs font-bold text-slate-800">Mon 06</span>
              <span className="text-[10px] text-slate-400">Oct</span>
              <div className="my-2 flex justify-center text-amber-500">
                <Sun className="w-7 h-7" />
              </div>
              <div className="text-sm font-bold text-slate-900">
                30° <span className="text-xs font-normal text-slate-400">/ 20°</span>
              </div>
              <div className="mt-1 text-[10px] text-blue-600 font-semibold">💧 5% · 0 mm</div>
              <span className="mt-2 px-1.5 py-1 rounded bg-[#e1f3e8] text-[#175638] text-[9px] font-bold leading-tight block">
                Good Sowing Days
              </span>
            </div>

            {/* Day 7 */}
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-center flex flex-col justify-between hover:border-emerald-300 transition">
              <span className="text-xs font-bold text-slate-800">Tue 07</span>
              <span className="text-[10px] text-slate-400">Oct</span>
              <div className="my-2 flex justify-center text-blue-400">
                <CloudRain className="w-7 h-7" />
              </div>
              <div className="text-sm font-bold text-slate-900">
                28° <span className="text-xs font-normal text-slate-400">/ 19°</span>
              </div>
              <div className="mt-1 text-[10px] text-blue-600 font-semibold">💧 20% · 0.5 mm</div>
              <span className="mt-2 px-1.5 py-1 rounded bg-[#e1efe6] text-[#175638] text-[9px] font-bold leading-tight block">
                Regular Fieldwork
              </span>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Evapotranspiration (ET₀)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                Low Loss
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2">3.4 mm/day</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Soil drying rate is low. <strong>Recommendation:</strong> Skip watering for 48 hrs.
            </p>
          </div>

          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Favorable Spray Window</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Open Tomorrow
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2">6:00 AM – 10:00 AM</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Wind speeds under 8 km/h. Zero drift risk for Basmati rice.
            </p>
          </div>

          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Soil Temp &amp; Moisture Index</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                22.4°C / 64%
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2">Optimal Germination</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Excellent root moisture retention across all surveyed zones.
            </p>
          </div>
        </div>
      </div>

      {/* Dost AI Agronomy Mustard Advice Banner */}
      <div className="bg-[#14382d] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider uppercase font-bold text-emerald-300">
              Dost AI Agronomy Advisory
            </span>
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-amber-400 text-xs">
              ⚡
            </div>
          </div>
          <h2 className="text-xl font-bold font-serif text-white mt-2 leading-snug">
            Start planting mustard this season.
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1.5 max-w-xl leading-relaxed">
            Based on your current soil profile, upcoming rain on Friday, and rising wholesale mustard prices, mustard could return{' '}
            <span className="font-bold text-amber-300">₹18,400 more</span> per acre compared to late wheat.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={onOpenAiChat}
            className="bg-[#e5b044] hover:bg-[#d4a037] text-slate-900 font-bold text-xs px-5 py-2.5 rounded-full transition shadow-xs"
          >
            View analysis
          </button>
          <button
            onClick={onOpenAiChat}
            className="text-xs font-semibold text-emerald-200 hover:text-white flex items-center gap-1 transition"
          >
            Tell me more ↗
          </button>
        </div>
      </div>

      {/* My Crops Overview / Regional Benchmarks Section */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#175638]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isAuthenticated && user ? 'My Crops Overview' : t('auth.regionalBenchmarks')}
              </h2>
              <p className="text-[11px] text-slate-500">
                {isAuthenticated && user
                  ? `Track the health and progress of your ${user.registeredParcelsCount} registered parcels.`
                  : t('auth.regionalBenchmarksSub')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isAuthenticated && (
              <button
                onClick={() => dispatch(openAuthModal())}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#eef4ee] hover:bg-[#dfece0] text-[#113e2e] text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('auth.signIn')}</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('my-crops')}
              className="text-xs font-semibold text-[#175638] hover:underline flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              View all crops →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CROPS_DATA.map((crop) => (
            <div
              key={crop.id}
              onClick={() => setActiveTab('my-crops')}
              className="bg-white rounded-2xl p-4 border border-[#e5ebe7] shadow-xs flex flex-col justify-between hover:border-emerald-300 transition cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl shadow-xs">
                    {crop.icon}
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      crop.status === 'healthy'
                        ? 'bg-[#e1f3e8] text-[#175638]'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {crop.status === 'healthy' ? 'Healthy' : 'Needs attention'}
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-xs font-bold text-slate-900">
                    {crop.name} <span className="font-normal text-slate-500">({crop.variety})</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 tabular-nums">
                    {crop.stage} • {crop.days} days
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                  <span>{isAuthenticated ? 'Progress' : 'Season progress'}</span>
                  <span className="font-bold text-slate-800 tabular-nums">{crop.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-[#175638] h-full rounded-full transition-all"
                    style={{ width: `${crop.progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">
                  {isAuthenticated ? `${crop.field} • ${crop.area}` : 'Coastal Andhra Regional Standard'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2-Column: Crop Calendar Stats + Market Prices Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Crop Calendar & Task Performance */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#e5ebe7] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#175638]">
                <CalendarCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Crop Calendar</h3>
                <p className="text-[11px] text-slate-500">
                  {isAuthenticated
                    ? 'Upcoming tasks and schedule for your crops.'
                    : 'Standard Kharif phenology & seasonal schedule.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('crop-calendar')}
              className="text-xs font-semibold text-[#175638] hover:underline flex items-center gap-1"
            >
              View full calendar →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1 border-b border-gray-100 pb-5">
            <div>
              <div className="text-lg font-bold text-slate-900">17</div>
              <div className="text-[10px] text-slate-500 leading-tight">Active crop calendars</div>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">124,520</div>
              <div className="text-[10px] text-slate-500 leading-tight">Tasks generated</div>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">86,420</div>
              <div className="text-[10px] text-slate-500 leading-tight">Tasks completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">38,100</div>
              <div className="text-[10px] text-slate-500 leading-tight">Tasks missed</div>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1 justify-start sm:justify-center">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-[#175638]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="69.4, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-slate-800">69.4%</span>
              </div>
              <span className="text-[10px] text-slate-500 leading-tight">
                Completion<br />rate
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-3">Task performance</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[11px] text-slate-400 font-semibold border-b border-gray-100">
                    <th className="pb-2">Task</th>
                    <th className="pb-2">Generated</th>
                    <th className="pb-2">Completed</th>
                    <th className="pb-2 text-right">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-slate-700">
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span> Irrigation
                    </td>
                    <td className="py-2.5">24,500</td>
                    <td className="py-2.5">18,920</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-[#175638] font-bold rounded-md text-[10px]">
                        77%
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Fertilizer
                    </td>
                    <td className="py-2.5">18,200</td>
                    <td className="py-2.5">12,400</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-[#175638] font-bold rounded-md text-[10px]">
                        68%
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span> Pest Inspection
                    </td>
                    <td className="py-2.5">15,800</td>
                    <td className="py-2.5">10,200</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-[#175638] font-bold rounded-md text-[10px]">
                        65%
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="py-2.5 flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Spraying
                    </td>
                    <td className="py-2.5">12,400</td>
                    <td className="py-2.5">8,950</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-[#175638] font-bold rounded-md text-[10px]">
                        72%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Market Prices Live Tickers with Sparklines */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#e5ebe7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#175638]">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Market Prices</h3>
                  <p className="text-[11px] text-slate-500">Live APMC benchmark prices and trends.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('market-prices')}
                className="text-xs font-semibold text-[#175638] hover:underline flex items-center gap-1"
              >
                View all prices →
              </button>
            </div>

            <div className="divide-y divide-gray-50 mt-4">
              {/* Paddy */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🌾</span>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900">Paddy (Basmati 1509)</h5>
                    <div className="text-xs font-bold text-slate-800">
                      ₹ 2,350 <span className="font-normal text-[10px] text-slate-400">/quintal</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">↑ 3.1%</span>
                    <span className="text-[9px] text-slate-400">7 days</span>
                  </div>
                  <svg className="w-14 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 60 20">
                    <path d="M2,16 L12,14 L24,17 L36,10 L48,11 L58,4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <circle cx="58" cy="4" fill="currentColor" r="2" />
                  </svg>
                </div>
              </div>

              {/* Chilli */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🌶️</span>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900">Guntur Sannam Chilli</h5>
                    <div className="text-xs font-bold text-slate-800">
                      ₹ 19,850 <span className="font-normal text-[10px] text-slate-400">/quintal</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">↑ 2.1%</span>
                    <span className="text-[9px] text-slate-400">7 days</span>
                  </div>
                  <svg className="w-14 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 60 20">
                    <path d="M2,18 L14,15 L26,16 L38,9 L48,11 L58,5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <circle cx="58" cy="5" fill="currentColor" r="2" />
                  </svg>
                </div>
              </div>

              {/* Maize */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🌽</span>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900">Hybrid Yellow Maize</h5>
                    <div className="text-xs font-bold text-slate-800">
                      ₹ 2,180 <span className="font-normal text-[10px] text-slate-400">/quintal</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-red-600 block">↓ 1.3%</span>
                    <span className="text-[9px] text-slate-400">7 days</span>
                  </div>
                  <svg className="w-14 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 60 20">
                    <path d="M2,6 L14,8 L26,10 L38,15 L48,13 L58,18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <circle cx="58" cy="18" fill="currentColor" r="2" />
                  </svg>
                </div>
              </div>

              {/* Groundnut */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🥜</span>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900">Groundnut (Bold Pods)</h5>
                    <div className="text-xs font-bold text-slate-800">
                      ₹ 6,750 <span className="font-normal text-[10px] text-slate-400">/quintal</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-600 block">↑ 1.6%</span>
                    <span className="text-[9px] text-slate-400">7 days</span>
                  </div>
                  <svg className="w-14 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 60 20">
                    <path d="M2,17 L12,15 L24,16 L36,11 L48,12 L58,4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <circle cx="58" cy="4" fill="currentColor" r="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">e-NAM &amp; AGMARKNET Synced: 08:42 AM</span>
            <button
              onClick={() => setActiveTab('market-prices')}
              className="text-xs font-bold text-[#175638] hover:underline"
            >
              Direct Buyer Linkages →
            </button>
          </div>
        </div>
      </div>

      {/* Crop Doctor & Diagnostic History Preview */}
      <section className="bg-white rounded-2xl p-5 border border-[#e5ebe7] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#175638]">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900">Crop Doctor</h2>
              <p className="text-[11px] text-slate-500">AI-powered crop diagnosis and expert dosage prescriptions.</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('crop-doctor')}
            className="text-xs font-semibold text-[#175638] hover:underline flex items-center gap-1"
          >
            View all diagnoses →
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
          {/* Upload card */}
          <div
            onClick={onOpenScanModal}
            className="lg:col-span-6 border-2 border-dashed border-emerald-300 bg-[#fbfdfc] hover:bg-[#f2f8f4] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition group"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#175638] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Upload or scan crop image</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 mb-4">Get instant diagnosis &amp; verified ICAR treatment</p>
            <button
              type="button"
              className="bg-[#175638] hover:bg-[#12452c] text-white text-xs font-semibold px-5 py-2 rounded-xl flex items-center gap-2 shadow-xs transition"
            >
              <Camera className="w-4 h-4" />
              <span>Scan crop now</span>
            </button>
          </div>

          {/* History (only visible after sign-in) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800">Recent Diagnosis History</h4>
                  <button
                    onClick={() => setActiveTab('crop-doctor')}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                  >
                    View full history →
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  <div
                    onClick={() => setActiveTab('crop-doctor')}
                    className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100/60 overflow-hidden flex items-center justify-center text-emerald-800 font-bold">
                        BLB
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">Bacterial Leaf Blight - Rice</h5>
                        <span className="text-[11px] text-amber-600 font-medium leading-none block mt-0.5">
                          Stage 2 (Moderate) • Streptocycline Rx
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">Today, 08:42 AM</span>
                  </div>

                  <div
                    onClick={() => setActiveTab('crop-doctor')}
                    className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100/60 overflow-hidden flex items-center justify-center text-amber-800 font-bold">
                        WF
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">Whitefly Nymphs - Chilli</h5>
                        <span className="text-[11px] text-emerald-700 font-medium leading-none block mt-0.5">
                          Resolved (100% Healthy)
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">16 Oct 2026</span>
                  </div>

                  <div
                    onClick={() => setActiveTab('crop-doctor')}
                    className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100/60 overflow-hidden flex items-center justify-center text-blue-800 font-bold">
                        TLB
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">Turcicum Leaf Blight - Maize</h5>
                        <span className="text-[11px] text-emerald-700 font-medium leading-none block mt-0.5">
                          Resolved (Stable Yield)
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">28 Sep 2026</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full rounded-2xl bg-[#f8faf8] border border-[#e5ebe7] p-6 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#113e2e] flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <h4 className="text-xs font-bold text-slate-900">{t('auth.signInToViewHistory')}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{t('auth.signInToViewHistorySub')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => dispatch(openAuthModal())}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#113e2e] hover:bg-[#0a291f] text-white text-xs font-bold transition whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#e5b54f]" />
                  <span>{t('auth.signIn')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Row: Farm Insights & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Farm Insights */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-[#e5ebe7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#175638]">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Farm Insights</h3>
                  <p className="text-[11px] text-slate-500">Soil health and sensor performance indicators.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('weather')}
                className="text-xs font-semibold text-[#175638] hover:underline flex items-center gap-1"
              >
                View station telemetry →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                <span className="text-[11px] font-semibold text-slate-600 block">Soil pH</span>
                <div className="text-base font-bold text-slate-900 mt-1">6.8</div>
                <span className="text-[10px] text-emerald-700 font-semibold">Optimal</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                <span className="text-[11px] font-semibold text-slate-600 block">Organic Matter</span>
                <div className="text-base font-bold text-slate-900 mt-1">2.4%</div>
                <span className="text-[10px] text-emerald-700 font-semibold">Good (+12%)</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                <span className="text-[11px] font-semibold text-slate-600 block">NPK (kg/ha)</span>
                <div className="text-base font-bold text-slate-900 mt-1">120-45-60</div>
                <span className="text-[10px] text-slate-400">Target Level</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50/70 border border-gray-100">
                <span className="text-[11px] font-semibold text-slate-600 block">Water Holding</span>
                <div className="text-base font-bold text-slate-900 mt-1">68%</div>
                <span className="text-[10px] text-emerald-700 font-semibold">Optimal</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#e8f4ec] rounded-xl flex items-center gap-2.5 text-xs text-[#175638]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>
              <strong>Soil health is improving!</strong> 12% increase in organic matter compared to last month.
            </span>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#e5ebe7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#175638]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">Recent Notifications</h3>
              </div>
              <button
                onClick={() => setActiveTab('notifications')}
                className="text-xs font-semibold text-[#175638] hover:underline flex items-center gap-1"
              >
                View all alerts →
              </button>
            </div>

            <div className="divide-y divide-gray-50 text-xs">
              {visibleNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveTab(item.actionUrlTab || 'notifications')}
                  className="py-2.5 cursor-pointer hover:bg-slate-50 px-1 rounded-lg transition"
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-bold text-slate-800">{item.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {item.description || item.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => setActiveTab('notifications')}
              className="text-xs font-bold text-[#175638] inline-flex items-center gap-1 hover:underline"
            >
              <span>Go to Alert Center</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
