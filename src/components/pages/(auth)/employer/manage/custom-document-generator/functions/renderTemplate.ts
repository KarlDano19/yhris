import { escapeHtml, richTextHtml } from '@/helpers/richText';

// Same pattern as PLACEHOLDER in yahshua-hris-be/utils/document_template.py
export const PLACEHOLDER = /\{\{\s*([a-z][a-z0-9_.]*)\s*\}\}/g;

// Same as SIGNATURE_IMAGE / MAX_SIGNATURE_LENGTH in the backend
const SIGNATURE_IMAGE = /^data:image\/(png|jpeg);base64,[A-Za-z0-9+/]+=*$/;
const MAX_SIGNATURE_LENGTH = 700_000;

export const isSignatureImage = (value: string) => value.length <= MAX_SIGNATURE_LENGTH && SIGNATURE_IMAGE.test(value);

/**
 * Browser copy of DocumentTemplateUtils.render_html for the live preview: values are escaped,
 * an empty value stays visible as a highlighted {{key}}, a signature field becomes its image (blank when
 * unsigned). The PDF is still rendered by the backend.
 */
export const renderTemplate = (
  html: string,
  values: Record<string, string>,
  signatureKeys: string[] = [],
  { htmlKeys = [], blankEmpty = false }: { htmlKeys?: string[]; blankEmpty?: boolean } = {}
): string =>
  html.replace(PLACEHOLDER, (match: string, key: string, offset: number, source: string) => {
    const value = values[key]?.trim();
    if (signatureKeys.includes(key)) {
      if (!value || !isSignatureImage(value)) return '';
      // Alone in its paragraph it sits in the flow; inside a line (___{{sig}}___) it is laid over the line
      const alone =
        /<p[^>]*>\s*$/.test(source.slice(0, offset)) && /^\s*<\/p>/.test(source.slice(offset + match.length));
      return `<img class="${alone ? 'doc-signature' : 'doc-signature doc-signature-over'}" src="${value}" alt="Signature">`;
    }
    if (value && htmlKeys.includes(key)) return richTextHtml(value);
    if (value) return escapeHtml(value);
    return blankEmpty ? '' : `<mark>{{${key}}}</mark>`;
  });
