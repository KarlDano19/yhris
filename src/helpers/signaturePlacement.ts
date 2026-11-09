/**
 * The signature's position inside the memo document's signature zone.
 *
 * Everything here is a percentage of that zone rather than a pixel offset, because the zone
 * is the one box whose proportions are identical in the drag overlay and in the rendered PDF.
 * The backend stores all three numbers as a single `"x,y,width"` string it never interprets
 * (see utils/directive_document.py), so this file is the only definition of the format.
 */
export interface SignaturePlacement {
  x: number;
  y: number;
  width: number;
}

// Mirrors PAGE/SIGNATURE_ZONE constants in utils/directive_document.py: a 17cm x 5cm band on
// an A4 page. The drag overlay uses this to match the PDF's proportions exactly — change it
// here and there together or the preview stops being WYSIWYG.
export const SIGNATURE_ZONE_ASPECT_RATIO = 17 / 5;

// The PDF's page margin (2cm) as a share of A4's 21cm width. The editor draws its sheet with
// the same margins so the drag surface has a page's real proportions, and the zone inside it
// is exactly the page's content column.
export const PAGE_MARGIN_PERCENT = (2 / 21) * 100;

// The zone is 17cm wide, so one point of the PDF's type is this share of the zone's width.
// Anything drawn in the editor that the PDF sizes in points is scaled through this, which is
// what keeps the editor and the document in proportion at any screen size.
export const cqwPerPoint = (100 / 17) * 0.0352778; // 1pt = 0.0352778cm

// The signatory block's height as a share of the zone, mirroring SIGNATORY_BLOCK_HEIGHT_CM in
// utils/directive_document.py: the 11pt name plus its 0.2em gap plus the 10pt position, at
// line-height 1.6, over the 5cm zone.
export const SIGNATORY_BLOCK_HEIGHT_PERCENT =
  ((((11 * 1.6) + (11 * 0.2) + (10 * 1.6)) * 0.0352778) / 5) * 100;
// Kept at zero to match SIGNATURE_FLOW_GAP_CM in utils/directive_document.py — the name's own
// line-leading already supplies the clear space above its glyphs.
export const SIGNATURE_FLOW_GAP_PERCENT = 0;

// Where a signature lands before it has been placed. Only `x` and `width` are meaningful here
// — `y` is recomputed from the signature's measured height the moment the image loads, so it
// parks just above the name whatever the image's proportions are. Compared by reference to
// detect "not placed yet", so it must stay a single shared object.
export const DEFAULT_SIGNATURE_PLACEMENT: SignaturePlacement = { x: 0, y: 30, width: 28 };

/**
 * The `y` that parks a signature of `heightPercent` directly above the signatory block.
 *
 * A fixed default cannot do this: how far down the signature starts depends on how tall it
 * is, which depends on the image's own aspect ratio.
 */
export const anchorAboveSignatory = (heightPercent: number): number =>
  Math.max(0, 100 - SIGNATORY_BLOCK_HEIGHT_PERCENT - SIGNATURE_FLOW_GAP_PERCENT - heightPercent);

export const MIN_SIGNATURE_WIDTH_PERCENT = 8;
export const MAX_SIGNATURE_WIDTH_PERCENT = 70;

const round2 = (value: number) => Math.round(value * 100) / 100;

const clampNumber = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Reads the stored `"x,y,width"` string.
 *
 * Returns null for anything missing or malformed — which callers treat as "not positioned"
 * and render in normal flow, exactly as memos did before free positioning existed.
 */
export const parseSignaturePlacement = (raw?: string | null): SignaturePlacement | null => {
  if (!raw) return null;

  const parts = raw.split(',').map((part) => Number(part.trim()));
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return null;

  const [x, y, width] = parts;
  if (x < 0 || x > 100 || y < 0 || y > 100 || width <= 0 || width > 100) return null;

  return { x, y, width };
};

export const serializeSignaturePlacement = (placement: SignaturePlacement): string =>
  `${round2(placement.x)},${round2(placement.y)},${round2(placement.width)}`;

/**
 * Keeps a placement inside the signature zone.
 *
 * `heightPercent` is the signature's rendered height as a percentage of the zone, which the
 * caller measures — it depends on the image's aspect ratio, so this file cannot derive it.
 * Pass 0 when the height is not known yet and only the horizontal edge is enforced.
 */
export const clampSignaturePlacement = (
  placement: SignaturePlacement,
  heightPercent = 0
): SignaturePlacement => {
  const width = clampNumber(placement.width, MIN_SIGNATURE_WIDTH_PERCENT, MAX_SIGNATURE_WIDTH_PERCENT);
  return {
    width,
    x: clampNumber(placement.x, 0, 100 - width),
    y: clampNumber(placement.y, 0, Math.max(0, 100 - heightPercent)),
  };
};
