import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Percent
} from 'lucide-react';
import { CalculationResults } from '../utils/calculations';
import { BusinessSettings, Language } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { getTranslation } from '../translations';

interface SummaryCardsProps {
  totals: CalculationResults;
  settings: BusinessSettings;
  language: Language;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totals,
  settings,
  language,
}) => {
  const t = getTranslation(language);
  const sym = settings.currencySymbol;
  const dec = settings.decimalPlaces;
  const bn = settings.useBengaliNumerals;

  return (
    <section aria-label="Summary Dashboard" className="mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* 1. TOTAL COST */}
        <div 
          id="summary-card-total-cost"
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-bold tracking-wider uppercase">
              {t.totalCost}
            </span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-mono">
              {formatCurrency(totals.finalCost, sym, dec, bn)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {totals.additionalCost > 0 ? (
                <span>Base: {formatCurrency(totals.subtotalCost, sym, dec, bn)}</span>
              ) : (
                <span>Direct itemized cost</span>
              )}
            </p>
          </div>
        </div>

        {/* 2. TOTAL BILL */}
        <div 
          id="summary-card-total-bill"
          className="bg-white border border-indigo-100 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition-colors bg-gradient-to-b from-indigo-50/20 to-white"
        >
          <div className="flex items-center justify-between text-indigo-600 mb-1.5">
            <span className="text-xs font-bold tracking-wider uppercase">
              {t.totalBill}
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-indigo-950 tracking-tight font-mono">
              {formatCurrency(totals.finalBill, sym, dec, bn)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {totals.discount > 0 ? (
                <span className="text-amber-600">Disc: -{formatCurrency(totals.discount, sym, dec, bn)}</span>
              ) : (
                <span>Customer payable bill</span>
              )}
            </p>
          </div>
        </div>

        {/* 3. PAID */}
        <div 
          id="summary-card-paid"
          className="bg-white border border-emerald-100 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-emerald-200 transition-colors bg-gradient-to-b from-emerald-50/20 to-white"
        >
          <div className="flex items-center justify-between text-emerald-700 mb-1.5">
            <span className="text-xs font-bold tracking-wider uppercase">
              {t.paid}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-800 tracking-tight font-mono">
              {formatCurrency(totals.paidAmount, sym, dec, bn)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {totals.isOverpaid ? (
                <span className="text-amber-600 font-medium">Overpaid</span>
              ) : totals.paidAmount > 0 && totals.finalBill > 0 ? (
                <span>{Math.round((totals.paidAmount / totals.finalBill) * 100)}% collected</span>
              ) : (
                <span>Received amount</span>
              )}
            </p>
          </div>
        </div>

        {/* 4. DUE */}
        <div 
          id="summary-card-due"
          className={`bg-white border rounded-xl p-4 shadow-xs flex flex-col justify-between transition-colors ${
            totals.dueAmount > 0 
              ? 'border-amber-200 bg-gradient-to-b from-amber-50/30 to-white' 
              : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-amber-700 mb-1.5">
            <span className="text-xs font-bold tracking-wider uppercase">
              {t.due}
            </span>
            <div className={`p-1.5 rounded-lg border ${
              totals.dueAmount > 0 
                ? 'bg-amber-100 text-amber-700 border-amber-200' 
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className={`text-xl sm:text-2xl font-bold tracking-tight font-mono ${
              totals.dueAmount > 0 ? 'text-amber-900' : 'text-slate-600'
            }`}>
              {formatCurrency(totals.dueAmount, sym, dec, bn)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {totals.dueAmount === 0 && totals.finalBill > 0 ? (
                <span className="text-emerald-600 font-medium">Fully Paid ✓</span>
              ) : totals.dueAmount > 0 ? (
                <span className="text-amber-700 font-medium">Outstanding Balance</span>
              ) : (
                <span>Zero balance</span>
              )}
            </p>
          </div>
        </div>

        {/* 5. PROFIT */}
        <div 
          id="summary-card-profit"
          className={`col-span-2 sm:col-span-1 bg-white border rounded-xl p-4 shadow-xs flex flex-col justify-between transition-colors ${
            totals.isLoss 
              ? 'border-rose-200 bg-rose-50/30' 
              : totals.isProfit 
                ? 'border-emerald-200 bg-emerald-50/30' 
                : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-xs font-bold tracking-wider uppercase ${
              totals.isLoss ? 'text-rose-700' : totals.isProfit ? 'text-emerald-700' : 'text-slate-600'
            }`}>
              {totals.isLoss ? t.loss : t.profit}
            </span>
            <div className={`p-1.5 rounded-lg border ${
              totals.isLoss 
                ? 'bg-rose-100 text-rose-700 border-rose-200' 
                : totals.isProfit 
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                  : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {totals.isLoss ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
            </div>
          </div>
          <div>
            <div className={`text-xl sm:text-2xl font-bold tracking-tight font-mono ${
              totals.isLoss ? 'text-rose-700' : totals.isProfit ? 'text-emerald-700' : 'text-slate-700'
            }`}>
              {formatCurrency(totals.profit, sym, dec, bn)}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                totals.isLoss 
                  ? 'bg-rose-100 text-rose-800' 
                  : totals.isProfit 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-slate-100 text-slate-700'
              }`}>
                <Percent className="w-3 h-3 inline" />
                {formatNumber(totals.profitMargin, 2, bn)}% {t.profitMargin}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
