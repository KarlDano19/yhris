'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  DEFAULT_SIGNATURE_PLACEMENT,
  MAX_SIGNATURE_WIDTH_PERCENT,
  MIN_SIGNATURE_WIDTH_PERCENT,
  PAGE_MARGIN_PERCENT,
  SIGNATURE_ZONE_ASPECT_RATIO,
  SignaturePlacement,
  anchorAboveSignatory,
  clampSignaturePlacement,
  cqwPerPoint,
} from '@/helpers/signaturePlacement';

interface SignatureZoneEditorProps {
  signatureUrl: string;
  name?: string;
  position?: string;
  placement: SignaturePlacement | null;
  onChange: (placement: SignaturePlacement) => void;
}

const NUDGE_PERCENT = 0.5;

// Typography copied from the PDF's stylesheet (utils/directive_document.py) and re-expressed
// in container-query units, so the signatory block is drawn at the same proportion of the
// zone here as it is there. A fixed pixel size would silently shrink the name relative to the
// zone and make everything the user arranges against it wrong.
const NAME_FONT_CQW = 11 * cqwPerPoint;
const POSITION_FONT_CQW = 10 * cqwPerPoint;

/**
 * The drag surface for placing a signature on the memo.
 *
 * It reproduces the document's signature zone — the band that closes the document — at the
 * same 17:5 proportions and the same relative type sizes the PDF uses, because that band is
 * the coordinate space the placement is stored in. Dragging is built on pointer events rather
 * than a drag library: one code path covers mouse and touch, and it adds no dependency.
 */
const SignatureZoneEditor = ({
  signatureUrl,
  name,
  position,
  placement,
  onChange,
}: SignatureZoneEditorProps) => {
  const zoneRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLImageElement>(null);
  const dragStateRef = useRef<{
    mode: 'move' | 'resize';
    startX: number;
    startY: number;
    origin: SignaturePlacement;
    zoneWidth: number;
    zoneHeight: number;
  } | null>(null);

  const [isInteracting, setIsInteracting] = useState(false);

  const current = placement ?? DEFAULT_SIGNATURE_PLACEMENT;

  // The signature's height as a percentage of the zone depends on the image's own aspect
  // ratio, so it can only be measured once the image is laid out. Clamping needs it to stop
  // the signature being dragged off the bottom edge.
  const measureHeightPercent = useCallback(() => {
    const zone = zoneRef.current;
    const signature = signatureRef.current;
    if (!zone || !signature || !zone.offsetHeight) return 0;
    return (signature.offsetHeight / zone.offsetHeight) * 100;
  }, []);

  const applyPlacement = useCallback(
    (next: SignaturePlacement) => {
      onChange(clampSignaturePlacement(next, measureHeightPercent()));
    },
    [measureHeightPercent, onChange]
  );

  const startInteraction = (mode: 'move' | 'resize') => (event: React.PointerEvent) => {
    const zone = zoneRef.current;
    if (!zone) return;

    event.preventDefault();
    event.stopPropagation();
    (event.target as Element).setPointerCapture(event.pointerId);

    const rect = zone.getBoundingClientRect();
    dragStateRef.current = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      origin: current,
      zoneWidth: rect.width,
      zoneHeight: rect.height,
    };
    setIsInteracting(true);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    const state = dragStateRef.current;
    if (!state || !state.zoneWidth || !state.zoneHeight) return;

    const deltaXPercent = ((event.clientX - state.startX) / state.zoneWidth) * 100;

    if (state.mode === 'move') {
      const deltaYPercent = ((event.clientY - state.startY) / state.zoneHeight) * 100;
      applyPlacement({
        ...state.origin,
        x: state.origin.x + deltaXPercent,
        y: state.origin.y + deltaYPercent,
      });
      return;
    }

    // Resizing only changes the width — the image keeps its own aspect ratio, so height
    // follows on its own and the signature can never be stretched out of shape.
    applyPlacement({ ...state.origin, width: state.origin.width + deltaXPercent });
  };

  const endInteraction = (event: React.PointerEvent) => {
    if (!dragStateRef.current) return;
    dragStateRef.current = null;
    setIsInteracting(false);
    const target = event.target as Element;
    if (target.hasPointerCapture?.(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const nudges: Record<string, Partial<SignaturePlacement>> = {
      ArrowLeft: { x: current.x - NUDGE_PERCENT },
      ArrowRight: { x: current.x + NUDGE_PERCENT },
      ArrowUp: { y: current.y - NUDGE_PERCENT },
      ArrowDown: { y: current.y + NUDGE_PERCENT },
    };
    const nudge = nudges[event.key];
    if (!nudge) return;

    event.preventDefault();
    applyPlacement({ ...current, ...nudge });
  };

  // Settle the placement once the image has loaded and its real height is known. A signature
  // that has never been placed gets parked just above the signatory name — which needs the
  // measured height, so it cannot be a fixed default. One that was placed before is only
  // re-clamped, so the user's own position is never overridden.
  useEffect(() => {
    const signature = signatureRef.current;
    if (!signature || !placement) return;

    const settle = () => {
      const heightPercent = measureHeightPercent();
      const isUnplaced = placement === DEFAULT_SIGNATURE_PLACEMENT;
      const next = isUnplaced
        ? { ...placement, y: anchorAboveSignatory(heightPercent) }
        : placement;
      onChange(clampSignaturePlacement(next, heightPercent));
    };

    if (signature.complete) {
      settle();
      return;
    }
    signature.addEventListener('load', settle);
    return () => signature.removeEventListener('load', settle);
    // Only re-run when the image itself changes; re-running on every placement change would
    // fight the drag in progress.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatureUrl]);

  return (
    <div className='w-full'>
      {/* The sheet — page-width, with the document's own side margins, so the drag surface
          reads as the bottom of a page rather than a band floating on its own. The zone
          inside it is then literally the page's content column. */}
      <div
        className='w-full rounded bg-white shadow-sm ring-1 ring-gray-200'
        style={{
          paddingLeft: `${PAGE_MARGIN_PERCENT}%`,
          paddingRight: `${PAGE_MARGIN_PERCENT}%`,
          paddingTop: '4%',
          paddingBottom: `${PAGE_MARGIN_PERCENT}%`,
        }}
      >
        {/* Marks where the memo body stops, so the band is not floating in a void. */}
        <div className='flex items-center gap-3 text-[10px] uppercase tracking-wide text-gray-400'>
          <span className='h-px flex-1 bg-gray-200' />
          end of the memo body
          <span className='h-px flex-1 bg-gray-200' />
        </div>

        <div
          ref={zoneRef}
          className='relative mt-3 w-full overflow-hidden border border-dashed border-gray-200'
          style={{
            aspectRatio: String(SIGNATURE_ZONE_ASPECT_RATIO),
            // Makes every cqw below resolve against this box's width, which is what keeps the
            // signatory block at the same scale as the PDF at any modal size.
            containerType: 'inline-size',
          }}
        >
        {/* Mirrors the signatory block the PDF anchors to the bottom-left of the zone. */}
        <div className='absolute bottom-0 left-0 leading-[1.6]'>
          <p
            className='font-bold text-gray-800'
            style={{ fontSize: `${NAME_FONT_CQW}cqw`, margin: '0 0 0.2em 0' }}
          >
            {name || ' '}
          </p>
          <p className='text-gray-500' style={{ fontSize: `${POSITION_FONT_CQW}cqw`, margin: 0 }}>
            {position || ' '}
          </p>
        </div>

        <div
          role='button'
          tabIndex={0}
          aria-label='Drag to position the signature'
          className={`absolute cursor-move touch-none select-none rounded-sm ring-2 ring-savoy-blue ${
            isInteracting ? 'ring-offset-1' : ''
          }`}
          style={{
            left: `${current.x}%`,
            top: `${current.y}%`,
            width: `${current.width}%`,
          }}
          onPointerDown={startInteraction('move')}
          onPointerMove={handlePointerMove}
          onPointerUp={endInteraction}
          onPointerCancel={endInteraction}
          onKeyDown={handleKeyDown}
        >
          <img
            ref={signatureRef}
            src={signatureUrl}
            alt='Signature'
            draggable={false}
            className='pointer-events-none block w-full select-none'
          />
          <span
            aria-hidden
            className='absolute -bottom-1.5 -right-1.5 h-3 w-3 cursor-nwse-resize touch-none rounded-full border border-white bg-savoy-blue'
            onPointerDown={startInteraction('resize')}
            onPointerMove={handlePointerMove}
            onPointerUp={endInteraction}
            onPointerCancel={endInteraction}
          />
        </div>
        </div>
      </div>

      <div className='mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500'>
        <span>Drag the signature to move it, or drag the blue dot to resize. Arrow keys nudge it.</span>
        <span>
          Size {Math.round(current.width)}% (min {MIN_SIGNATURE_WIDTH_PERCENT}%, max{' '}
          {MAX_SIGNATURE_WIDTH_PERCENT}%)
        </span>
      </div>
    </div>
  );
};

export default SignatureZoneEditor;
