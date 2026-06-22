'use client';

import React, { useRef, useLayoutEffect, useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { TourStep, ElementRect, TooltipPlacement } from './types';

const OFFSET         = 20;
const VIEWPORT_MARGIN = 16;

interface TourTooltipProps {
  step: TourStep;
  currentStep: number;
  totalSteps: number;
  targetRect: ElementRect | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onDoItNow: (link: string) => void;
  onNavigateAndContinue: (link: string) => void;
}

function computePosition(
  targetRect: ElementRect | null,
  tooltipW: number,
  tooltipH: number,
): { top: number; left: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (!targetRect) {
    return {
      top:  Math.max(VIEWPORT_MARGIN, (vh - tooltipH) / 2),
      left: Math.max(VIEWPORT_MARGIN, (vw - tooltipW) / 2),
    };
  }

  const spaceBottom = vh - targetRect.bottom;
  const spaceTop    = targetRect.top;
  const spaceRight  = vw - targetRect.right;
  const spaceLeft   = targetRect.left;

  let placement: TooltipPlacement = 'bottom';
  if      (spaceBottom >= tooltipH + OFFSET) placement = 'bottom';
  else if (spaceTop    >= tooltipH + OFFSET) placement = 'top';
  else if (spaceRight  >= tooltipW + OFFSET) placement = 'right';
  else if (spaceLeft   >= tooltipW + OFFSET) placement = 'left';

  const cx = targetRect.left + targetRect.width  / 2;
  const cy = targetRect.top  + targetRect.height / 2;

  let top = 0, left = 0;
  switch (placement) {
    case 'bottom': top = targetRect.bottom + OFFSET;         left = cx - tooltipW / 2;             break;
    case 'top':    top = targetRect.top - tooltipH - OFFSET; left = cx - tooltipW / 2;             break;
    case 'right':  top = cy - tooltipH / 2;                  left = targetRect.right  + OFFSET;    break;
    case 'left':   top = cy - tooltipH / 2;                  left = targetRect.left - tooltipW - OFFSET; break;
  }

  const vw2 = window.innerWidth;
  const vh2 = window.innerHeight;
  left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw2 - tooltipW - VIEWPORT_MARGIN));
  top  = Math.max(VIEWPORT_MARGIN, Math.min(top,  vh2 - tooltipH - VIEWPORT_MARGIN));

  return { top, left };
}

// ─────────────────────────────────────────────────────────────────────────────
// Compact "pointer" tooltip — ← back  |  "Click here!"  |  ✕ skip
// ─────────────────────────────────────────────────────────────────────────────
function PointerTooltip({
  step,
  targetRect,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSkip,
}: Pick<TourTooltipProps, 'step' | 'targetRect' | 'currentStep' | 'totalSteps' | 'onPrevious' | 'onNext' | 'onSkip'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0, top: 0, left: 0, pointerEvents: 'none' });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const { offsetWidth: w, offsetHeight: h } = ref.current;
    const { top, left } = computePosition(targetRect, w, h);
    setStyle({ opacity: 1, top, left, pointerEvents: 'auto' });
  }, [targetRect, currentStep]);

  const isFirst = currentStep === 0;
  const isLast  = currentStep === totalSteps - 1;

  // Always call onNext — TourProvider fires onComplete when past the last step
  const handleAction = () => onNext();

  return (
    <div
      ref={ref}
      className="fixed z-[10000] w-[calc(100vw-32px)] max-w-[288px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-[top,left] duration-200 ease-out"
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Description area */}
      <div className="px-4 pt-3 pb-2 flex items-start justify-between gap-2">
        <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
        <XCircleIcon
          onClick={onSkip}
          className="w-8 h-8 text-savoy-blue cursor-pointer self-start shrink-0"
        />
      </div>

      {/* Button row */}
      <div className="px-3 pb-3 flex items-center gap-2">
        {/* ← Back button — only shown when there is a previous step */}
        {!isFirst && (
          <button
            onClick={onPrevious}
            aria-label="Previous step"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border-2 border-gray-700 text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
        )}

        {/* Action pill */}
        <button
          onClick={handleAction}
          className="flex-1 text-sm font-bold text-white bg-savoy-blue hover:opacity-90 active:opacity-80 px-4 py-2 rounded-full transition-opacity shadow-sm whitespace-nowrap"
          aria-label={step.actionLabel ?? 'Click here!'}
        >
          {isLast ? 'Finish' : (step.actionLabel ?? 'Click here!')}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Full "card" tooltip — blue header + description + Do it Later / Do it now!
// ─────────────────────────────────────────────────────────────────────────────
function CardTooltip({
  step,
  currentStep,
  totalSteps,
  targetRect,
  onNext,
  onPrevious,
  onSkip,
  onDoItNow,
  onNavigateAndContinue,
}: TourTooltipProps) {
  const ref  = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0, top: 0, left: 0, pointerEvents: 'none' });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const { offsetWidth: w, offsetHeight: h } = ref.current;
    const { top, left } = computePosition(targetRect, w, h);
    setStyle({ opacity: 1, top, left, pointerEvents: 'auto' });
  }, [targetRect, currentStep]);

  const isFirst  = currentStep === 0;
  const isLast   = currentStep === totalSteps - 1;
  const hasLink  = Boolean(step.link);

  return (
    <div
      ref={ref}
      className="fixed z-[10000] w-[calc(100vw-32px)] max-w-[340px] rounded-xl overflow-hidden shadow-2xl border border-gray-200 transition-[top,left] duration-200 ease-out"
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="bg-savoy-blue px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          {totalSteps > 1 && (
            <span className="shrink-0 text-[10px] font-bold text-savoy-blue bg-white px-2 py-0.5 rounded-full">
              {currentStep + 1}/{totalSteps}
            </span>
          )}
          <h3 className="text-sm font-semibold text-white truncate leading-snug">
            {step.title}
          </h3>
        </div>
        <XCircleIcon
          onClick={onSkip}
          className="w-8 h-8 text-white cursor-pointer self-start"
        />
      </div>

      {/* Body */}
      <div className="bg-white px-4 pt-3 pb-4">
        <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>

        {step.previewImage && (
          <div className="mt-3 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
            <img
              src={step.previewImage}
              alt={`Preview for ${step.title}`}
              className="w-full object-cover max-h-36"
            />
          </div>
        )}

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mt-4 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-5 bg-savoy-blue'
                  : i < currentStep ? 'w-2.5 bg-savoy-blue/30'
                  : 'w-2.5 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className="text-xs font-medium text-gray-400 hover:text-gray-600 disabled:opacity-0 disabled:pointer-events-none transition-colors min-h-[44px] px-2 flex items-center"
            aria-label="Previous step"
          >
            ← Back
          </button>

          <div className="flex items-center gap-2">
            {hasLink ? (
              <>
                <button
                  onClick={onSkip}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors px-2 py-1.5 rounded hover:bg-gray-50"
                >
                  Do it Later
                </button>
                <button
                  onClick={() => {
                    if (step.continuesOnNextPage && step.link) onNavigateAndContinue(step.link);
                    else if (step.link) onDoItNow(step.link);
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-white bg-savoy-blue hover:opacity-90 active:opacity-80 px-3.5 py-1.5 rounded-lg transition-opacity shadow-sm"
                >
                  {step.actionLabel ?? 'Do it now!'}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={onNext}
                className="flex items-center gap-1 text-xs font-semibold text-white bg-savoy-blue hover:opacity-90 active:opacity-80 px-3.5 py-1.5 rounded-lg transition-opacity shadow-sm"
              >
                {isLast ? '🎉 Finish' : 'Next →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported component — delegates to the right variant
// ─────────────────────────────────────────────────────────────────────────────
export default function TourTooltip(props: TourTooltipProps) {
  if (props.step.variant === 'pointer') {
    return (
      <PointerTooltip
        step={props.step}
        targetRect={props.targetRect}
        currentStep={props.currentStep}
        totalSteps={props.totalSteps}
        onPrevious={props.onPrevious}
        onNext={props.onNext}
        onSkip={props.onSkip}
      />
    );
  }
  return <CardTooltip {...props} />;
}
