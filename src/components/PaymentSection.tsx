import React from 'react';
import { 
  CreditCard, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Calculator,
  Percent,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { PaymentDetails, BusinessSettings, Language } from '../types';
import { CalculationResults } from '../utils/calculations';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { getTranslation } from '../translations';

interface PaymentSectionProps {
  details: PaymentDetails;
  onChange: (details: PaymentDetails) => void;
  totals: CalculationResults;
  hasRecordedPayments: boolean;
  settings: BusinessSettings;
  language: Language;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  details,
  onChange,
  totals,
  hasRecordedPayments,
  settings,
  language,
}) => {
  const t = getTranslation(language);
  const sym = settings.currencySymbol;
  const dec = settings.decimalPlaces;
  const bn = settings.useBengaliNumerals;

  const handleFieldChange = (field: keyof PaymentDetails, value: number) => {
    onChange({
      ...details,
      [field]: Math.max(0, value),
    });
  };

  return (
    <section 
      id="payment-details-section"
      className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs mb-6"
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <CreditCard className="w-4 h-4 text-emerald-600" />
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
            {t.paymentSectionTitle}
          </h2>
          <p className="text-xs text-slate-500">
            {t.paymentSectionDesc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Side: Editable Billing Inputs (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Selling Price */}
            <div className="sm:col-span-2">
              <label 
                htmlFor="input-selling-price"
                className="block text-xs font-semibold text-slate-800 mb-1"
              >
                {t.sellingPrice} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">
                  {sym}
                </span>
                <input
                  id="input-selling-price"
                  type="number"
                  min="0"
                  step="any"
                  value={details.sellingPrice === 0 ? '' : details.sellingPrice}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    handleFieldChange('sellingPrice', isNaN(val) ? 0 : val);
                  }}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 text-base font-semibold font-mono bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
                />
              </div>
            </div>

            {/* Discount */}
            <div>
              <label 
                htmlFor="input-discount"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                {t.discount}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                  {sym}
                </span>
                <input
                  id="input-discount"
                  type="number"
                  min="0"
                  step="any"
                  value={details.discount === 0 ? '' : details.discount}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    handleFieldChange('discount', isNaN(val) ? 0 : val);
                  }}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
                />
              </div>
            </div>

            {/* Tax / VAT */}
            <div>
              <label 
                htmlFor="input-tax"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                {t.taxVat}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                  {sym}
                </span>
                <input
                  id="input-tax"
                  type="number"
                  min="0"
                  step="any"
                  value={details.tax === 0 ? '' : details.tax}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    handleFieldChange('tax', isNaN(val) ? 0 : val);
                  }}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
                />
              </div>
            </div>

            {/* Additional Charge to Customer (e.g. rush/express charge) */}
            <div>
              <label 
                htmlFor="input-additional-charge"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                {t.additionalCharge}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                  {sym}
                </span>
                <input
                  id="input-additional-charge"
                  type="number"
                  min="0"
                  step="any"
                  value={details.additionalCharge === 0 ? '' : details.additionalCharge}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    handleFieldChange('additionalCharge', isNaN(val) ? 0 : val);
                  }}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
                />
              </div>
            </div>

            {/* Additional Direct Cost (Internal expense not covered in item table) */}
            <div>
              <label 
                htmlFor="input-additional-cost"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                {t.additionalCost}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                  {sym}
                </span>
                <input
                  id="input-additional-cost"
                  type="number"
                  min="0"
                  step="any"
                  value={details.additionalCost === 0 ? '' : details.additionalCost}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    handleFieldChange('additionalCost', isNaN(val) ? 0 : val);
                  }}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
                />
              </div>
            </div>

          </div>

          {/* Quick Manual Paid Amount (only if no payment records) */}
          {!hasRecordedPayments ? (
            <div className="pt-2 border-t border-slate-200">
              <label 
                htmlFor="input-manual-paid"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                {t.paidAmount} (Direct Input)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                  {sym}
                </span>
                <input
                  id="input-manual-paid"
                  type="number"
                  min="0"
                  step="any"
                  value={details.manualPaidAmount === 0 || details.manualPaidAmount === undefined ? '' : details.manualPaidAmount}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    handleFieldChange('manualPaidAmount', isNaN(val) ? 0 : val);
                  }}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-mono bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Tip: You can also record multiple itemized payments (Cash, bKash, Bank, etc.) in the section below.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-emerald-800">
                  {t.paidFromHistoryNote}
                </span>
                <div className="text-base font-bold font-mono text-emerald-900">
                  {formatCurrency(totals.paidAmount, sym, dec, bn)}
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          )}

          {/* Overpayment warning if paid > finalBill */}
          {totals.isOverpaid && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-amber-800 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{t.overpaidWarning} {formatCurrency(totals.overpaidAmount, sym, dec, bn)}</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Customer has paid more than the final bill. Make sure to record any change or refund given.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Clear Calculation Breakdown (5 cols) */}
        <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Calculation Audit
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Auto-computed
              </span>
            </div>

            <dl className="space-y-2 text-xs">
              {/* Selling Price */}
              <div className="flex justify-between items-center text-slate-600">
                <dt>{t.sellingPrice}:</dt>
                <dd className="font-mono font-medium text-slate-800">
                  {formatCurrency(totals.sellingPrice, sym, dec, bn)}
                </dd>
              </div>

              {/* Discount */}
              {totals.discount > 0 && (
                <div className="flex justify-between items-center text-amber-600">
                  <dt>- {t.discount}:</dt>
                  <dd className="font-mono font-medium">
                    -{formatCurrency(totals.discount, sym, dec, bn)}
                  </dd>
                </div>
              )}

              {/* Tax */}
              {totals.tax > 0 && (
                <div className="flex justify-between items-center text-slate-600">
                  <dt>+ {t.taxVat}:</dt>
                  <dd className="font-mono font-medium text-slate-800">
                    +{formatCurrency(totals.tax, sym, dec, bn)}
                  </dd>
                </div>
              )}

              {/* Additional Charge */}
              {totals.additionalCharge > 0 && (
                <div className="flex justify-between items-center text-slate-600">
                  <dt>+ {t.additionalCharge}:</dt>
                  <dd className="font-mono font-medium text-slate-800">
                    +{formatCurrency(totals.additionalCharge, sym, dec, bn)}
                  </dd>
                </div>
              )}

              {/* FINAL BILL DIVIDER */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-sm text-slate-900">
                <dt>{t.finalBill}:</dt>
                <dd className="font-mono text-indigo-700">
                  {formatCurrency(totals.finalBill, sym, dec, bn)}
                </dd>
              </div>

              {/* TOTAL COST */}
              <div className="flex justify-between items-center text-slate-600">
                <dt>- {t.finalCost}:</dt>
                <dd className="font-mono font-medium text-slate-800">
                  -{formatCurrency(totals.finalCost, sym, dec, bn)}
                </dd>
              </div>

              {/* PROFIT DIVIDER */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-sm">
                <dt className={totals.isLoss ? 'text-rose-700' : 'text-emerald-700'}>
                  = {totals.isLoss ? t.loss : t.profit}:
                </dt>
                <dd className={`font-mono ${totals.isLoss ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {formatCurrency(totals.profit, sym, dec, bn)}
                </dd>
              </div>

              {/* PROFIT MARGIN */}
              <div className="flex justify-between items-center text-slate-500 text-[11px] pt-0.5">
                <dt>{t.profitMargin}:</dt>
                <dd className="font-mono font-semibold text-slate-700">
                  {formatNumber(totals.profitMargin, 2, bn)}%
                </dd>
              </div>

              {/* PAID & DUE */}
              <div className="pt-3 border-t border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-slate-600">
                  <dt>{t.paid}:</dt>
                  <dd className="font-mono font-bold text-emerald-700">
                    {formatCurrency(totals.paidAmount, sym, dec, bn)}
                  </dd>
                </div>
                <div className="flex justify-between items-center text-slate-800 font-semibold">
                  <dt>{t.due}:</dt>
                  <dd className="font-mono font-bold text-amber-700">
                    {formatCurrency(totals.dueAmount, sym, dec, bn)}
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Formula: Bill - Cost = Profit</span>
            <span className="font-mono font-medium text-slate-600">
              {formatCurrency(totals.finalBill, sym, 0, bn)} - {formatCurrency(totals.finalCost, sym, 0, bn)}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
