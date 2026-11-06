/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Upload, Camera, Sparkles, ArrowRight } from 'lucide-react';
import { ActiveTab } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface ScanCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab?: (tab: ActiveTab) => void;
  onDiagnosed?: () => void;
}

export const ScanCropModal: React.FC<ScanCropModalProps> = ({
  isOpen,
  onClose,
  setActiveTab = () => {},
  onDiagnosed,
}) => {
  const { t } = useTranslation();
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState<boolean>(false);
  const [selectedSampleName, setSelectedSampleName] = useState<string>('Rice Leaf Sample (East Quadrant)');

  if (!isOpen) return null;

  const handleSimulateScan = (name?: string) => {
    if (name) setSelectedSampleName(name);
    setAnalyzing(true);
    setAnalyzedResult(false);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzedResult(true);
    }, 1200);
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-[#d5e7db]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#e7efe7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#113e2e] flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#113124]">{t('modals.scanTitle')}</h3>
              <p className="text-[11px] text-slate-500">{t('modals.scanSub')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!analyzedResult ? (
          <div className="mt-5 space-y-4">
            <div
              onClick={() => handleSimulateScan('Custom Captured Leaf Photo')}
              className="border-2 border-dashed border-[#bcd3c3] hover:border-[#175638] rounded-2xl p-7 bg-[#f8faf7] hover:bg-[#f2f7f2] transition-colors cursor-pointer text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#e5f1eb] text-[#1f6e4d] mx-auto flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                {analyzing ? (
                  <span className="w-6 h-6 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <p className="font-bold text-sm text-[#1b3e31]">
                {analyzing ? 'Analyzing leaf margins & lesions...' : t('doctor.uploadTitle')}
              </p>
              <p className="text-xs text-[#6b8a7c] mt-1 max-w-xs mx-auto">
                {t('doctor.uploadSub')}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2 text-[10px] text-slate-500 font-semibold">
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#bcd3c3]">✓ Macro daylight</span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#bcd3c3]">✓ Sharp margins</span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#bcd3c3]">✓ Max 15MB</span>
              </div>
            </div>

            {/* Quick Demo Samples */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {t('doctor.quickTests')}:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateScan('Paddy Leaf - BLB Lesions')}
                  className="p-2.5 rounded-xl bg-[#f0f7f2] hover:bg-[#e4efe7] border border-[#d5e7db] text-left text-xs font-semibold text-[#113e2e] transition"
                >
                  🌾 Basmati Paddy (BLB)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateScan('Chilli Leaf - Leaf Curl')}
                  className="p-2.5 rounded-xl bg-[#f0f7f2] hover:bg-[#e4efe7] border border-[#d5e7db] text-left text-xs font-semibold text-[#113e2e] transition"
                >
                  🌶️ Chilli Leaf Curl
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateScan('Maize Whorl - Fall Armyworm')}
                  className="p-2.5 rounded-xl bg-[#f0f7f2] hover:bg-[#e4efe7] border border-[#d5e7db] text-left text-xs font-semibold text-[#113e2e] transition"
                >
                  🌽 Maize Fall Armyworm
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateScan('Groundnut - Tikka Spots')}
                  className="p-2.5 rounded-xl bg-[#f0f7f2] hover:bg-[#e4efe7] border border-[#d5e7db] text-left text-xs font-semibold text-[#113e2e] transition"
                >
                  🥜 Groundnut Tikka Spot
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Diagnosis Result Preview */
          <div className="mt-4 space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-[#f0f9f3] border border-[#bcd3c3] space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#113e2e] text-white text-[10px] font-bold uppercase tracking-wide">
                  {t('doctor.activeScan')}
                </span>
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#e5b54f]" />
                  96.4% Match Confidence
                </span>
              </div>

              <div>
                <h4 className="font-serif font-bold text-lg text-[#113e2e]">
                  Bacterial Leaf Blight (BLB)
                </h4>
                <p className="text-xs italic text-slate-600">Xanthomonas oryzae pv. oryzae</p>
                <p className="text-xs text-slate-700 mt-1">
                  Sample: <strong>{selectedSampleName}</strong> • Affected canopy: 18.5%
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#d5e7db] text-xs space-y-1.5">
                <div className="font-bold text-[#113e2e]">{t('diseases.standardTreatment')}:</div>
                <div className="text-slate-600">
                  Dissolve <strong>Copper Oxychloride 50% WP</strong> @ 2.5g/L together with <strong>Streptocycline</strong> (100 ppm, 1g per 10L water). Spray foliage thoroughly.
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAnalyzedResult(false)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-700 bg-[#eef4ee] hover:bg-[#e3ede3] rounded-xl transition"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDiagnosed) {
                    onDiagnosed();
                  } else {
                    setActiveTab('crop-doctor');
                    onClose();
                  }
                }}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-[#103d2e] hover:bg-[#0a291f] rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>{t('doctor.dosageTitle')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
