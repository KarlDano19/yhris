'use client';

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { usePathname } from 'next/navigation';
import { TourContextType, TourStartOptions, TourStep } from './types';
import TourOverlay from './TourOverlay';

const PENDING_KEY = 'hris_tour_pending_state';

// ── localStorage helpers ──────────────────────────────────────────────────────

function savePendingState(nextStepIndex: number, steps: TourStep[]): void {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ nextStepIndex, steps }));
  } catch { /* private browsing */ }
}

function loadPendingState(): { nextStepIndex: number; steps: TourStep[] } | null {
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

  // Ref so callbacks always see latest steps without stale closure
  const stepsRef = useRef<TourStep[]>([]);
  stepsRef.current = steps;

  // Persists segment callbacks across page navigation (TourProvider never unmounts)
  const segmentCallbacksRef = useRef<{
    onComplete?: () => void;
    onSkip?:     () => void;
  }>({});

  const stopTour = useCallback(() => {
    setIsRunning(false);
    setCurrentStep(0);
  }, []);

  const startTour = useCallback((tourSteps: TourStep[], options: TourStartOptions = {}) => {
    const { fromIndex = 0, onComplete, onSkip } = options;
    // Store callbacks in ref so they survive page navigation
    segmentCallbacksRef.current = { onComplete, onSkip };
    setSteps(tourSteps);
    setCurrentStep(fromIndex);
    setIsRunning(true);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      const last = stepsRef.current.length - 1;
      if (prev >= last) {
        // Segment complete — fire callback, clear ref, stop
        const { onComplete } = segmentCallbacksRef.current;
        segmentCallbacksRef.current = {};
        setIsRunning(false);
        if (onComplete) onComplete();
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const skipTour = useCallback(() => {
    // Fire onSkip callback (no backend write — "Do it Later")
    const { onSkip } = segmentCallbacksRef.current;
    segmentCallbacksRef.current = {};
    clearPendingState();
    stopTour();
    if (onSkip) onSkip();
  }, [stopTour]);

  // "Do it now!" — navigate to link AND complete the segment
  const doItNow = useCallback((link: string) => {
    const { onComplete } = segmentCallbacksRef.current;
    segmentCallbacksRef.current = {};
    clearPendingState();
    setIsRunning(false);
    setCurrentStep(0);
    if (onComplete) onComplete();
    window.location.href = link;
  }, []);

  // Cross-page: save remaining steps → navigate WITHOUT completing
  const navigateAndContinue = useCallback((link: string) => {
    // Functional updater reads the real current step synchronously
    setCurrentStep((prev) => {
      savePendingState(prev + 1, stepsRef.current);
      return prev;
    });
    // Do NOT clear segmentCallbacksRef — callbacks survive for auto-resume
    setIsRunning(false);
    window.location.href = link;
  }, []);

  // Auto-resume: on every pathname change, check for a pending tour state
  useEffect(() => {
    const pending = loadPendingState();
    if (!pending) return;

    clearPendingState();

    // Small delay so the new page's DOM elements have time to render
    const id = setTimeout(() => {
      startTour(pending.steps, {
        fromIndex:  pending.nextStepIndex,
        onComplete: segmentCallbacksRef.current.onComplete,
        onSkip:     segmentCallbacksRef.current.onSkip,
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
