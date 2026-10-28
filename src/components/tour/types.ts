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
  /**
   * When set, the tour auto-advances this step when
   * window.dispatchEvent(new CustomEvent('tour-action-complete', { detail: { action: '<value>' } }))
   * fires. Use this for steps where a page action (form save, button click) should
   * be the trigger rather than the tooltip's action button.
   */
  completeTrigger?: string;
  /**
   * When true, hides the action/proceed button on pointer-style tooltips.
   * Use together with completeTrigger so the step can only advance via the
   * page action — prevents the overlay from blocking the form while waiting.
   */
  hideActionButton?: boolean;
  /**
   * When true, the dark overlay is rendered purely visually — pointer events
   * pass through to the page so the user can interact with form fields while
   * the tour is active. Use for steps where the user must fill in a form
   * before clicking the spotlighted element.
   */
  nonBlocking?: boolean;
  /**
   * When set, clicking the action button dispatches a CustomEvent with this
   * name instead of (or in addition to) navigating. The target component
   * listens for this event to trigger its own behaviour (e.g. open a modal
   * and auto-start a sync). The tour waits for a matching `completeTrigger`
   * to advance past the step.
   */
  actionEvent?: string;
  /**
   * When true, clicking X or "Do it Later" hides the overlay instead of
   * stopping the tour. Use for steps that wait for a page action via
   * completeTrigger — the trigger remains active even after the tooltip
   * is dismissed, so the tour can still auto-advance.
   */
  hideOnSkip?: boolean;
  /**
   * When true, renders no dark SVG overlay at all — only a small floating
   * card pinned to the bottom-left corner. The card stays visible throughout
   * page navigations (no X to dismiss) so the user can click the action button
   * whenever they are ready. Ideal for "set up at your own pace" steps.
   */
  noOverlay?: boolean;
  /**
   * When set alongside noOverlay, the FloatingTourCard is only rendered when
   * the current pathname starts with this value. Use to prevent the card from
   * showing on unrelated pages (e.g. dashboard) while the tour is still running.
   */
  visibleOnPath?: string;
  /**
   * The page this step lives on. When the user clicks ← Back to return to a
   * step whose homePath differs from the current pathname, TourProvider saves
   * pending state to localStorage and navigates to homePath so the step is
   * shown in its correct context.
   */
  homePath?: string;
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
  isNavigating: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: (steps: TourStep[], options?: TourStartOptions) => void;
  stopTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  navigateAndContinue: (link: string) => void;
  hideOverlay: () => void;
  showOverlay: () => void;
}
