// app/(manage)/employee-201-records/[id]/Employee201Content.tsx
"use client";

import { useRouter } from "next/navigation";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { Employee } from "@/types/employee-201-records/employee";

// Data
import { useEmployee } from "./hooks/useEmployee";
import { toDisplayEmployee } from "./utils/toDisplayEmployee";

// UI
import EmployeeHeaderSkeleton from "./components/EmployeeHeaderSkeleton";
import EmployeeHeader, { TabKey } from "./components/EmployeeHeader";
import ConfirmModal from "./modals/ConfirmModal";
import LeaveConfirmModal from "./modals/LeaveConfirmModal";

// Forms
import PersonalInfoForm from "./components/PersonalInfoForm";
import EmploymentDetailsForm from "./components/EmploymentDetailsForm";
import TrainingDevelopmentForm from "./components/TrainingDevelopmentForm";
import DisciplinaryRecordsForm from "./components/DisciplinaryRecordsForm";
import PerformanceEvaluationForm from "./components/PerformanceEvaluationForm";
import BenefitsComplianceForm from "./components/BenefitsComplianceForm";
import DocumentRepositoryForm from "./components/DocumentRepositoryForm";

// Helpers
import { notify } from "./utils/notify";
import { labelForTab } from "./utils/labelForTab";
import { useSectionLoader } from "./hooks/useSectionLoader";
import { SectionMap, sectionOrder } from "./types/section";

// PATCH hooks
import { usePersonalDetailsPatch } from "./hooks/usePersonalDetailsPatch";
import { useEmploymentDetailsPatch } from "./hooks/useEmploymentDetailsPatch";

// Training API hooks (parent-side save)
import {
  useCreateTrainingRecord,
  useUpdateTrainingRecord,
  useDeleteTrainingRecord,
} from "./hooks/useTrainingRecord";

// Type-only import to annotate the collector ref
import type { TrainingChangeSet } from "./components/TrainingDevelopmentForm";

export interface ContentProps {
  params: { id: string };
  emp?: Partial<Employee>;
  hasActiveSubscription: boolean;
}

export default function Employee201Content({ params, emp, hasActiveSubscription }: ContentProps) {
  const router = useRouter();

  // ------------------------ State ------------------------
  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [pendingTab, setPendingTab] = useState<TabKey | null>(null);

  // per-section flags
  const [sections, setSections] = useState<SectionMap>(() =>
    sectionOrder.reduce((acc, key) => {
      acc[key] = {
        loaded: false,
        loading: false,
        dirty: false,
        saving: false,
        hasErrors: false, // ← important for disabling Save
      };
      return acc;
    }, {} as SectionMap)
  );

  // accumulate patches from forms
  const personalPatchRef = useRef<Record<string, any>>({});
  const employmentPatchRef = useRef<Record<string, any>>({});

  // Training: child exposes a collector we call on save
  const trainingCollectorRef = useRef<null | (() => TrainingChangeSet)>(null);
  const [trainingRefreshKey, setTrainingRefreshKey] = useState(0);

  const [resetKey, setResetKey] = useState({
    personal: 0,
    employment: 0,
    training: 0,
  });

  const isDirty = useMemo(
    () => Object.values(sections).some((s) => s.dirty),
    [sections]
  );

  // ------------------------ Data hooks ------------------------
  const { data, isLoading, refetch } = useEmployee(params?.id);
  const employee = toDisplayEmployee(data, emp);
  const [employeeDetails, setEmployeeDetails] = useState<Partial<Employee> | undefined>(data ?? emp);

  // PATCH hooks (sim mode by default; configure when backend is ready)
  const { save: savePersonal } = usePersonalDetailsPatch(params?.id);
  const { save: saveEmployment } = useEmploymentDetailsPatch(params?.id);

  // Training hooks (actual API calls from parent on save)
  const { create: createTraining } = useCreateTrainingRecord();
  const { update: updateTraining } = useUpdateTrainingRecord();
  const { remove: deleteTraining } = useDeleteTrainingRecord();

  // Section loader with race guard
  const { loadSection } = useSectionLoader(setSections);

  // ------------------------ Derived flags ------------------------
  const canSave = !!(
    !isLoading &&
    !sections[activeTab]?.loading &&
    !sections[activeTab]?.saving &&
    sections[activeTab]?.dirty &&
    !sections[activeTab]?.hasErrors
  );
  const saving = sections[activeTab]?.saving;

  // ------------------------ Navigation helpers ------------------------
  const attemptNavigate = useCallback((href: string | "back") => {
    if (isDirty) {
      setPendingHref(href);
      setShowLeaveConfirm(true);
    } else {
      href === "back" ? router.back() : router.push(href);
    }
  }, [isDirty, router]);

  const proceedAfterLeave = useCallback(() => {
    if (pendingTab) {
      setActiveTab(pendingTab);
      void loadSection(pendingTab);
      setPendingTab(null);
      return;
    }
    if (pendingHref) {
      pendingHref === "back" ? router.back() : router.push(pendingHref);
      setPendingHref(null);
    }
  }, [pendingHref, pendingTab, router, loadSection]);

  useEffect(() => {
    setEmployeeDetails(data ?? emp);
  }, [data, emp]);

  // warn on unload when dirty
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [isDirty]);

  // keyboard: Esc to close, Ctrl/Cmd+S to open
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowConfirm(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (canSave) setShowConfirm(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [canSave]);

  // load initial tab when parent data ready
  useEffect(() => {
    if (!isLoading) void loadSection(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Wrapper change → mark dirty (guards inputs only; still keep per-form emit)
  const handleWrapperChange: React.FormEventHandler<HTMLDivElement> = useCallback((e) => {
    if (activeTab === "training") return; // training dirty comes from child
    const t = e.target as HTMLElement;
    if (
      t instanceof HTMLInputElement ||
      t instanceof HTMLSelectElement ||
      t instanceof HTMLTextAreaElement
    ) {
      setSections((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], dirty: true },
      }));
    }
  }, [activeTab]);

  // ------------------------ Save helpers ------------------------

  const applyLocalPatch = useCallback((patch: Record<string, any>) => {
    // shallow-merge is fine because patch only includes changed leaf fields
    // (if you ever include nested objects like emergency_contact, you're already
    // emitting the full object, so shallow merge still works).
    setEmployeeDetails(prev => ({ ...(prev || {}), ...patch }));
  }, []);


  const savePersonalTab = useCallback(async () => {
    const payload = personalPatchRef.current || {};
    const res = await savePersonal(payload);
    if (!res.ok) throw res.error;

    applyLocalPatch(payload)
    personalPatchRef.current = {};
    await refetch();

    return res;
  }, [savePersonal, refetch]);

  const saveEmploymentTab = useCallback(async () => {
    const payload = employmentPatchRef.current;
    const res = await saveEmployment(payload);
    if (!res.ok) throw res.error;

    applyLocalPatch(payload)
    employmentPatchRef.current = {}; // clear after success
    await refetch();

    return res;
  }, [saveEmployment, refetch]);

  const saveTrainingTab = useCallback(async () => {
    const collect = trainingCollectorRef.current;
    if (!collect) return { ok: true }; // nothing registered; no-op

    const { creates, updates, deletes, hasErrors } = collect();
    if (hasErrors) throw new Error("Please fix validation errors before saving.");

    // Run creates → updates → deletes
    for (const c of creates) {
      await createTraining(params.id, {
        training_title: c.training_title,
        date_completed: c.date_completed,
        training_provider: c.training_provider,
        proof_of_completion: c.proof_of_completion || null,
      });
    }
    for (const u of updates) {
      await updateTraining(params.id, u.id, {
        training_title: u.training_title,
        date_completed: u.date_completed,
        training_provider: u.training_provider,
        ...(u.proof_of_completion !== undefined ? { proof_of_completion: u.proof_of_completion } : {}),
        clear_file: !!u.clear_file,
      });
    }
    for (const id of deletes) {
      await deleteTraining(params.id, id);
    }

    // On success, tell the form to refetch its list and refresh employee details
    setTrainingRefreshKey((k) => k + 1);
    await refetch();

    return { ok: true };
  }, [createTraining, updateTraining, deleteTraining, params.id, refetch]);

  const saveCurrentSection = useCallback(async () => {
    const key = activeTab;
    const s = sections[key];
    if (!s) return;
    if (!s.dirty) {
      setShowConfirm(false);
      return;
    }

    setConfirmBusy(true);
    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], saving: true },
    }));

    const savePromise = (async () => {
      if (key === "personal") {
        await savePersonalTab();
      } else if (key === "employment") {
        await saveEmploymentTab();
      } else if (key === "training") {
        await saveTrainingTab();
      } else {
        // fallback demo save for other tabs
        await new Promise<void>((r) => setTimeout(r, 800));
        // Not calling refetch here because there’s no actual API change
      }

      setSections((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          saving: false,
          dirty: false,
          savedAt: Date.now(),
        },
      }));
    })();

    const ok = await notify.promise(savePromise, {
      success: `${labelForTab(key)} saved successfully.`,
      error: `Failed to save ${labelForTab(key)}.`,
    });

    setConfirmBusy(false);
    if (ok) setShowConfirm(false);
    else
      setSections((prev) => ({
        ...prev,
        [key]: { ...prev[key], saving: false },
      }));
  }, [activeTab, sections, savePersonalTab, saveEmploymentTab, saveTrainingTab]);

  // ------------------------ Tab click ------------------------
  const handleTabClick = useCallback(
    (key: TabKey) => {
      if (key === activeTab) return;
      const curDirty = sections[activeTab]?.dirty;
      if (curDirty) {
        setPendingTab(key);
        setShowLeaveConfirm(true);
        return;
      }
      setActiveTab(key);
      void loadSection(key);
    },
    [activeTab, sections, loadSection]
  );

  // helper to mark errors for a section (stable)
  const markSectionErrors = useCallback((key: TabKey, hasErrors: boolean) => {
    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], hasErrors },
    }));
  }, []);

  // --------- STABLE callbacks passed to TrainingDevelopmentForm ----------
  const handleTrainingDirtyChange = useCallback((dirty: boolean) => {
    setSections((prev) => ({
      ...prev,
      training: { ...prev.training, dirty },
    }));
  }, []);

  const handleTrainingErrorsChange = useCallback(
    (hasErrors: boolean) => markSectionErrors("training", hasErrors),
    [markSectionErrors]
  );

  const setTrainingCollector = useCallback(
    (fn: (() => TrainingChangeSet) | null) => {
      trainingCollectorRef.current = fn ?? null;
    },
    []
  );

  // ------------------------ Render ------------------------
  const renderActiveForm = () => {
    const s = sections[activeTab];
    if (!s || s.loading || !s.loaded) {
      return (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-10 w-full rounded-md bg-gray-200" />
            ))}
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "personal":
        return (
          <PersonalInfoForm
            key={`personal-${resetKey.personal}`}
            emp={employeeDetails}
            onPatchChange={(patch) => {
              Object.assign(personalPatchRef.current, patch);
              setSections((p) => ({ ...p, personal: { ...p.personal, dirty: true } }));
            }}
            onErrorsChange={(hasErrors) => markSectionErrors("personal", hasErrors)}
          />
        );

      case "employment":
        return (
          <EmploymentDetailsForm
            key={`employment-${resetKey.employment}`}
            emp={employeeDetails}
            onPatchChange={(patch) => {
              Object.assign(employmentPatchRef.current, patch);
              setSections((p) => ({ ...p, employment: { ...p.employment, dirty: true } }));
            }}
            onErrorsChange={(hasErrors) => markSectionErrors("employment", hasErrors)}
          />
        );

      case "training":
        return (
          <TrainingDevelopmentForm
            key={`training-${resetKey.training}`}
            employeeId={employeeDetails?.id as number | string}
            onErrorsChange={handleTrainingErrorsChange}   // ✅ stable
            onDirtyChange={handleTrainingDirtyChange}     // ✅ stable
            registerCollector={setTrainingCollector}      // ✅ stable
            refreshKey={trainingRefreshKey}
          />
        );

      case "disciplinary":
        return <DisciplinaryRecordsForm emp={employeeDetails} />;

      case "performance":
        return <PerformanceEvaluationForm emp={employeeDetails} />;

      case "benefits":
        return <BenefitsComplianceForm emp={employeeDetails} />;

      case "documents":
        return <DocumentRepositoryForm emp={employeeDetails} />;

      default:
        return null;
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top bar + Save */}
        <div className="flex items-center justify-between gap-4 py-4">
          <a
            href="/manage/employee-201-records"
            onClick={(e) => {
              e.preventDefault();
              attemptNavigate("/manage/employee-201-records");
            }}
            className="inline-flex items-center gap-3 rounded-md px-2 py-1 hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-gray-700">
              Manage | Employee 201 Records
              <span className="text-gray-400"> | </span>
              <span className="font-semibold text-indigo-dye">
                {isLoading ? "Loading…" : employee.name}
              </span>
            </h4>
          </a>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={!canSave}
          className="rounded-md bg-[#355fd0] px-5 py-2 text-sm font-semibold text-white hover:bg-[#355fd0]/90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        </div>

        <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2">
          {isLoading ? (
            <EmployeeHeaderSkeleton />
          ) : (
            <EmployeeHeader
              employee={{
                ...toDisplayEmployee(data, emp),
                name: toDisplayEmployee(data, emp).name ?? "",
                role: toDisplayEmployee(data, emp).role ?? "",
                email: toDisplayEmployee(data, emp).email ?? "",
              }}
              activeTab={activeTab}
              setActiveTab={handleTabClick}
              empPartial={employeeDetails}
              locked={!hasActiveSubscription}
            />
          )}
        </div>

        {/* DYNAMIC FORM */}
        <div className="mt-6 mb-24 space-y-8" onChange={handleWrapperChange}>
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 w-full rounded-md bg-gray-200" />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 w-full rounded-md bg-gray-200" />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 w-full rounded-md bg-gray-200" />
                ))}
              </div>
            </div>
          ) : (
            renderActiveForm()
          )}
        </div>
      </div>

      {/* Confirm saving current section */}
      {showConfirm && (
        <ConfirmModal
          title="Save changes?"
          message="Are you sure you want to save this section’s changes?"
          onCancel={() => {
            if (!confirmBusy) setShowConfirm(false);
          }}
          onConfirm={() => {
            if (!confirmBusy) void saveCurrentSection();
          }}
          busy={confirmBusy}
        />
      )}

      {/* Leave confirmation for tab switches or route navigation */}
      {showLeaveConfirm && (
        <LeaveConfirmModal
          onCancel={() => {
            setShowLeaveConfirm(false);
            setPendingHref(null);
            setPendingTab(null);
          }}
          onDiscard={() => {
            setSections((prev) => ({
              ...prev,
              [activeTab]: { ...prev[activeTab], dirty: false },
            }));
            setShowLeaveConfirm(false);
            if (activeTab === "personal") {
              personalPatchRef.current = {};
              setResetKey((k) => ({ ...k, personal: k.personal + 1 }));
            } else if (activeTab === "employment") {
              employmentPatchRef.current = {};
              setResetKey((k) => ({ ...k, employment: k.employment + 1 }));
            } else if (activeTab === "training") {
              // reset the child form UI
              setTrainingRefreshKey((k) => k + 1);
              setResetKey((k) => ({ ...k, training: k.training + 1 }));
            }
            proceedAfterLeave();
          }}
          onSaveAndLeave={async () => {
            const key = activeTab;
            const s = sections[key];
            if (!s?.dirty) {
              setShowLeaveConfirm(false);
              proceedAfterLeave();
              return;
            }
            setSections((prev) => ({
              ...prev,
              [key]: { ...prev[key], saving: true },
            }));

            const leavePromise = (async () => {
              // keep modal flow light for non-main save actions
              await new Promise<void>((r) => setTimeout(r, 800));
              setSections((prev) => ({
                ...prev,
                [key]: {
                  ...prev[key],
                  saving: false,
                  dirty: false,
                  savedAt: Date.now(),
                },
              }));
            })();

            const ok = await notify.promise(leavePromise, {
              loading: `Saving ${labelForTab(key)}…`,
              success: `${labelForTab(key)} saved.`,
              error: `Failed to save ${labelForTab(key)}.`,
            });

            setShowLeaveConfirm(false);
            if (ok) proceedAfterLeave();
            else
              setSections((prev) => ({
                ...prev,
                [key]: { ...prev[key], saving: false },
              }));
          }}
        />
      )}
    </>
  );
}
