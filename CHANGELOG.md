# YAHSHUA HRIS — Frontend Changelog

Tracks new features, UI changes, and refactors.  
Format: newest entries at the top. Each entry uses the template below.

---

## TEMPLATE

```
## [YYYY-MM-DD] — <Short Title>

### Type
<!-- Added | Changed | Removed | Fixed | Refactor -->

### Description
<!-- What was done and why -->

### Files Changed
- `path/to/file.tsx` — what changed
- `path/to/file.tsx` — what changed

### Notes
<!-- Any caveats, follow-ups, or related backend changes -->
```

---

## [2026-08-18] — Mark Employees as Resigned (Single + Bulk)

### Type
Added

### Description
Added a shortcut for employees who won't undergo the full offboarding process: a per-row
"Mark as Resigned" action in the Employee List that PATCHes `is_resigned: true` directly,
plus a bulk "Mark as Resigned" action alongside "Delete Selected" for multi-select.

### Files Changed
- `src/svg/ResignIcon.tsx` — new icon (amber, matches Edit/Delete icon box style)
- `src/components/pages/(auth)/employer/manage/employees/hooks/useBulkMarkResigned.ts` — new hook, calls the dedicated bulk `PATCH /api/employees/` endpoint
- `src/components/pages/(auth)/employer/manage/employees/Content.tsx` — added single-row "Mark as Resigned" button (hidden once `is_resigned` is true) with `ConfirmModal`; added bulk "Mark as Resigned" button with `ConfirmModal` + `ProgressModal`, following the existing bulk-delete pattern

### Notes
- Related backend change: bulk `PATCH /api/employees/` endpoint — see `be/CHANGELOG.md`.

---

## [2026-08-18] — Document Repository Drag-and-Drop Reordering & Bulk Actions

### Type
Added

### Description
Enhanced the Employee 201 Document Repository: folders can now be reordered via
drag-and-drop (backed by `@hello-pangea/dnd`), and documents support a bulk-selection mode
for moving or deleting multiple documents at once. Added a dedicated modal for moving
documents between folders, and a loading-spinner message for requests that are taking a
while.

### Files Changed
- `src/components/pages/(auth)/employer/manage/employee-201-records/[id]/components/DocumentFolderList.tsx` — drag-and-drop folder reordering
- `src/components/pages/(auth)/employer/manage/employee-201-records/[id]/components/DocumentList.tsx` — bulk-selection mode for move/delete actions
- `src/components/pages/(auth)/employer/manage/employee-201-records/[id]/components/DocumentRepositoryForm.tsx` — wires up the new reordering and bulk-action state
- `src/components/pages/(auth)/employer/manage/employee-201-records/[id]/components/modals/MoveDocumentModal.tsx` — new modal for moving documents between folders
- `src/components/pages/(auth)/employer/manage/employee-201-records/[id]/hooks/useReorderFolders.ts` — new hook calling the folder-reorder endpoint
- `src/types/employee-201-records/document-repository.ts` — supporting type additions
- `src/components/GlobalLoadingSpinner.tsx` — added a "this is taking longer than usual" message for slow requests

### Notes
- Related backend change: new folder-reorder endpoint — see `be/CHANGELOG.md`.

---

## [2026-08-17] — Collision-Safe Email Masking for Directives

### Type
Changed

### Description
Reworked directive email masking so it no longer always masks a fixed 4 characters. The mask
length now scales with the local-part length, and masks the middle of the local part instead
of the tail. If two emails on the same directive would mask down to an identical-looking
string (common with standardized company email naming), progressively fewer characters are
masked until they're distinguishable again; if they're still identical (true duplicates), a
`(1)`, `(2)`, ... suffix is appended so no two options in the dropdown look the same.

### Files Changed
- `src/app/api/directives/[id]/emails/route.ts` — replaced the fixed `****` masking with
  `buildMaskedEmails()`: scaled middle-masking via `getMaskLength()`/`maskLocalPart()`, plus
  collision detection/resolution and de-duplication numbering
- `docs/directive-email-privacy.md` — updated to describe the new masking behavior

### Notes
- None.

---

## [2026-05-30] — Post a Job Page Consolidation

### Type
Refactor / Changed / Removed

### Description
The `/post-job` landing page (which only had "Create a Job" and "Job Posting History" cards)
was replaced with the full Job Posting History table. The separate `/post-job/job-posting-history`
sub-route was removed. The CREATE button for opening the job form was moved into the
Job Posting History table header, matching the Employee List pattern.

The quick access "Create a Job" entry continues to work via `?create=true` — navigating to
`/post-job` with that param auto-opens the CreateJobModal immediately.

Users who had "Job Posting History" saved in their quick access preferences (stored in the
backend) are unaffected — the `post-job-history` catalog entry is retained and now points to `/post-job`.

### Files Changed
- `src/app/(auth)/(employer)/post-job/page.tsx` — now renders job-posting-history Content; session check retained for `hasActiveSubscription`
- `src/app/(auth)/(employer)/post-job/job-posting-history/` — **deleted** (route removed)
- `src/components/pages/(auth)/employer/job-postings/job-posting-history/Content.tsx` — added CREATE button to filter row; added `hasActiveSubscription` prop; BackButton now goes to `/dashboard`; added `useSearchParams` to handle `?create=true` and `?resumeDraftId=` params; page header retained as "Job Posting History"
- `src/components/pages/(auth)/employer/job-postings/post-job/Content.tsx` — **deleted** (all functionality already existed in job-posting-history Content)
- `src/config/quick-access-catalog.tsx` — `post-job-history` URL updated to `/post-job`

### Notes
- All features from the deleted `post-job/Content.tsx` are present in `job-posting-history/Content.tsx`: social share (FB/LinkedIn), all 7 form states, screening questions, draft resume via URL param, `ConfirmSocialShareModal`.
- The old `post-job` page no longer exists as a separate UI — `/post-job` IS the Job Posting History table.
