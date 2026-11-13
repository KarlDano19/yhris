/**
 * Quill never returns a truly empty string once the editor has been focused —
 * an "empty" editor still serializes to `<p><br></p>`, and a cleared one can
 * leave behind `&nbsp;`. A plain `!value` / `value.trim() === ''` check
 * therefore reads those as filled content and lets required fields pass.
 * Strip the markup and the non-breaking spaces before deciding.
 */
/**
 * Some saved text (e.g. employment history copied from job applications before
 * the backend fix) still contains literal `&nbsp;`, which shows up as raw code
 * and stops the text from wrapping. Turn it back into a normal space.
 */
export const decodeNbsp = (text?: string | null): string =>
  (text ?? '').replace(/&nbsp;|&#160;/g, ' ').replace(/ /g, ' ');

export const isRichTextEmpty =(html?: string): boolean =>
  !html ||
  html
    .replace(/<(.|\n)*?>/g, '')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/ /g, ' ')
    .trim() === '';
