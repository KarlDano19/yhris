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
- **Session:** `iron-session` (server-side encrypted cookie)

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
| `PhaseModal` | `modal/PhaseModal.tsx` | 3-tab modal: **Info** (name/description) → **Items** (add/reorder template items) → **Preview** (read-only review before save) |
| `PreviewPhaseModal` | `modal/PreviewPhaseModal.tsx` | Read-only checklist item preview with embedded YouTube/Loom video |

#### Hooks

**Path:** `add-checklist/hooks/`

| Hook | File | Method | Cache Key | Description |
|------|------|--------|-----------|-------------|
| `useGetPhases` | `useGetPhases.ts` | GET | `checklistPhasesCache` | Fetches all active phases with their nested template items; throws on error |
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
| `Board` | `modal/BoardModal.tsx` | Employer list with debounced search input (300ms); summary stat cards (total / completed / in progress / not started) |
| `EmployerCard` | `modal/EmployerCardModal.tsx` | Summary tile per employer; shows company name, status badge, and progress percentage |
| `EmployerDetail` | `modal/EmployerDetailModal.tsx` | Full detail panel for one employer; shows grouped checklist items and acceptance memo status |
| `ChecklistGroup` | `modal/ChecklistGroupModal.tsx` | Read-only display of one phase group and its items |
| `ProgressCard` | `modal/ProgressCardModal.tsx` | Progress card component showing completion stats |

#### Hooks

**Path:** `onboarding-tracker/hooks/`

| Hook | File | Method | Cache Key | Description |
|------|------|--------|-----------|-------------|
| `useGetOnboardingList` | `useGetOnboardingList.ts` | GET | `onboardingListCache` | Fetches employer list with progress; accepts `search` string as query param; throws on error |
| `useGetOnboardingDetail` | `useGetOnboardingDetail.ts` | GET | `['onboardingDetailCache', recordId]` | Fetches full detail for one employer's onboarding record; throws on error |
| `useUpdateOnboardingStatus` | `useUpdateOnboardingStatus.ts` | PATCH | — | Admin overrides employer's overall status; invalidates both list and detail caches |
| `useUpdateChecklistItem` | `useUpdateChecklistItem.ts` | PATCH | — | Admin marks an item complete or skipped; accepts `recordId` to invalidate the correct detail cache |

---

## 3. Employer Side

### Pages & Routes

| Route | Purpose |
|-------|---------|
| `/setup-employer-profile/onboarding-checklist` | Main checklist view with progress bar and phase groups |
| `/setup-employer-profile/acceptance-memo` | Standalone acceptance memo form (onboarding flow) |
| `/manage/document-generator?type=acceptance-memo` | Acceptance memo accessible from the Document Generator |

---

### Checklist View

**Base path:** `src/components/pages/(auth)/employer/onboarding-checklist/`

#### Components

| Component | File | Responsibility |
|-----------|------|----------------|
| `ChecklistView` | `ChecklistView.tsx` | Main view container; shows progress card, list of `ChecklistGroup` components, and "Proceed to Acceptance Memo" CTA button (active only when all items done) |
| `ChecklistGroup` | `ChecklistGroup.tsx` | Renders one phase group with its items; clicking an item opens `TutorialVideoModal`; shows per-group progress counts |
| `TutorialVideoModal` | `TutorialVideoModal.tsx` | Embeds the item's tutorial video (YouTube or Loom); enforces a 30-second continuous time-lock before allowing mark-complete; each item has its own independent countdown |

#### Hooks

**Path:** `onboarding-checklist/hooks/`

| Hook | File | Method | Cache Key | Description |
|------|------|--------|-----------|-------------|
| `useGetChecklist` | `useGetChecklist.ts` | GET | `employerChecklistCache` | Fetches the employer's own onboarding record with grouped items and progress |
| `useMarkChecklistItemComplete` | `useMarkChecklistItemComplete.ts` | PATCH | — | Marks a checklist item as complete; invalidates `employerChecklistCache` |

---

### Acceptance Memo

Two entry points exist for the acceptance memo: the dedicated onboarding flow and the Document Generator.

**Onboarding flow path:** `src/components/pages/(auth)/employer/setup-employer-profile/acceptance-memo/`

**Document Generator path:** `src/components/pages/(auth)/employer/manage/document-generator/`

#### Components

| Component | File | Responsibility |
|-----------|------|----------------|
| `Content` (onboarding) | `setup-employer-profile/acceptance-memo/Content.tsx` | Standalone acceptance memo form used during the onboarding flow |
| `Content` (doc generator) | `manage/document-generator/Content.tsx` | Multi-document generator; includes acceptance memo as one document type |
| `AcceptanceMemoPreview` | `manage/document-generator/form-previews/AcceptanceMemoPreview.tsx` | Real-time PDF-like document preview that updates as form values change; signature image rendered with `max-h-12 object-contain` flush to the underline |

#### Hooks

| Hook | File | Method | Cache Key | Description |
|------|------|--------|-----------|-------------|
| `useGetAcceptanceMemo` | `document-generator/hooks/useGetAcceptanceMemo.ts` | GET | `acceptanceMemoCache` | Fetches the employer's existing acceptance memo (to pre-fill form on revisit) |
| `useSubmitAcceptanceMemo` | `document-generator/hooks/useSubmitAcceptanceMemo.ts` | POST | — | Submits the memo as `multipart/form-data`; invalidates `acceptanceMemoCache` on success |
| `useUpdateUserViewType` | `src/components/hooks/useUpdateUserViewType.ts` | PATCH | — | Called after successful memo submission; PATCHes `/api/user-accounts/details/` with `view_type: 'onboarding'`, then calls `/api/refresh-onboarding-session` to sync the iron-session from the backend |

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
3. Use the search input to filter by employer name; the query fires 300ms after the user stops typing (debounced).
4. Click an `EmployerCard` → `Content` sets selected employer; `EmployerDetail` renders using `useGetOnboardingDetail`.
5. In `EmployerDetail`, click a checklist item to view description and tutorial video.
   - Click **"Mark Complete"** → `useUpdateChecklistItem` fires; `onboardingDetailCache` and `onboardingListCache` invalidated.
   - Click **"Skip"** → same flow; item is marked skipped.
6. To override overall status: use the status dropdown in `EmployerDetail` → `useUpdateOnboardingStatus` fires.

---

### Employer — Complete Onboarding Checklist

1. Navigate to `/setup-employer-profile/onboarding-checklist`.
2. `ChecklistView` loads via `useGetChecklist`; progress bar reflects completed / total.
3. Items are sequentially locked — only the next incomplete item is clickable at a time.
4. Click a checklist item → `TutorialVideoModal` opens.
   - Tutorial video (YouTube or Loom) plays in an embed.
   - **"Mark as Complete"** button is disabled for 30 seconds from first open; a visible countdown shows remaining time.
   - The 30-second timer is continuous — closing and reopening the modal does not reset it; the elapsed time is tracked via `localStorage` per item.
   - After 30 seconds total have elapsed, the button activates (even across multiple modal opens/closes).
   - Click **"Mark as Complete"** → `useMarkChecklistItemComplete` fires; `employerChecklistCache` invalidated; item turns green.
5. When all items are completed, the **"Proceed to Acceptance Memo"** CTA activates.
6. Click CTA → navigate to `/setup-employer-profile/acceptance-memo`.
7. On the acceptance memo page:
   - Fill in company details and authority information.
   - Draw or upload a signature.
   - The `AcceptanceMemoPreview` updates live as fields change.
   - Check all confirmation checkboxes.
   - Click **"Submit"** → `useSubmitAcceptanceMemo` fires.
   - On success: `useUpdateUserViewType('onboarding')` is called, which PATCHes the backend and calls `/api/refresh-onboarding-session` to sync `hasCompletedOnboarding` in the iron-session; then redirects to `/dashboard`.

---

## 5. React Query Cache Keys

| Cache Key | Data Cached | Invalidated By |
|-----------|-------------|----------------|
| `checklistPhasesCache` | All active phases with nested template items | `useCreatePhase`, `useUpdatePhase`, `useDeletePhase`, `useReorderPhases` |
| `onboardingListCache` | Employer list with status and progress % | `useUpdateChecklistItem`, `useUpdateOnboardingStatus` |
| `['onboardingDetailCache', recordId]` | One employer's full onboarding detail with grouped items | `useUpdateChecklistItem(recordId)`, `useUpdateOnboardingStatus` |
| `employerChecklistCache` | Employer's own checklist with groups and progress | `useMarkChecklistItemComplete` |
| `acceptanceMemoCache` | Employer's acceptance memo data | `useSubmitAcceptanceMemo` |

---

## 6. Notable Implementation Details

### 30-Second Per-Item Time-Lock (`TutorialVideoModal`)
Each checklist item has its own independent 30-second countdown. The timer starts the first time the item's modal is opened and runs continuously in the background — closing the modal does not pause the timer. Elapsed time is stored in `localStorage` under the key `onboarding_timer_start_{item.id}`. When the modal reopens, it computes `Date.now() - startTime` to determine remaining time. The **"Mark as Complete"** button remains disabled until 30 cumulative seconds have passed.

### Session Security — Onboarding Flags
`hasCompletedOnboarding` and `hasOnboarded` are **not** updatable via the generic `/api/update-session` endpoint. They are exclusively set by the server-side `/api/refresh-onboarding-session` endpoint, which reads `has_onboarded` directly from the Django backend using the session token and writes it to iron-session. This prevents client-side spoofing of the onboarding gate.

### Onboarding Completion Flow (`useUpdateUserViewType`)
After a successful acceptance memo submission, `useUpdateUserViewType('onboarding')` is called. It:
1. PATCHes `/api/user-accounts/details/` with `{ view_type: 'onboarding' }` (marks `has_onboarded = True` on the backend).
2. Calls `POST /api/refresh-onboarding-session` to sync `hasCompletedOnboarding` and `hasOnboarded` into the iron-session from the backend.
3. `mutateAsync` resolves only after both steps complete, so the subsequent `router.push('/dashboard')` always navigates with an up-to-date session.

### Middleware Onboarding Gate
The middleware blocks all employer routes (except `setup-employer-profile` sub-routes) when `hasCompletedOnboarding` is false. **`settings` and `notifications` are explicitly exempt** from this gate so employers cannot get trapped during onboarding if they need to access account settings.

### Debounced Search (`BoardModal`)
The search input in the onboarding tracker Board fires a query 300ms after the user stops typing. Local `search` state updates immediately (for input responsiveness); `debouncedSearch` state feeds the `useGetOnboardingList` hook.

### XSS Safety in Video Embeds (`PreviewPhaseModal`)
The `getEmbedUrl` function in the admin checklist preview modal only converts recognized YouTube URLs into embed URLs. Any URL that does not match the YouTube allowlist returns `'about:blank'` — the raw URL is never passed directly to `<iframe src>`.

### Optimistic Reorder (`useReorderPhases`)
Phase row drag-and-drop in the admin Add Checklist table applies the reordered list to local state immediately (optimistic update) before the API call resolves. If the API call fails, the list is reverted to the original order and an error toast is shown.

### Acceptance Memo Upsert Behavior
`useSubmitAcceptanceMemo` always calls the POST endpoint. The backend uses `update_or_create`, so re-submitting the form simply updates the existing memo. The form is pre-filled on revisit via `useGetAcceptanceMemo`.

### Soft Delete Safety for Phases
Deleting a phase calls the backend DELETE endpoint, which sets `is_active=False` on the phase and all its templates. The frontend removes the phase from the local list immediately via cache invalidation. Existing employer checklist items already seeded from those templates are **not** removed from the database and remain visible in employer/admin detail views.
