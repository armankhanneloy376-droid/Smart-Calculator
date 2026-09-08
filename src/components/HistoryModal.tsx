import React, { useState } from 'react';
import { History, X, Trash2, FolderOpen, Search, Calendar, User, DollarSign } from 'lucide-react';
import { CalculationHistoryItem, BusinessSettings, Language } from '../types';
import { getTranslation } from '../translations';
import { formatCurrency } from '../utils/formatters';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationHistoryItem[];
  onLoadItem: (item: CalculationHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  settings: BusinessSettings;
  language: Language;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onLoadItem,
  onDeleteItem,
  onClearAll,
  settings,
  language,
}) => {
  if (!isOpen) return null;

  const t = getTranslation(language);
  const sym = settings.currencySymbol;
  const dec = settings.decimalPlaces;
  const bn = settings.useBengaliNumerals;

  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredHistory = history.filter((item) => {
    const q = searchQuery.toLowerCase();
    const inv = item.customerInfo.invoiceNumber.toLowerCase();
    const name = item.customerInfo.name.toLowerCase();
    const phone = item.customerInfo.phone.toLowerCase();
    return inv.includes(q) || name.includes(q) || phone.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs modal-overlay">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {t.calcHistoryTitle}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {history.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar & Clear All */}
        {history.length > 0 && (
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by invoice number or customer name..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1.5 rounded hover:bg-rose-50 shrink-0"
            >
              {t.clearAllHistory}
            </button>
          </div>
        )}

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">{t.noHistory}</p>
              <p className="text-xs text-slate-400 mt-1">
                Click "{t.saveToHistory}" in the header anytime to save your work.
              </p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-xs">No records matched "{searchQuery}"</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 shadow-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {item.customerInfo.invoiceNumber}
                    </span>
                    <span className="text-xs text-slate-400">|</span>
                    <span className="text-xs font-medium text-slate-700">
                      {item.customerInfo.name || 'Walk-in Customer'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({item.costItems.length} {t.itemsCount})
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.customerInfo.date}
                    </span>
                    {item.customerInfo.phone && (
                      <span>Phone: {item.customerInfo.phone}</span>
                    )}
                  </div>

                  {/* Summary row */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-mono">
                    <span className="text-indigo-700 font-semibold">
                      Bill: {formatCurrency(item.totals.finalBill, sym, dec, bn)}
                    </span>
                    <span className="text-emerald-700">
                      Paid: {formatCurrency(item.totals.paidAmount, sym, dec, bn)}
                    </span>
                    <span className="text-amber-700 font-semibold">
                      Due: {formatCurrency(item.totals.dueAmount, sym, dec, bn)}
                    </span>
                    <span className={item.totals.profit >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                      Profit: {formatCurrency(item.totals.profit, sym, dec, bn)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadItem(item);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>{t.open}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    title={t.delete}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
