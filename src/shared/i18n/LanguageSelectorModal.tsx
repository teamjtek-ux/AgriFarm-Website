/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Globe, 
  Check, 
  Sparkles, 
  RotateCcw,
  Languages
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { LanguageOption } from '../types';

export const LanguageSelectorModal: React.FC = () => {
  const {
    language,
    currentLanguage,
    setLanguage,
    allLanguages,
    regionalLanguages,
    globalLanguages,
    popularLanguages,
    isLanguageModalOpen,
    setIsLanguageModalOpen,
    isTranslating,
  } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'popular' | 'regional' | 'global'>('all');

  const filteredLanguages = useMemo(() => {
    let list: LanguageOption[] = [];
    if (activeCategory === 'popular') {
      list = popularLanguages;
    } else if (activeCategory === 'regional') {
      list = regionalLanguages;
    } else if (activeCategory === 'global') {
      list = globalLanguages;
    } else {
      list = allLanguages;
    }

    if (!searchQuery.trim()) {
      return list;
    }

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        lang.regionLabel.toLowerCase().includes(q)
    );
  }, [allLanguages, regionalLanguages, globalLanguages, popularLanguages, activeCategory, searchQuery]);

  if (!isLanguageModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200 notranslate"
      translate="no"
    >
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full h-[88vh] max-h-[720px] flex flex-col shadow-2xl overflow-hidden border border-[#d5e7db] notranslate"
        translate="no"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#113e2e] via-[#174e3b] to-[#113e2e] text-white p-4 sm:p-6 flex items-center justify-between shrink-0 shadow-sm notranslate" translate="no">
          <div className="flex items-center gap-3 notranslate" translate="no">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-[#e5b54f] border border-white/20 shadow-xs">
              <Languages className="w-6 h-6" />
            </div>
            <div className="notranslate" translate="no">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif tracking-tight notranslate" translate="no">
                  Select Language / భాషను ఎంచుకోండి / भाषा चुनें
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/30 notranslate" translate="no">
                  {allLanguages.length}+ Languages
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5 notranslate" translate="no">
                Choose any Indian regional or world language to switch the entire app dynamically
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLanguageModalOpen(false)}
            className="p-2 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition notranslate"
            aria-label="Close language selector"
            translate="no"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="p-4 sm:p-5 bg-[#f8faf8] border-b border-[#e5ece5] space-y-3 shrink-0 notranslate" translate="no">
          {/* Search Bar */}
          <div className="relative notranslate" translate="no">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by language, script or region (e.g., Telugu, தமிழ், Marathi, Spanish, Arabic)..."
              className="w-full bg-white border border-[#d2e2d5] rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#113e2e]/30 focus:border-[#113e2e] transition shadow-xs notranslate"
              translate="no"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1 notranslate"
                translate="no"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar notranslate" translate="no">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center gap-1.5 notranslate ${
                activeCategory === 'all'
                  ? 'bg-[#113e2e] text-white shadow-xs'
                  : 'bg-white border border-[#d2e2d5] text-slate-700 hover:bg-[#edf5ee]'
              }`}
              translate="no"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="notranslate" translate="no">All ({allLanguages.length})</span>
            </button>
            <button
              onClick={() => setActiveCategory('regional')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center gap-1.5 notranslate ${
                activeCategory === 'regional'
                  ? 'bg-[#113e2e] text-white shadow-xs'
                  : 'bg-white border border-[#d2e2d5] text-slate-700 hover:bg-[#edf5ee]'
              }`}
              translate="no"
            >
              <span className="notranslate" translate="no">🇮🇳 Indian Regional ({regionalLanguages.length})</span>
            </button>
            <button
              onClick={() => setActiveCategory('global')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center gap-1.5 notranslate ${
                activeCategory === 'global'
                  ? 'bg-[#113e2e] text-white shadow-xs'
                  : 'bg-white border border-[#d2e2d5] text-slate-700 hover:bg-[#edf5ee]'
              }`}
              translate="no"
            >
              <span className="notranslate" translate="no">🌍 Country & Global ({globalLanguages.length})</span>
            </button>
            <button
              onClick={() => setActiveCategory('popular')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center gap-1.5 notranslate ${
                activeCategory === 'popular'
                  ? 'bg-[#113e2e] text-white shadow-xs'
                  : 'bg-white border border-[#d2e2d5] text-slate-700 hover:bg-[#edf5ee]'
              }`}
              translate="no"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e5b54f]" />
              <span className="notranslate" translate="no">Popular ({popularLanguages.length})</span>
            </button>
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scroll bg-[#fdfefd] notranslate" translate="no">
          {filteredLanguages.length === 0 ? (
            <div className="py-16 text-center notranslate" translate="no">
              <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-pulse" />
              <div className="text-base font-bold text-slate-700 notranslate" translate="no">No language found</div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto notranslate" translate="no">
                Try searching with native characters, country name, or language code (e.g. "te", "hi", "mr", "ta").
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 notranslate" translate="no">
              {filteredLanguages.map((lang) => {
                const isSelected = language.toLowerCase() === lang.code.toLowerCase();
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLanguageModalOpen(false);
                    }}
                    className={`text-left p-3 rounded-2xl border transition-all flex items-start justify-between group cursor-pointer notranslate ${
                      isSelected
                        ? 'bg-[#eaf4ed] border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-white border-[#e0eae1] hover:border-emerald-300 hover:bg-[#f6faf7] hover:shadow-xs'
                    }`}
                    translate="no"
                  >
                    <div className="flex items-start gap-2.5 min-w-0 notranslate" translate="no">
                      <span className="text-xl shrink-0 mt-0.5 notranslate" translate="no">{lang.flag || '🌐'}</span>
                      <div className="min-w-0 notranslate" translate="no">
                        <div className="flex items-center gap-1.5 notranslate" translate="no">
                          <span className="text-base font-bold text-slate-900 group-hover:text-[#113e2e] truncate notranslate" translate="no">
                            {lang.nativeName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-semibold uppercase notranslate" translate="no">
                            {lang.code}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 font-medium truncate notranslate" translate="no">
                          {lang.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5 notranslate" translate="no">
                          {lang.regionLabel}
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs notranslate" translate="no">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-200 group-hover:border-emerald-300 shrink-0 notranslate" translate="no" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with status and quick action */}
        <div className="p-4 bg-[#f3f7f4] border-t border-[#e2ece3] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs notranslate" translate="no">
          <div className="flex items-center gap-2 text-slate-600 notranslate" translate="no">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="notranslate" translate="no">
              Active: <strong className="notranslate" translate="no">{currentLanguage.nativeName}</strong> ({currentLanguage.name})
            </span>
            {isTranslating && (
              <span className="text-[11px] text-emerald-700 font-semibold animate-pulse ml-2 notranslate" translate="no">
                Translating UI...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 notranslate" translate="no">
            {language !== 'en' && (
              <button
                onClick={() => {
                  setLanguage('en');
                  setIsLanguageModalOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#d2e2d5] hover:bg-slate-50 text-slate-700 font-semibold transition flex items-center gap-1.5 text-xs shadow-xs notranslate"
                translate="no"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span className="notranslate" translate="no">Reset to English</span>
              </button>
            )}

            <button
              onClick={() => setIsLanguageModalOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-[#113e2e] hover:bg-[#0a281e] text-white font-semibold transition text-xs shadow-xs notranslate"
              translate="no"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
