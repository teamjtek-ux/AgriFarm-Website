import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  openAuthModal,
  selectAuthUser,
  selectIsAuthenticated,
} from '../store/slices/authSlice';
import {
  Download,
  PhoneCall,
  CheckCircle2,
  Droplets,
  Ban,
  Layers,
  Archive,
  FileText,
  ShieldCheck,
  Check,
  Clock,
  Lock,
  LogIn,
} from 'lucide-react';

interface MyCropsViewProps {
  setActiveTab?: (tab: ActiveTab) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
  onOpenAiChat?: () => void;
  onOpenDostAi?: () => void;
  onOpenScanCrop?: () => void;
}

export const MyCropsView: React.FC<MyCropsViewProps> = ({
  setActiveTab: propSetActiveTab,
  onNavigateTab,
  onOpenAiChat: propOnOpenAiChat,
  onOpenDostAi,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const setActiveTab = onNavigateTab || propSetActiveTab || (() => {});
  const onOpenAiChat = onOpenDostAi || propOnOpenAiChat || (() => {});
  // Interactive checklist state
  const [checklist, setChecklist] = useState([
    {
      id: 1,
      text: 'Secure farm machinery, solar pumps & knapsack sprayers in covered shed',
      note: 'Completed today at 09:30 AM',
      checked: true,
    },
    {
      id: 2,
      text: 'Elevate harvested produce and seed bags off ground with wooden pallets',
      note: 'Transferred seed sacks to raised dry storage',
      checked: true,
    },
    {
      id: 3,
      text: 'Inspect field bunds and clear natural drainage outlets',
      note: 'Due Today, 5:00 PM • Critical for lowland Paddy plots',
      checked: false,
    },
    {
      id: 4,
      text: 'Stake vulnerable vegetable & chilli patches with bamboo stakes',
      note: 'Due Tomorrow, 10:00 AM • Prepare bamboo stakes',
      checked: false,
    },
    {
      id: 5,
      text: 'Connect with local Kisan Mitra Agri-Officer',
      note: 'Contact: Sri M. Venkatesh (+91 94401 23456)',
      checked: false,
    },
  ]);

  const [dossierCreated, setDossierCreated] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4500);
  };

  const toggleItem = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = checklist.filter((i) => i.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const handleResetChecklist = () => {
    setChecklist((prev) => prev.map((item) => ({ ...item, checked: false })));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#e5ebe7]">
        <div>
          <nav className="flex items-center gap-2 text-slate-500 font-label-sm text-xs">
            <span onClick={() => setActiveTab('overview')} className="hover:text-emerald-900 cursor-pointer">
              {t('nav.workspace')}
            </span>
            <span>/</span>
            <span className="text-[#113e2e] font-bold">{t('nav.myCrops')}</span>
            <span>/</span>
            <span className="text-slate-400">{t('myCrops.title')}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#113e2e] tracking-tight">
              {t('myCrops.title')}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
              {t('myCrops.cycloneEta')}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => showNotice('Official KVK Cyclone Safeguard Protocol (PDF) prepared for download.')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-[#113e2e] text-xs font-semibold shadow-xs hover:bg-slate-50 transition whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#175638]" />
            <span>{t('common.download')} PDF</span>
          </button>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                dispatch(openAuthModal());
                return;
              }
              setDossierCreated(true);
              showNotice('Intimation Claim Dossier #PMFBY-8820 generated with your geo-coordinates.');
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-slate-700 text-xs font-semibold shadow-xs hover:bg-slate-50 transition whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>{isAuthenticated ? t('myCrops.generateClaim') : t('auth.signInToLinkPolicy')}</span>
          </button>
          <a
            href="tel:18001801551"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#113e2e] text-white text-xs font-semibold shadow-sm hover:bg-[#0c2a1f] transition whitespace-nowrap shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('myCrops.helplineTitle')}</span>
          </a>
        </div>
      </div>

      {actionNotice && (
        <div className="rounded-xl bg-[#eef7f0] border border-[#bcd3c3] px-4 py-2.5 text-xs font-semibold text-[#113e2e]">
          {actionNotice}
        </div>
      )}

      {/* Cyclone Preparedness & Telemetry Banner */}
      <section className="rounded-3xl bg-white border border-[#d2e5d7] p-6 md:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-6 border-b border-[#e5ebe7] items-start">
          <div className="lg:col-span-7 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest block">
              SEVERE CYCLONIC STORM • BAY OF BENGAL
            </span>
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[#113e2e] leading-snug">
              {isAuthenticated && user
                ? `Cyclone Alert: Preparedness & Mitigation Protocol for Your ${user.registeredParcelsCount} Active Crops`
                : 'Cyclone Alert: Regional Crop Preparedness & Mitigation Protocol'}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              {isAuthenticated && user
                ? `Immediate agronomic safeguard guidelines tailored to ${user.name}'s ${user.holding} holding in ${user.location}.`
                : 'Standard agronomic safeguard guidelines for Coastal Andhra Kharif paddy, chilli, maize & groundnut crops.'}
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-3 gap-4 pt-1">
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">LANDFALL WINDOW</span>
              <span className="text-base font-bold text-slate-900">42 Hours</span>
              <span className="text-xs text-slate-500 leading-tight">Estimated Friday 04:00 AM</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">WIND VELOCITY</span>
              <span className="text-base font-bold text-slate-900">
                85-95 <span className="text-xs font-normal text-slate-600">km/h</span>
              </span>
              <span className="text-xs text-slate-500 leading-tight">Gusts up to 105 km/h</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">EXPECTED RAIN</span>
              <span className="text-base font-bold text-slate-900">
                85-110 <span className="text-xs font-normal text-slate-600">mm</span>
              </span>
              <span className="text-xs text-slate-500 leading-tight">Heavy Coastal Inundation</span>
            </div>
          </div>
        </div>

        {/* 4 Mandatory Directives */}
        <div>
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
            {t('myCrops.mandatoryDirectives')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Directive 1 */}
            <div className="bg-white border border-[#e5ebe7] p-5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition">
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-[#175638] flex items-center justify-center mb-3 shadow-xs">
                  <Droplets className="w-5 h-5 text-[#175638]" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">De-water &amp; Trench</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {t('myCrops.directive1')}
                </p>
              </div>
              <div className="mt-4 pt-2">
                <span className="text-xs font-bold text-slate-800 inline-flex items-center gap-1">
                  Priority: Urgent →
                </span>
              </div>
            </div>

            {/* Directive 2 */}
            <div className="bg-white border border-[#e5ebe7] p-5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition">
              <div>
                <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-3 shadow-xs">
                  <Ban className="w-5 h-5 text-red-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Halt Spraying/Urea</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {t('myCrops.directive2')}
                </p>
              </div>
              <div className="mt-4 pt-2">
                <span className="text-xs font-bold text-red-700 inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Zero Application →
                </span>
              </div>
            </div>

            {/* Directive 3 */}
            <div className="bg-white border border-[#e5ebe7] p-5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition">
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-[#175638] flex items-center justify-center mb-3 shadow-xs">
                  <Layers className="w-5 h-5 text-[#175638]" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Staking &amp; Propping</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {t('myCrops.directive3')}
                </p>
              </div>
              <div className="mt-4 pt-2">
                <span className="text-xs font-bold text-emerald-800 inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Field Block B →
                </span>
              </div>
            </div>

            {/* Directive 4 */}
            <div className="bg-white border border-[#e5ebe7] p-5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-3 shadow-xs">
                  <Archive className="w-5 h-5 text-[#7e5700]" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Early Salvage Harvest</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {t('myCrops.directive4')}
                </p>
              </div>
              <div className="mt-4 pt-2">
                <span className="text-xs font-bold text-[#7e5700] inline-flex items-center gap-1">
                  Elevated Storage →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Crop Parcels & Vulnerability Matrix */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#113e2e]">
              {isAuthenticated && user
                ? 'Active Crop Parcels & Vulnerability Matrix'
                : 'Regional Crop Vulnerability & Cyclone Matrix'}
            </h2>
            <p className="text-xs text-slate-600">
              {isAuthenticated && user
                ? 'Real-time field parcel telemetry with pre-landfall action items'
                : 'Regional Kharif crop susceptibility and pre-landfall guidelines'}
            </p>
          </div>
          {isAuthenticated && user ? (
            <span className="text-xs font-semibold bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-700 tabular-nums">
              Total Monitored: {user.holding}
            </span>
          ) : (
            <button
              onClick={() => dispatch(openAuthModal())}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-[#113e2e] transition cursor-pointer whitespace-nowrap shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 text-[#175638]" />
              <span>{t('auth.signInToViewParcels')}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parcel A: Paddy */}
          <div className="bg-white rounded-2xl shadow-xs border border-[#e5ebe7] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-2xl flex items-center justify-center border border-emerald-100">
                    🌾
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#113e2e]">Paddy (Basmati 1509)</h3>
                    <span className="text-xs text-slate-500">
                      {isAuthenticated ? 'Parcel A • 5.0 Acres • Vegetative (45 Days)' : 'Kharif Regional Stage • Vegetative (45 Days)'}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                  High Risk: Waterlogging
                </span>
              </div>

              <div className="flex items-center gap-5 p-4 rounded-xl bg-[#f5f8f6] border border-[#e5ebe7] mb-4">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-[#113e2e]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="92, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-[#113e2e]">92%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Vigor: Optimal Stand</span>
                  <span className="text-xs text-slate-500 leading-relaxed">
                    Canopy closed. Susceptible to excessive root submergence exceeding 48 hours.
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-xs text-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  SPECIFIC CYCLONE PROTOCOL:
                </span>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Deepen field outlet channels to 30 cm depth to evacuate standing water.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Maintain maximum 2-inch standing retention level; drain excess to peripheral canal.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Stage mobile diesel dewatering pump on eastern embankment.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-400">Last inspected: 3 hrs ago</span>
              <button
                onClick={() => setActiveTab('weather')}
                className="font-bold text-[#113e2e] hover:underline"
              >
                Sensor Telemetry →
              </button>
            </div>
          </div>

          {/* Parcel B: Chilli */}
          <div className="bg-white rounded-2xl shadow-xs border border-[#e5ebe7] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-2xl flex items-center justify-center border border-red-100">
                    🌶️
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#113e2e]">Chilli (Guntur Sannam)</h3>
                    <span className="text-xs text-slate-500">
                      {isAuthenticated ? 'Parcel B • 3.0 Acres • Flowering (62 Days)' : 'Kharif Regional Stage • Flowering (62 Days)'}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-200">
                  Critical: Blossom &amp; Twig Drop
                </span>
              </div>

              <div className="flex items-center gap-5 p-4 rounded-xl bg-[#f5f8f6] border border-[#e5ebe7] mb-4">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-amber-500"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="78, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-slate-900">78%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-red-700">Needs Immediate Intervention</span>
                  <span className="text-xs text-slate-500 leading-relaxed">
                    Wind speeds over 60 km/h will shatter early blossoms and dislodge lateral fruiting branches.
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-xs text-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  SPECIFIC CYCLONE PROTOCOL:
                </span>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Deploy bamboo stakes along row edges and tie loose trellis strings.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Keep Copper Oxychloride (COC @ 2.5g/L) ready for instant post-storm spray against Dieback.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Clear silt build-ups from all micro-channels before heavy squalls commence.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-400">Last inspected: 1 hr ago</span>
              <button
                onClick={() => onOpenAiChat()}
                className="font-bold text-[#113e2e] hover:underline"
              >
                Chilli Advisory Note →
              </button>
            </div>
          </div>

          {/* Parcel C: Maize */}
          <div className="bg-white rounded-2xl shadow-xs border border-[#e5ebe7] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-2xl flex items-center justify-center border border-amber-100">
                    🌽
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#113e2e]">Hybrid Yellow Maize</h3>
                    <span className="text-xs text-slate-500">
                      {isAuthenticated ? 'Parcel C • 2.5 Acres • Vegetative (38 Days)' : 'Kharif Regional Stage • Vegetative (38 Days)'}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
                  Moderate: Wind Lodging Risk
                </span>
              </div>

              <div className="flex items-center gap-5 p-4 rounded-xl bg-[#f5f8f6] border border-[#e5ebe7] mb-4">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-[#113e2e]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="85, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-[#113e2e]">85%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Strong Vegetative Vigor</span>
                  <span className="text-xs text-slate-500 leading-relaxed">
                    Stalks tall and leafy; exposed to root-lodging if soils become saturated during wind peaks.
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-xs text-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  SPECIFIC CYCLONE PROTOCOL:
                </span>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Complete earth-up operations: mound soil 15 cm around stem base for anchorage.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Halt all sprinkler passes; open furrow drains leading to perimeter catch basin.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Clear vegetative debris blocking the downstream boundary ditch.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-400">Last inspected: 5 hrs ago</span>
              <button
                onClick={() => setActiveTab('crop-calendar')}
                className="font-bold text-[#113e2e] hover:underline"
              >
                Agronomy Logs →
              </button>
            </div>
          </div>

          {/* Parcel D: Groundnut */}
          <div className="bg-white rounded-2xl shadow-xs border border-[#e5ebe7] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-2xl flex items-center justify-center border border-orange-100">
                    🥜
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#113e2e]">Groundnut (K6 Kadiri)</h3>
                    <span className="text-xs text-slate-500">
                      {isAuthenticated ? 'Parcel D • 2.0 Acres • Pegging & Pod Fill (50 Days)' : 'Kharif Regional Stage • Pegging & Pod Fill (50 Days)'}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
                  Mod-High: Soil Compaction &amp; Rot
                </span>
              </div>

              <div className="flex items-center gap-5 p-4 rounded-xl bg-[#f5f8f6] border border-[#e5ebe7] mb-4">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-[#113e2e]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="88, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-[#113e2e]">88%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">Active Sub-surface Pegging</span>
                  <span className="text-xs text-slate-500 leading-relaxed">
                    Prolonged waterlogging creates anaerobic soil conditions triggering collar rot and pod decay.
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-xs text-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  SPECIFIC CYCLONE PROTOCOL:
                </span>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Open cross-furrows every 6 rows to ensure zero ponding in peg zone.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Prepare Trichoderma viride enriched farmyard manure for post-storm soil dressing.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Ensure farm boundary bunds are reinforced against upstream road runoff.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-400">Last inspected: 4 hrs ago</span>
              <button
                onClick={() => onOpenAiChat()}
                className="font-bold text-[#113e2e] hover:underline"
              >
                Groundnut Advisory →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Storm Interactive Checklist & Insurance Card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Interactive Checklist */}
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-xs border border-[#e5ebe7] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#113e2e]">
                  {t('myCrops.checklistTitle')}
                </h2>
                <p className="text-xs text-slate-500">
                  Complete all 5 physical safeguarding milestones before T-24 hours
                </p>
              </div>
              <span className="font-bold text-sm text-[#113e2e]">
                {completedCount} / {checklist.length} {t('myCrops.itemsCompleted')}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6">
              <div
                className="bg-[#113e2e] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checkbox Tasks */}
            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-start gap-3.5 p-3.5 rounded-2xl transition cursor-pointer select-none border ${
                    item.checked
                      ? 'bg-[#f5faf6] border-[#d4ead7]'
                      : 'bg-white hover:bg-slate-50 border-[#e5ebe7]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="mt-1 w-5 h-5 rounded text-[#113e2e] focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span
                      className={`text-xs font-semibold block ${
                        item.checked ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {item.text}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.id === 1 && isAuthenticated && user
                        ? `Completed today at 09:30 AM by ${user.name}`
                        : item.note}
                    </p>
                  </div>
                  {item.checked && <Check className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-500">Auto-syncing with Village Panchayat Disaster Cell</span>
            <button
              onClick={handleResetChecklist}
              className="font-bold text-[#113e2e] hover:underline"
            >
              Reset Checklist
            </button>
          </div>
        </div>

        {/* Right 5 cols: PMFBY Insurance & KVK Helpline */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* PMFBY Insurance Card */}
          <div className="bg-white rounded-3xl shadow-xs border border-[#e5ebe7] p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6 text-[#7e5700]" />
              </div>
              <span className="text-xs font-bold text-[#113e2e] bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                Govt Protected
              </span>
            </div>

            <h3 className="font-serif font-bold text-lg text-[#113e2e] mb-1">
              PM Fasal Bima Yojana (PMFBY)
            </h3>
            <p className="text-xs text-slate-500 mb-4">Mandatory Post-Disaster Loss Reporting Protocol</p>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#f5f8f6] border border-[#e5ebe7]">
                <Clock className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-900">72-Hour Golden Window</span>
                  <span className="text-slate-500 leading-relaxed text-[11px] block mt-0.5">
                    Take geo-tagged, time-stamped photos of crop lodging or inundation directly inside this app before clearing debris.
                  </span>
                </div>
              </div>

              {isAuthenticated && user ? (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#f5f8f6] border border-[#e5ebe7]">
                  <FileText className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">Policy Number Bound</span>
                    <span className="text-slate-500 leading-relaxed text-[11px] block mt-0.5 tabular-nums">
                      {user.name} • {user.pmfbyPolicy} • Insured Sum: {user.insuredSum} for {user.holding}.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#f5f8f6] border border-[#e5ebe7]">
                  <Lock className="w-5 h-5 text-[#113e2e] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">{t('auth.signInToLinkPolicy')}</span>
                    <span className="text-slate-500 leading-relaxed text-[11px] block mt-0.5">
                      Verify your mobile number to view your PMFBY policy number, insured acreage, and file intimation claims.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  setDossierCreated(true);
                  showNotice(`Intimation Claim Dossier #PMFBY-CLAIM-8820 generated for policy ${user.pmfbyPolicy}.`);
                }}
                className="w-full mt-5 py-2.5 px-4 rounded-xl bg-[#113e2e] hover:bg-[#0c2a1f] text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{dossierCreated ? 'Dossier Filed ✓ (#PMFBY-8820)' : 'Prepare Intimation Claim Dossier'}</span>
              </button>
            ) : (
              <button
                onClick={() => dispatch(openAuthModal())}
                className="w-full mt-5 py-2.5 px-4 rounded-xl bg-[#113e2e] hover:bg-[#0c2a1f] text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#e5b54f]" />
                <span>{t('auth.signIn')}</span>
              </button>
            )}
          </div>

          {/* KVK Agronomist Helpline */}
          <div className="bg-[#e4efe7] border border-[#d2e5d7] rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#113e2e] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  KVK
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#113e2e]">Krishi Vigyan Kendra Helpline</h4>
                  <span className="text-xs text-slate-600">Lam Farm, Guntur • Direct Extension Desk</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Direct access to Dr. R. Ramanjaneyulu (Principal Scientist - Agronomy) for pest outbreak mitigation post-inundation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="tel:08632524000"
                className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-[#d2e5d7] text-[#113e2e] text-xs font-bold text-center shadow-xs hover:bg-[#f5f8f6] transition flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4 text-emerald-700" />
                <span>0863-2524000</span>
              </a>
              <button
                onClick={() => showNotice('WhatsApp query prepared for KVK Guntur Agronomist On-Duty.')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#175638] text-white text-xs font-bold text-center shadow-xs hover:bg-[#12452c] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>WhatsApp KVK</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
