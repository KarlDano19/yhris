import { toast } from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

import { AcceptanceMemoFormData, PrintOptions } from '@/types/document-generator/documents';

/**
 * Prints an acceptance memo using a hidden iframe approach.
 * No field validation is performed — view mode guarantees data is already present.
 */
export const printAcceptanceMemo = (formData: AcceptanceMemoFormData, options: PrintOptions): void => {
  const documentElement = document.getElementById(options.elementId);
  if (!documentElement) {
    toast.custom(() => <CustomToast message="Document preview not found" type="error" />);
    return;
  }

  toast.custom(() => <CustomToast message="Preparing acceptance memo for printing..." type="info" />);

  const frame = document.createElement('iframe');
  frame.style.position = 'fixed';
  frame.style.right = '0';
  frame.style.bottom = '0';
  frame.style.width = '210mm';
  frame.style.height = '297mm';
  frame.style.border = '0';
  frame.style.opacity = '0';
  frame.style.pointerEvents = 'none';

  document.body.appendChild(frame);

  const frameDoc = frame.contentWindow?.document;
  if (!frameDoc) {
    document.body.removeChild(frame);
    toast.custom(() => <CustomToast message="Could not create document frame" type="error" />);
    return;
  }

  const clone = documentElement.cloneNode(true) as HTMLElement;

  const previewHeader = clone.querySelector('.preview-header');
  if (previewHeader) previewHeader.remove();

  const printHideElements = clone.querySelectorAll('.print-hide');
  printHideElements.forEach(el => el.remove());

  const docTitle = `Acceptance Memo - ${formData.companyName || 'Document'}`;

  frameDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${docTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @page { size: A4 portrait; margin: 15mm 20mm; }

          *, *::before, *::after { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

          html, body { margin: 0; padding: 0; font-size: 14px; color: #1f2937; background: white; }

          /* Container */
          .print-container { width: 100%; }
          .print-container > div { background: white; padding: 1.5rem; width: 100%; }

          /* Typography */
          .text-2xl { font-size: 1.5rem; line-height: 2rem; }
          .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
          .text-xs { font-size: 0.75rem; line-height: 1rem; }
          .font-bold { font-weight: 700; }
          .font-semibold { font-weight: 600; }
          .uppercase { text-transform: uppercase; }
          .tracking-wide { letter-spacing: 0.05em; }
          .leading-relaxed { line-height: 1.625; }
          .text-center { text-align: center; }
          .text-gray-800 { color: #1f2937; }
          .text-gray-500 { color: #6b7280; }
          .text-gray-400 { color: #9ca3af; }
          .text-white { color: #ffffff; }

          /* Spacing — margin */
          .mt-1 { margin-top: 0.25rem; }
          .mt-8 { margin-top: 2rem; }
          .mb-2 { margin-bottom: 0.5rem; }
          .mb-3 { margin-bottom: 0.75rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mb-5 { margin-bottom: 1.25rem; }
          .mb-6 { margin-bottom: 1.5rem; }
          .mb-8 { margin-bottom: 2rem; }

          /* Spacing — padding */
          .pl-2 { padding-left: 0.5rem; }
          .pt-6 { padding-top: 1.5rem; }
          .p-8 { padding: 2rem; }

          /* Layout */
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .gap-4 { gap: 1rem; }
          .flex-shrink-0 { flex-shrink: 0; }
          .space-y-2 > * + * { margin-top: 0.5rem; }

          /* Sizing */
          .w-5 { width: 1.25rem; }
          .h-5 { height: 1.25rem; }
          .w-3 { width: 0.75rem; }
          .h-3 { height: 0.75rem; }
          .h-16 { height: 4rem; }
          .w-auto { width: auto; }
          .w-56 { width: 14rem; }
          .w-full { width: 100%; }

          /* Checkbox */
          .rounded { border-radius: 0.25rem; }
          .border { border-width: 1px; border-style: solid; }
          .border-t { border-top-width: 1px; border-top-style: solid; }
          .border-b { border-bottom-width: 1px; border-bottom-style: solid; }
          .border-gray-200 { border-color: #e5e7eb; }
          .border-gray-300 { border-color: #d1d5db; }
          .border-gray-400 { border-color: #9ca3af; }
          .border-blue-600 { border-color: #2563eb; }
          .bg-white { background-color: #ffffff; }
          .bg-blue-600 { background-color: #2563eb !important; }

          /* Image */
          .object-contain { object-fit: contain; }

          /* SVG */
          svg { display: block; overflow: visible; }

          /* HR */
          hr { border: none; border-top: 1px solid #d1d5db; }

          /* Font family */
          .font-serif { }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${clone.innerHTML}
        </div>
      </body>
    </html>
  `);

  frameDoc.close();

  frame.onload = () => {
    try {
      setTimeout(() => {
        toast.custom(() => <CustomToast message="Print dialog opening..." type="info" />);

        const style = frame.contentDocument?.createElement('style');
        if (style) {
          style.textContent = `
            body {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              background-color: white !important;
            }
            .print-hide { display: none !important; }
            strong, b { font-weight: 700 !important; }
            * { text-rendering: optimizeLegibility !important; }
          `;
          frame.contentDocument?.head.appendChild(style);
        }

        setTimeout(() => {
          frame.contentWindow?.focus();
          frame.contentWindow?.print();

          setTimeout(() => {
            document.body.removeChild(frame);
            toast.custom(() => <CustomToast message="Your document was saved successfully and is ready for use" type="success" />);
          }, 1000);
        }, 200);
      }, 800);
    } catch (error) {
      console.error('Print error:', error);
      document.body.removeChild(frame);
      toast.custom(() => <CustomToast message="There was an error printing. Please try again" type="error" />);
    }
  };
};
