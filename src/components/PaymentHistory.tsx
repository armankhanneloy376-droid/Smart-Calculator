import React, { useState } from 'react';
import { 
  History, 
  Plus, 
  Trash2, 
  Edit3, 
  CreditCard, 
  Check, 
  X, 
  Smartphone, 
  Landmark, 
  Banknote 
} from 'lucide-react';
import { PaymentRecord, PaymentMethod, BusinessSettings, Language } from '../types';
import { getTranslation } from '../translations';
import { formatCurrency, getTodayDateString, generatePaymentId } from '../utils/formatters';

interface PaymentHistoryProps {
  payments: PaymentRecord[];
  onChange: (payments: PaymentRecord[]) => void;
  settings: BusinessSettings;
  language: Language;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'Cash',
  'bKash',
  'Nagad',
  'Bank',
  'Card',
  'Other',
];

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  payments,
  onChange,
  settings,
  language,
}) => {
  const t = getTranslation(language);
  const sym = settings.currencySymbol;
  const dec = settings.decimalPlaces;
  const bn = settings.useBengaliNumerals;

  // State for Add / Edit Modal or form
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formDate, setFormDate] = useState<string>(getTodayDateString());
  const [formMethod, setFormMethod] = useState<PaymentMethod>('bKash');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formRef, setFormRef] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');

  const openAddModal = () => {
    setEditingId(null);
    setFormDate(getTodayDateString());
    setFormMethod('bKash');
    setFormAmount('');
    setFormRef('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (record: PaymentRecord) => {
    setEditingId(record.id);
    setFormDate(record.date);
    setFormMethod((record.method as PaymentMethod) || 'Other');
    setFormAmount(String(record.amount));
    setFormRef(record.reference);
    setFormNotes(record.notes);
    setIsModalOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Math.max(0, parseFloat(formAmount) || 0);

    if (parsedAmount <= 0) {
      alert(t.invalidNumber);
      return;
    }

    if (editingId) {
      // update existing
      onChange(
        payments.map((p) =>
          p.id === editingId
            ? {
                ...p,
                date: formDate,
                method: formMethod,
                amount: parsedAmount,
                reference: formRef,
                notes: formNotes,
              }
            : p
        )
      );
    } else {
      // add new
      const newPayment: PaymentRecord = {
        id: generatePaymentId(),
        date: formDate,
        method: formMethod,
        amount: parsedAmount,
        reference: formRef,
        notes: formNotes,
      };
      onChange([...payments, newPayment]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.deleteConfirmMsg)) {
      onChange(payments.filter((p) => p.id !== id));
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'bKash':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">
            <Smartphone className="w-3 h-3" />
            bKash
          </span>
        );
      case 'Nagad':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
            <Smartphone className="w-3 h-3" />
            Nagad
          </span>
        );
      case 'Cash':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            <Banknote className="w-3 h-3" />
            Cash
          </span>
        );
      case 'Bank':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            <Landmark className="w-3 h-3" />
            Bank
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            <CreditCard className="w-3 h-3" />
            {method}
          </span>
        );
    }
  };

  const totalRecordedPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <section 
      id="payment-history-section"
      className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              {t.paymentHistoryTitle}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {payments.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.paymentHistoryDesc}
          </p>
        </div>

        <button
          id="btn-add-payment-entry"
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addPayment}</span>
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-7 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
          <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600 font-medium">{t.noPayments}</p>
          <button
            type="button"
            onClick={openAddModal}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addPayment}</span>
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-2/12">{t.paymentDate}</th>
                  <th className="py-2.5 px-3 w-2/12">{t.paymentMethod}</th>
                  <th className="py-2.5 px-3 w-2/12 text-right">{t.paymentAmount}</th>
                  <th className="py-2.5 px-3 w-2.5/12">{t.paymentRef}</th>
                  <th className="py-2.5 px-3 w-2.5/12">{t.paymentNotes}</th>
                  <th className="py-2.5 px-2 w-16 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {payments.map((p, index) => (
                  <tr 
                    key={p.id}
                    id={`payment-row-${index}`}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-xs text-slate-700 font-mono">
                      {p.date}
                    </td>
                    <td className="py-2.5 px-3">
                      {getMethodBadge(p.method)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                      {formatCurrency(p.amount, sym, dec, bn)}
                    </td>
                    <td className="py-2.5 px-3 text-xs font-mono text-slate-600 truncate max-w-[140px]">
                      {p.reference || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-slate-600 truncate max-w-[160px]">
                      {p.notes || '—'}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          title={t.edit}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          title={t.delete}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-2.5">
            {payments.map((p, index) => (
              <div 
                key={p.id}
                id={`payment-card-${index}`}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getMethodBadge(p.method)}
                    <span className="text-xs font-mono text-slate-500">{p.date}</span>
                  </div>
                  <div className="text-base font-bold font-mono text-emerald-800">
                    {formatCurrency(p.amount, sym, dec, bn)}
                  </div>
                </div>

                {(p.reference || p.notes) && (
                  <div className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200/60">
                    {p.reference && <div><span className="font-semibold">Ref:</span> {p.reference}</div>}
                    {p.notes && <div><span className="font-semibold">Note:</span> {p.notes}</div>}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => openEditModal(p)}
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium px-2 py-1 rounded hover:bg-indigo-50"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{t.edit}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium px-2 py-1 rounded hover:bg-rose-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{t.delete}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Total Recorded Summary Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          {t.totalPaidSummary}
        </span>
        <span className="text-sm sm:text-base font-bold font-mono text-emerald-800">
          {formatCurrency(totalRecordedPaid, sym, dec, bn)}
        </span>
      </div>

      {/* Record / Edit Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs modal-overlay">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-5 sm:p-6 border border-slate-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? t.editPaymentModalTitle : t.recordPaymentModalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3.5">
              
              {/* Payment Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.paymentAmount} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">
                    {sym}
                  </span>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    required
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                    className="w-full pl-8 pr-3 py-2 text-base font-bold font-mono bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.paymentMethod}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormMethod(m)}
                      className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all text-center ${
                        formMethod === m
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.paymentDate}
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              {/* Reference / TrxID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.paymentRef} (TrxID / Receipt #)
                </label>
                <input
                  type="text"
                  value={formRef}
                  onChange={(e) => setFormRef(e.target.value)}
                  placeholder="e.g. TRX892348 or Cheque #124"
                  className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-400"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.paymentNotes}
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Received via WhatsApp confirm"
                  className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-400"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  {t.savePayment}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </section>
  );
};
