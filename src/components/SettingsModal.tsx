import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Check, RotateCcw } from 'lucide-react';
import { BusinessSettings, Language } from '../types';
import { getTranslation } from '../translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BusinessSettings;
  onSave: (updated: BusinessSettings) => void;
  language: Language;
}

const PRESET_CURRENCIES = [
  { symbol: '৳', label: '৳ Bangladeshi Taka (BDT)', code: 'BDT' },
  { symbol: '$', label: '$ US Dollar (USD)', code: 'USD' },
  { symbol: '€', label: '€ Euro (EUR)', code: 'EUR' },
  { symbol: '£', label: '£ British Pound (GBP)', code: 'GBP' },
  { symbol: '₹', label: '₹ Indian Rupee (INR)', code: 'INR' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  language,
}) => {
  if (!isOpen) return null;

  const t = getTranslation(language);

  const [currentSettings, setCurrentSettings] = useState<BusinessSettings>({ ...settings });
  const [customSymbol, setCustomSymbol] = useState<string>(
    PRESET_CURRENCIES.some((c) => c.symbol === settings.currencySymbol) ? '' : settings.currencySymbol
  );

  const handleCurrencySelect = (symbol: string, code: string) => {
    setCurrentSettings({
      ...currentSettings,
      currencySymbol: symbol,
      currencyCode: code,
    });
    setCustomSymbol('');
  };

  const handleCustomSymbolChange = (val: string) => {
    setCustomSymbol(val);
    setCurrentSettings({
      ...currentSettings,
      currencySymbol: val || '৳',
      currencyCode: 'CUSTOM',
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(currentSettings);
    onClose();
  };

  const handleResetDefaults = () => {
    const defaults: BusinessSettings = {
      businessName: '',
      businessPhone: '',
      businessAddress: '',
      currencySymbol: '৳',
      currencyCode: 'BDT',
      decimalPlaces: 0,
      useBengaliNumerals: false,
    };
    setCurrentSettings(defaults);
    setCustomSymbol('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs modal-overlay">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-5 sm:p-6 border border-slate-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              {t.settingsTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Currency Selection */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">
              {t.currencySetting} (Default: ৳ BDT)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
              {PRESET_CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCurrencySelect(c.symbol, c.code)}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                    currentSettings.currencySymbol === c.symbol && !customSymbol
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{c.label}</span>
                  {currentSettings.currencySymbol === c.symbol && !customSymbol && (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Symbol Input */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">{t.currencySymbolCustom}:</span>
              <input
                type="text"
                maxLength={4}
                value={customSymbol}
                onChange={(e) => handleCustomSymbolChange(e.target.value)}
                placeholder="e.g. ৳ or ﷼"
                className="w-24 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-center font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Bengali Numerals toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800 block">
                {t.bengaliDigitsToggle}
              </span>
              <span className="text-slate-500 text-[11px]">
                Convert 1,250 to ১,২৫০ in cards, calculations & printed invoice
              </span>
            </div>
            <input
              type="checkbox"
              checked={currentSettings.useBengaliNumerals}
              onChange={(e) =>
                setCurrentSettings({
                  ...currentSettings,
                  useBengaliNumerals: e.target.checked,
                })
              }
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Decimal places */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-semibold text-slate-800">Decimal Places:</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setCurrentSettings({ ...currentSettings, decimalPlaces: 0 })}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  currentSettings.decimalPlaces === 0
                    ? 'bg-white shadow-xs text-slate-900'
                    : 'text-slate-600'
                }`}
              >
                0 (e.g. ৳5,420)
              </button>
              <button
                type="button"
                onClick={() => setCurrentSettings({ ...currentSettings, decimalPlaces: 2 })}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  currentSettings.decimalPlaces === 2
                    ? 'bg-white shadow-xs text-slate-900'
                    : 'text-slate-600'
                }`}
              >
                2 (e.g. ৳5,420.00)
              </button>
            </div>
          </div>

          {/* Business Details for Printout */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="font-bold text-slate-800 block">
              {t.businessInfoTitle}
            </span>
            
            <div>
              <label className="block text-slate-600 mb-0.5">{t.businessName}</label>
              <input
                type="text"
                value={currentSettings.businessName}
                onChange={(e) => setCurrentSettings({ ...currentSettings, businessName: e.target.value })}
                placeholder="e.g. Dhaka Fashion House / Global Trading Ltd"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-0.5">{t.businessPhone}</label>
              <input
                type="text"
                value={currentSettings.businessPhone}
                onChange={(e) => setCurrentSettings({ ...currentSettings, businessPhone: e.target.value })}
                placeholder="e.g. +880 1711-000000"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-0.5">{t.businessAddress}</label>
              <input
                type="text"
                value={currentSettings.businessAddress}
                onChange={(e) => setCurrentSettings({ ...currentSettings, businessAddress: e.target.value })}
                placeholder="e.g. Motijheel C/A, Dhaka-1000, Bangladesh"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.resetDefaults}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-xs"
              >
                {t.saveSettings}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
