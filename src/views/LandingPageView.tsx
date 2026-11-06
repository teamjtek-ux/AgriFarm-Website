/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActiveTab } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface LandingPageViewProps {
  onEnterWorkspace: (tab?: ActiveTab) => void;
  onOpenDostAi: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterWorkspace,
  onOpenDostAi,
}) => {
  const { t } = useTranslation();
  const features = [
    {
      tab: 'calendar' as ActiveTab,
      icon: 'calendar_today',
      title: 'Dynamic Crop Calendar',
      desc: 'Stage-by-stage sowing to harvest phenology, automated fertigation timelines, and weather-adjusted tasks.',
      color: 'bg-emerald-100 text-[#113E2E]',
    },
    {
      tab: 'doctor' as ActiveTab,
      icon: 'health_and_safety',
      title: 'AI Crop Doctor',
      desc: 'Instant plant disease diagnosis from leaf photos with precision dosage calculator and verified ICAR prescriptions.',
      color: 'bg-red-100 text-red-700',
    },
    {
      tab: 'weather' as ActiveTab,
      icon: 'wb_sunny',
      title: 'Hyperlocal Micro-Weather',
      desc: 'Live IoT field station readings, Doppler coastal radar, 24h spray drift matrix, and severe cyclone warnings.',
      color: 'bg-sky-100 text-sky-700',
    },
    {
      tab: 'market' as ActiveTab,
      icon: 'trending_up',
      title: 'Real-Time Mandi Intelligence',
      desc: 'Live AGMARKNET rates, 15-day AI price trajectory forecasts, cross-mandi freight arbitrage, and corporate buyer tenders.',
      color: 'bg-amber-100 text-amber-800',
    },
    {
      tab: 'diseases' as ActiveTab,
      icon: 'menu_book',
      title: '128+ Diseases & Pests Library',
      desc: 'Comprehensive visual pathology catalog with biological, cultural, and chemical integrated pest management (IPM).',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      tab: 'crops' as ActiveTab,
      icon: 'shield',
      title: 'Cyclone Mitigation & PMFBY',
      desc: 'Pre-storm parcel checklists, lodging mitigation guidelines, and 1-click insurance claim evidence dossier generation.',
      color: 'bg-teal-100 text-teal-800',
    },
    {
      tab: 'overview' as ActiveTab,
      icon: 'psychology',
      title: 'Dost AI Agronomist',
      desc: 'Voice & text conversational agricultural assistant speaking Telugu, Hindi, and English with regional farm expertise.',
      color: 'bg-emerald-100 text-[#1B6F49]',
    },
    {
      tab: 'notifications' as ActiveTab,
      icon: 'notifications_active',
      title: 'Instant Multi-Channel Alerts',
      desc: 'Dispatched via SMS, WhatsApp, and automated IVR voice alerts for severe pest flare-ups and price spikes.',
      color: 'bg-orange-100 text-orange-700',
    },
  ];

  return (
    <div className="flex-1 w-full bg-[#F3F6F1]">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-[#113E2E] text-xs font-bold tracking-wide shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#1B6F49] animate-pulse"></span>
                <span>AI-Powered • Farmer Focused • Sustainable</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#113E2E] tracking-tight leading-[1.12]">
                {t('landing.heroTitle')}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl">
                {t('landing.heroSub')}
              </p>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onEnterWorkspace('overview')}
                  className="inline-flex items-center gap-2 bg-[#113E2E] hover:bg-[#0a291f] text-white text-base font-bold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition duration-200 group"
                >
                  <span>{t('landing.launchWorkspace')}</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <button
                  onClick={onOpenDostAi}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#113E2E] border border-slate-300 font-bold px-6 py-3.5 rounded-xl shadow-xs transition"
                >
                  <span className="material-symbols-outlined text-emerald-700">chat</span>
                  <span>{t('landing.askDostAiDemo')}</span>
                </button>
              </div>

              {/* Social Proof */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-amber-200 flex items-center justify-center font-bold text-xs text-amber-900 shadow-xs">KR</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-emerald-200 flex items-center justify-center font-bold text-xs text-emerald-900 shadow-xs">SD</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-sky-200 flex items-center justify-center font-bold text-xs text-sky-900 shadow-xs">BS</div>
                </div>
                <div className="text-xs sm:text-sm text-slate-600">
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <span className="text-amber-500">★★★★★</span>
                    <span className="ml-1">4.8 / 5 Rating</span>
                  </div>
                  <p className="text-slate-500 font-medium">Trusted by <strong className="text-[#113E2E]">50,000+</strong> farmers across India</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Badges */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              <div className="absolute w-80 h-80 sm:w-96 sm:h-96 bg-emerald-300/30 rounded-full filter blur-3xl -z-10 top-1/2 -translate-y-1/2"></div>
              <div className="relative w-full max-w-md lg:max-w-lg">
                {/* Farmer Illustration Card */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-emerald-100 to-white border-4 border-white shadow-xl p-3">
                  <div className="relative w-full h-[440px] rounded-2xl overflow-hidden bg-emerald-950 flex flex-col justify-end">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvs_Ck9apokSW9sH-_cTAw2quhxPj_bF6BUelLIGzTC_REowwXIGHAGqt4kk-ALjCatxpMKbbkvO9mAQ3_mFg3hl1GyOQKqLz8JZRYF4dBZ8hM7qak2Gy-8WZ9m1vh9ES_LPbNhddNs81882GUzIUtRMvRaguwH6wg2ZuiNIb7EjeNE01VqXSdVidfNq2ojdF25G81GfAfxBuBpEn796hWQt4zl0sGaUr3kLI7betI_XAAOymU8BtA"
                      alt="Indian farmer checking crop diagnostics"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                    <div className="relative p-5 text-white">
                      <p className="text-sm font-bold text-emerald-300">Real-Time Agronomic Advisory</p>
                      <p className="text-xs text-slate-200">Gopal Rao checking live cyclone mitigation directives in Guntur</p>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1: Crop Health */}
                <div className="absolute -top-3 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-emerald-100 flex items-start gap-3 max-w-[240px]">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-[#113E2E]">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">98% Healthy</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Basmati Paddy Plot 2 • Optimal Growth</p>
                  </div>
                </div>

                {/* Floating Badge 2: Pest Warning */}
                <div className="absolute top-1/2 -right-4 sm:-right-8 -translate-y-1/2 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-red-100 flex items-start gap-3 max-w-[240px]">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0 text-red-600">
                    <span className="material-symbols-outlined text-lg">warning</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-red-900">Pest Risk Warning</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">High humidity detected. Spray preventive bio-agent.</p>
                  </div>
                </div>

                {/* Floating Badge 3: Mandi Price Alert */}
                <div className="absolute -bottom-4 left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-amber-100 flex items-start gap-3 max-w-[260px]">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
                    <span className="material-symbols-outlined text-lg">trending_up</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900">Mandi Price Alert</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">+₹140/qtl</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Chana Dal spiked to ₹6,920 in Nagpur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Feature Showcase Grid */}
      <section className="py-16 bg-white border-y border-[#DFEBDE]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#113E2E] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Full Spectrum Agronomy
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#113E2E] mt-3">
              {t('landing.featuresHeading')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {t('landing.featuresSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                onClick={() => onEnterWorkspace(feat.tab)}
                className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-2xl p-6 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feat.color} group-hover:scale-105 transition-transform`}>
                    <span className="material-symbols-outlined text-2xl">{feat.icon}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#113E2E] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center gap-1 text-xs font-bold text-[#113E2E] group-hover:text-emerald-700">
                  <span>Open Tool</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-16 bg-[#113E2E] text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-bold font-serif text-[#E5B54F]">50,000+</p>
              <p className="text-xs sm:text-sm text-emerald-200 font-medium">Registered Farmers</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-bold font-serif text-[#E5B54F]">18+</p>
              <p className="text-xs sm:text-sm text-emerald-200 font-medium">Agro-Climatic Zones</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-bold font-serif text-[#E5B54F]">25%</p>
              <p className="text-xs sm:text-sm text-emerald-200 font-medium">Avg Chemical Cost Saved</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-bold font-serif text-[#E5B54F]">₹18 Cr+</p>
              <p className="text-xs sm:text-sm text-emerald-200 font-medium">Direct Farmer Profit Growth</p>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Stories */}
      <section className="py-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#113E2E] uppercase tracking-wider bg-emerald-100/70 px-3 py-1 rounded-full">
            Farmer Testimonials
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#113E2E] mt-3">
            Voices from the Field
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE] space-y-4">
            <div className="flex items-center gap-1 text-amber-500 text-sm">★★★★★</div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "During the last cyclone warning, the KissanDost checklist helped us dig runoff trenches in Plot A 12 hours before heavy rains. We saved 4.5 acres of Basmati from waterlogged lodging."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#113E2E] font-bold flex items-center justify-center text-xs">KR</div>
              <div>
                <p className="text-xs font-bold text-slate-900">Gopal Rao</p>
                <p className="text-[11px] text-slate-500">Guntur, Andhra Pradesh (Paddy &amp; Chilli)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE] space-y-4">
            <div className="flex items-center gap-1 text-amber-500 text-sm">★★★★★</div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "The Mandi Arbitrage comparison showed me Nagpur was offering ₹6,920/qtl for Chana while local APMC was at ₹6,480. Even after freight, I earned ₹38,000 more on 10 tonnes."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">SP</div>
              <div>
                <p className="text-xs font-bold text-slate-900">Suresh Patil</p>
                <p className="text-[11px] text-slate-500">Nashik, Maharashtra (Pulses &amp; Onion)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE] space-y-4">
            <div className="flex items-center gap-1 text-amber-500 text-sm">★★★★★</div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "Scanning diseased leaves with Crop Doctor diagnosed Yellow Stem Borer in minutes and gave me exact chlorantraniliprole dosage. No guesswork or overpaying at private agro stores."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-900 font-bold flex items-center justify-center text-xs">BS</div>
              <div>
                <p className="text-xs font-bold text-slate-900">Balwinder Singh</p>
                <p className="text-[11px] text-slate-500">Ludhiana, Punjab (Wheat &amp; Mustard)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 bg-gradient-to-r from-[#113E2E] to-[#1B6F49] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            {t('landing.ctaHeading')}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
            {t('landing.ctaSub')}
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => onEnterWorkspace('overview')}
              className="px-8 py-4 rounded-xl bg-[#E5B54F] hover:bg-[#d8a53a] text-[#113E2E] font-bold text-base shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
              <span>{t('landing.enterWorkspace')}</span>
              <span className="material-symbols-outlined text-lg">agriculture</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
