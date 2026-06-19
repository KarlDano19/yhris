# Onboarding Tour System

A custom, zero-dependency guided tour built with React context, Tailwind CSS, and a Django backend for per-employer progress tracking.

---

## Architecture Overview

```
src/components/tour/
├── types.ts               — TourStep, TourContextType, TourStartOptions interfaces
├── TourProvider.tsx       — Context provider, state machine, cross-page persistence
├── TourOverlay.tsx        — SVG spotlight + highlight ring
├── TourTooltip.tsx        — Two variants: 'card' and 'pointer'
├── useTour.ts             — useContext hook
└── dashboardTourSteps.ts  — Dashboard segment definitions and TOUR_SEGMENTS config

src/components/hooks/
├── useGetTourProgress.ts  — GET /api/tour-progress/
└── useUpdateTourProgress.ts — PATCH /api/tour-progress/
```

`TourProvider` lives in `src/app/layout.tsx` and never unmounts, so segment callbacks survive cross-page navigation.

---

## Tour Segments (Dashboard)

The dashboard has four independent tracked segments, run in this order:

| # | Key | Page | Variant | Payroll only? |
|---|-----|------|---------|---------------|
| 1 | `header` | Dashboard | pointer | No |
| 2 | `sync` | Dashboard | pointer | Yes |
| 3 | `manage` | Dashboard → /manage | card + card | No |
| 4 | `settings` | Dashboard | card | No |

Progress is stored in the `employer_tour_progress` DB table (one row per employer).

---

## Adding a Tour to Any Module

### Step 1 — Mark the target element

Add `data-tour-id` to the element you want spotlighted. Any HTML element works.

```tsx
<button data-tour-id="tour-payroll-run">Run Payroll</button>
```

> Alternatively, a regular `id=""` attribute also works as a target.

### Step 2 — Define the steps

```ts
import { TourStep } from '@/components/tour/types';

const MY_TOUR_STEPS: TourStep[] = [
  {
    id: 'tour-payroll-run',
    targetId: 'tour-payroll-run',   // matches data-tour-id or id on the DOM element
    title: 'Run Payroll',
    description: 'Click here to process payroll for all active employees.',
    actionLabel: 'Got it!',
    variant: 'pointer',
  },
  {
    id: 'tour-payroll-history',
    targetId: 'tour-payroll-history',
    title: 'Payroll History',
    description: 'View all past payroll runs and download reports here.',
    link: '/payroll/history',        // shows "Do it Later" + action button
    actionLabel: 'View History',
  },
];
```

### Step 3 — Start the tour

```tsx
'use client';
import { useTour } from '@/components/tour/useTour';

export default function PayrollPage() {
  const { startTour } = useTour();

  return (
    <button onClick={() => startTour(MY_TOUR_STEPS)}>
      ? Take a tour
    </button>
  );
}
```

---

## TourStep Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier for the step |
| `targetId` | `string` | ✅ | Value of `data-tour-id=""` or `id=""` on the target element |
| `title` | `string` | ✅ | Displayed in the card header (card variant only) |
| `description` | `string` | ✅ | Body text shown in the tooltip |
| `variant` | `'card' \| 'pointer'` | — | Tooltip style. Default: `'card'` |
| `link` | `string` | — | Adds "Do it Later" + action button. Navigates on click |
| `actionLabel` | `string` | — | Label for the action button. Default: `'Do it now!'` |
| `previewImage` | `string` | — | Image URL shown inside the card body |
| `continuesOnNextPage` | `boolean` | — | Action button navigates without ending the tour; resumes on the next page |

### Variants

**`card`** — Full card with a dark blue (`#1a2e6e`) header, description, progress dots, and a "Do it Later" / action button footer. Best for feature introductions.

**`pointer`** — Compact white rounded card with description, a back arrow, and an action pill. Best for pointing at a single UI element (navbar items, floating buttons).

---

## Backend-Tracked Tours

Use this when you want the tour to only show once per employer (permanently dismissed after completion).

### 1. Add fields to the model

```python
# yahshua-hris-be/app/models/employer_onboarding.py
class EmployerTourProgress(TimeStampMixin):
    # existing fields ...
    is_payroll_tour_done = models.BooleanField(default=False)  # add this
```

Run migrations:
```bash
python manage.py makemigrations && python manage.py migrate
```

### 2. Use `onComplete` / `onSkip` callbacks

```tsx
import useGetTourProgress from '@/components/hooks/useGetTourProgress';
import useUpdateTourProgress from '@/components/hooks/useUpdateTourProgress';
import { useTour } from '@/components/tour/useTour';

const { data: tourProgress } = useGetTourProgress();
const { mutate: updateTourProgress } = useUpdateTourProgress();
const { startTour } = useTour();

const launchTour = () => {
  if (tourProgress?.is_payroll_tour_done) return; // already completed

  startTour(MY_TOUR_STEPS, {
    onComplete: () => {
      // Mark done permanently in the backend
      updateTourProgress({ is_payroll_tour_done: true });
    },
    onSkip: () => {
      // "Do it Later" — don't mark done; tour will show again next visit
    },
  });
};
```

---

## Cross-Page Tours

When a tour step navigates to a different page and the tour should continue there, set `continuesOnNextPage: true` on the step that triggers the navigation.

```ts
const STEPS: TourStep[] = [
  {
    id: 'tour-manage',
    targetId: 'tour-manage',
    title: 'Manage Employees',
    description: 'Click to go to the Manage page.',
    link: '/manage',
    actionLabel: 'Go to Manage',
    continuesOnNextPage: true,   // ← key flag
  },
  {
    id: 'tour-employee-list',
    targetId: 'tour-manage-employees',
    title: 'Employee List',
    description: 'Your full employee directory lives here.',
    actionLabel: 'Got it!',
    // This step renders on /manage after navigation
  },
];
```

**How it works internally:**
1. Clicking the action button calls `navigateAndContinue(link)`.
2. The remaining steps + callbacks are saved to `localStorage` key `hris_tour_pending_state`.
3. `TourProvider` watches `usePathname()`. On the new page, it reads the pending state and resumes the tour after a 600ms delay (to let the DOM render).
4. Callbacks (`onComplete` / `onSkip`) persist in a ref inside `TourProvider` and survive the navigation.

---

## `startTour` Options

```ts
startTour(steps: TourStep[], options?: {
  fromIndex?:  number;    // start from a specific step index (default: 0)
  segmentKey?: string;    // label for this tour segment (used internally)
  onComplete?: () => void; // called when the last step is completed
  onSkip?:     () => void; // called when "Do it Later" or ✕ is clicked
})
```

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `→` / `Enter` | Next step |
| `←` | Previous step |
| `Escape` | Skip tour |

---

## Context API

```ts
import { useTour } from '@/components/tour/useTour';

const {
  isRunning,      // boolean — is a tour currently active?
  currentStep,    // number — 0-based index of the current step
  steps,          // TourStep[] — all steps in the active tour
  startTour,      // (steps, options?) => void
  stopTour,       // () => void — stop without callbacks
  nextStep,       // () => void
  previousStep,   // () => void
  navigateAndContinue, // (link: string) => void — cross-page navigation
} = useTour();
```
