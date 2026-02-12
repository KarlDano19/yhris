/**
 * Converts plain text URLs to clickable links and styles all links blue
 */
export const linkify = (text: string): string => {
  if (!text) return text;

  const linkClass = 'text-blue-600 hover:text-blue-800 underline';

  // Convert plain URLs to links (skip if already inside <a> tags)
  const withLinks = text.split(/(<a[^>]*>.*?<\/a>)/gi).map(part =>
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
