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
