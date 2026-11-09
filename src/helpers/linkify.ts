/**
 * Word-processor/Quill-pasted content commonly joins every word with a
 * non-breaking space instead of a regular one (both the literal U+00A0
 * character and the `&nbsp;` HTML entity show up in saved content). A real
 * nbsp never provides a line-break opportunity, so `overflow-wrap:
 * break-word` has no word boundary to wrap at and is forced to split
 * mid-word instead. Normalizing to a regular space (visually identical)
 * restores natural word-boundary wrapping.
 */
export const normalizeNbsp = (text: string): string => text.replace(/&nbsp;/gi, ' ').replace(/\u00A0/g, ' ');

/**
 * Converts plain text URLs to clickable links and styles all links blue
 */
export const linkify = (text: string): string => {
  if (!text) return text;

  const linkClass = 'text-blue-600 hover:text-blue-800 underline';

  const normalized = normalizeNbsp(text);

  // Split into HTML tags vs. plain text segments, and only linkify the plain text
  // segments — never text inside a tag's attributes (e.g. <img src="https://...">),
  // otherwise a URL there gets a whole <a> tag injected inside the attribute value,
  // corrupting the markup (broken <img>, stray "> text visible on the page).
  const withLinks = normalized.split(/(<[^>]+>)/g).map(part =>
    part.startsWith('<') ? part : part.replace(/(https?:\/\/[^\s<>"]+)/g,
      `<a href="$1" target="_blank" rel="noopener noreferrer" class="${linkClass}">$1</a>`)
  ).join('');

  // Add blue classes to existing links (merge with existing classes if present)
  return withLinks.replace(/<a\s+([^>]*?)>/gi, (match, attrs) =>
    attrs.includes('class=')
      ? match.replace(/class="([^"]*)"/, `class="$1 ${linkClass}"`)
      : `<a class="${linkClass}" ${attrs}>`
  );
};

/**
 * Prepares Quill-authored HTML for an HTML email.
 *
 * Two things the editor does that an email client will not forgive:
 *
 * 1. Quill serializes ordinary spaces as non-breaking spaces. A real nbsp never
 *    offers a line-break opportunity, so a whole sentence becomes one unbreakable
 *    token and the client chops it mid-word ("Y AHSHUA", "Augu st 17"). Each run
 *    of spaces keeps its width but gets one real space at the front so the line can
 *    break there — unlike a plain nbsp-to-space swap, deliberate multi-space runs
 *    are not collapsed by the HTML renderer.
 *
 * 2. getSemanticHTML() saves a deliberate blank line as a truly empty <p></p> (no
 *    <br>), which has zero height in an email — the blank lines the composer typed
 *    just disappear. On screen globals.css papers over this with a p:empty
 *    min-height rule; an email has no such stylesheet, so the <br> is put back into
 *    the content itself.
 */
export const prepareRichTextForEmail = (html: string): string => {
  if (!html) return html;

  return html
    .replace(/&nbsp;/gi, '\u00A0')
    .replace(/[ \u00A0]*\u00A0[ \u00A0]*/g, (run) => ' ' + '&nbsp;'.repeat(run.length - 1))
    .replace(/<p([^>]*)>(?:\s|&nbsp;)*<\/p>/gi, '<p$1><br></p>');
};
