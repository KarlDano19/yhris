'use client';

import { useState, useEffect, useRef } from 'react';

import { UseFormReturn } from 'react-hook-form';

const DRAFT_VERSION = 1;
const STORAGE_KEY = 'job_application_draft';
const FILE_FIELDS = ['profilePicture', 'resume'];
const DEBOUNCE_MS = 600;

// ─── Serialization helpers ────────────────────────────────────────────────────
// Date objects can't be JSON-serialized by default, so we convert them to a tagged object

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

function useJobApplicationDraft(
  jobId: string | number | undefined,
  firstForm: UseFormReturn<any>,
  screeningForm: UseFormReturn<any>,
  secondForm: UseFormReturn<any>,
  profilePhotoList: FileList | null,
  setProfilePhotoList: (files: FileList | null) => void,
) {
  const [draftRestored, setDraftRestored] = useState(false);
  const [hadSavedDraft, setHadSavedDraft] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs so saveNow() always reads the latest values even inside stale closures
  const canSave = useRef(false);
  const currentJobId = useRef(jobId);
  const snapshot = useRef({ profile: {} as any, screening: {} as any, preferences: {} as any });
  const fileData = useRef<{ photo: SavedFile | null; resume: SavedFile | null }>({ photo: null, resume: null });

  // ─── 1. Restore saved draft on mount ──────────────────────────────────────

  useEffect(() => {
    if (!jobId) return;

    currentJobId.current = jobId;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const saved = JSON.parse(raw);

        if (saved.version === DRAFT_VERSION && String(saved.jobId) === String(jobId)) {
          Object.entries<any>(deserialize(saved.profile ?? {})).forEach(([k, v]) => firstForm.setValue(k, v));
          Object.entries<any>(deserialize(saved.screening ?? {})).forEach(([k, v]) => screeningForm.setValue(k, v));
          Object.entries<any>(deserialize(saved.preferences ?? {})).forEach(([k, v]) => secondForm.setValue(k, v));

          if (saved.photo) {
            fileData.current.photo = saved.photo;
            setProfilePhotoList(base64ToFileList(saved.photo));
          }

          if (saved.resume) {
            fileData.current.resume = saved.resume;
            firstForm.setValue('resume', base64ToFileList(saved.resume));
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

  useEffect(() => {
    snapshot.current = { profile: profileValues, screening: screeningValues, preferences: preferencesValues };
  }, [profileValues, screeningValues, preferencesValues]);

  // Convert profile photo to base64 whenever it changes
  useEffect(() => {
    if (!profilePhotoList?.[0]) { fileData.current.photo = null; return; }
    fileToBase64(profilePhotoList[0]).then(data => { fileData.current.photo = data; });
  }, [profilePhotoList]);

  // Convert resume to base64 whenever it changes
  useEffect(() => {
    if (!resumeFileList?.[0]) { fileData.current.resume = null; return; }
    fileToBase64(resumeFileList[0]).then(data => { fileData.current.resume = data; });
  }, [resumeFileList]);

  // ─── Core save function ────────────────────────────────────────────────────
  // Reads only from refs so it is safe to call at any time (no stale values)

  const saveNow = () => {
    if (!canSave.current) return;

    const { profile, screening, preferences } = snapshot.current;

    // Don't override a previous job's draft if this form hasn't been touched yet
    if (!profile.firstName && !profile.lastName && !profile.email) return;

    const profileWithoutFiles = Object.fromEntries(
      Object.entries(profile).filter(([k]) => !FILE_FIELDS.includes(k))
    );

    const base = {
      version: DRAFT_VERSION,
      jobId: String(currentJobId.current),
      profile: serialize(profileWithoutFiles),
      screening: serialize(screening),
      preferences: serialize(preferences),
    };

    try {
      // Try saving with files first
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...base,
        photo: fileData.current.photo,
        resume: fileData.current.resume,
      }));
    } catch {
      // Storage quota exceeded — retry without files
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...base, photo: null, resume: null }));
      } catch {
        // fail silently
      }
    }
  };

  // ─── 3. Debounced save on every form change ────────────────────────────────
  // Waits for the user to stop typing before writing to avoid excessive writes

  useEffect(() => {
    if (!draftRestored || !jobId) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(saveNow, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftRestored, profileValues, screeningValues, preferencesValues, jobId]);

  // ─── 4. Immediate save on tab close or page refresh ───────────────────────
  // beforeunload fires before the page is torn down, giving us one last chance to write

  useEffect(() => {
    window.addEventListener('beforeunload', saveNow);
    return () => window.removeEventListener('beforeunload', saveNow);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── 5. Immediate save on component unmount (back button / client-side nav) ─
  // The debounce cleanup in effect 3 would cancel the pending timer on unmount,
  // so we flush synchronously here to ensure the latest data is always saved

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

  return { clearDraft, hadSavedDraft };
}

export default useJobApplicationDraft;
