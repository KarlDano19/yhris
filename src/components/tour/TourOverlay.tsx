'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { TourStep, ElementRect } from './types';
import TourTooltip from './TourTooltip';

const SPOTLIGHT_PADDING = 10;
const SPOTLIGHT_RADIUS  = 10;

interface TourOverlayProps {
  step: TourStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onDoItNow: (link: string) => void;
  onNavigateAndContinue: (link: string) => void;
}

function resolveTarget(targetId: string): Element | null {
  return (
    document.getElementById(targetId) ??
    document.querySelector(`[data-tour-id="${targetId}"]`)
  );
}

/**
 * SVG path with fill-rule="evenodd":
 *   outer rect (full viewport) + inner rounded rect (spotlight hole)
 *
 * The "hole" area has no paint so pointer events pass through naturally,
 * letting users see — but not accidentally interact with — the target element.
 * The filled dark areas block all interaction.
 */
function buildSpotlightPath(rect: ElementRect, vw: number, vh: number): string {
  const { top: t, left: l, width: w, height: h } = rect;
  const r = Math.min(SPOTLIGHT_RADIUS, w / 2, h / 2);

  const outer = `M0,0 H${vw} V${vh} H0 Z`;
  const inner = [
    `M${l + r},${t}`,
    `H${l + w - r}`,
    `Q${l + w},${t} ${l + w},${t + r}`,
    `V${t + h - r}`,
    `Q${l + w},${t + h} ${l + w - r},${t + h}`,
    `H${l + r}`,
    `Q${l},${t + h} ${l},${t + h - r}`,
    `V${t + r}`,
    `Q${l},${t} ${l + r},${t}`,
    'Z',
  ].join(' ');

  return `${outer} ${inner}`;
}

export default function TourOverlay({
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  onDoItNow,
  onNavigateAndContinue,
}: TourOverlayProps) {
  const [targetRect, setTargetRect] = useState<ElementRect | null>(null);
  const [vw, setVw] = useState(0);
  const [vh, setVh] = useState(0);

  const measure = useCallback(() => {
    setVw(window.innerWidth);
    setVh(window.innerHeight);

    const el = resolveTarget(step.targetId);
    if (!el) { setTargetRect(null); return; }

    const r = el.getBoundingClientRect();
    setTargetRect({
      top:    r.top    - SPOTLIGHT_PADDING,
      left:   r.left   - SPOTLIGHT_PADDING,
      width:  r.width  + SPOTLIGHT_PADDING * 2,
      height: r.height + SPOTLIGHT_PADDING * 2,
      bottom: r.bottom + SPOTLIGHT_PADDING,
      right:  r.right  + SPOTLIGHT_PADDING,
    });
  }, [step.targetId]);

  // Scroll target into view, then measure
  useEffect(() => {
    const el = resolveTarget(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      const id = setTimeout(measure, 300);
      return () => clearTimeout(id);
    }
    measure();
  }, [step.targetId, measure]);

  useEffect(() => {
    measure();
    const resizeObs = new ResizeObserver(measure);
    resizeObs.observe(document.body);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { capture: true, passive: true });
    return () => {
      resizeObs.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, { capture: true });
    };
  }, [measure]);

  const hasTarget = Boolean(targetRect);
  const spotlightPath = hasTarget && vw > 0
    ? buildSpotlightPath(targetRect!, vw, vh)
    : `M0,0 H${vw} V${vh} H0 Z`; // solid overlay when no target

  return (
    <>
      {/* SVG dark overlay — spotlight hole passes pointer events through */}
      <svg
        aria-hidden="true"
        className="fixed inset-0 z-[9998] overflow-visible"
        style={{ width: '100vw', height: '100vh', pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={spotlightPath}
          fill="rgba(0,0,0,0.72)"
          fillRule="evenodd"
          style={{ pointerEvents: 'all', cursor: 'default' }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Indigo highlight ring around the target */}
        {targetRect && (
          <>
            {/* Transparent click blocker — prevents clicks on the spotlighted element
                from navigating away before the tour step completes */}
            <rect
              x={targetRect.left}
              y={targetRect.top}
              width={targetRect.width}
              height={targetRect.height}
              rx={SPOTLIGHT_RADIUS}
              ry={SPOTLIGHT_RADIUS}
              fill="transparent"
              style={{ pointerEvents: 'all', cursor: 'default' }}
              onClick={(e) => e.stopPropagation()}
            />
            {/* Glow halo */}
            <rect
              x={targetRect.left - 3}
              y={targetRect.top  - 3}
              width={targetRect.width  + 6}
              height={targetRect.height + 6}
              rx={SPOTLIGHT_RADIUS + 3}
              ry={SPOTLIGHT_RADIUS + 3}
              fill="none"
              stroke="rgba(99,102,241,0.3)"
              strokeWidth="8"
              style={{ pointerEvents: 'none' }}
            />
            {/* Crisp border */}
            <rect
              x={targetRect.left}
              y={targetRect.top}
              width={targetRect.width}
              height={targetRect.height}
              rx={SPOTLIGHT_RADIUS}
              ry={SPOTLIGHT_RADIUS}
              fill="none"
              stroke="rgba(99,102,241,0.9)"
              strokeWidth="2"
              style={{ pointerEvents: 'none' }}
            />
          </>
        )}
      </svg>

      {/* Tooltip rendered above the overlay */}
      <TourTooltip
        step={step}
        currentStep={currentStep}
        totalSteps={totalSteps}
        targetRect={targetRect}
        onNext={onNext}
        onPrevious={onPrevious}
        onSkip={onSkip}
        onDoItNow={onDoItNow}
        onNavigateAndContinue={onNavigateAndContinue}
      />
    </>
  );
}
