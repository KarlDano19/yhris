import * as DOMPurify from 'dompurify';

/**
 * Quill never returns a truly empty string once the editor has been focused —
 * an "empty" editor still serializes to `<p><br></p>`, and a cleared one can
 * leave behind `&nbsp;`. A plain `!value` / `value.trim() === ''` check
 * therefore reads those as filled content and lets required fields pass.
 * Strip the markup and the non-breaking spaces before deciding.
 */
export const isRichTextEmpty = (html?: string): boolean =>
  !html ||
  html
    .replace(/<(.|\n)*?>/g, '')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/ /g, ' ')
    .trim() === '';

// Same as RICH_TEXT in yahshua-hris-be/utils/document_template.py: Quill output opens with a block tag,
// anything else is plain text saved before the field became rich text.
const RICH_TEXT = /^\s*<(p|h[1-3]|ol|ul|table|blockquote)\b/i;

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const isRichText = (value?: string | null) => RICH_TEXT.test(value || '');

/** Editor value for a stored field: rich text as is, older plain text as one paragraph per line. */
export const toEditorHtml = (value?: string | null): string =>
  isRichText(value)
    ? (value as string)
    : (value || '').split('\n').map((line) => `<p>${escapeHtml(line) || '<br>'}</p>`).join('');

/** Display HTML for a stored field: rich text sanitized, older plain text escaped with its line breaks kept. */
export const richTextHtml = (value?: string | null): string => {
  if (!isRichText(value)) return escapeHtml(value || '').replace(/\n/g, '<br>');
  // DOMPurify needs a DOM; on the server render nothing until the client takes over
  return typeof window === 'undefined' ? '' : DOMPurify.sanitize(value as string);
};
