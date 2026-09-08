import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Loader2, 
  FileText 
} from 'lucide-react';
import { 
  CustomerInfo, 
  CostItem, 
  PaymentRecord, 
  PaymentDetails, 
  BusinessSettings, 
  Language 
} from '../types';
import { CalculationResults } from '../utils/calculations';
import { PrintInvoiceView } from './PrintInvoiceView';
import { exportElementToPdf, triggerPrintDocument } from '../utils/pdfExport';
import { getTranslation } from '../translations';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerInfo: CustomerInfo;
  costItems: CostItem[];
  payments: PaymentRecord[];
  paymentDetails: PaymentDetails;
  totals: CalculationResults;
  settings: BusinessSettings;
  language: Language;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  customerInfo,
  costItems,
  payments,
  paymentDetails,
  totals,
  settings,
  language,
}) => {
  if (!isOpen) return null;

  const t = getTranslation(language);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const fileName = `Invoice_${customerInfo.invoiceNumber || 'INV'}_${customerInfo.date || 'doc'}.pdf`;

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfSuccess(false);
    try {
      const res = await exportElementToPdf('preview-invoice-container', fileName);
      if (res.success) {
        setPdfSuccess(true);
        setTimeout(() => setPdfSuccess(false), 4000);
      } else {
        alert('Could not export PDF: ' + (res.error || 'Unknown error'));
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrintClick = () => {
    triggerPrintDocument('preview-invoice-container');
  };

  const handleOpenInNewTab = () => {
    const previewEl = document.getElementById('preview-invoice-container');
    if (!previewEl) return;

    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      alert('Please allow popups for this site to open print window.');
      return;
    }

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');

    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${customerInfo.invoiceNumber || 'Invoice'} - Smart Calculator</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
          ${styles}
          <style>
            @page { size: A4; margin: 10mm; }
            body { 
              background: #fff !important; 
              color: #000 !important; 
              padding: 20px; 
              font-family: 'Plus Jakarta Sans', 'Hind Siliguri', sans-serif;
            }
            .no-print { display: none !important; }
          </style>
        </head>
        <body>
          <div style="margin-bottom: 20px; text-align: center;" class="no-print">
            <button onclick="window.print()" style="padding: 10px 24px; font-size: 14px; font-weight: bold; background: #059669; color: #fff; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
              🖨️ Print Now (Ctrl+P)
            </button>
            <button onclick="window.close()" style="padding: 10px 18px; font-size: 14px; background: #e2e8f0; color: #334155; border: none; border-radius: 6px; cursor: pointer;">
              Close Window
            </button>
          </div>
          ${previewEl.outerHTML}
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs modal-overlay">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Modal Toolbar Header */}
        <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Invoice & Print Preview
              </h3>
              <p className="text-[11px] text-slate-300">
                Invoice #{customerInfo.invoiceNumber} • Ready for A4 Print & PDF Download
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Direct PDF Download Button */}
            <button
              id="btn-modal-download-pdf"
              type="button"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.saveAsPdf}</span>
                </>
              )}
            </button>

            {/* Print Trigger Button */}
            <button
              id="btn-modal-print-trigger"
              type="button"
              onClick={handlePrintClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-800 bg-white hover:bg-slate-100 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-700" />
              <span>{t.print}</span>
            </button>

            {/* New Tab Option (avoids all iframe restrictions) */}
            <button
              id="btn-modal-open-tab"
              type="button"
              onClick={handleOpenInNewTab}
              title="Open in standalone tab for browser native printing"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>New Tab</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/80">
          <div className="max-w-3xl mx-auto shadow-md rounded-lg overflow-hidden border border-slate-300">
            <div id="preview-invoice-container" className="bg-white">
              <PrintInvoiceView
                customerInfo={customerInfo}
                costItems={costItems}
                payments={payments}
                paymentDetails={paymentDetails}
                totals={totals}
                settings={settings}
                language={language}
                containerId="preview-invoice-inner"
              />
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 shrink-0">
          <span className="text-center sm:text-left">
            💡 <strong>Save as PDF</strong> downloads an actual PDF file directly to your device without requiring print dialogs.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
