import React, { useState } from 'react';
import { Plus, Trash2, Layers, AlertCircle } from 'lucide-react';
import { CostItem, BusinessSettings, Language } from '../types';
import { getTranslation } from '../translations';
import { formatCurrency } from '../utils/formatters';
import { calculateItemTotal, sanitizeNumber } from '../utils/calculations';
import { generateItemId } from '../utils/formatters';

interface CostItemsTableProps {
  items: CostItem[];
  onChange: (items: CostItem[]) => void;
  settings: BusinessSettings;
  language: Language;
}

const PREDEFINED_CATEGORIES = [
  'Product',
  'Delivery',
  'Packaging',
  'Labor',
  'Service',
  'Marketing',
  'Tax',
  'Commission',
  'Other',
];

export const CostItemsTable: React.FC<CostItemsTableProps> = ({
  items,
  onChange,
  settings,
  language,
}) => {
  const t = getTranslation(language);
  const sym = settings.currencySymbol;
  const dec = settings.decimalPlaces;
  const bn = settings.useBengaliNumerals;

  const [customCatInputs, setCustomCatInputs] = useState<Record<string, string>>({});

  const handleAddItem = () => {
    const newItem: CostItem = {
      id: generateItemId(),
      description: '',
      category: 'Product',
      quantity: 1,
      unitCost: 0,
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (id: string, updates: Partial<CostItem>) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'Product': return t.catProduct;
      case 'Delivery': return t.catDelivery;
      case 'Packaging': return t.catPackaging;
      case 'Labor': return t.catLabor;
      case 'Service': return t.catService;
      case 'Marketing': return t.catMarketing;
      case 'Tax': return t.catTax;
      case 'Commission': return t.catCommission;
      case 'Other': return t.catOther;
      default: return cat;
    }
  };

  return (
    <section 
      id="cost-items-section"
      className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              {t.costSectionTitle}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {items.length} {t.itemsCount}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.costSectionDesc}
          </p>
        </div>

        <button
          id="btn-add-cost-item"
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addCostItem}</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
          <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600 font-medium">{t.noCostItems}</p>
          <button
            type="button"
            onClick={handleAddItem}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addCostItem}</span>
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-5/12">{t.itemDescription}</th>
                  <th className="py-2.5 px-3 w-2/12">{t.category}</th>
                  <th className="py-2.5 px-3 w-1.5/12 text-center">{t.quantity}</th>
                  <th className="py-2.5 px-3 w-2/12 text-right">{t.unitCost}</th>
                  <th className="py-2.5 px-3 w-2/12 text-right">{t.totalCostCol}</th>
                  <th className="py-2.5 px-2 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {items.map((item, index) => {
                  const rowTotal = calculateItemTotal(item);
                  const isCustomCategory = !PREDEFINED_CATEGORIES.includes(item.category);

                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50/60 transition-colors group"
                      id={`cost-row-${index}`}
                    >
                      {/* Description */}
                      <td className="py-2 px-3">
                        <input
                          id={`cost-desc-${item.id}`}
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                          placeholder={t.itemDescription}
                          className="w-full px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                        />
                      </td>

                      {/* Category */}
                      <td className="py-2 px-3">
                        <div className="flex flex-col gap-1">
                          <select
                            id={`cost-cat-${item.id}`}
                            value={isCustomCategory ? 'Custom' : item.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'Custom') {
                                handleUpdateItem(item.id, { category: customCatInputs[item.id] || 'Custom' });
                              } else {
                                handleUpdateItem(item.id, { category: val });
                              }
                            }}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                          >
                            {PREDEFINED_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {getCategoryLabel(cat)}
                              </option>
                            ))}
                            <option value="Custom">{t.catCustom}</option>
                          </select>

                          {/* Custom Category Input if selected */}
                          {(isCustomCategory || item.category === 'Custom') && (
                            <input
                              type="text"
                              value={item.category === 'Custom' ? (customCatInputs[item.id] || '') : item.category}
                              onChange={(e) => {
                                const customVal = e.target.value;
                                setCustomCatInputs({ ...customCatInputs, [item.id]: customVal });
                                handleUpdateItem(item.id, { category: customVal || 'Custom' });
                              }}
                              placeholder={t.customCategoryPlaceholder}
                              className="w-full px-2 py-1 text-xs border border-emerald-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800"
                            />
                          )}
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="py-2 px-3">
                        <input
                          id={`cost-qty-${item.id}`}
                          type="number"
                          min="0"
                          step="any"
                          value={item.quantity === 0 ? '' : item.quantity}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                            handleUpdateItem(item.id, { quantity: isNaN(val) || val < 0 ? 0 : val });
                          }}
                          className="w-full px-2 py-1.5 text-sm text-center font-mono bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                          placeholder="0"
                        />
                      </td>

                      {/* Unit Cost */}
                      <td className="py-2 px-3">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">
                            {sym}
                          </span>
                          <input
                            id={`cost-unit-${item.id}`}
                            type="number"
                            min="0"
                            step="any"
                            value={item.unitCost === 0 ? '' : item.unitCost}
                            onChange={(e) => {
                              const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                              handleUpdateItem(item.id, { unitCost: isNaN(val) || val < 0 ? 0 : val });
                            }}
                            className="w-full pl-6 pr-2.5 py-1.5 text-sm text-right font-mono bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                            placeholder="0"
                          />
                        </div>
                      </td>

                      {/* Total Cost */}
                      <td className="py-2 px-3 text-right">
                        <span className="text-sm font-bold font-mono text-slate-900">
                          {formatCurrency(rowTotal, sym, dec, bn)}
                        </span>
                      </td>

                      {/* Remove Button */}
                      <td className="py-2 px-2 text-center">
                        <button
                          id={`cost-remove-${item.id}`}
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          title={t.remove}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards Layout */}
          <div className="md:hidden space-y-3">
            {items.map((item, index) => {
              const rowTotal = calculateItemTotal(item);
              const isCustomCategory = !PREDEFINED_CATEGORIES.includes(item.category);

              return (
                <div 
                  key={item.id}
                  id={`cost-card-${index}`}
                  className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Item #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium px-2 py-1 rounded-md hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.remove}</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {t.itemDescription}
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                      placeholder={t.itemDescription}
                      className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {t.category}
                      </label>
                      <select
                        value={isCustomCategory ? 'Custom' : item.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Custom') {
                            handleUpdateItem(item.id, { category: customCatInputs[item.id] || 'Custom' });
                          } else {
                            handleUpdateItem(item.id, { category: val });
                          }
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                      >
                        {PREDEFINED_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {getCategoryLabel(cat)}
                          </option>
                        ))}
                        <option value="Custom">{t.catCustom}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {t.quantity}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.quantity === 0 ? '' : item.quantity}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          handleUpdateItem(item.id, { quantity: isNaN(val) || val < 0 ? 0 : val });
                        }}
                        className="w-full px-2.5 py-1.5 text-sm text-center font-mono bg-white border border-slate-300 rounded-lg text-slate-800"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Custom category input if custom */}
                  {(isCustomCategory || item.category === 'Custom') && (
                    <div>
                      <input
                        type="text"
                        value={item.category === 'Custom' ? (customCatInputs[item.id] || '') : item.category}
                        onChange={(e) => {
                          const customVal = e.target.value;
                          setCustomCatInputs({ ...customCatInputs, [item.id]: customVal });
                          handleUpdateItem(item.id, { category: customVal || 'Custom' });
                        }}
                        placeholder={t.customCategoryPlaceholder}
                        className="w-full px-2 py-1 text-xs border border-emerald-300 rounded-md text-slate-800"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {t.unitCost}
                      </label>
                      <div className="relative">
                        <span className="absolute left-2 top-1.5 text-xs font-bold text-slate-400">
                          {sym}
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.unitCost === 0 ? '' : item.unitCost}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                            handleUpdateItem(item.id, { unitCost: isNaN(val) || val < 0 ? 0 : val });
                          }}
                          className="w-full pl-5 pr-2 py-1.5 text-sm text-right font-mono bg-white border border-slate-300 rounded-lg text-slate-800"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-end text-right">
                      <span className="text-[11px] text-slate-500">{t.totalCostCol}</span>
                      <span className="text-base font-bold font-mono text-slate-900">
                        {formatCurrency(rowTotal, sym, dec, bn)}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Footer summary bar inside Cost Section */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={handleAddItem}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.addCostItem}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            {t.subtotalCost}:
          </span>
          <span className="text-sm sm:text-base font-bold font-mono text-slate-900">
            {formatCurrency(
              items.reduce((s, it) => s + calculateItemTotal(it), 0),
              sym,
              dec,
              bn
            )}
          </span>
        </div>
      </div>
    </section>
  );
};
