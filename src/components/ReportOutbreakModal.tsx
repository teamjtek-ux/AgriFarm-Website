/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, AlertTriangle, Send, Check } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

interface ReportOutbreakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportOutbreakModal: React.FC<ReportOutbreakModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [crop, setCrop] = useState('Rice / Paddy');
  const [symptoms, setSymptoms] = useState('');
  const [mandal, setMandal] = useState('Mangalagiri, Guntur District');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#d5e7db]">
        <div className="flex items-center justify-between pb-3 border-b border-[#e7efe7]">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-base text-[#113124]">{t('modals.reportTitle')}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-6 h-6 text-emerald-700" />
            </div>
            <h4 className="font-bold text-sm text-[#113e2e]">Outbreak Bulletin Dispatched!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your report has been relayed to the Guntur Krishi Vigyan Kendra extension team and nearby farmers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Affected Crop</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#d5e0d3] outline-none text-xs bg-white cursor-pointer"
              >
                <option>Rice / Paddy (Samba Masuri / Basmati)</option>
                <option>Teja Chilli (Guntur Sannam)</option>
                <option>Hybrid Yellow Maize</option>
                <option>Groundnut (K6 Kadiri)</option>
                <option>Cotton (Long Staple)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Observed Symptoms / Damage</label>
              <textarea
                rows={3}
                required
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe leaf margins, discoloration, insect count per plant..."
                className="w-full p-2.5 rounded-xl border border-[#d5e0d3] outline-none text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location / Mandal</label>
              <input
                type="text"
                value={mandal}
                onChange={(e) => setMandal(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#d5e0d3] outline-none text-xs"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>{t('common.submit')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
