/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface WeatherViewProps {
  onOpenDostAi: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const WeatherView: React.FC<WeatherViewProps> = ({
  onOpenDostAi,
  onNavigateTab,
}) => {
  const { t } = useTranslation();
  const [timelineIndex, setTimelineIndex] = useState<number>(3);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [smsTriggers, setSmsTriggers] = useState({
    wind: true,
    rain: true,
    heat: false,
  });

  const handleRefreshSensors = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const sprayStripData = [
    { time: '06:00 AM', icon: 'wb_twilight', temp: '23°C', wind: '9 km/h', status: 'Optimal', badgeBg: 'bg-emerald-100 text-[#113E2E]', note: 'Wetness: 2.1h' },
    { time: '08:00 AM', icon: 'wb_sunny', temp: '26°C', wind: '11 km/h', status: 'Optimal', badgeBg: 'bg-emerald-100 text-[#113E2E]', note: 'Wetness: 0.4h' },
    { time: '10:00 AM', icon: 'wb_sunny', temp: '28°C', wind: '13 km/h', status: 'Optimal', badgeBg: 'bg-emerald-100 text-[#113E2E]', note: 'Wetness: 0h' },
    { time: '12:00 PM', icon: 'partly_cloudy_day', temp: '30°C', wind: '18 km/h', status: 'Marginal', badgeBg: 'bg-amber-100 text-amber-900', note: 'Thermal Lift' },
    { time: '02:00 PM', icon: 'air', temp: '31°C', wind: '22 km/h', status: 'Drift Risk', badgeBg: 'bg-amber-100 text-amber-900', note: 'High Gusts' },
    { time: '04:00 PM', icon: 'cloud', temp: '29°C', wind: '26 km/h', status: 'Do Not Spray', badgeBg: 'bg-red-100 text-red-800', note: 'Precip Influx' },
    { time: '06:00 PM', icon: 'thunderstorm', temp: '25°C', wind: '34 km/h', status: 'Do Not Spray', badgeBg: 'bg-red-100 text-red-800', note: 'Storm Influx' },
    { time: '08:00 PM', icon: 'rainy', temp: '24°C', wind: '38 km/h', status: 'Do Not Spray', badgeBg: 'bg-red-100 text-red-800', note: 'Heavy Squalls' },
  ];

  const tenDayForecast = [
    { day: 'Today (Wed)', date: '29 Oct', icon: 'thunderstorm', temp: '29° / 22°', rain: '85%', rainMm: '48 mm', wind: '28 km/h', condition: 'Squall rain bands', advice: 'Halt all spray; tie shade nets' },
    { day: 'Thu', date: '30 Oct', icon: 'rainy', temp: '27° / 21°', rain: '95%', rainMm: '72 mm', wind: '42 km/h', condition: 'Cyclone landfall rain', advice: 'Open field runoff trenches' },
    { day: 'Fri', date: '31 Oct', icon: 'grain', temp: '28° / 22°', rain: '65%', rainMm: '22 mm', wind: '25 km/h', condition: 'Scattered squalls', advice: 'Inspect waterlogging in paddy' },
    { day: 'Sat', date: '01 Nov', icon: 'partly_cloudy_day', temp: '31° / 23°', rain: '20%', rainMm: '2 mm', wind: '14 km/h', condition: 'Clearing skies', advice: 'Assess crop lodging' },
    { day: 'Sun', date: '02 Nov', icon: 'wb_sunny', temp: '32° / 23°', rain: '10%', rainMm: '0 mm', wind: '10 km/h', condition: 'Sunny & mild breeze', advice: 'Begin prophylactic fungicide spray' },
    { day: 'Mon', date: '03 Nov', icon: 'wb_sunny', temp: '33° / 24°', rain: '5%', rainMm: '0 mm', wind: '8 km/h', condition: 'Dry & warm', advice: 'Resume harvesting Plot 3' },
    { day: 'Tue', date: '04 Nov', icon: 'partly_cloudy_day', temp: '33° / 24°', rain: '15%', rainMm: '0 mm', wind: '11 km/h', condition: 'Fair', advice: 'Normal farm operations' },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Top Bar with Microclimate Meta */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 pb-1">
            <span>{t('nav.workspace')}</span>
            <span>/</span>
            <span>{t('nav.weather')}</span>
            <span>/</span>
            <span className="text-[#113E2E] font-bold">{t('weather.stationBadge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#113E2E]">{t('weather.title')}</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {t('weather.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#DFEBDE] text-slate-700 text-xs shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="font-semibold text-slate-900">{t('weather.stationBadge')}</span>
            <span className="text-slate-500">(16.3067° N, 80.4365° E)</span>
            <span className="text-slate-400">• Synced 4m ago</span>
          </div>
          <button
            onClick={handleRefreshSensors}
            className={`p-2 rounded-full bg-white border border-[#DFEBDE] text-slate-600 hover:text-emerald-900 hover:bg-slate-50 transition-colors shadow-xs ${isRefreshing ? 'animate-spin' : ''}`}
            title="Refresh Live Sensors"
          >
            <span className="material-symbols-outlined text-lg">sync</span>
          </button>
          <button
            onClick={() => alert('Sensor config: Calibrated for LoRaWAN gateway. Next sync interval: 5 mins.')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#113E2E] text-white text-xs font-semibold shadow-xs hover:bg-[#0a291f]"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>Configure Sensors</span>
          </button>
        </div>
      </div>

      {/* Cyclone Warning Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-[#E5B54F] text-amber-950 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#DF9B12] text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-2xl animate-pulse">cyclone</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-md">
                IMD Warning • Bay of Bengal Depression
              </span>
              <span className="text-xs text-amber-800 font-bold">Landfall ETA: 42 Hours</span>
            </div>
            <p className="text-sm font-bold text-amber-950 mt-1">
              Deep Depression crossing Andhra Coast between Machilipatnam and Nizampatnam.
            </p>
            <p className="text-xs text-amber-900/90 mt-0.5">
              Wind gusts up to 65 km/h, 70-95mm precipitation expected across Guntur &amp; Gopal deltas.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('crops')}
          className="px-4 py-2 rounded-xl bg-[#113E2E] hover:bg-[#0a291f] text-white text-xs font-bold whitespace-nowrap self-end md:self-auto shadow-sm"
        >
          Open Cyclone Protocol Checklist
        </button>
      </div>

      {/* Top Agronomic Alert Cards (Operational Decision Matrix) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Spraying Window */}
        <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <span className="material-symbols-outlined text-xl">pest_control</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">Caution • Narrow</span>
          </div>
          <div className="my-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Spraying Window</span>
            <span className="text-base font-bold text-slate-900 block mt-1">Open 06:00 - 11:00 AM</span>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Unfavorable after Thursday evening. High wind shear (&gt;24km/h) and moisture wash expected.
            </p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '35%' }}></div>
          </div>
        </div>

        {/* Card 2: Irrigation Needs */}
        <div className="bg-white border border-sky-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200">
              <span className="material-symbols-outlined text-xl">water_drop</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 text-[11px] font-bold">Halt 72 Hours</span>
          </div>
          <div className="my-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Irrigation Needs</span>
            <span className="text-base font-bold text-slate-900 block mt-1">Zero Deficit (Full)</span>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Upper root zone saturated at 64%. Projected rain replaces 100% of evapotranspiration loss.
            </p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-sky-600 h-full rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>

        {/* Card 3: Fertilizer Application */}
        <div className="bg-white border border-red-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center border border-red-200">
              <span className="material-symbols-outlined text-xl">science</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-900 text-[11px] font-bold">High Leaching Risk</span>
          </div>
          <div className="my-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Fertilizer Application</span>
            <span className="text-base font-bold text-slate-900 block mt-1">Postpone Urea</span>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              High precipitation runoff causes 60% nutrient washout. Await Sunday clear sky window.
            </p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-red-500 h-full rounded-full" style={{ width: '15%' }}></div>
          </div>
        </div>

        {/* Card 4: Harvest Operations */}
        <div className="bg-white border border-emerald-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <span className="material-symbols-outlined text-xl">agriculture</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">Active Harvest</span>
          </div>
          <div className="my-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Harvest Operations</span>
            <span className="text-base font-bold text-slate-900 block mt-1">Window Ends 5 PM</span>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Basmati paddy in Plot 3 ready. Expedite combine cutting before lodging risk elevates.
            </p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>

      {/* Bento Grid: Live Telemetry & Field Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 6 Live Station Sensors */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Field-Station Telemetry</h2>
                <p className="text-xs text-slate-500">Real-time ultrasonic &amp; capacitive readings across Guntur Plot #4</p>
              </div>
              <span className="material-symbols-outlined text-emerald-700 text-2xl">sensors</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              <div className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">thermostat</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t('weather.airTemp')}</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">28.4°C</div>
                <div className="text-xs text-slate-500 mt-1">Feels 31° • Dew pt 21°</div>
              </div>

              <div className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">opacity</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t('weather.soilMoisture')}</span>
                </div>
                <div className="text-2xl font-bold text-[#1B6F49]">64%</div>
                <div className="text-xs text-slate-500 mt-1">Field capacity optimal</div>
              </div>

              <div className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">nest_clock_farsight_analog</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t('weather.soilTemp')}</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">23.2°C</div>
                <div className="text-xs text-slate-500 mt-1">Microbial activity peak</div>
              </div>

              <div className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">humidity_percentage</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t('weather.relHumidity')}</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">68%</div>
                <div className="text-xs text-slate-500 mt-1">High leaf vapor press.</div>
              </div>

              <div className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">air</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t('weather.windSpeed')}</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">14 <span className="text-xs text-slate-500 font-normal">km/h SW</span></div>
                <div className="text-xs text-slate-500 mt-1">Gusts up to 26 km/h</div>
              </div>

              <div className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4 transition-all hover:bg-white hover:shadow-xs">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">wb_sunny</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t('weather.solarEt')}</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">3.8 <span className="text-xs text-slate-500 font-normal">mm/d</span></div>
                <div className="text-xs text-slate-500 mt-1">Rad: 680 W/m² (UV 6)</div>
              </div>
            </div>

            {/* Telemetry History Sparklines */}
            <div className="mt-6 pt-5 border-t border-slate-100 bg-[#F8FAF7] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#113E2E]">
                  <span className="material-symbols-outlined text-lg">ssid_chart</span>
                </div>
                <div>
                  <span className="text-xs text-slate-900 font-bold block">24h Soil Temperature Stability Profile</span>
                  <span className="text-[11px] text-slate-500">Root thermal shock index: Normal (Δ 2.4°C over 18h)</span>
                </div>
              </div>
              <div className="w-48 h-8 text-[#1B6F49]">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 24">
                  <path d="M0,18 Q15,19 30,14 T60,10 T85,13 L100,8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                  <circle cx="100" cy="8" fill="currentColor" r="3"></circle>
                </svg>
              </div>
            </div>
          </div>

          {/* Soil Profile & Root Depth Moisture Analysis */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Root Zone Stratification</h3>
                <p className="text-xs text-slate-500">Volumetric Water Content (VWC) by sensor probe depth</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">Basmati Paddy Profile</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">0-10 cm (Topsoil / Seedling bed)</span>
                  <span className="font-bold text-[#113E2E]">68% VWC • Saturated</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#113E2E] h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">15-30 cm (Primary Active Root Depth)</span>
                  <span className="font-bold text-emerald-700">64% VWC • Optimal</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#1B6F49] h-2 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">45-60 cm (Subsoil Drainage Layer)</span>
                  <span className="font-bold text-slate-800">51% VWC • Adequate</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-teal-600 h-2 rounded-full" style={{ width: '51%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doppler Radar & SMS Alerts */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE] flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Doppler Precip Radar</h2>
                  <p className="text-xs text-slate-500">Live coastal cloud reflectivity &amp; rain bands</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span> Live Radar
                </span>
              </div>

              {/* Radar Visual Container */}
              <div className="relative w-full h-64 rounded-xl overflow-hidden bg-slate-900 shadow-inner">
                {/* Simulated radar map with grid circles and sweep line */}
                <div className="absolute inset-0 bg-[radial-gradient(#2F855A_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 rounded-full border border-emerald-500/30"></div>
                  <div className="w-32 h-32 rounded-full border border-emerald-500/40"></div>
                  <div className="w-16 h-16 rounded-full border border-emerald-500/60"></div>
                </div>

                {/* Simulated weather storm cell blobs */}
                <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-emerald-500/40 blur-xl"></div>
                <div className="absolute bottom-12 right-20 w-32 h-32 rounded-full bg-amber-500/50 blur-2xl"></div>
                <div className="absolute bottom-6 right-28 w-16 h-16 rounded-full bg-red-600/60 blur-lg animate-pulse"></div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-1 rounded bg-white/90 text-slate-900 text-[11px] font-bold shadow-xs backdrop-blur-xs">
                      dBZ Reflectivity: 42 (Moderate Rain)
                    </span>
                    <span className="px-2 py-1 rounded bg-white/90 text-slate-900 text-[11px] font-bold shadow-xs backdrop-blur-xs">
                      Bay of Bengal Core: 110km SE
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-white text-xs font-bold">
                        <span className="material-symbols-outlined text-base text-yellow-400">flash_on</span>
                        <span>0 strikes in 50km radius</span>
                      </div>
                      <span className="text-[11px] text-slate-300">No convective lightning threat within 30m</span>
                    </div>
                    <button
                      onClick={() => alert('Doppler composite radar expanded to full Andhra Pradesh coastal corridor.')}
                      className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-[#113E2E] text-xs font-bold shadow-xs transition-colors"
                    >
                      Expand
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Radar Timeline Slider Mockup */}
            <div className="mt-4 pt-4 bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-600 font-semibold">Radar Timeline</span>
                <span className="text-[#113E2E] font-bold">T - 30m ({timelineIndex === 3 ? 'Now' : timelineIndex > 3 ? `+${(timelineIndex - 3) * 20}m` : `-${(3 - timelineIndex) * 20}m`})</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTimelineIndex(prev => (prev + 1) % 6)}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-50"
                >
                  <span className="material-symbols-outlined text-sm">play_arrow</span>
                </button>
                <div className="flex-1 bg-slate-200 h-2 rounded-full relative cursor-pointer" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const fraction = (e.clientX - rect.left) / rect.width;
                  setTimelineIndex(Math.min(5, Math.max(0, Math.round(fraction * 5))));
                }}>
                  <div className="bg-[#113E2E] h-2 rounded-full" style={{ width: `${(timelineIndex / 5) * 100}%` }}></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#1B6F49] border-2 border-white absolute top-1/2 -translate-y-1/2 shadow-xs" style={{ left: `calc(${(timelineIndex / 5) * 100}% - 7px)` }}></div>
                </div>
                <span className="text-[11px] text-slate-500">+60m Forecast</span>
              </div>
            </div>
          </div>

          {/* Quick Micro-Alerts Config Widget */}
          <div className="bg-white border border-[#DFEBDE] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Telemetry SMS Triggers</h3>
                <p className="text-xs text-slate-500 mt-0.5">Instant alerts dispatched to +91 98480 ••••</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">notifications_active</span>
              </div>
            </div>

            <div className="space-y-2.5 mt-4">
              <div className="flex items-center justify-between bg-[#F8FAF7] border border-[#E7EFE7] p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200/60 flex items-center justify-center text-slate-700">
                    <span className="material-symbols-outlined text-sm">air</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Wind Gusts &gt; 35 km/h</span>
                    <span className="text-[10px] text-slate-500">Plot 4 anemometer threshold</span>
                  </div>
                </div>
                <button
                  onClick={() => setSmsTriggers(prev => ({ ...prev, wind: !prev.wind }))}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    smsTriggers.wind ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {smsTriggers.wind ? 'Enabled' : 'Paused'}
                </button>
              </div>

              <div className="flex items-center justify-between bg-[#F8FAF7] border border-[#E7EFE7] p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200/60 flex items-center justify-center text-slate-700">
                    <span className="material-symbols-outlined text-sm">rainy</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Hourly Rain &gt; 20 mm</span>
                    <span className="text-[10px] text-slate-500">Tipping bucket gauge threshold</span>
                  </div>
                </div>
                <button
                  onClick={() => setSmsTriggers(prev => ({ ...prev, rain: !prev.rain }))}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    smsTriggers.rain ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {smsTriggers.rain ? 'Enabled' : 'Paused'}
                </button>
              </div>

              <div className="flex items-center justify-between bg-[#F8FAF7] border border-[#E7EFE7] p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-slate-200/60 flex items-center justify-center text-slate-700">
                    <span className="material-symbols-outlined text-sm">device_thermostat</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Heat Stress Index &gt; 38°C</span>
                    <span className="text-[10px] text-slate-500">Canopy thermal index alert</span>
                  </div>
                </div>
                <button
                  onClick={() => setSmsTriggers(prev => ({ ...prev, heat: !prev.heat }))}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    smsTriggers.heat ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {smsTriggers.heat ? 'Enabled' : 'Paused'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 24-Hour Spray Drift & Wind Matrix */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t('weather.sprayIndexTitle')}</h2>
            <p className="text-xs text-slate-500">Drift hazards calculated from gust vectors, thermal buoyancy, and leaf canopy wetness duration</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-slate-700">Optimal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-700">Marginal / Drift Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span className="text-slate-700">Do Not Spray</span>
            </div>
          </div>
        </div>

        {/* Scrollable 24-hour strip */}
        <div className="overflow-x-auto pb-2 custom-scroll">
          <div className="min-w-[850px] grid grid-cols-8 gap-3">
            {sprayStripData.map((slot, idx) => (
              <div key={idx} className="bg-[#F8FAF7] border border-[#DFEBDE] rounded-xl p-3.5 flex flex-col justify-between items-center text-center">
                <span className="text-xs font-semibold text-slate-500">{slot.time}</span>
                <span className="material-symbols-outlined text-emerald-800 text-2xl my-2">{slot.icon}</span>
                <span className="text-base font-bold text-slate-900">{slot.temp}</span>
                <span className="text-xs text-slate-500 mt-1">{slot.wind}</span>
                <span className={`mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${slot.badgeBg}`}>{slot.status}</span>
                <span className="text-[10px] text-slate-400 mt-1">{slot.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 10-Day Agronomic Telemetry Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFEBDE]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t('weather.tenDayTitle')}</h2>
            <p className="text-xs text-slate-500">Synthesized forecast with farm-specific actionable agronomic directives</p>
          </div>
          <button
            onClick={onOpenDostAi}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-[#113E2E] text-xs font-bold border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">psychology</span>
            <span>Ask Dost AI Weather Advisory</span>
          </button>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Day &amp; Date</th>
                <th className="pb-3">Sky Condition</th>
                <th className="pb-3">Temp (Hi / Lo)</th>
                <th className="pb-3">Precip Prob &amp; Vol</th>
                <th className="pb-3">Wind Speed</th>
                <th className="pb-3 pr-2">Actionable Field Advisory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenDayForecast.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pl-2 font-bold text-slate-900">
                    <div>{item.day}</div>
                    <div className="text-[10px] font-normal text-slate-500">{item.date}</div>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-700 text-lg">{item.icon}</span>
                      <span className="text-slate-700 font-medium">{item.condition}</span>
                    </div>
                  </td>
                  <td className="py-3.5 font-bold text-slate-800">{item.temp}</td>
                  <td className="py-3.5">
                    <span className={`font-bold ${parseInt(item.rain) > 50 ? 'text-blue-600' : 'text-slate-700'}`}>
                      {item.rain}
                    </span>
                    <span className="text-slate-400 pl-1.5">({item.rainMm})</span>
                  </td>
                  <td className="py-3.5 font-medium text-slate-700">{item.wind}</td>
                  <td className="py-3.5 pr-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#113E2E] font-medium border border-emerald-200/60 block w-fit">
                      {item.advice}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
