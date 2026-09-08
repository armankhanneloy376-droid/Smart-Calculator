import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  language: Language;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  language,
}) => {
  if (!isOpen) return null;

  const t = getTranslation(language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs modal-overlay">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-5 border border-slate-200 animate-in fade-in zoom-in duration-150">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-rose-100 text-rose-600 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {title}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {cancelLabel || t.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
