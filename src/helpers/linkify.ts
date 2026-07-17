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

  // Convert plain URLs to links (skip if already inside <a> tags)
  const withLinks = normalized.split(/(<a[^>]*>.*?<\/a>)/gi).map(part =>
    part.startsWith('<a') ? part : part.replace(/(https?:\/\/[^\s<>"]+)/g,
      `<a href="$1" target="_blank" rel="noopener noreferrer" class="${linkClass}">$1</a>`)
  ).join('');

  // Add blue classes to existing links (merge with existing classes if present)
  return withLinks.replace(/<a\s+([^>]*?)>/gi, (match, attrs) =>
    attrs.includes('class=')
      ? match.replace(/class="([^"]*)"/, `class="$1 ${linkClass}"`)
      : `<a class="${linkClass}" ${attrs}>`
  );
};
