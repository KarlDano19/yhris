export const MM_TO_PX = 96 / 25.4;
export const HEADINGS = new Set(['H1', 'H2', 'H3']);

export const margin = (el: Element, side: 'marginTop' | 'marginBottom') => parseFloat(getComputedStyle(el)[side]) || 0;

/**
 * Splits the rendered children of `root` into pages of A4 content height and returns each page's html.
 * `contentMm` is the A4 height left after the top and bottom margins. `root` must be laid out at the
 * content width (170mm) with the document's typography.
 * shortcut: a block taller than one page (a long table) is not split and overflows its page; split by rows when needed.
 */
export function paginate(root: HTMLElement, contentMm: number): string[] {
  const limit = contentMm * MM_TO_PX;
  const blocks = Array.from(root.children) as HTMLElement[];
  if (blocks.length === 0) return [root.innerHTML];

  const pages: HTMLElement[][] = [[]];
  let pageTop = blocks[0].getBoundingClientRect().top - margin(blocks[0], 'marginTop');

  for (const block of blocks) {
    const bottom = block.getBoundingClientRect().bottom + margin(block, 'marginBottom');
    let current = pages[pages.length - 1];

    if (bottom - pageTop > limit && current.length > 0) {
      // Do not leave a heading alone at the bottom of a page: carry it to the next one.
      const carried: HTMLElement[] = [];
      while (current.length > 1 && HEADINGS.has(current[current.length - 1].tagName)) carried.unshift(current.pop()!);
      current = [...carried];
      pages.push(current);
      const first = carried[0] ?? block;
      pageTop = first.getBoundingClientRect().top - margin(first, 'marginTop');
    }
    current.push(block);
  }

  return pages.map((page) => page.map((el) => el.outerHTML).join(''));
}
