import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { MANDI_ITEMS, NEARBY_ARBITRAGE, CORPORATE_TENDERS } from '../data/mockData';
import { useTranslation } from '../context/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  openAuthModal,
  selectAuthUser,
  selectIsAuthenticated,
} from '../store/slices/authSlice';
import { setActiveTab as setActiveTabAction } from '../store/slices/uiSlice';
import { maskPhoneNumber } from '../utils/jwt';
import {
  Download,
  BellRing,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  Phone,
  Flame,
  Wheat,
  Sprout,
  X,
  LogIn,
} from 'lucide-react';

interface MarketPricesViewProps {
  setActiveTab?: (tab: ActiveTab) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  onOpenAiChat?: () => void;
  onOpenDostAi?: () => void;
}

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({
  setActiveTab,
  onNavigateTab,
  onOpenAiChat,
  onOpenDostAi,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const triggerAi = onOpenDostAi || onOpenAiChat || (() => {});
  const navigate = setActiveTab || onNavigateTab || ((tab: ActiveTab) => dispatch(setActiveTabAction(tab)));
  const [selectedMandi, setSelectedMandi] = useState('Guntur Mandi Yard');
  const [selectedCrop, setSelectedCrop] = useState('Paddy Basmati 1509');
  const [chartMode, setChartMode] = useState<'both' | 'past' | 'forecast'>('both');
  const [subscribedPhone, setSubscribedPhone] = useState(user?.phone || '');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?.phone) {
      setSubscribedPhone((prev) => prev || user.phone);
    } else if (!isAuthenticated) {
      setSubscribedPhone('');
      setIsSubscribed(false);
    }
  }, [isAuthenticated, user?.phone]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribedPhone.trim()) return;
    setIsSubscribed(true);
    setActionNotice(`Daily 7:00 AM mandi rate flashes subscribed for ${maskPhoneNumber(subscribedPhone) || subscribedPhone}.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Live AGMARKNET ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#e5ebe7]">
        <nav className="flex items-center gap-2 text-slate-500 text-xs">
          <span onClick={() => navigate('overview')} className="hover:text-emerald-900 cursor-pointer">
            {t('nav.workspace')}
          </span>
          <span>/</span>
          <span className="text-slate-400">{t('nav.marketPrices')}</span>
          <span>/</span>
          <span className="text-[#113e2e] font-bold">{t('mandi.title')}</span>
        </nav>

        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-[#d5e7db] text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
          <span className="text-[#113e2e]">AGMARKNET &amp; e-NAM SYNCED: 08:42 AM IST</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="text-slate-600">4,120 Mandis Monitored</span>
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

      {/* Header & Controls Section */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#d2e5d7] shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-2xl space-y-1.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#113e2e] tracking-tight">
              {t('mandi.title')}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('mandi.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() =>
                setActionNotice(`Preparing official APMC Morning Bulletin (PDF) for ${selectedMandi}.`)
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 transition shadow-xs"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>{t('common.download')} Bulletin (PDF)</span>
            </button>
            <button
              onClick={() => {
                document.getElementById('alert-subscribe-card')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#113e2e] hover:bg-[#0c2a1f] text-white text-xs font-bold transition shadow-sm"
            >
              <BellRing className="w-4 h-4 text-[#e5b54f]" />
              <span>Set Price Alert</span>
            </button>
          </div>
        </div>

        {/* Filter Bar Component */}
        <div className="bg-[#f8faf7] rounded-2xl p-3 border border-[#d6e5d8] flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 shadow-xs">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Mandi selector */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#d6e5d8] shadow-xs">
              <MapPin className="w-4 h-4 text-[#113e2e]" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 leading-tight">Mandi</span>
                <select
                  value={selectedMandi}
                  onChange={(e) => setSelectedMandi(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[#113e2e] outline-none cursor-pointer pr-1"
                >
                  <option>Guntur Mandi Yard</option>
                  <option>Duggirala Turmeric Yard</option>
                  <option>Tenali Market Yard</option>
                  <option>Vijayawada Wholesale Hub</option>
                  <option>Khammam Grain Mandi</option>
                </select>
              </div>
            </div>

            {/* Crop selector */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#d6e5d8] shadow-xs">
              <Wheat className="w-4 h-4 text-[#113e2e]" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 leading-tight">Crop</span>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-[#113e2e] outline-none cursor-pointer pr-1"
                >
                  <option>Paddy Basmati 1509</option>
                  <option>Chilli Teja (Guntur Grade)</option>
                  <option>Hybrid Yellow Maize</option>
                  <option>Groundnut (Bold Pods)</option>
                  <option>Cotton (Long Staple)</option>
                </select>
              </div>
            </div>

            {/* Window selector */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#d6e5d8] shadow-xs">
              <Calendar className="w-4 h-4 text-[#113e2e]" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 leading-tight">Window</span>
                <select className="bg-transparent text-xs font-semibold text-[#113e2e] outline-none cursor-pointer pr-1">
                  <option>Live Today</option>
                  <option>Past 7 Days</option>
                  <option>Past 30 Days</option>
                  <option>Seasonal Trend</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-xl border border-[#d6e5d8] shadow-xs shrink-0">
            <div className="text-left">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Arrivals</span>
              <span className="text-xs font-bold text-[#113e2e]">38,450 Qtl</span>
            </div>
            <div className="w-px h-6 bg-[#dce7de]"></div>
            <div className="text-left">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Sentiment</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                <TrendingUp className="w-3.5 h-3.5" /> Bullish (+3.4%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Commodity Price Tickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {MANDI_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl p-5 border shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between ${
              item.id === 'mandi-2' ? 'border-2 border-emerald-500/70' : 'border-[#d6e5d8]'
            }`}
          >
            {item.id === 'mandi-2' && <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600"></div>}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`font-semibold text-[11px] uppercase tracking-wider block ${
                      item.isPositive ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {item.grade}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#113e2e] mt-0.5">{item.name}</h3>
                </div>
                <span
                  className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
                    item.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {item.id === 'mandi-1' ? (
                    <Flame className="w-5 h-5 text-rose-600" />
                  ) : item.id === 'mandi-2' ? (
                    <Wheat className="w-5 h-5 text-emerald-700" />
                  ) : item.id === 'mandi-3' ? (
                    <Sprout className="w-5 h-5 text-amber-700" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-orange-600" />
                  )}
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-serif text-[#113e2e]">₹{item.price.toLocaleString()}</span>
                <span className="text-xs text-slate-500">/ {item.unit}</span>
              </div>

              <div className="mt-2.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 text-xs font-semibold border ${
                    item.isPositive
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {item.isPositive ? '↑' : '↓'} {item.change} ({item.changePercent}% today)
                </span>
              </div>
            </div>

            <div className="mt-5 pt-3 bg-[#f9fbf9] rounded-xl p-3 border border-[#e4ede5] flex justify-between items-center text-slate-600 text-xs">
              <div>
                <span className="block text-[11px] text-slate-500 font-medium">Daily Arrival</span>
                <span className="font-bold text-slate-800 text-sm">{item.dailyArrival}</span>
              </div>
              <div className="text-right">
                <span className="block text-[11px] text-slate-500 font-medium">Modal Price</span>
                <span className="font-bold text-[#113e2e] text-sm">₹{item.modalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive AI Forecasting & Historical Trend Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Chart Panel (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#d6e5d8] shadow-xs flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#eef4ee]">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif font-bold text-lg text-[#113e2e]">
                  Paddy Basmati 1509: 30D Trend vs 15D AI Forecast
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs">
                  94.2% Accuracy
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Multi-market aggregated modal prices across Krishna-Godavari Basin Mandis
              </p>
            </div>

            <div className="inline-flex p-1 rounded-xl bg-[#f0f5f1] border border-[#dce7de]">
              <button
                onClick={() => setChartMode('past')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  chartMode === 'past'
                    ? 'bg-white text-[#113e2e] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-[#113e2e]'
                }`}
              >
                Past 30 Days
              </button>
              <button
                onClick={() => setChartMode('forecast')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  chartMode === 'forecast'
                    ? 'bg-white text-[#df9b12] font-bold shadow-xs'
                    : 'text-slate-600 hover:text-[#113e2e]'
                }`}
              >
                AI 15-Day Prediction
              </button>
              <button
                onClick={() => setChartMode('both')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  chartMode === 'both'
                    ? 'bg-[#113e2e] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-[#113e2e]'
                }`}
              >
                Combined View
              </button>
            </div>
          </div>

          {/* SVG Chart Graphic */}
          <div className="relative w-full h-72 sm:h-80 my-3">
            <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 760 260">
              <defs>
                <linearGradient id="primaryAreaGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#113e2e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#113e2e" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="forecastAreaGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#df9b12" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#df9b12" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line stroke="#e2ece3" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="740" y1="30" y2="30" />
              <line stroke="#e2ece3" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="740" y1="85" y2="85" />
              <line stroke="#e2ece3" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="740" y1="140" y2="140" />
              <line stroke="#e2ece3" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="740" y1="195" y2="195" />

              {/* Y-Axis Labels */}
              <text className="fill-[#404942] font-sans text-[11px] font-semibold" x="5" y="34">₹3,900</text>
              <text className="fill-[#404942] font-sans text-[11px] font-semibold" x="5" y="89">₹3,750</text>
              <text className="fill-[#404942] font-sans text-[11px] font-semibold" x="5" y="144">₹3,600</text>
              <text className="fill-[#404942] font-sans text-[11px] font-semibold" x="5" y="199">₹3,450</text>

              {/* Historical Area & Line */}
              {(chartMode === 'both' || chartMode === 'past') && (
                <>
                  <path
                    d="M 40 180 L 90 170 L 150 160 L 220 168 L 290 145 L 360 135 L 430 115 L 470 100 L 470 230 L 40 230 Z"
                    fill="url(#primaryAreaGrad)"
                  />
                  <path
                    d="M 40 180 L 90 170 L 150 160 L 220 168 L 290 145 L 360 135 L 430 115 L 470 100"
                    stroke="#113e2e"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3.5"
                  />
                  <circle cx="290" cy="145" fill="#ffffff" r="4.5" stroke="#113e2e" strokeWidth="2.5" />
                  <circle cx="470" cy="100" fill="#113e2e" r="6" stroke="#ffffff" strokeWidth="2.5" />
                </>
              )}

              {/* Forecast Area & Line */}
              {(chartMode === 'both' || chartMode === 'forecast') && (
                <>
                  <path
                    d="M 470 100 L 530 85 L 590 62 L 650 48 L 730 70 L 730 230 L 470 230 Z"
                    fill="url(#forecastAreaGrad)"
                  />
                  <path
                    d="M 470 100 L 530 85 L 590 62 L 650 48 L 730 70"
                    stroke="#df9b12"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                  <g>
                    <circle cx="650" cy="48" fill="#f6c343" r="6" stroke="#df9b12" strokeWidth="2" />
                    <circle className="animate-pulse" cx="650" cy="48" fill="#f6c343" opacity="0.35" r="14" />
                    <rect fill="#113e2e" height="26" rx="6" width="155" x="572" y="8" />
                    <text className="fill-[#ffffff] font-sans text-[10px] font-bold" textAnchor="middle" x="650" y="24">
                      PROJECTED PEAK: ₹3,860
                    </text>
                  </g>
                </>
              )}

              {/* Today Marker Line */}
              <line stroke="#113e2e" strokeDasharray="2 3" strokeWidth="1.5" x1="470" x2="470" y1="15" y2="230" />
              <text className="fill-[#113e2e] font-sans text-[10px] font-extrabold uppercase" x="475" y="222">
                TODAY (₹3,680)
              </text>

              {/* X-Axis Dates */}
              <text className="fill-[#707972] font-sans text-[10px]" x="40" y="248">Sep 15</text>
              <text className="fill-[#707972] font-sans text-[10px]" x="180" y="248">Sep 25</text>
              <text className="fill-[#707972] font-sans text-[10px]" x="320" y="248">Oct 05</text>
              <text className="fill-[#113e2e] font-sans text-[10px] font-bold" x="470" y="248">Oct 12 (Live)</text>
              <text className="fill-[#df9b12] font-sans text-[10px] font-bold" x="610" y="248">Oct 18 (Diwali Peak)</text>
              <text className="fill-[#707972] font-sans text-[10px]" x="710" y="248">Oct 26</text>
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3.5 bg-[#f9fbf9] rounded-xl px-4 py-2.5 border border-[#e4ede5] mt-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 rounded-full bg-[#113e2e]"></span>
                <span className="text-xs font-medium text-slate-700">Verified Mandi Modal Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 border-b-2 border-dashed border-[#df9b12]"></span>
                <span className="text-xs font-semibold text-[#df9b12]">Dost AI ML Projection</span>
              </div>
            </div>
            <span className="text-xs text-slate-500">Factors: Deepavali festival demand spike + Export quota release</span>
          </div>
        </div>

        {/* AI Directive Card (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#f0f9f3] to-[#e4f5ea] border border-[#a8dab5] rounded-3xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#c8e8d1]">
              <div className="inline-flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#113e2e] flex items-center justify-center text-[#e5b54f] shadow-xs text-xs">
                  🌱
                </div>
                <span className="font-bold text-xs uppercase tracking-wider text-[#113e2e]">DOST AI DIRECTIVE</span>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-white/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                94% Confidence
              </span>
            </div>

            <div>
              <span className="bg-[#113e2e] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
                HOLD BASMATI PADDY
              </span>
              <h3 className="font-serif font-bold text-xl text-[#113e2e] mt-2">Optimum Selling Window</h3>
              <p className="text-xs text-emerald-800 font-medium mt-0.5">
                Next 10 to 14 days (Prior to Deepavali surge peak)
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-[#bfe3cc] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Projected Gain</span>
                <span className="text-base font-bold font-serif text-[#113e2e]">+₹140 - ₹180 / Qtl</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#e2f1e6]">
                <span className="text-slate-500">On 120 Qtl stock:</span>
                <span className="font-bold text-emerald-800">+₹16,800 - ₹21,600 net</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Local mill inventories in Guntur district are critically down by 22% this week.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Dry atmospheric conditions reduce warehouse pest risk safely for 20+ days.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <button
              onClick={triggerAi}
              className="w-full py-2.5 px-4 bg-[#113e2e] hover:bg-[#0c2a1f] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Sparkles className="w-4 h-4 text-[#e5b54f]" />
              <span>Ask Dost AI: "When should I sell?"</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nearby APMC Yard Arbitrage & Comparison Table */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#d6e5d8] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eef4ee]">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#113e2e]">
              {t('mandi.arbitrageTitle')}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {isAuthenticated && user
                ? `Calculated from your verified farm coordinates in ${user.location}`
                : 'Estimated from Coastal Andhra APMC benchmark hub (sign in to personalize from your farm)'}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f2f7f3] border border-[#dce7de] text-[#113e2e] text-xs font-semibold">
            <span>Includes ₹1.8/km/Qtl road freight adjustment</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e2ece3] overflow-hidden">
          <div className="overflow-x-auto custom-scroll">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead>
                <tr className="bg-[#f2f7f3] text-[#2b4c37] font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">APMC Mandi</th>
                  <th className="py-3 px-3">Distance</th>
                  <th className="py-3 px-4">Selected Variety</th>
                  <th className="py-3 px-3">Min Rate</th>
                  <th className="py-3 px-3">Max Rate</th>
                  <th className="py-3 px-4">Modal Price</th>
                  <th className="py-3 px-4">Daily Arrival</th>
                  <th className="py-3 px-4 text-right">Net Return (after freight)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef4ee] text-xs text-slate-700 bg-white">
                {NEARBY_ARBITRAGE.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-[#f9fcf9] transition ${idx === 0 ? 'bg-emerald-50/30' : ''}`}
                  >
                    <td className="py-3.5 px-4 font-bold text-[#113e2e] flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                      <span>{item.mandi}</span>
                      {item.statusTag && (
                        <span className="bg-emerald-100 text-emerald-800 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-emerald-300 ml-1">
                          {item.statusTag}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-600">{item.distance}</td>
                    <td className="py-3.5 px-4">{item.variety}</td>
                    <td className="py-3.5 px-3 text-slate-500">₹{item.minRate.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-slate-500">₹{item.maxRate.toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">₹{item.modalPrice.toLocaleString()}/Qtl</td>
                    <td className="py-3.5 px-4 text-slate-600">{item.dailyArrival}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`font-serif font-bold text-base ${idx === 0 ? 'text-[#113e2e]' : 'text-slate-800'}`}>
                        ₹{item.netReturn.toLocaleString()}
                      </span>
                      {item.diffNote && (
                        <span
                          className={`block text-[10px] font-bold uppercase tracking-wide ${
                            idx === 0 ? 'text-emerald-700' : item.diffNote.includes('erodes') ? 'text-rose-600' : 'text-slate-500'
                          }`}
                        >
                          {item.diffNote}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Direct Corporate Buyer Linkages & Farmgate Contracts */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#e5b54f] text-[#113e2e] text-[10px] font-bold uppercase">
                Pro Feature
              </span>
              <h2 className="font-serif font-bold text-lg text-[#113e2e]">
                Direct Corporate Buyer Linkages &amp; Farmgate Contracts
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Bypass middleman commissions. Verified buyers pickup directly from your farmyard.
            </p>
          </div>
          <button
            onClick={() =>
              setActionNotice('Loaded 28 active corporate procurement tenders across Andhra Pradesh APMC hubs.')
            }
            className="text-xs font-bold text-[#113e2e] hover:underline"
          >
            View all 28 corporate tenders →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CORPORATE_TENDERS.map((tender) => (
            <div
              key={tender.id}
              className="bg-white rounded-3xl p-5 border border-[#d6e5d8] shadow-xs flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  {tender.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-3.5">
                  <h3 className="font-serif font-bold text-base text-[#113e2e]">{tender.company}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{tender.subtitle}</p>
                </div>

                <div className="mt-4 p-3.5 rounded-2xl bg-[#f9fbf9] border border-[#e4ede5] space-y-2 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-600 font-medium">Contract Offer:</span>
                    <span className="text-xl font-bold font-serif text-[#113e2e]">{tender.contractOffer}</span>
                  </div>
                  {tender.minLotSize && (
                    <div className="flex justify-between text-slate-600">
                      <span>Min Lot Size:</span>
                      <span className="font-bold text-slate-800">{tender.minLotSize}</span>
                    </div>
                  )}
                  {tender.targetCrop && (
                    <div className="flex justify-between text-slate-600">
                      <span>Target Crop:</span>
                      <span className="font-bold text-slate-800">{tender.targetCrop}</span>
                    </div>
                  )}
                  {tender.targetVariety && (
                    <div className="flex justify-between text-slate-600">
                      <span>Target Variety:</span>
                      <span className="font-bold text-slate-800">{tender.targetVariety}</span>
                    </div>
                  )}
                  {tender.paymentTerms && (
                    <div className="flex justify-between text-slate-600">
                      <span>Payment Terms:</span>
                      <span className="font-bold text-emerald-800">{tender.paymentTerms}</span>
                    </div>
                  )}
                  {tender.farmgatePickup && (
                    <div className="flex justify-between text-slate-600">
                      <span>Farmgate Pickup:</span>
                      <span className="font-bold text-emerald-800">{tender.farmgatePickup}</span>
                    </div>
                  )}
                  {tender.spotAdvance && (
                    <div className="flex justify-between text-slate-600">
                      <span>Spot Advance:</span>
                      <span className="font-bold text-slate-800">{tender.spotAdvance}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-1">
                <button
                  onClick={() => {
                    if (!isAuthenticated || !user) {
                      dispatch(openAuthModal());
                      return;
                    }
                    setActionNotice(
                      `Initiated trade request with ${tender.company}. Confirmation sent to ${maskPhoneNumber(user.phone)}.`
                    );
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#113e2e] hover:bg-[#0c2a1f] text-white text-xs font-bold transition shadow-xs"
                >
                  {isAuthenticated ? tender.actionText : `Sign In to ${tender.actionText}`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Price Alert Subscription Card */}
      <div id="alert-subscribe-card" className="bg-[#113e2e] text-white rounded-3xl p-6 lg:p-8 shadow-md border border-[#0d3023]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold">
              <BellRing className="w-4 h-4 text-[#e5b54f]" />
              <span>Daily Mandi Advisory Service</span>
            </div>
            <h3 className="font-serif font-bold text-xl text-white">
              Get 7:00 AM Morning Bhav directly on WhatsApp &amp; SMS
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Receive tailored morning rate flashes before trading starts. Never undersell to village aggregators without current APMC benchmark prices.
            </p>
          </div>

          <div className="w-full lg:w-auto flex-1 max-w-lg">
            <form onSubmit={handleSubscribe} className="bg-white rounded-2xl p-2 shadow-xs flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={subscribedPhone}
                  onChange={(e) => setSubscribedPhone(e.target.value)}
                  placeholder="Enter 10-digit WhatsApp number"
                  className="w-full pl-9 pr-3 py-2 bg-[#f0f5f1] rounded-xl text-xs font-semibold text-slate-800 focus:outline-none tabular-nums"
                />
              </div>
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-[#e5b54f] hover:bg-[#d8a742] text-[#113e2e] font-bold text-xs whitespace-nowrap shadow-xs transition"
              >
                {isSubscribed ? 'Subscribed ✓' : 'Subscribe Free'}
              </button>
            </form>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
              <p className="text-[11px] text-emerald-200/80 text-center lg:text-left">
                Available in Telugu, Hindi &amp; English. Opt-out anytime by replying STOP.
              </p>
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => dispatch(openAuthModal())}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#e5b54f] hover:underline"
                >
                  <LogIn className="w-3 h-3" />
                  <span>{t('auth.signIn')} to auto-fill</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
