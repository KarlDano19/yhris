/**
 * The letterhead a memo/policy is printed on: a full-bleed A4 portrait image carrying the
 * company's header and footer, painted behind every page of the generated PDF.
 *
 * The backend keeps the image and nothing else — no margins, no toggles. The safe area it
 * leaves for text is fixed in utils/directive_document.py, so an uploaded letterhead has to
 * keep its header inside the top 3.5cm and its footer inside the bottom 3.1cm of the sheet.
 */

// A4 portrait at 150 DPI. Anything smaller visibly softens once it is printed, because the
// image is stretched to the full 21 x 29.7cm sheet rather than placed at its natural size.
export const LETTERHEAD_MIN_WIDTH = 1240;
export const LETTERHEAD_MIN_HEIGHT = 1754;

// A4's aspect ratio, with enough tolerance for the odd off-by-a-pixel export. A letterhead
// that is not A4 portrait gets stretched to fit, which distorts the company's logo.
const A4_ASPECT_RATIO = 21 / 29.7;
const ASPECT_RATIO_TOLERANCE = 0.02;

export const LETTERHEAD_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const LETTERHEAD_ACCEPTED_TYPES = ['image/png', 'image/jpeg'];

/**
 * Pulls the single File out of whatever the form holds.
 *
 * Returns null for a letterhead that is already stored on the memo — that arrives as a URL
 * string and must not be re-uploaded, or every save would write the same image again.
 */
export const letterheadFile = (
  letterhead?: string | File | FileList | null
): File | null => {
  if (!letterhead) return null;
  if (letterhead instanceof File) return letterhead;
  if (letterhead instanceof FileList) return letterhead.length > 0 ? letterhead[0] : null;
  return null;
};

/** Appends the letterhead to a multipart payload, if the user picked a new one. */
export const appendLetterhead = (
  data: FormData,
  letterhead?: string | File | FileList | null
): void => {
  const file = letterheadFile(letterhead);
  if (file) data.append('letterhead', file);
};

export interface LetterheadValidationResult {
  ok: boolean;
  message?: string;
}

/**
 * Checks an uploaded letterhead before it reaches the form.
 *
 * Reads the image's real pixel dimensions rather than trusting the file name, because the
 * two failures that actually reach users — a landscape scan and a low-resolution screenshot
 * — both look fine until the PDF is printed.
 */
export const validateLetterhead = (file: File): Promise<LetterheadValidationResult> =>
  new Promise((resolve) => {
    if (!LETTERHEAD_ACCEPTED_TYPES.includes(file.type)) {
      resolve({ ok: false, message: 'The letterhead must be a PNG or JPEG image.' });
      return;
    }

    if (file.size > LETTERHEAD_MAX_FILE_SIZE) {
      resolve({ ok: false, message: 'The letterhead must be 5MB or smaller.' });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const { naturalWidth: width, naturalHeight: height } = image;

      if (width > height * (A4_ASPECT_RATIO + ASPECT_RATIO_TOLERANCE) ||
          width < height * (A4_ASPECT_RATIO - ASPECT_RATIO_TOLERANCE)) {
        resolve({
          ok: false,
          message: 'The letterhead must be A4 portrait. This image has different proportions and would be stretched.',
        });
        return;
      }

      if (width < LETTERHEAD_MIN_WIDTH || height < LETTERHEAD_MIN_HEIGHT) {
        resolve({
          ok: false,
          message: `The letterhead is too small to print clearly. Use at least ${LETTERHEAD_MIN_WIDTH} x ${LETTERHEAD_MIN_HEIGHT} pixels.`,
        });
        return;
      }

      resolve({ ok: true });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ ok: false, message: 'That file could not be read as an image.' });
    };

    image.src = objectUrl;
  });
