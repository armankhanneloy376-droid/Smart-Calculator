import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface ExportPdfResult {
  success: boolean;
  error?: string;
}

/**
 * Preload all image assets inside a container element so html2canvas renders them completely.
 */
async function preloadImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map(async (img) => {
      try {
        img.crossOrigin = 'anonymous';
        if ('decode' in img && img.complete && img.naturalHeight !== 0) {
          await img.decode();
          return;
        }
      } catch {
        // Continue if decode fails
      }

      if (img.complete && img.naturalHeight !== 0) return;

      return new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, 1500);
        img.onload = () => {
          clearTimeout(timer);
          resolve();
        };
        img.onerror = () => {
          clearTimeout(timer);
          resolve();
        };
      });
    })
  );
}

/**
 * Waits for document fonts to finish loading so text metrics render accurately without clipping.
 */
async function waitForFontsReady(): Promise<void> {
  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch {
    // Ignore font loading errors if unsupported
  }
}

/**
 * Exports a DOM element directly into a high-resolution, unclipped standard A4 PDF document
 * using html2canvas and jsPDF. Completely client-side, zero paid APIs.
 *
 * Handles offscreen rendering by staging a cloned node at standard A4 pixel density
 * at (0, 0) with high negative z-index to prevent clipping, negative offset bugs,
 * or UI disruption.
 */
export async function exportElementToPdf(
  elementId: string,
  fileName: string = 'Invoice.pdf'
): Promise<ExportPdfResult> {
  let stagingContainer: HTMLDivElement | null = null;

  try {
    const rawTarget = document.getElementById(elementId);
    if (!rawTarget) {
      return { success: false, error: `Target element #${elementId} not found.` };
    }

    // Determine the actual invoice element to capture
    // If target is an offscreen wrapper, extract the inner invoice content
    const sourceNode =
      rawTarget.id === 'offscreen-pdf-area' && rawTarget.firstElementChild instanceof HTMLElement
        ? rawTarget.firstElementChild
        : rawTarget;

    // Standard A4 dimensions in pixels at 96 DPI: 210mm = 793.7px, 297mm = 1122.5px
    const A4_WIDTH_PX = 794;

    // 1. Create an isolated staging container in the document body
    // Positioned at (0,0) so html2canvas calculates correct non-negative coordinates,
    // but hidden under document flow with zIndex -99999 so user screen is never disrupted.
    stagingContainer = document.createElement('div');
    stagingContainer.id = 'pdf-render-staging-sandbox';
    stagingContainer.style.position = 'fixed';
    stagingContainer.style.left = '0';
    stagingContainer.style.top = '0';
    stagingContainer.style.width = `${A4_WIDTH_PX}px`;
    stagingContainer.style.maxWidth = `${A4_WIDTH_PX}px`;
    stagingContainer.style.minHeight = 'auto';
    stagingContainer.style.zIndex = '-99999';
    stagingContainer.style.backgroundColor = '#ffffff';
    stagingContainer.style.color = '#000000';
    stagingContainer.style.opacity = '1';
    stagingContainer.style.visibility = 'visible';
    stagingContainer.style.pointerEvents = 'none';
    stagingContainer.style.overflow = 'visible';
    stagingContainer.style.boxSizing = 'border-box';

    // 2. Clone the target node into our staging container
    const clonedNode = sourceNode.cloneNode(true) as HTMLElement;
    clonedNode.style.position = 'static';
    clonedNode.style.display = 'block';
    clonedNode.style.visibility = 'visible';
    clonedNode.style.width = '100%';
    clonedNode.style.maxWidth = '100%';
    clonedNode.style.margin = '0';
    clonedNode.style.transform = 'none';
    clonedNode.style.opacity = '1';

    stagingContainer.appendChild(clonedNode);
    document.body.appendChild(stagingContainer);

    // 3. Ensure fonts and image assets are completely ready
    await waitForFontsReady();
    await preloadImages(stagingContainer);

    // Small tick to ensure browser layout & styles recalculate
    await new Promise((resolve) => setTimeout(resolve, 100));

    const renderWidth = stagingContainer.offsetWidth || A4_WIDTH_PX;
    const renderHeight = stagingContainer.scrollHeight || 1123;

    // 4. Render with html2canvas at scale 2 (192+ DPI for vector-quality text & tables)
    const canvas = await html2canvas(stagingContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: renderWidth,
      height: renderHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1024,
    });

    // 5. Build standard A4 PDF with jsPDF
    // Standard A4 dimensions in millimeters
    const PDF_PAGE_WIDTH_MM = 210;
    const PDF_PAGE_HEIGHT_MM = 297;
    const MARGIN_MM = 10; // 10mm margins on left, right, top, bottom

    const contentWidthMm = PDF_PAGE_WIDTH_MM - MARGIN_MM * 2; // 190 mm
    const contentHeightMm = PDF_PAGE_HEIGHT_MM - MARGIN_MM * 2; // 277 mm

    const totalHeightMm = (canvas.height * contentWidthMm) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Case A: Fits on a single A4 page
    if (totalHeightMm <= contentHeightMm) {
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(
        imgData,
        'PNG',
        MARGIN_MM,
        MARGIN_MM,
        contentWidthMm,
        totalHeightMm,
        undefined,
        'FAST'
      );
    }
    // Case B: Slightly larger than single page (within 8% tolerance)
    // Scale slightly so invoice delivers on 1 pristine page instead of an orphan 2nd page
    else if (totalHeightMm <= contentHeightMm * 1.08) {
      const scale = contentHeightMm / totalHeightMm;
      const scaledWidth = contentWidthMm * scale;
      const scaledX = MARGIN_MM + (contentWidthMm - scaledWidth) / 2;
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(
        imgData,
        'PNG',
        scaledX,
        MARGIN_MM,
        scaledWidth,
        contentHeightMm,
        undefined,
        'FAST'
      );
    }
    // Case C: Multi-page document
    // Split using crisp canvas slices so content is never sliced awkwardly or clipped
    else {
      const pageCanvasHeightPx = Math.floor((contentHeightMm * canvas.width) / contentWidthMm);
      const totalPages = Math.ceil(canvas.height / pageCanvasHeightPx);

      for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
        if (pageIdx > 0) {
          pdf.addPage('a4', 'portrait');
        }

        const sourceY = pageIdx * pageCanvasHeightPx;
        const sourceH = Math.min(pageCanvasHeightPx, canvas.height - sourceY);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceH;
        const ctx = pageCanvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceH,
            0,
            0,
            pageCanvas.width,
            sourceH
          );

          const pageData = pageCanvas.toDataURL('image/png', 1.0);
          const pageHeightMm = (sourceH * contentWidthMm) / canvas.width;

          pdf.addImage(
            pageData,
            'PNG',
            MARGIN_MM,
            MARGIN_MM,
            contentWidthMm,
            pageHeightMm,
            undefined,
            'FAST'
          );
        }

        // Clean page number footer in multi-page mode
        pdf.setFontSize(8);
        pdf.setTextColor(140, 140, 140);
        pdf.text(
          `Page ${pageIdx + 1} of ${totalPages}`,
          PDF_PAGE_WIDTH_MM / 2,
          PDF_PAGE_HEIGHT_MM - 4,
          { align: 'center' }
        );
      }
    }

    // 6. Save file directly to user device
    const finalFileName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(finalFileName);

    return { success: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('PDF Export Error:', errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    // 7. Cleanup staging container from DOM
    if (stagingContainer && stagingContainer.parentNode) {
      stagingContainer.parentNode.removeChild(stagingContainer);
    }
  }
}

/**
 * Robust print trigger for modern web apps, handling iframe restrictions
 * by injecting into an isolated printable frame.
 */
export function triggerPrintDocument(elementId: string): boolean {
  try {
    const rawTarget = document.getElementById(elementId);
    if (!rawTarget) {
      window.print();
      return true;
    }

    const targetElement =
      rawTarget.id === 'offscreen-pdf-area' && rawTarget.firstElementChild instanceof HTMLElement
        ? rawTarget.firstElementChild
        : rawTarget;

    // Create a temporary hidden iframe to print ONLY the invoice content
    const existingFrame = document.getElementById('temp-print-frame');
    if (existingFrame) {
      existingFrame.remove();
    }

    const printFrame = document.createElement('iframe');
    printFrame.id = 'temp-print-frame';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) {
      window.print();
      return true;
    }

    // Gather existing styles
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');

    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <base href="${window.location.origin}/">
          <title>Print Invoice</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
          ${styles}
          <style>
            @page { size: A4; margin: 8mm 12mm; }
            body { 
              margin: 0; 
              padding: 0; 
              background: #fff !important; 
              color: #000 !important;
              font-family: 'Plus Jakarta Sans', 'Hind Siliguri', sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print { display: none !important; }
            table { width: 100% !important; border-collapse: collapse !important; }
            tr, .print-avoid-break { page-break-inside: avoid; break-inside: avoid; }
          </style>
        </head>
        <body>
          ${targetElement.outerHTML}
        </body>
      </html>
    `);
    frameDoc.close();

    setTimeout(() => {
      try {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
      } catch {
        window.print();
      } finally {
        setTimeout(() => printFrame.remove(), 2500);
      }
    }, 450);

    return true;
  } catch (err) {
    console.error('Print Error, falling back to window.print()', err);
    try {
      window.print();
      return true;
    } catch {
      return false;
    }
  }
}
