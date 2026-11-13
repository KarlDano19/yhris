import { A4_HEIGHT_MM } from './detectLetterheadMargins';
import { HEADINGS, margin, MM_TO_PX } from './paginate';

// The grey strip between two sheets, as in Page preview
export const PAGE_GAP_MM = 6;

// Matches the inline spacing spaceEditorPages adds, so it never reaches the saved template or the preview
export const PAGE_SPACING_STYLE = / style="(?:padding|margin)-top: ?[\d.]+px;?"/g;

/**
 * Lays the editing area (`root`, the Quill editor) out as A4 sheets with a gap between them, like paginate() cuts the
 * Page preview: a block that would cross a sheet's bottom margin gets extra space above it and starts at the next
 * sheet's top margin. The area is stretched to whole sheets and the number of sheets is returned.
 * The spacing is inline and editor-only: strip it with PAGE_SPACING_STYLE before the html is used or saved.
 * shortcut: a block taller than one sheet (a long table) is not split and runs over the sheet end; same as paginate().
 */
export function spaceEditorPages(root: HTMLElement, topMm: number, bottomMm: number): number {
  const stride = (A4_HEIGHT_MM + PAGE_GAP_MM) * MM_TO_PX;
  const top = topMm * MM_TO_PX;
  const bottomPad = bottomMm * MM_TO_PX;
  const content = (A4_HEIGHT_MM - topMm - bottomMm) * MM_TO_PX;
  const blocks = Array.from(root.children) as HTMLElement[];

  blocks.forEach((block) => {
    block.style.paddingTop = '';
    block.style.marginTop = '';
    if (!block.getAttribute('style')) block.removeAttribute('style');
  });

  const rootTop = root.getBoundingClientRect().top;
  const marginBoxTop = (block: HTMLElement) => block.getBoundingClientRect().top - rootTop - margin(block, 'marginTop');

  let pageIndex = 0;
  let firstOnPage = 0;
  blocks.forEach((block, i) => {
    // A block that already starts on a later sheet (after a tall block) moves the sheet forward
    while (marginBoxTop(block) >= (pageIndex + 1) * stride + top) {
      pageIndex += 1;
      firstOnPage = i;
    }
    const bottom = block.getBoundingClientRect().bottom - rootTop + margin(block, 'marginBottom');
    if (bottom <= pageIndex * stride + top + content || i === firstOnPage) return;

    // Do not leave a heading alone at the bottom of a sheet: carry it to the next one
    let moved = i;
    while (moved - 1 > firstOnPage && HEADINGS.has(blocks[moved - 1].tagName)) moved -= 1;

    const target = blocks[moved];
    const extra = (pageIndex + 1) * stride + top - marginBoxTop(target);
    if (extra > 0) {
      // Padding does not apply to a table and margins collapse, so a table gets the margin plus its own
      if (target.tagName === 'TABLE') target.style.marginTop = `${extra + margin(target, 'marginTop')}px`;
      else target.style.paddingTop = `${extra}px`;
    }
    pageIndex += 1;
    firstOnPage = moved;
  });

  const last = blocks[blocks.length - 1];
  const needed = last ? last.getBoundingClientRect().bottom - rootTop + margin(last, 'marginBottom') + bottomPad : 0;
  const pages = Math.max(1, Math.ceil((needed + PAGE_GAP_MM * MM_TO_PX) / stride));
  root.style.minHeight = `${pages * (A4_HEIGHT_MM + PAGE_GAP_MM) - PAGE_GAP_MM}mm`;
  return pages;
}

/**
 * Draws one white A4 sheet per page behind the editing area (the letterhead on each, or on the first only).
 * Done with plain DOM next to the Quill editor: React does not own that container.
 */
export function drawPageSheets(root: HTMLElement, pages: number, letterheadUrl: string | null, firstPageOnly: boolean) {
  const container = root.parentElement;
  if (!container) return;
  container.style.position = 'relative';

  let layer = container.querySelector<HTMLElement>(':scope > .page-sheets');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'page-sheets';
    layer.style.cssText = 'position:absolute;pointer-events:none;z-index:0;';
    container.prepend(layer);
  }
  layer.style.left = `${root.offsetLeft}px`;
  layer.style.top = `${root.offsetTop}px`;
  layer.style.width = `${root.offsetWidth}px`;

  layer.replaceChildren(
    ...Array.from({ length: pages }, (_, i) => {
      const sheet = document.createElement('div');
      sheet.style.cssText = `position:absolute;left:0;width:100%;height:${A4_HEIGHT_MM}mm;top:${i * (A4_HEIGHT_MM + PAGE_GAP_MM)}mm;background:#fff center/100% 100% no-repeat;box-shadow:0 1px 6px rgb(0 0 0 / 0.18);`;
      if (letterheadUrl && (!firstPageOnly || i === 0)) sheet.style.backgroundImage = `url("${encodeURI(letterheadUrl)}")`;
      return sheet;
    })
  );
}

export function removePageSheets(root: HTMLElement) {
  root.parentElement?.querySelector(':scope > .page-sheets')?.remove();
}
