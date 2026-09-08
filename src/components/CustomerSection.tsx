import React from 'react';
import { RefreshCw, User, Phone, FileText, Calendar, StickyNote } from 'lucide-react';
import { CustomerInfo, Language } from '../types';
import { getTranslation } from '../translations';
import { generateInvoiceNumber } from '../utils/formatters';

interface CustomerSectionProps {
  customerInfo: CustomerInfo;
  onChange: (updated: CustomerInfo) => void;
  language: Language;
}

export const CustomerSection: React.FC<CustomerSectionProps> = ({
  customerInfo,
  onChange,
  language,
}) => {
  const t = getTranslation(language);

  const handleFieldChange = (field: keyof CustomerInfo, value: string) => {
    onChange({
      ...customerInfo,
      [field]: value,
    });
  };

  const handleRegenerateInvoice = () => {
    handleFieldChange('invoiceNumber', generateInvoiceNumber());
  };

  return (
    <section 
      id="customer-info-section"
      className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs mb-6"
    >
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
        <User className="w-4 h-4 text-emerald-600" />
        <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
          {t.customerSectionTitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Customer Name */}
        <div>
          <label 
            htmlFor="customer-name"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            {t.customerName}
          </label>
          <div className="relative">
            <input
              id="customer-name"
              type="text"
              value={customerInfo.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder={t.customerNamePlaceholder}
              className="w-full pl-3 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Customer Phone */}
        <div>
          <label 
            htmlFor="customer-phone"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            {t.customerPhone}
          </label>
          <div className="relative">
            <input
              id="customer-phone"
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              placeholder={t.customerPhonePlaceholder}
              className="w-full pl-3 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Invoice / Reference Number */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label 
              htmlFor="invoice-number"
              className="block text-xs font-semibold text-slate-700"
            >
              {t.invoiceNumber}
            </label>
            <button
              type="button"
              onClick={handleRegenerateInvoice}
              title={t.generateNewInvoice}
              className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>{t.generateNewInvoice}</span>
            </button>
          </div>
          <div className="relative">
            <input
              id="invoice-number"
              type="text"
              value={customerInfo.invoiceNumber}
              onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
              className="w-full pl-3 pr-3 py-2 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label 
            htmlFor="transaction-date"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            {t.date}
          </label>
          <div className="relative">
            <input
              id="transaction-date"
              type="date"
              value={customerInfo.date}
              onChange={(e) => handleFieldChange('date', e.target.value)}
              className="w-full pl-3 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Notes (spans across) */}
        <div className="sm:col-span-2 lg:col-span-4">
          <label 
            htmlFor="transaction-notes"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            {t.notes}
          </label>
          <input
            id="transaction-notes"
            type="text"
            value={customerInfo.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            placeholder={t.notesPlaceholder}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

      </div>
    </section>
  );
};
