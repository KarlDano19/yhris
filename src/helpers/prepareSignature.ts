/**
 * Crops a signature image down to the strokes actually drawn on it.
 *
 * The draw pad is a fixed 900x200 canvas and an uploaded PNG usually has margins of its own,
 * so most of the image is empty space. Left uncropped, that padding *is* the signature as far
 * as layout is concerned: the drag box and the width percentage both size the transparent
 * canvas rather than the ink, which makes the signature look small, land nowhere near where
 * it was placed, and resize unpredictably.
 *
 * Cropping happens at native resolution — no downscaling — so enlarging the signature later
 * stays sharp.
 */

// Pixels this faint are anti-aliasing noise or JPEG fringing, not ink.
const ALPHA_THRESHOLD = 10;
const LUMINANCE_THRESHOLD = 245;

// Guards against a huge uploaded scan eating memory during the pixel scan. Well above any
// size the signature is ever displayed at, so it never costs visible quality.
const MAX_SOURCE_WIDTH = 1200;

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not load the signature image.'));
    image.src = src;
  });

/**
 * Returns a PNG data URL cropped to the signature's ink.
 *
 * Falls back to the original source on any failure. The most likely one is a signature
 * already stored on a remote host: drawing it taints the canvas and `getImageData` throws,
 * and an uncropped signature is far better than a broken one.
 */
export async function prepareSignature(source: string): Promise<string> {
  try {
    const image = await loadImage(source);

    const scale = Math.min(1, MAX_SOURCE_WIDTH / (image.naturalWidth || 1));
    const width = Math.max(1, Math.round((image.naturalWidth || 1) * scale));
    const height = Math.max(1, Math.round((image.naturalHeight || 1) * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return source;

    context.drawImage(image, 0, 0, width, height);
    const { data } = context.getImageData(0, 0, width, height);

    let top = height;
    let left = width;
    let right = -1;
    let bottom = -1;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const offset = (y * width + x) * 4;
        const alpha = data[offset + 3];
        if (alpha < ALPHA_THRESHOLD) continue;

        // A PNG on a white background is opaque everywhere, so transparency alone cannot
        // find the ink — near-white pixels count as background too.
        const isNearWhite =
          data[offset] > LUMINANCE_THRESHOLD &&
          data[offset + 1] > LUMINANCE_THRESHOLD &&
          data[offset + 2] > LUMINANCE_THRESHOLD;
        if (isNearWhite) continue;

        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }

    // Nothing was drawn — hand back the original rather than an empty crop.
    if (right < left || bottom < top) return source;

    // A couple of pixels of breathing room so strokes are not clipped at the very edge.
    const padding = 2;
    left = Math.max(0, left - padding);
    top = Math.max(0, top - padding);
    right = Math.min(width - 1, right + padding);
    bottom = Math.min(height - 1, bottom + padding);

    const croppedWidth = right - left + 1;
    const croppedHeight = bottom - top + 1;

    const cropped = document.createElement('canvas');
    cropped.width = croppedWidth;
    cropped.height = croppedHeight;
    const croppedContext = cropped.getContext('2d');
    if (!croppedContext) return source;

    croppedContext.drawImage(
      canvas,
      left,
      top,
      croppedWidth,
      croppedHeight,
      0,
      0,
      croppedWidth,
      croppedHeight
    );

    return cropped.toDataURL('image/png');
  } catch {
    return source;
  }
}

// How large the signature is shown in the editor's signature card. It is only a preview —
// the size that actually reaches the document comes from the placement's width percentage,
// set by dragging in the preview.
export const SIGNATURE_MAX_DISPLAY_WIDTH = 240;
export const SIGNATURE_MAX_DISPLAY_HEIGHT = 90;
