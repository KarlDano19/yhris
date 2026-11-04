export const A4_HEIGHT_MM = 297;
export const DEFAULT_MARGIN_MM = 20;
export const MAX_MARGIN_MM = 120;

const SAMPLE_WIDTH = 200;
const PADDING_MM = 6;
// A pixel counts as artwork when it is clearly darker than white; faint watermarks are ignored.
const INK_BELOW = 215;
// Artwork whose first row is further than this share of the page from the edge is body, not header or footer.
const EDGE_ZONE_SHARE = 0.35;
// A blank stretch this tall (share of the page) ends the header or footer block.
const GAP_SHARE = 0.04;

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read the image.'));
    img.src = url;
  });

/** Rows from `start` in direction `step` that belong to the first artwork block, or 0 when there is none. */
function blockRows(ink: boolean[], start: number, step: 1 | -1, gap: number): number {
  let r = start;
  while (r >= 0 && r < ink.length && !ink[r]) r += step;
  if (r < 0 || r >= ink.length) return 0;
  if (Math.abs(r - start) > ink.length * EDGE_ZONE_SHARE) return 0; // a header-only page has no footer block
  let last = r;
  for (; r >= 0 && r < ink.length; r += step) {
    if (ink[r]) last = r;
    else if (Math.abs(r - last) > gap) break;
  }
  return Math.abs(last - start) + 1;
}

/**
 * Looks at a letterhead image (an object URL — a cross-origin URL would taint the canvas) and returns
 * the top and bottom margins (mm) that clear its header and footer artwork. Side columns are ignored so
 * page borders do not count as artwork.
 * shortcut: assumes artwork at the top and bottom edges; a full-page frame or background falls back to the default margins.
 */
export async function detectLetterheadMargins(url: string): Promise<{ topMm: number; bottomMm: number }> {
  const fallback = { topMm: DEFAULT_MARGIN_MM, bottomMm: DEFAULT_MARGIN_MM };
  try {
    const img = await loadImage(url);
    const height = Math.round((SAMPLE_WIDTH * img.naturalHeight) / img.naturalWidth);
    const canvas = document.createElement('canvas');
    canvas.width = SAMPLE_WIDTH;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return fallback;
    ctx.fillStyle = '#fff'; // transparent PNGs are judged on white, like the page
    ctx.fillRect(0, 0, SAMPLE_WIDTH, height);
    ctx.drawImage(img, 0, 0, SAMPLE_WIDTH, height);
    const { data } = ctx.getImageData(0, 0, SAMPLE_WIDTH, height);

    const from = Math.floor(SAMPLE_WIDTH * 0.1);
    const to = Math.ceil(SAMPLE_WIDTH * 0.9);
    const ink = Array.from({ length: height }, (_, y) => {
      let count = 0;
      for (let x = from; x < to; x++) {
        const i = (y * SAMPLE_WIDTH + x) * 4;
        if (Math.min(data[i], data[i + 1], data[i + 2]) < INK_BELOW) count++;
      }
      return count >= 2;
    });

    const gap = Math.round(height * GAP_SHARE);
    const top = blockRows(ink, 0, 1, gap);
    const bottom = blockRows(ink, height - 1, -1, gap);
    if (top + bottom > height * 0.7) return fallback; // artwork everywhere: leave it to the user

    const toMm = (rows: number) => Math.min(MAX_MARGIN_MM, Math.ceil((rows / height) * A4_HEIGHT_MM + PADDING_MM));
    return {
      topMm: Math.max(DEFAULT_MARGIN_MM, toMm(top)),
      bottomMm: Math.max(DEFAULT_MARGIN_MM, toMm(bottom)),
    };
  } catch {
    return fallback;
  }
}
