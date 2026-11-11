/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calendar, Plus } from 'lucide-react';
import { CalendarTask } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface CustomTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask?: (task: CalendarTask) => void;
  onTaskCreated?: (task: CalendarTask) => void;
}

export const CustomTaskModal: React.FC<CustomTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onTaskCreated,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'fertilizer' | 'pest' | 'irrigation' | 'harvest' | 'general'>('fertilizer');
  const [field, setField] = useState('Field 1 (Basmati Rice - 5.0 Acres)');
  const [timing, setTiming] = useState('Tomorrow • 08:00 AM');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: CalendarTask = {
      id: `task-custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Custom farm operation recorded in KissanDost.',
      category,
      categoryLabel:
        category === 'fertilizer'
          ? 'Fertilizer Application'
          : category === 'pest'
          ? 'Crop Protection'
          : category === 'irrigation'
          ? 'Irrigation Cycle'
          : category === 'harvest'
          ? 'Harvesting Operation'
          : 'Field Operation',
      field,
      timing,
      dueDateLabel: 'Scheduled',
      isCompleted: false,
      actionButtonText: t('calendar.markDone'),
    };

    if (onAddTask) onAddTask(newTask);
    if (onTaskCreated) onTaskCreated(newTask);
    onClose();
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-[#d5e7db]">
        <div className="flex items-center justify-between pb-3 border-b border-[#e7efe7]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#113e2e]" />
            <h3 className="font-bold text-base text-[#113124]">{t('modals.customTaskTitle')}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zinc Sulphate Foliar Spray or Bund Repair"
              className="w-full p-2.5 rounded-xl border border-[#d5e0d3] focus:ring-1 focus:ring-[#113e2e] outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-[#d5e0d3] focus:ring-1 focus:ring-[#113e2e] outline-none text-xs bg-white cursor-pointer"
              >
                <option value="fertilizer">Fertilizer Application</option>
                <option value="pest">Crop Protection / Spray</option>
                <option value="irrigation">Irrigation &amp; Moisture</option>
                <option value="harvest">Harvesting &amp; Storage</option>
                <option value="general">General Fieldwork</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Field</label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#d5e0d3] focus:ring-1 focus:ring-[#113e2e] outline-none text-xs bg-white cursor-pointer"
              >
                <option value="Field 1 (Basmati Rice - 5.0 Acres)">Field 1 (Paddy 5.0 Ac)</option>
                <option value="Field 2 (Chilli - 3.0 Acres)">Field 2 (Chilli 3.0 Ac)</option>
                <option value="Field 3 (Maize - 2.5 Acres)">Field 3 (Maize 2.5 Ac)</option>
                <option value="Field 4 (Groundnut - 2.0 Acres)">Field 4 (Groundnut 2.0 Ac)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Schedule Timing</label>
            <input
              type="text"
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              placeholder="e.g. Tomorrow • 08:00 AM or Saturday morning"
              className="w-full p-2.5 rounded-xl border border-[#d5e0d3] focus:ring-1 focus:ring-[#113e2e] outline-none text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Instructions / Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dosage details, knapsack tank volume, or specific worker directives..."
              className="w-full p-2.5 rounded-xl border border-[#d5e0d3] focus:ring-1 focus:ring-[#113e2e] outline-none text-xs"
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
              className="flex-1 py-2 text-xs font-bold text-white bg-[#113e2e] hover:bg-[#0a291f] rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t('calendar.addTask')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
