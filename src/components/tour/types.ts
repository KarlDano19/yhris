export interface TourStep {
  id: string;
  /** The element's id="" or data-tour-id="" value to highlight */
  targetId: string;
  title: string;
  description: string;
  /** URL for the "Do it now!" / "Click here!" button */
  link?: string;
  /** Override the action button label (default: "Do it now!") */
  actionLabel?: string;
  /** Optional small preview image shown in the card body */
  previewImage?: string;
  /**
   * 'card'    — full card with blue header, description, and two buttons (default)
   * 'pointer' — compact callout: back arrow + action pill + skip X
   */
  variant?: 'card' | 'pointer';
  /**
   * When true, clicking "Do it now!" saves the remaining steps to localStorage
   * and navigates to `link` WITHOUT marking the tour complete — the tour
   * auto-resumes on the next page from the following step.
   */
  continuesOnNextPage?: boolean;
}

export interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export type TourSegmentKey = 'header' | 'sync' | 'manage' | 'settings';

export interface TourStartOptions {
  fromIndex?:  number;
  segmentKey?: string;
  onComplete?: () => void;
  onSkip?:     () => void;
}

export interface TourContextType {
  isRunning: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: (steps: TourStep[], options?: TourStartOptions) => void;
  stopTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  navigateAndContinue: (link: string) => void;
}
