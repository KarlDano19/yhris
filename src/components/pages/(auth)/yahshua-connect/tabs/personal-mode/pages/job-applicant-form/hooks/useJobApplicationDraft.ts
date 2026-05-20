'use client';

import { useState, useEffect, useRef } from 'react';

import { UseFormReturn } from 'react-hook-form';

const DRAFT_VERSION = 1;
const STORAGE_KEY = 'job_applicant_draft';
const DEBOUNCE_MS = 600;

// ─── Serialization helpers ────────────────────────────────────────────────────

function serialize(val: any): any {
  if (val instanceof Date) return { __isDate: true, iso: val.toISOString() };
  if (Array.isArray(val)) return val.map(serialize);
  if (val && typeof val === 'object')
    return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, serialize(v)]));
  return val;
}

function deserialize(val: any): any {
  if (val?.__isDate) return new Date(val.iso);
  if (Array.isArray(val)) return val.map(deserialize);
  if (val && typeof val === 'object')
    return Object.fromEntries(Object.entries(val).map(([k, v]) => [k, deserialize(v)]));
  return val;
}

// ─── File helpers ─────────────────────────────────────────────────────────────

type SavedFile = { name: string; type: string; data: string };

async function fileToBase64(file: File): Promise<SavedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result as string });
    reader.onerror = reject;
  });
}

function base64ToFileList(saved: SavedFile): FileList {
  const [header, base64] = saved.data.split(',');
  const mime = header.match(/:(.*?);/)?.[1] ?? saved.type;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const file = new File([bytes], saved.name, { type: mime });
  const dt = new DataTransfer();
  dt.items.add(file);
  return dt.files;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

// Personal info fields that come from the API — never saved/restored from draft
const PROFILE_API_FIELDS = ['firstName', 'middleName', 'lastName', 'email', 'mobileNo', 'address', 'profilePicture'];

function useJobApplicationDraft(
  jobId: string | number | undefined,
  firstForm: UseFormReturn<any>,
  screeningForm: UseFormReturn<any>,
  secondForm: UseFormReturn<any>,
  setDpaAgreed: (agreed: boolean) => void,
  setIsDPAModalOpen: (open: boolean) => void,
  dpaAgreed?: boolean,
) {
  const [draftRestored, setDraftRestored] = useState(false);
  const [hadSavedDraft, setHadSavedDraft] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canSave = useRef(false);
  const currentJobId = useRef(jobId);
  const snapshot = useRef({ profile: {} as any, screening: {} as any, preferences: {} as any });
  const resumeData = useRef<SavedFile | null>(null);
  const dpaAgreedRef = useRef(false);

  // ─── 1. Restore saved draft on mount ──────────────────────────────────────

  useEffect(() => {
    if (!jobId) return;

    currentJobId.current = jobId;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const saved = JSON.parse(raw);

        if (saved.version === DRAFT_VERSION && String(saved.jobId) === String(jobId)) {
          // Restore only user-entered profile fields (not API-populated ones)
          const profile = deserialize(saved.profile ?? {});
          Object.entries<any>(profile).forEach(([k, v]) => {
            if (!PROFILE_API_FIELDS.includes(k)) firstForm.setValue(k, v);
          });

          Object.entries<any>(deserialize(saved.screening ?? {})).forEach(([k, v]) => screeningForm.setValue(k, v));
          Object.entries<any>(deserialize(saved.preferences ?? {})).forEach(([k, v]) => secondForm.setValue(k, v));

          if (saved.resume) {
            resumeData.current = saved.resume;
            firstForm.setValue('resume', base64ToFileList(saved.resume));
          }

          if (saved.dpa_agreed) {
            setDpaAgreed(true);
            setIsDPAModalOpen(false);
          }

          setHadSavedDraft(true);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }

    setDraftRestored(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  // ─── 2. Keep refs in sync with the latest form values ─────────────────────

  const profileValues = firstForm.watch();
  const screeningValues = screeningForm.watch();
  const preferencesValues = secondForm.watch();
  const resumeFileList = profileValues.resume as FileList | undefined;

  useEffect(() => { canSave.current = draftRestored; }, [draftRestored]);
  useEffect(() => { currentJobId.current = jobId; }, [jobId]);
  useEffect(() => { dpaAgreedRef.current = dpaAgreed ?? false; }, [dpaAgreed]);

  useEffect(() => {
    snapshot.current = { profile: profileValues, screening: screeningValues, preferences: preferencesValues };
  }, [profileValues, screeningValues, preferencesValues]);

  // Convert resume to base64 whenever it changes
  useEffect(() => {
    if (!resumeFileList?.[0]) { resumeData.current = null; return; }
    fileToBase64(resumeFileList[0]).then(data => { resumeData.current = data; });
  }, [resumeFileList]);

  // ─── Core save function ────────────────────────────────────────────────────

  const saveNow = () => {
    if (!canSave.current) return;

    const { profile, screening, preferences } = snapshot.current;

    // Don't save a blank form
    if (!profile.portfolio && !screening.screeningAnswers && !dpaAgreedRef.current) return;

    // Strip API-populated fields from the profile snapshot before saving
    const profileWithoutApiFields = Object.fromEntries(
      Object.entries(profile).filter(([k]) => !PROFILE_API_FIELDS.includes(k) && k !== 'resume')
    );

    const base = {
      version: DRAFT_VERSION,
      jobId: String(currentJobId.current),
      profile: serialize(profileWithoutApiFields),
      screening: serialize(screening),
      preferences: serialize(preferences),
      dpa_agreed: dpaAgreedRef.current,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...base, resume: resumeData.current }));
    } catch {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...base, resume: null }));
      } catch {
        // fail silently
      }
    }
  };

  // ─── 3. Debounced save on every form change ────────────────────────────────

  useEffect(() => {
    if (!draftRestored || !jobId) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(saveNow, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftRestored, profileValues, screeningValues, preferencesValues, jobId]);

  // ─── 4. Immediate save on tab close / page refresh ────────────────────────

  useEffect(() => {
    window.addEventListener('beforeunload', saveNow);
    return () => window.removeEventListener('beforeunload', saveNow);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── 5. Immediate save on unmount (back button / client-side nav) ──────────

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      saveNow();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Public API ───────────────────────────────────────────────────────────

  const clearDraft = () => {
    canSave.current = false;
    localStorage.removeItem(STORAGE_KEY);
  };

  return { clearDraft, hadSavedDraft, draftRestored };
}

export default useJobApplicationDraft;
