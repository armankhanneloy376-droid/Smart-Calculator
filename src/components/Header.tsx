import React from 'react';
import { 
  ArrowLeft,
  RotateCcw, 
  Printer, 
  Download, 
  History, 
  Settings as SettingsIcon, 
  Sparkles,
  Save,
  Loader2
} from 'lucide-react';
import { Language, BusinessSettings } from '../types';
import { getTranslation } from '../translations';
import { Logo } from './Logo';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNewCalculation: () => void;
  onPrint: () => void;
  onSaveAsPdf: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onLoadExample: () => void;
  onSaveToHistory: () => void;
  historyCount: number;
  settings: BusinessSettings;
  isExportingPdf?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onNewCalculation,
  onPrint,
  onSaveAsPdf,
  onOpenHistory,
  onOpenSettings,
  onLoadExample,
  onSaveToHistory,
  historyCount,
  settings,
  isExportingPdf = false,
  onBack,
}) => {
  const t = getTranslation(language);

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Logo & App Brand with Business Logo from Assets & Back Option */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="header-back-btn"
              type="button"
              onClick={handleBackClick}
              title={t.back || 'Back'}
              aria-label={t.back || 'Back'}
              className="inline-flex items-center justify-center p-2 sm:px-2.5 sm:py-1.5 text-slate-700 bg-white hover:bg-slate-100 hover:text-slate-900 rounded-lg border border-slate-200/90 shadow-2xs transition-all active:scale-95 shrink-0 group focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-900 transition-colors" />
              <span className="hidden sm:inline text-xs font-semibold ml-1.5">{t.back || 'Back'}</span>
            </button>

            <Logo 
              size="md" 
              businessName={settings.businessName || 'Smart Calculator'}
              showSubtitle={true}
              showText={true}
            />
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-center">
              {settings.currencySymbol} BDT
            </span>
          </div>

          {/* Controls & Action Buttons */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 justify-start md:justify-end">
            
            {/* Language Switcher */}
            <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 mr-1">
              <button
                id="lang-btn-en"
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'en' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                id="lang-btn-bn"
                type="button"
                onClick={() => onLanguageChange('bn')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'bn' 
                    ? 'bg-white text-slate-900 shadow-xs font-medium' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাংলা
              </button>
            </div>

            {/* Load Example (Req 19) button */}
            <button
              id="btn-load-example"
              type="button"
              onClick={onLoadExample}
              title="Load calculation test case from Requirement #19"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">{t.loadExample}</span>
              <span className="lg:hidden">Sample</span>
            </button>

            {/* Save to History */}
            <button
              id="btn-save-history"
              type="button"
              onClick={onSaveToHistory}
              title={t.saveToHistory}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.saveToHistory}</span>
            </button>

            {/* History Modal Trigger */}
            <button
              id="btn-open-history"
              type="button"
              onClick={onOpenHistory}
              className="relative inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-100 transition-colors border border-slate-300 shadow-xs"
            >
              <History className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">{t.history}</span>
              {historyCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-900 text-white">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Settings Trigger */}
            <button
              id="btn-open-settings"
              type="button"
              onClick={onOpenSettings}
              title={t.settings}
              className="inline-flex items-center justify-center p-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-100 transition-colors border border-slate-300 shadow-xs"
            >
              <SettingsIcon className="w-4 h-4 text-slate-600" />
            </button>

            <div className="h-5 w-px bg-slate-200 mx-0.5 hidden sm:block"></div>

            {/* New Calculation Button */}
            <button
              id="btn-new-calculation"
              type="button"
              onClick={onNewCalculation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>{t.newCalculation}</span>
            </button>

            {/* Print Button */}
            <button
              id="btn-print"
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300"
            >
              <Printer className="w-3.5 h-3.5 text-slate-700" />
              <span>{t.print}</span>
            </button>

            {/* Save as PDF Button */}
            <button
              id="btn-save-pdf"
              type="button"
              disabled={isExportingPdf}
              onClick={onSaveAsPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-60"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Exporting PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.saveAsPdf}</span>
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
