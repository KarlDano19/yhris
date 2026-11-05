'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { A4_HEIGHT_MM } from '../functions/detectLetterheadMargins';
import { paginate } from '../functions/paginate';
import { renderTemplate } from '../functions/renderTemplate';

import { T_PageLayout } from '@/types/custom-document-generator';

// Mirrors the PDF stylesheet (DirectiveDocument._styles + EXTRA_STYLES in utils/document_template.py),
// in mm/pt so the on-screen pages break where the PDF's do. Keep the two in step.
const PREVIEW_STYLES = `
.custom-doc { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; line-height: 1.6; color: #333; text-align: justify; overflow-wrap: break-word; }
.custom-doc p { margin: 0.4em 0; }
.custom-doc p:empty { min-height: 1.6em; }
.custom-doc ul { list-style-type: disc; margin: 0.4em 0; padding-left: 1.5em; }
.custom-doc ol { list-style-type: decimal; margin: 0.4em 0; padding-left: 1.5em; }
.custom-doc li { display: list-item; }
.custom-doc h1, .custom-doc h2, .custom-doc h3 { font-weight: bold; color: #222; margin: 0.8em 0 0.3em 0; }
.custom-doc h1 { font-size: 13pt; } .custom-doc h2 { font-size: 12pt; } .custom-doc h3 { font-size: 11pt; }
.custom-doc blockquote { border-left: 4px solid #ccc; margin: 0.5em 0; padding-left: 1em; color: #555; }
.custom-doc .ql-align-center { text-align: center; } .custom-doc .ql-align-right { text-align: right; } .custom-doc .ql-align-justify { text-align: justify; }
${Array.from({ length: 8 }, (_, i) => `.custom-doc .ql-indent-${i + 1} { padding-left: ${(i + 1) * 3}em; }`).join(' ')}
.custom-doc table { width: 100%; border-collapse: collapse; margin: 0.4em 0; }
.custom-doc td, .custom-doc th { padding: 4px 6px; vertical-align: top; text-align: left; }
.custom-doc mark { background: #fef08a; color: #333; }
.custom-doc img.doc-signature { display: inline; max-height: 15mm; max-width: 60mm; vertical-align: bottom; }
.custom-doc img.doc-signature-over { width: 50mm; height: 15mm; max-width: none; max-height: none; object-fit: contain; margin: 0 -25mm; vertical-align: -2mm; }
.custom-doc .ql-font-serif { font-family: Georgia, "Times New Roman", serif; }
.custom-doc .ql-font-monospace { font-family: Monaco, "Courier New", monospace; }
.custom-doc .ql-size-small { font-size: 0.75em; } .custom-doc .ql-size-large { font-size: 1.5em; } .custom-doc .ql-size-huge { font-size: 2.5em; }
`;

type DocumentPreviewProps = {
  html: string;
  values: Record<string, string>;
  layout: T_PageLayout;
  signatureKeys?: string[];
  htmlKeys?: string[];
  blankEmpty?: boolean;
};

// A4 pages as the PDF will print them, updated as the user types.
const DocumentPreview = ({ html, values, layout, signatureKeys, htmlKeys, blankEmpty }: DocumentPreviewProps) => {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<string[]>([]);

  // Same non-breaking-space fix the backend applies (DirectiveDocument._normalize_quill)
  const filled = useMemo(
    () => renderTemplate(html.replace(/&nbsp;| /g, ' '), values, signatureKeys, { htmlKeys, blankEmpty }),
    [html, values, signatureKeys, htmlKeys, blankEmpty]
  );

  // Layout is measured in a hidden copy at the content width, then split into A4 pages
  useLayoutEffect(() => {
    if (measureRef.current) setPages(paginate(measureRef.current, A4_HEIGHT_MM - layout.topMm - layout.bottomMm));
  }, [filled, layout.topMm, layout.bottomMm]);

  return (
    <div className='relative overflow-x-auto rounded-md bg-gray-100 p-4' data-testid='document-preview'>
      <style>{PREVIEW_STYLES}</style>
      {/* The template html is sanitized by the backend on every save; values are escaped by renderTemplate */}
      <div
        ref={measureRef}
        aria-hidden='true'
        className='custom-doc pointer-events-none invisible absolute'
        style={{ width: '170mm' }}
        dangerouslySetInnerHTML={{ __html: filled }}
      />
      <div className='flex flex-col items-center gap-4'>
        {pages.map((pageHtml, index) => (
          <article
            key={index}
            className='relative flex-none bg-white shadow'
            style={{ width: '210mm', height: '297mm', padding: `${layout.topMm}mm 20mm ${layout.bottomMm}mm` }}
            aria-label={`Page ${index + 1} of ${pages.length}`}
          >
            {layout.letterheadUrl && (!layout.firstPageOnly || index === 0) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={layout.letterheadUrl} alt='' className='absolute inset-0 h-full w-full' />
            )}
            <div className='custom-doc relative' dangerouslySetInnerHTML={{ __html: pageHtml }} />
            {!layout.letterheadUrl && (
              <span
                className='absolute inset-x-0 text-center text-[9pt] text-gray-500'
                style={{ bottom: `${Math.max(layout.bottomMm / 2 - 2, 4)}mm` }}
              >
                Page {index + 1} of {pages.length}
              </span>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};

export default DocumentPreview;
