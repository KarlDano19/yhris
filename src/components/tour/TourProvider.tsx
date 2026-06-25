'use client';

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { usePathname } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { TourContextType, TourStartOptions, TourStep } from './types';
import TourOverlay from './TourOverlay';
import { FloatingTourCard } from './TourTooltip';
import LoadingSpinner from '@/components/LoadingSpinner';

const PENDING_KEY = 'hris_tour_pending_state';

// Synchronous flag — set before navigation so the auto-start effect can check
// it immediately without waiting for a React state re-render cycle.
export let tourIsNavigating = false;

// ── Direct API caller (no hook) ───────────────────────────────────────────────
// Called directly so it works even after a full-page reload (refs cleared) and
// can be awaited inside doItNow before navigation.

async function patchTourProgress(segmentKey: string): Promise<void> {
  try {
    const token = getCookie('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tour-progress/`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ [`is_${segmentKey}_tour_done`]: true }),
    });
  } catch {
    // Fail silently — tour tracking should never block the user
  }
}

// ── localStorage helpers ──────────────────────────────────────────────────────

function savePendingState(
  nextStepIndex: number,
  steps: TourStep[],
  segmentKey?: string,
): void {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ nextStepIndex, steps, segmentKey }));
  } catch { /* private browsing */ }
}

function loadPendingState(): {
  nextStepIndex: number;
  steps: TourStep[];
  segmentKey?: string;
} | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearPendingState(): void {
  try { localStorage.removeItem(PENDING_KEY); } catch { /* ignore */ }
}

// ── Provider ─────────────────────────────────────────────────────────────────

export const TourContext = createContext<TourContextType | null>(null);

interface TourProviderProps {
  children: React.ReactNode;
}

export default function TourProvider({ children }: TourProviderProps) {
  const [isRunning, setIsRunning]           = useState(false);
  const [isNavigating, setIsNavigating]     = useState(false);
  const [isOverlayHidden, setIsOverlayHidden] = useState(false);
  const [currentStep, setCurrentStep]       = useState(0);
  const [steps, setSteps]                   = useState<TourStep[]>([]);
  const pathname = usePathname();

  // Always-current refs
  const stepsRef       = useRef<TourStep[]>([]);
  const currentStepRef = useRef(0);
  stepsRef.current       = steps;
  currentStepRef.current = currentStep;

  // Segment callbacks + key — stored in a ref so they survive re-renders.
  // NOTE: these are cleared on a full-page reload (window.location.href).
  // segmentKey is also persisted in localStorage so it can be restored on
  // auto-resume after cross-page navigation.
  const segmentCallbacksRef = useRef<{
    segmentKey?: string;
    onComplete?: () => void;
    onSkip?:     () => void;
  }>({});

  const stopTour = useCallback(() => {
    setIsRunning(false);
    setCurrentStep(0);
  }, []);

  const startTour = useCallback((tourSteps: TourStep[], options: TourStartOptions = {}) => {
    const { fromIndex = 0, segmentKey, onComplete, onSkip } = options;
    segmentCallbacksRef.current = { segmentKey, onComplete, onSkip };
    setSteps(tourSteps);
    setCurrentStep(fromIndex);
    setIsRunning(true);
  }, []);

  const hideOverlay = useCallback(() => setIsOverlayHidden(true), []);
  const showOverlay = useCallback(() => setIsOverlayHidden(false), []);

  const nextStep = useCallback(() => {
    setIsOverlayHidden(false); // always re-show on step advance
    const last = stepsRef.current.length - 1;

    if (currentStepRef.current >= last) {
      // ── Segment complete ──────────────────────────────────────────────────
      const { segmentKey, onComplete } = segmentCallbacksRef.current;
      segmentCallbacksRef.current = {};
      setIsRunning(false);
      setCurrentStep(0);

      // Persist to backend directly — works even after a full-page reload
      // because segmentKey is in the ref (non-cross-page) or restored from
      // localStorage (cross-page auto-resume).
      if (segmentKey) patchTourProgress(segmentKey);

      // Fire optional callback (e.g. start the next segment from Home.tsx)
      if (onComplete) onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  }, []);

  const previousStep = useCallback(() => {
    const prevIndex = Math.max(0, currentStepRef.current - 1);
    if (prevIndex === currentStepRef.current) return; // already at first step

    const prevStep = stepsRef.current[prevIndex];
    if (prevStep?.id) {
      window.dispatchEvent(new CustomEvent('tour-previous-step', { detail: { stepId: prevStep.id } }));
    }

    // If the previous step belongs to a different page, save pending state and navigate there.
    if (prevStep?.homePath && !window.location.pathname.startsWith(prevStep.homePath)) {
      savePendingState(prevIndex, stepsRef.current, segmentCallbacksRef.current.segmentKey);
      setIsNavigating(true);
      setIsRunning(false);
      window.location.href = prevStep.homePath;
      return;
    }

    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const skipTour = useCallback(() => {
    const { onSkip } = segmentCallbacksRef.current;
    segmentCallbacksRef.current = {};
    clearPendingState();
    stopTour();
    if (onSkip) onSkip();
  }, [stopTour]);

  // "Do it now!" — await the PATCH before navigating so the fetch isn't aborted.
  // onComplete is intentionally NOT called here — navigation replaces the page,
  // so the next pending segment auto-starts when the user returns to the dashboard.
  const doItNow = useCallback(async (link: string) => {
    const { segmentKey } = segmentCallbacksRef.current;
    segmentCallbacksRef.current = {};
    clearPendingState();
    tourIsNavigating = true; // synchronous — blocks auto-start immediately
    setIsNavigating(true);
    setIsRunning(false);
    setCurrentStep(0);
    if (segmentKey) await patchTourProgress(segmentKey); // wait before unloading
    try { localStorage.setItem('hris_show_tour_completion', '1'); } catch { /* private browsing */ }
    window.location.href = link;
  }, []);

  // Cross-page: save remaining steps + segmentKey → navigate WITHOUT completing
  const navigateAndContinue = useCallback((link: string) => {
    tourIsNavigating = true; // synchronous — blocks auto-start immediately
    setCurrentStep((prev) => {
      savePendingState(prev + 1, stepsRef.current, segmentCallbacksRef.current.segmentKey);
      return prev;
    });
    // Do NOT clear segmentCallbacksRef — segmentKey is also in localStorage as backup
    setIsNavigating(true);
    setIsRunning(false);
    window.location.href = link;
  }, []);

  // Auto-resume: on every pathname change, check for a pending tour state.
  // segmentKey is restored from localStorage so the API call works even though
  // the full-page reload cleared segmentCallbacksRef.
  // Load pending state INSIDE the timeout so child components' useEffects can patch
  // localStorage before it is read (child effects run synchronously before async timers).
  useEffect(() => {
    const id = setTimeout(() => {
      const pending = loadPendingState();
      if (!pending) return;
      clearPendingState();
      startTour(pending.steps, {
        fromIndex:  pending.nextStepIndex,
        segmentKey: pending.segmentKey,
      });
    }, 600);

    return () => clearTimeout(id);
  }, [pathname, startTour]);

  // Abandon tour when user navigates away from a step's visibleOnPath
  // (e.g. clicks the back button on the manage/employees or settings page).
  // Clears localStorage state and dispatches 'tour-abandoned' so Home.tsx can
  // reset its autoStartedRef, allowing the segment to restart automatically
  // when the user returns to the dashboard.
  useEffect(() => {
    if (!isRunning) return;
    const step = stepsRef.current[currentStepRef.current];
    if (!step?.visibleOnPath) return;
    if (pathname.startsWith(step.visibleOnPath)) return; // still on the right path

    clearPendingState();
    segmentCallbacksRef.current = {};
    setIsRunning(false);
    setCurrentStep(0);
    window.dispatchEvent(new CustomEvent('tour-abandoned'));
  }, [pathname]); // intentionally omits isRunning — only pathname triggers this

  // Re-show overlay on page navigation if the tour is running but tooltip was
  // hidden (e.g. user dismissed via hideOnSkip then navigated to another page).
  // Only re-shows when the current step's target element exists on the new page —
  // prevents the tooltip from popping up on sub-pages where the target isn't present.
  // noOverlay steps skip this — their FloatingTourCard is always visible.
  useEffect(() => {
    if (!isRunning) return;
    const step = stepsRef.current[currentStepRef.current];
    if (!step || step.noOverlay) return;
    const id = setTimeout(() => {
      const el =
        document.getElementById(step.targetId) ??
        document.querySelector(`[data-tour-id="${step.targetId}"]`);
      if (el) setIsOverlayHidden(false);
    }, 300);
    return () => clearTimeout(id);
  }, [pathname]); // intentionally omits isRunning — only pathname triggers this

  // Auto-advance when a page action fires the current step's completeTrigger
  useEffect(() => {
    if (!isRunning) return;
    const handler = (e: Event) => {
      const { action } = (e as CustomEvent<{ action: string }>).detail ?? {};
      const step = stepsRef.current[currentStepRef.current];
      if (step?.completeTrigger && step.completeTrigger === action) {
        const isLastStep = currentStepRef.current >= stepsRef.current.length - 1;
        if (isLastStep && step.link) {
          doItNow(step.link); // marks segment done + navigates (same as clicking the action button)
        } else {
          nextStep();
        }
      }
    };
    window.addEventListener('tour-action-complete', handler as EventListener);
    return () => window.removeEventListener('tour-action-complete', handler as EventListener);
  }, [isRunning, nextStep, doItNow]);

  // Keyboard navigation
  useEffect(() => {
    if (!isRunning) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')                            { skipTour();     return; }
      if (e.key === 'ArrowRight' || e.key === 'Enter')  { nextStep();     return; }
      if (e.key === 'ArrowLeft')                         { previousStep(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isRunning, nextStep, previousStep, skipTour]);

  const value: TourContextType = {
    isRunning,
    isNavigating,
    currentStep,
    steps,
    startTour,
    stopTour,
    nextStep,
    previousStep,
    navigateAndContinue,
    hideOverlay,
    showOverlay,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
      {isRunning && steps[currentStep] && (
        steps[currentStep].noOverlay ? (
          (!steps[currentStep].visibleOnPath || pathname.startsWith(steps[currentStep].visibleOnPath)) && (
            <FloatingTourCard
              key={currentStep}
              step={steps[currentStep]}
              onNext={nextStep}
              onSkip={skipTour}
              onDoItNow={doItNow}
              onNavigateAndContinue={navigateAndContinue}
            />
          )
        ) : (
          !isOverlayHidden && (
            <TourOverlay
              key={currentStep}
              step={steps[currentStep]}
              currentStep={currentStep}
              totalSteps={steps.length}
              onNext={nextStep}
              onPrevious={previousStep}
              onSkip={skipTour}
              onHideOverlay={hideOverlay}
              onDoItNow={doItNow}
              onNavigateAndContinue={navigateAndContinue}
            />
          )
        )
      )}
      {isNavigating && (
        <div className="fixed inset-0 z-[10001] flex flex-col items-center justify-center bg-white/85 backdrop-blur-sm">
          <LoadingSpinner size="xl" color="yellow" />
          <p className="mt-4 text-lg font-semibold text-yellow-600">Redirecting...</p>
        </div>
      )}
    </TourContext.Provider>
  );
}

/** Clear the pending cross-page state (useful for dev/testing). */
export function resetTourCompletion(): void {
  try { localStorage.removeItem(PENDING_KEY); } catch { /* ignore */ }
}
