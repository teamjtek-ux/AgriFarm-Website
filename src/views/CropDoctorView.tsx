/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface CropDoctorViewProps {
  onOpenScanModal: () => void;
  onOpenDostAi: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

interface SampleTest {
  id: string;
  name: string;
  pathogen: string;
  category: string;
  crop: string;
  location: string;
  confidence: number;
  severity: string;
  severityStage: string;
  affectedCanopy: string;
  incubation: string;
  chemicalRx: {
    title: string;
    description: string;
    tag: string;
  };
  organicRx: {
    title: string;
    description: string;
    tag: string;
  };
  image: string;
}

const SAMPLE_TESTS: SampleTest[] = [
  {
    id: 'paddy-blb',
    name: 'Paddy Bacterial Blight',
    pathogen: 'Xanthomonas oryzae',
    category: 'Bacterial Leaf Blight (BLB)',
    crop: 'Basmati Plot A',
    location: 'Basmati Plot A (East Quadrant)',
    confidence: 96.4,
    severity: 'Moderate',
    severityStage: 'Stage 2 (Moderate)',
    affectedCanopy: '18.5% leaf surface area',
    incubation: 'Active bacterial ooze',
    chemicalRx: {
      title: 'Copper Oxychloride + Streptocycline',
      description: 'Dissolve Copper Oxychloride 50% WP @ 2.5g/L together with Streptocycline (100 ppm, 1g per 10L water). Spray thoroughly over top foliage canopy.',
      tag: 'ICAR & ANGRAU Verified Standard',
    },
    organicRx: {
      title: 'Pseudomonas fluorescens 1.5% WP',
      description: 'Foliar spray with biological antagonist Pseudomonas fluorescens @ 10g/L or fresh fermented cow urine-neem leaf decoction (5% concentration) to colonize lesions.',
      tag: 'Organic Export Certified Safe',
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR5RlKFgl2A5FPxJ0jjsmtcIqtpXDmXl57U_TKWnEvfmGpFLh8HW7jECZYD13BHOLF6PZts8IJ6oY3Rfi7GZ_aP0je1UgVT0JmILgcqO1aEY5Ne9QGasrM8z44wuhf9CosX6XRks6dQ17yJGr0aVmB25wWuQXNznsy9AcsynvrGVZVmHHw58p0at3Yhefc9IF6nqXTk1D_KCZ-eQNJ7SRbkDIBB578xnEI4hXbPcu_HEhBfzeh_-rw',
  },
  {
    id: 'chilli-curl',
    name: 'Chilli Yellow Leaf Curl',
    pathogen: 'Begomovirus',
    category: 'Begomovirus • Whitefly vector',
    crop: 'Chilli Guntur S4',
    location: 'Chilli South Block (Plot B)',
    confidence: 94.8,
    severity: 'Severe',
    severityStage: 'Stage 3 (High)',
    affectedCanopy: '24.2% leaf surface area',
    incubation: 'Upward leaf curling & stunted internodes',
    chemicalRx: {
      title: 'Diafenthiuron 50% WP + Acetamiprid',
      description: 'Spray Diafenthiuron 50% WP @ 1.25g/L or Acetamiprid 20% SP @ 0.2g/L targeting underside foliage to eliminate whitefly vectors immediately.',
      tag: 'CIBRC Registered Protocol',
    },
    organicRx: {
      title: 'Neem Oil 10,000 PPM + Sticky Traps',
      description: 'Install 25 yellow sticky traps per acre. Spray cold-pressed Neem oil (10,000 ppm) @ 3ml/L emulsified with organic soap every 5 days.',
      tag: 'Residue-Free IPM Protocol',
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB08IB7OmaI6L57ddspEyKEA4RMWzRGIlvJtOcIIHKgpqunpnWohgWWLUdLSTv3ASXpIEmUY1JZClcx6WnNInFmX5ezvOYe42jFYNtIV7bYH7gvyia09Z-AWI2DrSu8ef5OLcZx__qhy3aqZT0AVhegznr6UhByl1TQuWFyy9-iGigUFC-7Ldkx2wlayD4z_yldejyrFdXh6o_cUJbCDLDNxg6vf0WiTm20o6HMKaZI7xcWvFevq90o',
  },
  {
    id: 'maize-armyworm',
    name: 'Maize Fall Armyworm',
    pathogen: 'Spodoptera frugiperda',
    category: 'Spodoptera frugiperda • High Voracity',
    crop: 'Maize Sweet Corn Parcel',
    location: 'North Quadrant Central Whorls',
    confidence: 98.1,
    severity: 'Severe',
    severityStage: 'Stage 3 (Urgent)',
    affectedCanopy: '31.0% leaf whorl damage',
    incubation: 'Instar larvae feeding in central whorl',
    chemicalRx: {
      title: 'Emamectin Benzoate 5% SG',
      description: 'Whorl application of Emamectin Benzoate 5% SG @ 0.4g/L or Chlorantraniliprole 18.5% SC @ 0.4ml/L with pencil-jet nozzle directed into funnel.',
      tag: 'DPPQS Standard Directive',
    },
    organicRx: {
      title: 'Bacillus thuringiensis (Bt) kurstaki',
      description: 'Apply Bt formulation @ 2g/L or Metarhizium rileyi entomopathogenic fungal spore suspension in early morning or evening hours.',
      tag: 'Bio-Safety Level 1',
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwR9hsWUjuZqgw2pxiCpO-9U_I0RPIZN-pOWAwcTvH5APdCrj5gT7yD6XssbgTp2DviKGnU2w3Ql_hpEShDiopJQ3iJlN8KRjAWO7-2lSnmR7kMFpcAu41HtIKiL5FNF1khLx-NxoGqXi9HTFJr2DRWEgoSesMW5KhcjMaIsjb1Pv_-sssSzJY7TQ-HIjc9XZrJSZd_xk5k8H8yBwj_y-DlMfuMws7DGOA-4hKf3cAzfyfPZ-_3Mby',
  },
  {
    id: 'groundnut-tikka',
    name: 'Groundnut Tikka Leaf Spot',
    pathogen: 'Cercospora arachidicola',
    category: 'Cercospora arachidicola • Fungal',
    crop: 'Groundnut Western Block',
    location: 'Groundnut Intercrop Row 8',
    confidence: 95.3,
    severity: 'Moderate',
    severityStage: 'Stage 2 (Moderate)',
    affectedCanopy: '14.8% leaf spot coverage',
    incubation: 'Circular necrotic spots with yellow halo',
    chemicalRx: {
      title: 'Hexaconazole 5% SC / Carbendazim',
      description: 'Foliar spray of Hexaconazole 5% SC @ 2ml/L or Carbendazim 12% + Mancozeb 63% WP (Saaf) @ 2g/L water on lower canopy.',
      tag: 'High Systemic Eradication',
    },
    organicRx: {
      title: 'Panchagavya 3% + Trichoderma',
      description: 'Apply fresh Panchagavya spray (30ml/L) blended with Trichoderma viride culture to suppress leaf foliar fungal mycelia.',
      tag: 'Natural Vedic Farming',
    },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtm9brD-2kG1R52anHVol_60En85afRlZt845bnF9sCoI8Oh4UUmiHYl8LhluwqmQzY1r6-d7fQzCtPoRSRE2oUnOouV9ZWgmTBCg_RPRTlMkpjC00HZJNzxcqwE9MMsAMX1cyNw9CnLJzc374Ibyk6m37ZqOXDGU9sc-eTqnrf6-na4frbAzlwQL_VPfjjUFObqaTHSZGglvWVd1GCfL1FPPGiT0eAdA7oj3x7PctgAPfwSHxeZp1',
  },
];

export const CropDoctorView: React.FC<CropDoctorViewProps> = ({
  onOpenScanModal,
  onOpenDostAi,
  onNavigateTab,
}) => {
  const { t } = useTranslation();
  const [selectedCase, setSelectedCase] = useState<SampleTest>(SAMPLE_TESTS[0]);
  const [acreage, setAcreage] = useState<number>(4.5);
  const [orderedToast, setOrderedToast] = useState<boolean>(false);
  const [consultModalOpen, setConsultModalOpen] = useState<boolean>(false);
  const [preventiveChecklist, setPreventiveChecklist] = useState({
    item1: true,
    item2: true,
    item3: false,
  });

  // Calculate dynamic dosage requirements based on acreage
  const waterReq = Math.round(acreage * 200);
  const tanksReq = Math.round(waterReq / 20);
  const coReq = (acreage * 0.5).toFixed(2);
  const strepReq = Math.round(acreage * 20);
  const pouchesReq = Math.ceil(strepReq / 6);
  const costReq = Math.round(acreage * 322);

  const handleOrderKit = () => {
    setOrderedToast(true);
    setTimeout(() => setOrderedToast(false), 5000);
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Toast Notification */}
      {orderedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#113E2E] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400/50 animate-bounce">
          <span className="material-symbols-outlined text-[#E5B54F] text-2xl">check_circle</span>
          <div>
            <p className="font-bold text-sm">Prescription Kit Ordered Successfully!</p>
            <p className="text-xs text-emerald-200">Express delivery dispatched to Guntur Farm Store. Total: ₹{costReq.toLocaleString('en-IN')}</p>
          </div>
        </div>
      )}

      {/* Header & Meta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{t('nav.workspace')}</span>
            <span>/</span>
            <span>{t('nav.cropDoctor')}</span>
            <span>/</span>
            <span className="text-[#113E2E] font-bold">{t('doctor.title')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#113E2E]">{t('doctor.title')}</h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#113E2E] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#1B6F49] animate-pulse"></span>
              {t('doctor.badge')}
            </span>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl">
            {t('doctor.subtitle')}
          </p>
        </div>

        {/* Quick Stat Pill Group */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-[#E8EFE5] p-1.5 rounded-xl shadow-xs">
          <div className="px-3.5 py-1.5 rounded-lg bg-white shadow-xs text-left">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Diagnostics Today</p>
            <p className="text-lg font-bold text-[#113E2E]">1,428 <span className="text-xs text-[#1B6F49] font-normal">healed</span></p>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-white shadow-xs text-left">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Model Accuracy</p>
            <p className="text-lg font-bold text-[#113E2E]">98.2%</p>
          </div>
        </div>
      </div>

      {/* Regional Alert Banner (Spodoptera Outbreak Warning) */}
      <div className="p-4 rounded-xl bg-red-50 text-red-950 border border-red-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">warning</span>
          </div>
          <div>
            <p className="font-bold text-sm text-red-900">High Pest Alert: Spodoptera litura (Armyworm) detected in 25km radius</p>
            <p className="text-xs text-red-800/80">Gopal &amp; Guntur district mandals reporting early leaf perforations in Chilli &amp; Maize parcels.</p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('diseases')}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors whitespace-nowrap self-end md:self-auto shadow-xs"
        >
          View Prevention Protocol
        </button>
      </div>

      {/* Primary Scanner Area (Interactive Dropzone) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE] flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 text-[#113E2E] border border-emerald-300 mb-2 text-[11px] font-bold shadow-xs tracking-wider">
                  <span className="material-symbols-outlined text-[15px] animate-pulse text-[#1B6F49]">electric_bolt</span>
                  <span>{t('doctor.badge')}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3FB968] animate-pulse"></span>
                </div>
                <h2 className="text-xl sm:text-[22px] text-[#113E2E] font-bold">{t('doctor.uploadTitle')}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{t('doctor.uploadSub')}</p>
              </div>
              <span className="text-xs bg-slate-100 text-[#113E2E] font-bold px-3 py-1 rounded-full border border-emerald-200/60 shadow-xs">
                Max 15MB • JPG, PNG, WEBP
              </span>
            </div>

            {/* Dropzone Container */}
            <div
              onClick={onOpenScanModal}
              className="group relative rounded-2xl p-8 sm:p-10 text-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50/70 border-2 border-dashed border-[#1B6F49] hover:border-[#113E2E] hover:shadow-md transition-all cursor-pointer shadow-xs relative overflow-hidden"
            >
              <div className="absolute -right-12 -top-12 w-36 h-36 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="relative z-0 flex flex-col items-center justify-center gap-3.5">
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-20 h-20 rounded-full bg-emerald-400/20 animate-ping"></span>
                  <div className="w-16 h-16 rounded-2xl bg-[#113E2E] group-hover:scale-110 transition-transform flex items-center justify-center text-white shadow-md ring-4 ring-emerald-600/30">
                    <span className="material-symbols-outlined text-[36px] text-[#90d6ab]">photo_camera</span>
                  </div>
                </div>
                <div>
                  <p className="text-lg text-[#113E2E] font-bold">{t('doctor.dragDrop')}</p>
                  <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                    Our neural vision model segments lesions, calculates pathogen chlorosis, and cross-references ICAR databases.
                  </p>
                </div>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#113E2E] hover:bg-[#0a291f] text-white text-sm font-semibold shadow-md transition-all group-hover:shadow-lg">
                    <span className="material-symbols-outlined text-[18px] text-emerald-300">upload_file</span>
                    <span>{t('doctor.browseFiles')}</span>
                  </span>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
                  <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-white text-[#113E2E] border border-emerald-200/60 shadow-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span> Macro focus
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-white text-[#113E2E] border border-emerald-200/60 shadow-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span> Good daylight
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-white text-[#113E2E] border border-emerald-200/60 shadow-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span> Sharp margins
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Scan Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5">
            <button
              onClick={onOpenScanModal}
              className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-[#F8FAF7] text-slate-800 hover:bg-white hover:border-emerald-300 border border-[#D5E1D2] transition-all text-xs font-semibold shadow-xs group"
            >
              <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-[#113E2E] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[18px]">videocam</span>
              </span>
              <span>{t('doctor.liveCamera')}</span>
            </button>
            <button
              onClick={onOpenDostAi}
              className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-[#F8FAF7] text-slate-800 hover:bg-white hover:border-emerald-300 border border-[#D5E1D2] transition-all text-xs font-semibold shadow-xs group"
            >
              <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </span>
              <span>{t('doctor.whatsappBot')}</span>
            </button>
            <button
              onClick={onOpenScanModal}
              className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-[#F8FAF7] text-slate-800 hover:bg-white hover:border-emerald-300 border border-[#D5E1D2] transition-all text-xs font-semibold shadow-xs group"
            >
              <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[18px]">photo_library</span>
              </span>
              <span>{t('doctor.gallery')}</span>
            </button>
          </div>
        </div>

        {/* Quick Test Bench / Sample Gallery */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <h2 className="font-bold text-base text-[#113E2E]">One-Click Sample Tests</h2>
              <span className="text-xs text-slate-500 font-semibold">Instant Demo</span>
            </div>
            <p className="text-xs text-slate-600 pb-4">
              Test diagnosis pipeline instantly with curated field samples from Andhra &amp; Telangana agro-climatic zones.
            </p>
            <div className="space-y-2.5">
              {SAMPLE_TESTS.map((sample) => {
                const isSelected = selectedCase.id === sample.id;
                return (
                  <button
                    key={sample.id}
                    onClick={() => setSelectedCase(sample)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 group border ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                        : 'bg-[#F8FAF7] border-transparent hover:bg-emerald-50/50 hover:border-emerald-200'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 shadow-xs">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform" src={sample.image} alt={sample.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-[#113E2E]' : 'text-slate-800'}`}>
                          {sample.name}
                        </p>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{sample.category}</p>
                    </div>
                    <span className={`material-symbols-outlined text-[20px] ${isSelected ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-700'}`}>
                      {isSelected ? 'check' : 'chevron_right'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs">
            <span>Auto-calibration via GPS: Andhra Pradesh</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-700">my_location</span>
          </div>
        </div>
      </div>

      {/* Active Diagnostic Case Study: Pro Diagnosis Suite */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-[#DFEBDE]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 gap-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 pb-1">
              <span className="font-mono font-bold text-slate-700">SCAN ID: #KD-88421</span>
              <span>•</span>
              <span>{selectedCase.location}</span>
              <span>•</span>
              <span>Captured Today, 08:42 AM</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#113E2E]">Diagnostic Evaluation &amp; Treatment Protocol</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => alert(`Prescription for ${selectedCase.name} shared with Area Officer K. Prasad.`)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Share with Field Officer</span>
            </button>
            <button
              onClick={() => alert(`Prescription PDF generated for ${selectedCase.name}. Ready for print/download.`)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Prescription (PDF)</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Visual Inspection Panel */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-sm bg-slate-100 aspect-[4/3] ring-2 ring-emerald-600/30">
              <img className="w-full h-full object-cover" src={selectedCase.image} alt={selectedCase.name} />

              {/* Viewfinder reticle brackets */}
              <div className="absolute inset-3 pointer-events-none">
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-emerald-400"></div>
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-emerald-400"></div>
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-emerald-400"></div>
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-emerald-400"></div>
              </div>

              {/* Active Scan Pulsing Pill */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                <div className="px-3 py-1 rounded-full bg-[#113E2E]/95 text-white text-xs backdrop-blur-xs flex items-center gap-2 shadow-md border border-emerald-400/40">
                  <span className="w-2 h-2 rounded-full bg-[#3FB968] animate-pulse"></span>
                  <span className="font-bold tracking-wide">Active Scan Analyzed</span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm w-fit">
                  <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                  <span>{selectedCase.confidence}% Match Confidence</span>
                </div>
              </div>

              {/* Severity Badge */}
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-md border border-amber-300 flex items-center gap-1.5 z-10">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>Severity: {selectedCase.severityStage}</span>
              </div>
            </div>

            {/* Pathology Attributes */}
            <div className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Identified Pathogen:</span>
                <span className="font-bold text-[#113E2E] italic">{selectedCase.pathogen}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Common Name:</span>
                <span className="font-bold text-slate-800">{selectedCase.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Affected Canopy:</span>
                <span className="font-bold text-slate-800">{selectedCase.affectedCanopy}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Incubation Stage:</span>
                <span className="font-bold text-amber-700">{selectedCase.incubation}</span>
              </div>
            </div>

            {/* Environmental Context Tile */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#113E2E] shrink-0">
                <span className="material-symbols-outlined text-[20px]">air</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#113E2E]">Current Weather Advisory</p>
                <p className="text-xs text-slate-600 mt-0.5">Wind speed: 8 km/h • Humidity: 78% • Ideal spray window next 6 hours.</p>
              </div>
            </div>
          </div>

          {/* Treatment & Prescription Panel */}
          <div className="lg:col-span-8 flex flex-col justify-between gap-6">
            <div>
              {/* Tabbed Prescription Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Chemical Protocol Card */}
                <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#DFEBDE] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-xs font-bold text-[#113E2E]">
                        Standard Chemical Rx
                      </span>
                      <span className="text-xs font-bold text-amber-600">Fast Action (24-48h)</span>
                    </div>
                    <h3 className="font-bold text-base text-[#113E2E] pt-1">{selectedCase.chemicalRx.title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {selectedCase.chemicalRx.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-slate-600 text-xs">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                    <span>{selectedCase.chemicalRx.tag}</span>
                  </div>
                </div>

                {/* Organic / Biological Control Card */}
                <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#DFEBDE] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-xs font-bold text-amber-900">
                        Eco Bio-Control Rx
                      </span>
                      <span className="text-xs font-bold text-[#1B6F49]">Zero-Chemical Residue</span>
                    </div>
                    <h3 className="font-bold text-base text-[#113E2E] pt-1">{selectedCase.organicRx.title}</h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {selectedCase.organicRx.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-2 text-slate-600 text-xs">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">eco</span>
                    <span>{selectedCase.organicRx.tag}</span>
                  </div>
                </div>
              </div>

              {/* Dosage Calculator Tool */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-[#E8EFE5] border border-emerald-200/80 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200/50">
                  <div>
                    <h4 className="font-bold text-sm text-[#113E2E]">{t('doctor.dosageTitle')}</h4>
                    <p className="text-xs text-slate-600">{t('doctor.dosageSub')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">{t('doctor.fieldArea')}:</span>
                    <div className="flex items-center rounded-xl bg-white px-3 py-1.5 shadow-xs border border-emerald-200">
                      <input
                        className="w-16 text-base font-bold text-[#113E2E] bg-transparent outline-none text-right"
                        id="acreage-input"
                        step="0.5"
                        min="0.5"
                        max="50"
                        type="number"
                        value={acreage}
                        onChange={(e) => setAcreage(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                      />
                      <span className="text-xs font-semibold text-slate-500 pl-1.5">Acres</span>
                    </div>
                  </div>
                </div>

                {/* Calculated Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  <div className="p-3 rounded-xl bg-white text-center shadow-xs border border-[#DFEBDE]">
                    <p className="text-[11px] text-slate-500 font-medium">{t('doctor.totalWater')}</p>
                    <p className="text-lg font-bold text-[#113E2E] pt-0.5">{waterReq} Liters</p>
                    <p className="text-[11px] text-slate-500">{tanksReq} knapsack tanks</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white text-center shadow-xs border border-[#DFEBDE]">
                    <p className="text-[11px] text-slate-500 font-medium">Copper Oxychloride</p>
                    <p className="text-lg font-bold text-[#113E2E] pt-0.5">{coReq} kg</p>
                    <p className="text-[11px] text-slate-500">50% WP Powder</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white text-center shadow-xs border border-[#DFEBDE]">
                    <p className="text-[11px] text-slate-500 font-medium">Streptocycline</p>
                    <p className="text-lg font-bold text-[#113E2E] pt-0.5">{strepReq} grams</p>
                    <p className="text-[11px] text-slate-500">{pouchesReq} pouches × 6g</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white text-center shadow-xs border border-[#DFEBDE]">
                    <p className="text-[11px] text-slate-500 font-medium">{t('doctor.estCost')}</p>
                    <p className="text-lg font-bold text-amber-600 pt-0.5">₹{costReq.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-emerald-700 font-medium">Save ₹480 online</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handleOrderKit}
                className="flex-1 px-6 py-3.5 rounded-xl bg-[#113E2E] text-white hover:bg-[#0d3328] transition-all text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px] text-[#E5B54F]">shopping_bag</span>
                <span>{t('doctor.orderKitBtn')} (₹{costReq.toLocaleString('en-IN')})</span>
              </button>
              <button
                onClick={() => setConsultModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#113E2E] text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-slate-200"
              >
                <span className="material-symbols-outlined text-[#113E2E] text-[20px]">support_agent</span>
                <span>{t('doctor.consultBtn')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Layout: Diagnostic History & Regional Pest Surveillance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Diagnostic History & Parcel Health Timeline */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4">
              <div>
                <h2 className="font-bold text-base text-[#113E2E]">Recent Diagnostic History</h2>
                <p className="text-xs text-slate-500">Tracking recovery rate across your 5 registered field parcels.</p>
              </div>
              <button
                onClick={() => alert('Opening all 24 historical field scans archived in your farm cloud ledger.')}
                className="text-xs text-[#113E2E] font-bold hover:underline"
              >
                View All Scans (24)
              </button>
            </div>

            {/* History Records */}
            <div className="space-y-3">
              {/* Record 1 */}
              <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E7EFE7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyLsD0wXCmsRezZkQaALJ4oYbkSgPHv9ZhxMB3I1nPEqSosV_NwXvxkUfjJVMDc13UxcQPMyBGwYdzQHeZCNA_qGpmLhA095JVY3AnkbEmjXqnTpyq-l2MfQPhylB7HHmLVYEr5-1eQUmdLYqA38JxaoOJsG5YWU0b_LmP6t6iknQy2qk4JH-Drc2JuTwQJQKpwd1zt4YLpyEaHOSjvvIV9dG6oN1zb9FpgqBflzVNx5iOY6v0gSGY" alt="Rice leaf" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Basmati Plot A • BLB Xanthomonas</p>
                    <p className="text-[11px] text-slate-500">Oct 24 • Streptocycline applied</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Moderate</span>
                    <p className="text-xs text-emerald-700 font-bold">85% Recovered</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
                </div>
              </div>

              {/* Record 2 */}
              <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E7EFE7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZvuM6vZPR_luNTcMTf9xYEbDzILAxdOm-WlC0dE8urJ8A4YWkJnHp38_dZmqyYCRs5qENF-cXCRIDXlnuQy1gb3kCO6OasrMs3yWnNpauhFfG9z-aFMqHN0ss3iWtOQl5QeC-rR5By85s5eABtxAnvpWHHGtfrkYloI0gptSNm7X-rPOt9YmouiNpwmOQYy5TgfgDBB8UGdsJKK5myYIjhbaFbTOn3aE3AikSbBaLVGqp0g5PksDV" alt="Chilli plant" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Chilli Block B • Whitefly Nymphs</p>
                    <p className="text-[11px] text-slate-500">Oct 16 • Neem oil 10,000 ppm applied</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Resolved</span>
                    <p className="text-xs text-emerald-700 font-bold">100% Healthy</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
                </div>
              </div>

              {/* Record 3 */}
              <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E7EFE7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc71mnJB-jC-tUqdxXLVa4pKWlVhgyvplKOERcfhxoZGWx6rZz87M1m-jJxGsVjSGSmfJR8kRbqZnnltZoYYKJTR4D-99QpS6sK2i8rUbnpgtup5EurRE9Zp6anNl6nLqWgLqADRWLwN-3qIkBzKQEQYLBHBiIKdxG0KYGbNKHLhP7OFE-1Xw5IgsCLV5ubngJZeWdtpFOoI69YquRobWg3mnU-KjYmE0-2EnK5obsHL6SodWJKySr" alt="Cotton leaf" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Cotton Acre 3 • Potassium Deficiency</p>
                    <p className="text-[11px] text-slate-500">Oct 11 • SOP 0-0-50 foliar nutrition</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Resolved</span>
                    <p className="text-xs text-emerald-700 font-bold">Healthy Green</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
                </div>
              </div>

              {/* Record 4 */}
              <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#E7EFE7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb19AAgHUJq0KEYfgp97mIaSmRCwZCOv8IKQcaAZx_ZidmkjXMNffWsrIxMCcVilJZY5IphLPek_ll9kFqr94At-KhQc48QbVybnc9XjX_ydFrEvJHOQcFgaXPv2BcOJe6gyUc84XmznQjmFFSFSIlhUY5ILDi4ceNR8v1TTKjdVp_GDP0-po8FpKIjquQ8yBdVoTlEWaoSYWSbTpkfASzHyE7TzKWRU1m-7W1OX8T2-OOnk14anUH" alt="Maize plant" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Maize Parcel C • Turcicum Leaf Blight</p>
                    <p className="text-[11px] text-slate-500">Sep 28 • Mancozeb 75% WP</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Resolved</span>
                    <p className="text-xs text-emerald-700 font-bold">Stable yield</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Recovery Progress Sparkline Graphic */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-slate-600 text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#113E2E] text-[20px]">timeline</span>
              <span>Average farm healing turnaround: <strong className="text-slate-900">4.2 days</strong></span>
            </div>
            <span className="text-emerald-700 font-bold">↑ 38% faster than regional avg</span>
          </div>
        </div>

        {/* Regional Outbreak Heatmap & Daily Prevention Routine */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <h2 className="font-bold text-base text-[#113E2E]">Regional Pest Surveillance</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold">
                Live Sensor Grid
              </span>
            </div>
            <p className="text-xs text-slate-600 pb-4">
              Real-time aggregation from 182 IoT pheromone traps &amp; farmer diagnostic uploads across Guntur, Tenali &amp; Vijayawada belts.
            </p>

            {/* Agrarian Radar Map Indicator */}
            <div className="p-4 rounded-xl bg-[#F8FAF7] border border-[#E7EFE7] mb-5">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-800">Gopal Delta Corridor</span>
                <span className="text-[11px] text-slate-500 font-semibold">Radius: 35 km</span>
              </div>
              <div className="space-y-2.5 pt-1">
                <div>
                  <div className="flex justify-between text-xs pb-1">
                    <span className="text-slate-700 font-medium">Spodoptera litura (Armyworm)</span>
                    <span className="text-red-600 font-bold">Severe (82%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs pb-1">
                    <span className="text-slate-700 font-medium">Brown Plant Hopper (BPH - Paddy)</span>
                    <span className="text-amber-600 font-bold">Moderate (46%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '46%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs pb-1">
                    <span className="text-slate-700 font-medium">Chilli Thrips &amp; Mites</span>
                    <span className="text-emerald-600 font-bold">Low (19%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '19%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Preventive Action Checklist */}
            <div>
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider pb-2.5">Today's Preventive Actions</h3>
              <div className="space-y-2">
                <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preventiveChecklist.item1}
                    onChange={(e) => setPreventiveChecklist(prev => ({ ...prev, item1: e.target.checked }))}
                    className="mt-0.5 rounded text-[#113E2E] focus:ring-0"
                  />
                  <span className="text-xs text-slate-700 leading-snug">Drain standing excess water in Basmati Plot A to arrest root sheath bacterial propagation.</span>
                </label>
                <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preventiveChecklist.item2}
                    onChange={(e) => setPreventiveChecklist(prev => ({ ...prev, item2: e.target.checked }))}
                    className="mt-0.5 rounded text-[#113E2E] focus:ring-0"
                  />
                  <span className="text-xs text-slate-700 leading-snug">Inspect 8 yellow sticky traps installed along the western chilli perimeter.</span>
                </label>
                <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preventiveChecklist.item3}
                    onChange={(e) => setPreventiveChecklist(prev => ({ ...prev, item3: e.target.checked }))}
                    className="mt-0.5 rounded text-[#113E2E] focus:ring-0"
                  />
                  <span className="text-xs text-slate-700 leading-snug">Apply prophylactic Trichoderma harzianum soil enrichment before evening dew.</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <button
              onClick={() => onNavigateTab('weather')}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore 14-Day Microclimate Pest Risk Map</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Agronomist & KVK Scientist Fast-Connect Dock */}
      <div className="p-6 rounded-3xl bg-[#E8EFE5] border border-emerald-200/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden shrink-0 shadow-sm ring-2 ring-emerald-600/30">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwJBMvLMEzNZc6m99gn8_1sa1FYyYW6gYG9Lpwmrbe76JXCoe95eoHVe3uieJKfGSITHm1Y5htFo7EujnKse7dP1xnu5dlLV497DXrU0Th0Jls63AAqDkfQoJQPm08FAQ5tPhZgqD-72PnEdb7rWNKr1VgNriDt8evqvtY1ELOYJUtYMTdbcGKDGhBFJVOqWgmoSNV-qxDNehBZzBBtTpCmfdzhZ0cJEcExV_AvdDQUkkYf-wtDkUg"
              alt="Dr. M. Venkat Raman"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#113E2E]">Dr. M. Venkat Raman, Ph.D.</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#113E2E] text-[11px] font-bold">Chief Pathologist • KVK Guntur</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">Specialized in Paddy, Chilli &amp; Cotton pathology. On-duty today until 6:00 PM for video diagnostic calls.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setConsultModalOpen(true)}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-[#113E2E] text-white hover:bg-[#0a291f] text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#E5B54F]">video_call</span>
            <span>Request Instant 1-on-1 Call</span>
          </button>
          <button
            onClick={onOpenDostAi}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#113E2E] text-xs font-bold flex items-center justify-center gap-2 border border-emerald-300 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Ask Dost AI First</span>
          </button>
        </div>
      </div>

      {/* Consult Modal */}
      {consultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-2xl">support_agent</span>
                <h3 className="font-bold text-base text-[#113E2E]">KVK Agronomist Consultation</h3>
              </div>
              <button onClick={() => setConsultModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600">
              <p>Connecting you to <strong>Dr. M. Venkat Raman</strong> (KVK Guntur Pathologist).</p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="font-bold text-[#113E2E]">Available Hotline Options:</p>
                <p className="mt-1">📞 Toll-Free Kisan Call Centre: <strong>1800-180-1551</strong></p>
                <p>💬 Direct KVK WhatsApp Desk: <strong>+91 863 223 4811</strong></p>
              </div>
              <p>A video consultation request with your attached scan dossier (#KD-88421) has been queued. An SMS with the secure video room link will be sent to +91 98480 •••• shortly.</p>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setConsultModalOpen(false)}
                className="px-4 py-2 bg-[#113E2E] text-white rounded-xl font-bold text-xs hover:bg-[#0a291f]"
              >
                Confirm &amp; Await Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
