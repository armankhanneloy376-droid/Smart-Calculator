import React from 'react';
import { 
  CustomerInfo, 
  CostItem, 
  PaymentRecord, 
  PaymentDetails, 
  BusinessSettings, 
  Language 
} from '../types';
import { CalculationResults, calculateItemTotal } from '../utils/calculations';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { getTranslation } from '../translations';
import { Logo } from './Logo';

interface PrintInvoiceViewProps {
  customerInfo: CustomerInfo;
  costItems: CostItem[];
  payments: PaymentRecord[];
  paymentDetails: PaymentDetails;
  totals: CalculationResults;
  settings: BusinessSettings;
  language: Language;
  containerId?: string;
}

export const PrintInvoiceView: React.FC<PrintInvoiceViewProps> = ({
  customerInfo,
  costItems,
  payments,
  paymentDetails,
  totals,
  settings,
  language,
  containerId = 'print-invoice-area',
}) => {
  const t = getTranslation(language);
  const sym = settings.currencySymbol;
  const dec = settings.decimalPlaces;
  const bn = settings.useBengaliNumerals;

  return (
    <div id={containerId} className="bg-white p-6 sm:p-8 max-w-4xl mx-auto text-slate-900 font-sans">
      
      {/* 1. Header Banner & Business Info with Logo */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-5 mb-5 gap-4">
        <div className="flex items-start gap-4">
          <Logo size="invoice" showSubtitle={false} showText={false} className="shrink-0" />
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
              {settings.businessName || t.appName}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5 max-w-sm">
              {settings.businessAddress || 'Commercial Cost, Billing & Profit Settlement'}
            </p>
            {settings.businessPhone && (
              <p className="text-xs text-slate-600 font-medium">
                Tel / Hotline: {settings.businessPhone}
              </p>
            )}
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <div className="inline-block bg-slate-900 text-white font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-xs mb-1">
            {t.invoiceHeading}
          </div>
          <div className="text-xs font-mono font-bold text-slate-800">
            #{customerInfo.invoiceNumber || 'INV-0001'}
          </div>
          <div className="text-xs text-slate-600">
            {t.date}: {customerInfo.date}
          </div>
        </div>
      </div>

      {/* 2. Customer & Transaction Information */}
      <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 border border-slate-300 rounded-md mb-5 text-xs">
        <div>
          <span className="font-bold text-slate-900 uppercase tracking-wider block mb-1">
            {t.billTo}
          </span>
          <div className="font-bold text-sm text-slate-900">
            {customerInfo.name || 'Walk-in Customer'}
          </div>
          {customerInfo.phone && (
            <div className="text-slate-700 mt-0.5">
              Phone: {customerInfo.phone}
            </div>
          )}
        </div>

        <div className="text-right">
          <span className="font-bold text-slate-900 uppercase tracking-wider block mb-1">
            {t.invoiceDetails}
          </span>
          <div><span className="text-slate-600">Ref / Invoice:</span> <span className="font-mono font-bold">{customerInfo.invoiceNumber}</span></div>
          <div><span className="text-slate-600">Issued Date:</span> <span className="font-medium">{customerInfo.date}</span></div>
        </div>
      </div>

      {/* 3. Cost Items Table */}
      <div className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-300 pb-1">
          {t.itemizedCosts}
        </h2>
        <table className="w-full text-xs border border-slate-300 border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
              <th className="p-2 text-left border-r border-slate-300 w-10">#</th>
              <th className="p-2 text-left border-r border-slate-300">{t.itemDescription}</th>
              <th className="p-2 text-left border-r border-slate-300 w-28">{t.category}</th>
              <th className="p-2 text-center border-r border-slate-300 w-16">{t.quantity}</th>
              <th className="p-2 text-right border-r border-slate-300 w-24">{t.unitCost}</th>
              <th className="p-2 text-right w-28">{t.totalCostCol}</th>
            </tr>
          </thead>
          <tbody>
            {costItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-3 text-center text-slate-500 italic">
                  {t.noCostItems}
                </td>
              </tr>
            ) : (
              costItems.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="p-2 text-center border-r border-slate-300 font-mono">{idx + 1}</td>
                  <td className="p-2 border-r border-slate-300 font-medium">{item.description || '—'}</td>
                  <td className="p-2 border-r border-slate-300 text-slate-700">{item.category}</td>
                  <td className="p-2 text-center border-r border-slate-300 font-mono">{item.quantity}</td>
                  <td className="p-2 text-right border-r border-slate-300 font-mono">
                    {formatCurrency(item.unitCost, sym, dec, bn)}
                  </td>
                  <td className="p-2 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(calculateItemTotal(item), sym, dec, bn)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-bold border-t border-slate-300">
              <td colSpan={5} className="p-2 text-right border-r border-slate-300 uppercase">
                {t.subtotalCost}:
              </td>
              <td className="p-2 text-right font-mono text-slate-900">
                {formatCurrency(totals.subtotalCost, sym, dec, bn)}
              </td>
            </tr>
            {totals.additionalCost > 0 && (
              <tr className="bg-slate-50 font-medium">
                <td colSpan={5} className="p-2 text-right border-r border-slate-300 text-slate-700">
                  + {t.additionalCost}:
                </td>
                <td className="p-2 text-right font-mono text-slate-900">
                  {formatCurrency(totals.additionalCost, sym, dec, bn)}
                </td>
              </tr>
            )}
            <tr className="bg-slate-100 font-bold border-t border-slate-300">
              <td colSpan={5} className="p-2 text-right border-r border-slate-300 uppercase">
                {t.finalCost}:
              </td>
              <td className="p-2 text-right font-mono text-slate-900">
                {formatCurrency(totals.finalCost, sym, dec, bn)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 4. Payment & Billing Settlement Breakdown (Two Column) */}
      <div className="grid grid-cols-12 gap-5 mb-5 print-avoid-break">
        
        {/* Left side: Payment History Table if any */}
        <div className="col-span-7">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-300 pb-1">
            {t.paymentTransactions}
          </h2>
          {payments.length === 0 ? (
            <div className="p-3 bg-slate-50 border border-slate-300 rounded text-xs text-slate-500">
              {totals.paidAmount > 0 ? (
                <div>Direct manual payment recorded: <span className="font-bold text-slate-900 font-mono">{formatCurrency(totals.paidAmount, sym, dec, bn)}</span></div>
              ) : (
                <div>No advance or installment payments recorded yet.</div>
              )}
            </div>
          ) : (
            <table className="w-full text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                  <th className="p-1.5 text-left border-r border-slate-300">{t.paymentDate}</th>
                  <th className="p-1.5 text-left border-r border-slate-300">{t.paymentMethod}</th>
                  <th className="p-1.5 text-left border-r border-slate-300">{t.paymentRef}</th>
                  <th className="p-1.5 text-right">{t.paymentAmount}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-slate-200">
                    <td className="p-1.5 border-r border-slate-300 font-mono">{p.date}</td>
                    <td className="p-1.5 border-r border-slate-300">{p.method}</td>
                    <td className="p-1.5 border-r border-slate-300 font-mono">{p.reference || '—'}</td>
                    <td className="p-1.5 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(p.amount, sym, dec, bn)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t border-slate-300">
                  <td colSpan={3} className="p-1.5 text-right border-r border-slate-300 uppercase">
                    {t.paid}:
                  </td>
                  <td className="p-1.5 text-right font-mono text-emerald-800">
                    {formatCurrency(totals.paidAmount, sym, dec, bn)}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}

          {customerInfo.notes && (
            <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded text-xs">
              <span className="font-bold text-slate-800 block mb-0.5">{t.notes}:</span>
              <p className="text-slate-600">{customerInfo.notes}</p>
            </div>
          )}
        </div>

        {/* Right side: Calculation Breakdown Box */}
        <div className="col-span-5 bg-slate-50 border border-slate-300 rounded p-3 text-xs">
          <h2 className="font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-300 pb-1">
            {t.billingSummary}
          </h2>
          <dl className="space-y-1.5">
            <div className="flex justify-between">
              <dt className="text-slate-700">{t.sellingPrice}:</dt>
              <dd className="font-mono font-medium">{formatCurrency(totals.sellingPrice, sym, dec, bn)}</dd>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-amber-800">
                <dt>- {t.discount}:</dt>
                <dd className="font-mono">-{formatCurrency(totals.discount, sym, dec, bn)}</dd>
              </div>
            )}
            {totals.tax > 0 && (
              <div className="flex justify-between">
                <dt>+ {t.taxVat}:</dt>
                <dd className="font-mono">+{formatCurrency(totals.tax, sym, dec, bn)}</dd>
              </div>
            )}
            {totals.additionalCharge > 0 && (
              <div className="flex justify-between">
                <dt>+ {t.additionalCharge}:</dt>
                <dd className="font-mono">+{formatCurrency(totals.additionalCharge, sym, dec, bn)}</dd>
              </div>
            )}
            <div className="flex justify-between font-bold border-t border-slate-300 pt-1 text-sm text-slate-900">
              <dt>{t.finalBill}:</dt>
              <dd className="font-mono">{formatCurrency(totals.finalBill, sym, dec, bn)}</dd>
            </div>

            <div className="flex justify-between text-slate-700 pt-1 border-t border-slate-200">
              <dt>- {t.totalCost}:</dt>
              <dd className="font-mono">-{formatCurrency(totals.finalCost, sym, dec, bn)}</dd>
            </div>

            <div className="flex justify-between font-bold pt-1 border-t border-slate-300 text-sm">
              <dt className={totals.isLoss ? 'text-rose-700' : 'text-emerald-800'}>
                = {totals.isLoss ? t.loss : t.profit}:
              </dt>
              <dd className={`font-mono ${totals.isLoss ? 'text-rose-700' : 'text-emerald-800'}`}>
                {formatCurrency(totals.profit, sym, dec, bn)} ({formatNumber(totals.profitMargin, 2, bn)}%)
              </dd>
            </div>

            <div className="border-t-2 border-slate-400 pt-2 mt-2 space-y-1">
              <div className="flex justify-between text-slate-800">
                <dt className="font-semibold">{t.paid}:</dt>
                <dd className="font-mono font-bold text-emerald-800">{formatCurrency(totals.paidAmount, sym, dec, bn)}</dd>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900">
                <dt className="text-amber-800">{t.due}:</dt>
                <dd className="font-mono text-amber-800">{formatCurrency(totals.dueAmount, sym, dec, bn)}</dd>
              </div>
            </div>
          </dl>
        </div>

      </div>

      {/* 5. Signatures and Footer */}
      <div className="pt-12 mt-8 border-t border-slate-300 flex justify-between items-end text-xs text-slate-600 print-avoid-break">
        <div className="text-center w-40">
          <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
            {t.preparedBy}
          </div>
        </div>
        <div className="text-center text-[11px] text-slate-400">
          {t.thankYou}
        </div>
        <div className="text-center w-40">
          <div className="border-t border-slate-400 pt-1 font-semibold text-slate-800">
            {t.authorizedSignature}
          </div>
        </div>
      </div>

    </div>
  );
};
