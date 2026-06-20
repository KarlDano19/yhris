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

const PENDING_KEY = 'hris_tour_pending_state';

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
  const [isRunning, setIsRunning]     = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps]             = useState<TourStep[]>([]);
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

  const nextStep = useCallback(() => {
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
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const skipTour = useCallback(() => {
    const { onSkip } = segmentCallbacksRef.current;
    segmentCallbacksRef.current = {};
    clearPendingState();
    stopTour();
    if (onSkip) onSkip();
  }, [stopTour]);

  // "Do it now!" — await the PATCH before navigating so the fetch isn't aborted
  const doItNow = useCallback(async (link: string) => {
    const { segmentKey, onComplete } = segmentCallbacksRef.current;
    segmentCallbacksRef.current = {};
    clearPendingState();
    setIsRunning(false);
    setCurrentStep(0);
    if (onComplete) onComplete();
    if (segmentKey) await patchTourProgress(segmentKey); // wait before unloading
    window.location.href = link;
  }, []);

  // Cross-page: save remaining steps + segmentKey → navigate WITHOUT completing
  const navigateAndContinue = useCallback((link: string) => {
    setCurrentStep((prev) => {
      savePendingState(prev + 1, stepsRef.current, segmentCallbacksRef.current.segmentKey);
      return prev;
    });
    // Do NOT clear segmentCallbacksRef — segmentKey is also in localStorage as backup
    setIsRunning(false);
    window.location.href = link;
  }, []);

  // Auto-resume: on every pathname change, check for a pending tour state.
  // segmentKey is restored from localStorage so the API call works even though
  // the full-page reload cleared segmentCallbacksRef.
  useEffect(() => {
    const pending = loadPendingState();
    if (!pending) return;

    clearPendingState();

    const id = setTimeout(() => {
      startTour(pending.steps, {
        fromIndex:  pending.nextStepIndex,
        segmentKey: pending.segmentKey,
        // onComplete / onSkip intentionally omitted here — Home.tsx is unmounted
        // after full-page navigation. patchTourProgress handles the API call
        // via segmentKey when nextStep() fires the last step.
      });
    }, 600);

    return () => clearTimeout(id);
  }, [pathname, startTour]);

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
    currentStep,
    steps,
    startTour,
    stopTour,
    nextStep,
    previousStep,
    navigateAndContinue,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
      {isRunning && steps[currentStep] && (
        <TourOverlay
          key={currentStep}
          step={steps[currentStep]}
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={nextStep}
          onPrevious={previousStep}
          onSkip={skipTour}
          onDoItNow={doItNow}
          onNavigateAndContinue={navigateAndContinue}
        />
      )}
    </TourContext.Provider>
  );
}

/** Clear the pending cross-page state (useful for dev/testing). */
export function resetTourCompletion(): void {
  try { localStorage.removeItem(PENDING_KEY); } catch { /* ignore */ }
}
