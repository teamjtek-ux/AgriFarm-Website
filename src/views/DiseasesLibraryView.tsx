import React, { useState, useMemo } from 'react';
import { ActiveTab, DiseaseThreat } from '../types';
import { DISEASES_CATALOG } from '../data/mockData';
import { useTranslation } from '../context/LanguageContext';
import {
  Search,
  X,
  AlertTriangle,
  Camera,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  ShoppingBag,
  ChevronRight,
  BookOpen,
  PlusCircle,
  CheckCircle,
} from 'lucide-react';

interface DiseasesLibraryViewProps {
  setActiveTab?: (tab: ActiveTab) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  onOpenScanModal: () => void;
  onOpenReportModal: () => void;
  onOpenAiChat?: () => void;
  onOpenDostAi?: () => void;
}

export const DiseasesLibraryView: React.FC<DiseasesLibraryViewProps> = ({
  setActiveTab: propSetActiveTab,
  onNavigateTab,
  onOpenScanModal,
  onOpenReportModal,
  onOpenAiChat: propOnOpenAiChat,
  onOpenDostAi,
}) => {
  const { t } = useTranslation();
  const setActiveTab = onNavigateTab || propSetActiveTab || (() => {});
  const onOpenAiChat = onOpenDostAi || propOnOpenAiChat || (() => {});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [activeGuideDisease, setActiveGuideDisease] = useState<DiseaseThreat | null>(null);

  const filteredDiseases = useMemo(() => {
    return DISEASES_CATALOG.filter((d) => {
      const matchesCrop = selectedCrop === 'all' || d.crop === selectedCrop;
      const matchesSeverity = selectedSeverity === 'all' || d.severity === selectedSeverity;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        d.name.toLowerCase().includes(query) ||
        d.scientificName.toLowerCase().includes(query) ||
        d.symptoms.toLowerCase().includes(query) ||
        d.solution.toLowerCase().includes(query);

      return matchesCrop && matchesSeverity && matchesQuery;
    });
  }, [searchQuery, selectedCrop, selectedSeverity]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Header Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#e5ebe7]">
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <span onClick={() => setActiveTab('overview')} className="hover:text-emerald-900 cursor-pointer">
            {t('nav.overview')}
          </span>
          <span>/</span>
          <span className="text-[#113e2e] font-bold">{t('nav.diseasesLibrary')}</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#d2e5d7] shadow-xs">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#113e2e] tracking-tight">
              {t('diseases.title')}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
              Guntur Region • Kharif 2026
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t('diseases.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-0">
          <button
            onClick={() => onOpenScanModal()}
            className="h-10 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#113e2e] text-xs font-bold flex items-center gap-2 transition shadow-xs"
          >
            <Camera className="w-4 h-4 text-emerald-800" />
            <span>{t('diseases.launchScanner')}</span>
          </button>
          <button
            onClick={onOpenReportModal}
            className="h-10 px-4 rounded-xl bg-[#113e2e] hover:bg-[#0c2a1f] text-white text-xs font-bold flex items-center gap-2 transition shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('diseases.reportOutbreak')}</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#e5ebe7] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#113e2e] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl text-[#175638]">coronavirus</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              CATALOGED DISEASES
            </span>
            <span className="font-serif font-bold text-base text-[#113e2e] block">128 Common Threats</span>
            <span className="text-[11px] text-slate-500">Rice, Chilli, Maize, Groundnut</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e5ebe7] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl text-red-500">crisis_alert</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              ACTIVE REGIONAL ALERTS
            </span>
            <span className="font-serif font-bold text-base text-red-700 block">2 High Alert</span>
            <span className="text-[11px] text-slate-500">Guntur &amp; Gopal district</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e5ebe7] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#113e2e] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl text-[#175638]">eco</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              VERIFIED REMEDIES
            </span>
            <span className="font-serif font-bold text-base text-[#113e2e] block">94% Biological / Bio</span>
            <span className="text-[11px] text-slate-500">Eco-safe agronomy tested</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e5ebe7] shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl text-amber-700">support_agent</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              ADVISORY HOTLINE
            </span>
            <span className="font-serif font-bold text-base text-slate-900 block">24/7 KVK Desk</span>
            <span className="text-[11px] text-emerald-700 font-semibold">Agronomist on duty</span>
          </div>
        </div>
      </div>

      {/* Featured Outbreak Warning Box */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/90 border border-amber-300 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                High Priority Field Alert
              </span>
              <h3 className="font-bold text-base text-slate-900">
                Yellow Stem Borer Detected in Adjacent Tenali Mandal
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
              Pest intensity index exceeds critical economic threshold (12% dead hearts recorded). Immediate preventive foliar bio-pesticide application advised across all 15–30 day transplanted paddy within 72 hours.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          <button
            onClick={() => alert('Opening Chlorantraniliprole 18.5 SC foliar treatment SOP protocol.')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs transition"
          >
            View Treatment Protocol
          </button>
          <button
            onClick={() => alert('Order placed for Chlorantraniliprole 18.5 SC (60ml bottle). Dispatched from Guntur Rythu Seva Kendra.')}
            className="px-4 py-2 rounded-xl bg-[#7e5700] hover:bg-[#684600] text-white text-xs font-bold shadow-xs transition"
          >
            Order Chlorantraniliprole
          </button>
        </div>
      </div>

      {/* Search Bar & Category/Severity Filters */}
      <div className="bg-white rounded-3xl p-5 border border-[#e5ebe7] shadow-xs space-y-4">
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('diseases.searchPlaceholder')}
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#f8faf8] border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#113e2e]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          {/* Crop Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCrop('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCrop === 'all'
                  ? 'bg-[#113e2e] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              All (128)
            </button>
            <button
              onClick={() => setSelectedCrop('paddy')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCrop === 'paddy'
                  ? 'bg-[#113e2e] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Rice / Paddy (34)
            </button>
            <button
              onClick={() => setSelectedCrop('chilli')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCrop === 'chilli'
                  ? 'bg-[#113e2e] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Teja Chilli (28)
            </button>
            <button
              onClick={() => setSelectedCrop('maize')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCrop === 'maize'
                  ? 'bg-[#113e2e] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Hybrid Maize (22)
            </button>
            <button
              onClick={() => setSelectedCrop('groundnut')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCrop === 'groundnut'
                  ? 'bg-[#113e2e] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Groundnut (18)
            </button>
          </div>

          {/* Severity Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Severity:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setSelectedSeverity('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedSeverity === 'all'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedSeverity('high')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedSeverity === 'high'
                    ? 'bg-white text-red-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                High Priority
              </button>
              <button
                onClick={() => setSelectedSeverity('moderate')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedSeverity === 'moderate'
                    ? 'bg-white text-amber-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Moderate
              </button>
              <button
                onClick={() => setSelectedSeverity('preventative')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedSeverity === 'preventative'
                    ? 'bg-white text-emerald-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Preventative
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiseases.map((disease) => (
          <article
            key={disease.id}
            className="flex flex-col justify-between rounded-3xl bg-white border border-[#e5ebe7] shadow-xs hover:shadow-md transition-all overflow-hidden"
          >
            <div>
              {/* Image banner with overlay badges */}
              <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
                <img
                  src={disease.imageUrl}
                  alt={disease.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs shadow-xs text-xs font-bold text-[#113e2e]">
                  <span>{disease.fieldTag}</span>
                </div>
                <div
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs uppercase tracking-wide ${
                    disease.severity === 'high'
                      ? 'bg-red-600 text-white'
                      : disease.severity === 'moderate'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  {disease.severityLabel}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#113e2e] leading-snug">
                    {disease.name}
                  </h3>
                  <p className="text-xs italic text-slate-500 mt-0.5">{disease.scientificName}</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#f8faf8] border border-slate-100 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    KEY SYMPTOMS
                  </span>
                  <p className="text-slate-700 leading-relaxed font-normal">{disease.symptoms}</p>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-[#113e2e] block">Recommended Solution:</span>
                    <p className="text-slate-700 mt-0.5">{disease.solution}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-600 block">Preventive Care:</span>
                    <p className="text-slate-500 mt-0.5">{disease.preventiveCare}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 pt-0 flex items-center gap-2">
              <button
                onClick={() => setActiveGuideDisease(disease)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                <span>View Full Guide</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  alert(`Order initialized for ${disease.name} prescription kit (₹${disease.treatmentPrice}).`)
                }
                className="flex-1 py-2 px-3 rounded-xl bg-[#113e2e] hover:bg-[#0a291f] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Order (₹{disease.treatmentPrice})</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {filteredDiseases.length === 0 && (
        <div className="p-10 bg-white rounded-3xl border border-[#e5ebe7] text-center space-y-3">
          <p className="text-sm font-bold text-slate-800">No diseases found matching "{searchQuery}"</p>
          <p className="text-xs text-slate-500">
            Try adjusting your query or crop filters, or take a photo with Crop Doctor AI.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCrop('all');
              setSelectedSeverity('all');
            }}
            className="px-4 py-2 bg-[#113e2e] text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Guide Detail Modal Popup */}
      {activeGuideDisease && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-[#d5e7db]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7efe7]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#113e2e]">
                  {activeGuideDisease.name}
                </h3>
                <p className="text-xs italic text-slate-500">{activeGuideDisease.scientificName}</p>
              </div>
              <button
                onClick={() => setActiveGuideDisease(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="h-44 rounded-2xl overflow-hidden">
                <img
                  src={activeGuideDisease.imageUrl}
                  alt={activeGuideDisease.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="font-bold text-[#113e2e] block text-sm">Pathology &amp; Symptoms</span>
                <p className="text-slate-700 mt-1 leading-relaxed">{activeGuideDisease.symptoms}</p>
              </div>

              <div className="p-3 rounded-2xl bg-[#f0f9f3] border border-[#bcd3c3] space-y-1">
                <span className="font-bold text-emerald-900 block">Verified Treatment:</span>
                <p className="text-slate-700">{activeGuideDisease.solution}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block">Preventive Field Hygiene:</span>
                <p className="text-slate-600 mt-1">{activeGuideDisease.preventiveCare}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => setActiveGuideDisease(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 font-bold text-slate-700 text-xs"
              >
                Close Guide
              </button>
              <button
                onClick={() => {
                  alert(`Order added for ${activeGuideDisease.name} Rx kit.`);
                  setActiveGuideDisease(null);
                }}
                className="flex-1 py-2 rounded-xl bg-[#113e2e] text-white font-bold text-xs"
              >
                Order Kit (₹{activeGuideDisease.treatmentPrice})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Agronomic Support Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Banner 1: AI Instant Diagnosis */}
        <div className="p-6 rounded-3xl bg-[#113e2e] text-white flex flex-col justify-between gap-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#e5b54f] flex items-center justify-center shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-base text-white">Need Immediate Diagnosis?</h4>
                <Sparkles className="w-4 h-4 text-[#e5b54f]" />
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Take or upload a leaf photo to get instant 98.4% accurate AI symptom verification, fungal strain detection, and localized spray SOP.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenScanModal}
              className="px-5 py-2.5 rounded-xl bg-[#e5b54f] hover:bg-[#d8a742] text-[#113e2e] font-bold text-xs shadow-xs transition flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Upload Plant Photo</span>
            </button>
            <span className="text-[11px] text-emerald-200">Takes ~15 seconds</span>
          </div>
        </div>

        {/* Banner 2: Krishi Vigyan Kendra Helpline */}
        <div className="p-6 rounded-3xl bg-white border border-[#e5ebe7] flex flex-col justify-between gap-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6 text-[#7e5700]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                KRISHI VIGYAN KENDRA HELPLINE
              </span>
              <span className="font-serif font-bold text-lg text-slate-900 block">1800-180-1551</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant Telugu, Hindi &amp; English agronomy consultation with field extension officers. Free call service available all days 6 AM – 9 PM.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:18001801551"
              className="px-5 py-2.5 rounded-xl bg-[#113e2e] hover:bg-[#0a291f] text-white font-bold text-xs shadow-xs transition flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Agronomist Desk</span>
            </a>
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              4 Officers Free
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
