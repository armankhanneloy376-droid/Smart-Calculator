import React, { useState, useEffect, useMemo } from 'react';
import { 
  CustomerInfo, 
  CostItem, 
  PaymentRecord, 
  PaymentDetails, 
  BusinessSettings, 
  CalculationHistoryItem, 
  Language 
} from './types';
import { 
  computeTotals, 
  getExampleData 
} from './utils/calculations';
import { 
  generateInvoiceNumber, 
  getTodayDateString, 
  generateItemId 
} from './utils/formatters';
import { getTranslation } from './translations';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { CustomerSection } from './components/CustomerSection';
import { CostItemsTable } from './components/CostItemsTable';
import { PaymentSection } from './components/PaymentSection';
import { PaymentHistory } from './components/PaymentHistory';
import { PrintInvoiceView } from './components/PrintInvoiceView';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { exportElementToPdf } from './utils/pdfExport';
import { CheckCircle, Info } from 'lucide-react';

const STORAGE_KEY_CURRENT = 'smart_cost_calc_current_v2';
const STORAGE_KEY_HISTORY = 'smart_cost_calc_history';
const STORAGE_KEY_SETTINGS = 'smart_cost_calc_settings';
const STORAGE_KEY_LANG = 'smart_cost_calc_lang';

const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: '',
  businessPhone: '',
  businessAddress: '',
  currencySymbol: '৳',
  currencyCode: 'BDT',
  decimalPlaces: 0,
  useBengaliNumerals: false,
};

function createInitialCustomerInfo(): CustomerInfo {
  return {
    name: '',
    phone: '',
    invoiceNumber: generateInvoiceNumber(),
    date: getTodayDateString(),
    notes: '',
  };
}

function createInitialCostItems(): CostItem[] {
  return [];
}

function createInitialPaymentDetails(): PaymentDetails {
  return {
    sellingPrice: 0,
    discount: 0,
    tax: 0,
    additionalCost: 0,
    additionalCharge: 0,
    manualPaidAmount: 0,
  };
}

export default function App() {
  // 1. Language state
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      return (saved === 'bn' || saved === 'en') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  // 2. Settings state
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // 3. Calculator State
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.customerInfo) return parsed.customerInfo;
      }
    } catch {
      // fallback
    }
    return createInitialCustomerInfo();
  });

  const [costItems, setCostItems] = useState<CostItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.costItems)) return parsed.costItems;
      }
    } catch {
      // fallback
    }
    return createInitialCostItems();
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.paymentDetails) return parsed.paymentDetails;
      }
    } catch {
      // fallback
    }
    return createInitialPaymentDetails();
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.payments)) return parsed.payments;
      }
    } catch {
      // fallback
    }
    return [];
  });

  // 4. Saved History state
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // 5. Modals & Notifications
  const [isNewCalcConfirmOpen, setIsNewCalcConfirmOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = getTranslation(language);

  // Compute all totals reactive to inputs
  const totals = useMemo(() => {
    return computeTotals(costItems, paymentDetails, payments);
  }, [costItems, paymentDetails, payments]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, language);
    } catch {
      // ignore
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Auto-save current calculation to localStorage (Requirement 13)
  useEffect(() => {
    try {
      const currentState = {
        customerInfo,
        costItems,
        paymentDetails,
        payments,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(currentState));
    } catch {
      // ignore
    }
  }, [customerInfo, costItems, paymentDetails, payments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Show auto-dismiss toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Actions
  const handleNewCalculationConfirm = () => {
    setCustomerInfo(createInitialCustomerInfo());
    setCostItems([]);
    setPaymentDetails({
      sellingPrice: 0,
      discount: 0,
      tax: 0,
      additionalCost: 0,
      additionalCharge: 0,
      manualPaidAmount: 0,
    });
    setPayments([]);
    setIsNewCalcConfirmOpen(false);
    showToast('New calculation started. Previous unsaved state cleared.');
  };

  const handlePrint = () => {
    setIsPrintPreviewOpen(true);
  };

  const handleSaveAsPdf = async () => {
    setIsExportingPdf(true);
    showToast('Generating high-resolution PDF document...');
    try {
      const fileName = `Invoice_${customerInfo.invoiceNumber || 'INV'}.pdf`;
      const result = await exportElementToPdf('offscreen-pdf-area', fileName);
      if (result.success) {
        showToast(`Downloaded ${fileName} successfully!`);
      } else {
        // Fallback to preview modal
        setIsPrintPreviewOpen(true);
        showToast('Direct download note: Please review in the print preview modal.');
      }
    } catch (err) {
      console.error(err);
      setIsPrintPreviewOpen(true);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleLoadExample = () => {
    const example = getExampleData();
    setCustomerInfo(example.customerInfo);
    setCostItems(example.costItems);
    setPaymentDetails(example.paymentDetails);
    setPayments(example.payments);
    showToast(t.exampleLoaded);
  };

  const handleSaveToHistory = () => {
    const historyItem: CalculationHistoryItem = {
      id: `calc_${Date.now()}`,
      savedAt: new Date().toISOString(),
      customerInfo: { ...customerInfo },
      costItems: [...costItems],
      payments: [...payments],
      paymentDetails: { ...paymentDetails },
      totals: { ...totals },
    };

    setHistory((prev) => [historyItem, ...prev]);
    showToast(t.savedSuccess);
  };

  const handleLoadHistoryItem = (item: CalculationHistoryItem) => {
    setCustomerInfo({ ...item.customerInfo });
    setCostItems([...item.costItems]);
    setPaymentDetails({ ...item.paymentDetails });
    setPayments([...item.payments]);
    showToast(`Loaded invoice ${item.customerInfo.invoiceNumber}`);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    showToast('All saved calculation history has been cleared.');
  };

  const handleBack = () => {
    if (isPrintPreviewOpen) {
      setIsPrintPreviewOpen(false);
      return;
    }
    if (isHistoryOpen) {
      setIsHistoryOpen(false);
      return;
    }
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
      return;
    }
    if (isNewCalcConfirmOpen) {
      setIsNewCalcConfirmOpen(false);
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast(language === 'bn' ? 'শুরুর অবস্থানে ফিরে যাওয়া হয়েছে' : 'Navigated to top of calculation');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* 1. Header (Navbar with actions) */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onNewCalculation={() => setIsNewCalcConfirmOpen(true)}
        onPrint={handlePrint}
        onSaveAsPdf={handleSaveAsPdf}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLoadExample={handleLoadExample}
        onSaveToHistory={handleSaveToHistory}
        historyCount={history.length}
        settings={settings}
        isExportingPdf={isExportingPdf}
        onBack={handleBack}
      />

      {/* 2. Main Workspace Layout */}
      <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Quick toast notification bar if active */}
        {toastMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button 
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top Summary Cards (Section 8) */}
        <SummaryCards
          totals={totals}
          settings={settings}
          language={language}
        />

        {/* Customer & Transaction Info (Section 4) */}
        <CustomerSection
          customerInfo={customerInfo}
          onChange={setCustomerInfo}
          language={language}
        />

        {/* Separate Cost Items Table (Section 5) */}
        <CostItemsTable
          items={costItems}
          onChange={setCostItems}
          settings={settings}
          language={language}
        />

        {/* Payment & Billing Section (Section 6 & 7) */}
        <PaymentSection
          details={paymentDetails}
          onChange={setPaymentDetails}
          totals={totals}
          hasRecordedPayments={payments.length > 0}
          settings={settings}
          language={language}
        />

        {/* Payment History Section (Section 9) */}
        <PaymentHistory
          payments={payments}
          onChange={setPayments}
          settings={settings}
          language={language}
        />

        {/* Quick Footer info */}
        <footer className="no-print mt-12 py-6 border-t border-slate-200 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              © {new Date().getFullYear()} {settings.businessName || 'Smart Cost & Payment Calculator'}. 
              All calculations executed client-side.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLoadExample}
                className="text-emerald-600 hover:text-emerald-700 underline font-medium"
              >
                {t.loadExample}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="text-slate-600 hover:text-slate-800 underline"
              >
                {t.settings}
              </button>
            </div>
          </div>
        </footer>

      </main>

      {/* 3. Standalone Print Layout (Rendered for Window.print()) */}
      <PrintInvoiceView
        containerId="print-invoice-area"
        customerInfo={customerInfo}
        costItems={costItems}
        payments={payments}
        paymentDetails={paymentDetails}
        totals={totals}
        settings={settings}
        language={language}
      />

      {/* Offscreen Printable Layout (Rendered for high-res PDF generation without screen disruption) */}
      <div id="offscreen-pdf-area">
        <PrintInvoiceView
          containerId="offscreen-pdf-inner"
          customerInfo={customerInfo}
          costItems={costItems}
          payments={payments}
          paymentDetails={paymentDetails}
          totals={totals}
          settings={settings}
          language={language}
        />
      </div>

      {/* 4. Modals & Dialogs */}
      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        customerInfo={customerInfo}
        costItems={costItems}
        payments={payments}
        paymentDetails={paymentDetails}
        totals={totals}
        settings={settings}
        language={language}
      />

      <ConfirmDialog
        isOpen={isNewCalcConfirmOpen}
        title={t.newCalcConfirmTitle}
        message={t.newCalcConfirmMsg}
        confirmLabel={t.startNew}
        onConfirm={handleNewCalculationConfirm}
        onCancel={() => setIsNewCalcConfirmOpen(false)}
        language={language}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadItem={handleLoadHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
        settings={settings}
        language={language}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
        language={language}
      />

    </div>
  );
}
