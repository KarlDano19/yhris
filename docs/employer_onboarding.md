# Employer Onboarding — Frontend Documentation

## Table of Contents
1. [Overview](#1-overview)
2. [Admin Side](#2-admin-side)
3. [Employer Side](#3-employer-side)
4. [User Interaction Flows](#4-user-interaction-flows)
5. [React Query Cache Keys](#5-react-query-cache-keys)
6. [Notable Implementation Details](#6-notable-implementation-details)

---

## 1. Overview

The employer onboarding feature has two distinct user contexts:

| Context | Who Uses It | Purpose |
|---------|------------|---------|
| **Admin** | Platform admins | Configure checklist phases/templates; monitor and manage each employer's onboarding progress |
| **Employer** | Registered employers | Self-service checklist completion; submit acceptance memo |

### Tech Stack
- **State & data fetching:** React Query (`@tanstack/react-query`)
- **UI components:** Headless UI (`@headlessui/react`)
- **Drag-and-drop:** `react-beautiful-dnd`
- **Notifications:** `react-hot-toast`
- **Forms:** `react-hook-form`
- **Auth tokens:** `cookies-next`

---

## 2. Admin Side

### Pages & Routes

| Route | Purpose |
|-------|---------|
| `/admin/employer-onboarding` | Hub menu — links to Add Checklist and Onboarding Tracker |
| `/admin/employer-onboarding/add-checklist` | Manage checklist phases and template items |
| `/admin/employer-onboarding/onboarding-tracker` | Track and update each employer's onboarding progress |

---

### Add Checklist

**Base path:** `src/components/pages/(auth)/admin/employer-onboarding/add-checklist/`

#### Components

| Component | File | Responsibility |
|-----------|------|----------------|
| `Content` | `Content.tsx` | Phase table with drag-to-reorder rows, edit and delete actions per row |
| `PhaseModal` | `PhaseModal.tsx` | 3-tab modal: **Info** (name/description) → **Items** (add/reorder template items) → **Preview** (read-only review before save) |

#### Hooks

**Path:** `add-checklist/hooks/`

| Hook | File | Method | Cache Key | Description |
|------|------|--------|-----------|-------------|
| `useGetPhases` | `useGetPhases.ts` | GET | `checklistPhasesCache` | Fetches all active phases with their nested template items |
| `useCreatePhase` | `useCreatePhase.ts` | POST | — | Creates a new phase; invalidates `checklistPhasesCache` |
| `useUpdatePhase` | `useUpdatePhase.ts` | PATCH | — | Updates phase info and nested items; invalidates `checklistPhasesCache` |
| `useDeletePhase` | `useDeletePhase.ts` | DELETE | — | Soft-deletes a phase; invalidates `checklistPhasesCache` |
| `useReorderPhases` | `useReorderPhases.ts` | PATCH | — | Bulk reorders phases by sending updated `order` values; invalidates `checklistPhasesCache` |

---

### Onboarding Tracker

**Base path:** `src/components/pages/(auth)/admin/employer-onboarding/onboarding-tracker/`

#### Components

| Component | File | Responsibility |
|-----------|------|----------------|
| `Content` | `Content.tsx` | State controller; owns the selected employer state; toggles between `Board` and `EmployerDetail` views |
| `Board` | `modal/Board.tsx` | Employer list with search input; summary stat cards (total / completed / in progress / not started) |
| `EmployerCard` | `modal/EmployerCard.tsx` | Summary tile per employer; shows company name, status badge, and progress percentage |
| `EmployerDetail` | `modal/EmployerDetail.tsx` | Full detail panel for one employer; shows grouped checklist items and acceptance memo status |
| `ChecklistGroup` | `modal/ChecklistGroup.tsx` | Read-only display of one phase group and its items; clicking an item opens `ChecklistItemModal` |
| `ChecklistItemModal` | `modal/ChecklistItemModal.tsx` | Item detail modal; shows description, YouTube/Loom embed, and admin actions: mark complete or skip |

#### Hooks

**Path:** `onboarding-tracker/hooks/`

| Hook | File | Method | Cache Key | Description |
|------|------|--------|-----------|-------------|
| `useGetOnboardingList` | `useGetOnboardingList.ts` | GET | `onboardingListCache` | Fetches employer list with progress; accepts `search` string as query param |
| `useGetOnboardingDetail` | `useGetOnboardingDetail.ts` | GET | `['onboardingDetailCache', recordId]` | Fetches full detail for one employer's onboarding record |
| `useUpdateOnboardingStatus` | `useUpdateOnboardingStatus.ts` | PATCH | — | Admin overrides employer's overall status; invalidates both list and detail caches |
| `useUpdateChecklistItem` | `useUpdateChecklistItem.ts` | PATCH | — | Admin marks an item complete or skipped; accepts `recordId` to invalidate the correct detail cache |

---

## 3. Employer Side

### Pages & Routes

| Route | Purpose |
|-------|---------|
| `/onboarding-checklist` | Main checklist view with progress bar and phase groups |
| `/onboarding-checklist/acceptance-memo` | Final acceptance memo form with live preview |

---

### Checklist View

**Base path:** `src/components/pages/(auth)/onboarding-checklist/`

#### Components

| Component | File | Responsibility |
|-----------|------|----------------|
| `ChecklistView` | `ChecklistView.tsx` | Main view container; shows progress card, list of `ChecklistGroup` components, and "Proceed to Acceptance Memo" CTA button (active only when all items done) |
| `ChecklistGroup` | `ChecklistGroup.tsx` | Renders one phase group with its items; clicking an item opens `TutorialVideoModal`; shows per-group progress counts |
| `TutorialVideoModal` | `TutorialVideoModal.tsx` | Embeds the item's tutorial video (YouTube or Loom); enforces 30-second time-lock before allowing mark-complete; shows countdown |

#### Hooks

**Path:** `onboarding-checklist/hooks/`

| Hook | File | Method | Cache Key | Description |
|------|------|--------|-----------|-------------|
| `useGetChecklist` | `useGetChecklist.ts` | GET | `employerChecklistCache` | Fetches the employer's own onboarding record with grouped items and progress |
| `useMarkItemComplete` | `useMarkItemComplete.ts` | PATCH | — | Marks a checklist item as complete; invalidates `employerChecklistCache` |

---

### Acceptance Memo

**Base path:** `src/components/pages/(auth)/onboarding-checklist/acceptance-memo/`

#### Components

| Component | File | Responsibility |
|-----------|------|----------------|
| `AcceptanceMemoView` | `AcceptanceMemoView.tsx` | Two-column layout container; left = form, right = live preview |
| `AcceptanceMemoForm` | `AcceptanceMemoForm.tsx` | All form fields (company name, authority info, signature); includes 5 confirmation checkboxes that must all be checked before submit is enabled |
| `AcceptanceMemoPreview` | `AcceptanceMemoPreview.tsx` | Real-time PDF-like document preview that updates as form values change |

#### Hooks

**Path:** `acceptance-memo/hooks/`

| Hook | File | Method | Cache Key | Description |
|------|------|--------|-----------|-------------|
| `useGetAcceptanceMemo` | `useGetAcceptanceMemo.ts` | GET | `acceptanceMemoCache` | Fetches the employer's existing acceptance memo (to pre-fill form on revisit) |
| `useSubmitAcceptanceMemo` | `useSubmitAcceptanceMemo.ts` | POST | — | Submits the memo; on success calls `updateSession()` and redirects to `/dashboard` |

---

## 4. User Interaction Flows

### Admin — Configure Checklist Phases

1. Navigate to `/admin/employer-onboarding/add-checklist`.
2. The phase table loads via `useGetPhases`.
3. Click **"Add Phase"** → `PhaseModal` opens.
   - **Tab 1 — Info:** Enter phase name and description.
   - **Tab 2 — Items:** Add template items (title, description, tutorial URL); drag items to reorder.
   - **Tab 3 — Preview:** Review the phase before saving.
4. Submit → `useCreatePhase` fires; `checklistPhasesCache` is invalidated; table refreshes.
5. To reorder phases: drag phase rows in the table → `useReorderPhases` fires on drop, updating `order` values optimistically.
6. To edit a phase: click the edit icon → `PhaseModal` opens pre-filled → submit calls `useUpdatePhase`.
7. To delete a phase: click delete icon → confirm → `useDeletePhase` fires (soft delete).

---

### Admin — Track Employer Onboarding

1. Navigate to `/admin/employer-onboarding/onboarding-tracker`.
2. `Board` loads via `useGetOnboardingList`; stat cards show totals across all employers.
3. Use the search input to filter by employer name (passed as query param).
4. Click an `EmployerCard` → `Content` sets selected employer; `EmployerDetail` renders using `useGetOnboardingDetail`.
5. In `EmployerDetail`, click a checklist item → `ChecklistItemModal` opens.
   - View item description and watch the tutorial video.
   - Click **"Mark Complete"** → `useUpdateChecklistItem` fires; `onboardingDetailCache` and `onboardingListCache` invalidated.
   - Click **"Skip"** → same flow; item is marked skipped.
6. To override overall status: use the status dropdown in `EmployerDetail` → `useUpdateOnboardingStatus` fires.

---

### Employer — Complete Onboarding Checklist

1. Navigate to `/onboarding-checklist`.
2. `ChecklistView` loads via `useGetChecklist`; progress bar reflects completed + skipped / total.
3. Click a checklist item → `TutorialVideoModal` opens.
   - Tutorial video (YouTube or Loom) plays in an embed.
   - **"Mark as Complete"** button is disabled for the first 30 seconds; a visible countdown shows remaining time.
   - After 30 seconds (or when video ends for YouTube), the button activates.
   - Click **"Mark as Complete"** → `useMarkItemComplete` fires; `employerChecklistCache` invalidated; item turns green.
4. When all non-memo items are completed, the **"Proceed to Acceptance Memo"** CTA activates.
5. Click CTA → navigate to `/onboarding-checklist/acceptance-memo?itemId={acceptanceMemoItemId}`.
6. On the acceptance memo page:
   - Fill in company details and authority information.
   - Draw or upload a signature.
   - The right-side `AcceptanceMemoPreview` updates live as fields change.
   - Check all 5 confirmation checkboxes.
   - Click **"Submit"** → `useSubmitAcceptanceMemo` fires.
   - On success: `updateSession()` is called, the acceptance memo checklist item is marked complete, and the user is redirected to `/dashboard`.

---

## 5. React Query Cache Keys

| Cache Key | Data Cached | Invalidated By |
|-----------|-------------|----------------|
| `checklistPhasesCache` | All active phases with nested template items | `useCreatePhase`, `useUpdatePhase`, `useDeletePhase`, `useReorderPhases` |
| `onboardingListCache` | Employer list with status and progress % | `useUpdateChecklistItem`, `useUpdateOnboardingStatus` |
| `['onboardingDetailCache', recordId]` | One employer's full onboarding detail with grouped items | `useUpdateChecklistItem(recordId)`, `useUpdateOnboardingStatus` |
| `employerChecklistCache` | Employer's own checklist with groups and progress | `useMarkItemComplete` |
| `acceptanceMemoCache` | Employer's acceptance memo data | `useSubmitAcceptanceMemo` |

---

## 6. Notable Implementation Details

### 30-Second Time-Lock (`TutorialVideoModal`)
`TutorialVideoModal` starts a 30-second countdown when opened. The **"Mark as Complete"** button is disabled until the countdown reaches zero. A visible timer label shows remaining seconds. This is enforced client-side to ensure the employer has had at least 30 seconds to engage with the tutorial content.

### YouTube Auto-Complete
When the embedded YouTube player fires a state change event of `0` (video ended), the modal treats this as the employer having watched the content and unlocks the mark-complete button immediately (overriding any remaining countdown).

### Optimistic Reorder (`useReorderPhases`)
Phase row drag-and-drop in the admin Add Checklist table applies the reordered list to local state immediately (optimistic update) before the API call resolves. If the API call fails, the list is reverted to the original order and an error toast is shown.

### Acceptance Memo Checklist Item Filtering
Both the admin `EmployerDetail` view and the employer `ChecklistView` filter out the special "Acceptance Memo" checklist item from the general grouped list. The memo item is displayed as a separate block/section at the bottom, preventing it from appearing inside a regular phase group.

### Session Update on 100% Completion
When the employer's progress hits 100%, `ChecklistView` detects this after the cache refreshes and calls `updateSession()` (NextAuth session update) before redirecting to `/dashboard`. This ensures the session reflects the completed onboarding state immediately.

### Soft Delete Safety for Phases
Deleting a phase calls the backend DELETE endpoint, which sets `is_active=False` on the phase and all its templates. The frontend removes the phase from the local list immediately via cache invalidation. Existing employer checklist items already seeded from those templates are **not** removed from the database and remain visible in employer/admin detail views.

### Acceptance Memo Upsert Behavior
`useSubmitAcceptanceMemo` always calls the POST endpoint. The backend uses `update_or_create`, so re-submitting the form simply updates the existing memo. The form is pre-filled on revisit via `useGetAcceptanceMemo`.
