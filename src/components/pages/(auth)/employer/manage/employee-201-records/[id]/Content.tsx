"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from '@tanstack/react-query';

import { SmartButton } from '@/components/SmartPermissions/SmartButton';

import type { Employee } from "@/types/employee-201-records/employee";
import type { TrainingChangeSet } from "./components/TrainingDevelopmentForm";

import { useEmployee } from "./hooks/useEmployee";
import { toDisplayEmployee } from "./utils/toDisplayEmployee";

import EmployeeHeaderSkeleton from "./components/EmployeeHeaderSkeleton";
import EmployeeHeader, { TabKey } from "./components/EmployeeHeader";
import ConfirmModal from "./modals/ConfirmModal";
import LeaveConfirmModal from "./modals/LeaveConfirmModal";
import UpdatePhotoModal from "./modals/UpdatePhotoModal";

import PersonalInfoForm from "./components/PersonalInfoForm";
import EmploymentDetailsForm from "./components/EmploymentDetailsForm";
import TrainingDevelopmentForm from "./components/TrainingDevelopmentForm";
import DisciplinaryRecordsForm from "./components/DisciplinaryRecordsForm";
import PerformanceEvaluationForm from "./components/PerformanceEvaluationForm";
import BenefitsComplianceForm from "./components/BenefitsComplianceForm";
import DocumentRepositoryForm from "./components/DocumentRepositoryForm";

import { notify } from "./utils/notify";
import { labelForTab } from "./utils/labelForTab";
import { useSectionLoader } from "./hooks/useSectionLoader";
import { SectionMap, sectionOrder } from "./types/section";

import { usePersonalDetailsPatch } from "./hooks/usePersonalDetailsPatch";
import { useEmploymentDetailsPatch } from "./hooks/useEmploymentDetailsPatch";

import { useCreateTrainingRecord } from "./hooks/useCreateTrainingRecord";
import { usePatchTrainingRecord } from "./hooks/usePatchTrainingRecord";
import { useDeleteTrainingRecord } from "./hooks/useDeleteTrainingRecord";
import { useEmployeePhotoPatch } from "./hooks/useEmployeePhotoPatch";
import useUpdateEmployeeToYP from "@/components/hooks/useUpdateEmployeeToYP";

export interface ContentProps {
  params: { id: string };
  emp?: Partial<Employee>;
  hasActiveSubscription: boolean;
  loginType: string;
}

export default function Employee201Content({
  params,
  emp,
  hasActiveSubscription,
  loginType,
}: ContentProps) {
  const router = useRouter();

  // ------------------------ State ------------------------
  const TABS_REQUIRE_EDIT: TabKey[] = ["personal", "employment"];
  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [pendingTab, setPendingTab] = useState<TabKey | null>(null);
  const [leaveMessage, setLeaveMessage] = useState<string>("");

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

  const [editMode, setEditMode] = useState<{
    personal: boolean;
    employment: boolean;
  }>({
    personal: false,
    employment: false,
  });

  // helpers
  const requiresEdit = TABS_REQUIRE_EDIT.includes(activeTab);
  const isEditingTab =
    activeTab === "personal"
      ? editMode.personal
      : activeTab === "employment"
      ? editMode.employment
      : false;
  // ------------------------ Data hooks ------------------------
  const { data, isLoading, refetch } = useEmployee(params?.id);
  const employee = toDisplayEmployee(data, emp);
  const [employeeDetails, setEmployeeDetails] = useState<
    Partial<Employee> | undefined
  >(data ?? emp);

  // PATCH hooks (sim mode by default; configure when backend is ready)
  const { save: savePersonal } = usePersonalDetailsPatch(params?.id);
  const { save: saveEmployment } = useEmploymentDetailsPatch(params?.id);

  // Training hooks (actual API calls from parent on save)
  const { create: createTraining } = useCreateTrainingRecord();
  const { update: updateTraining } = usePatchTrainingRecord();
  const { remove: deleteTraining } = useDeleteTrainingRecord();

  // Section loader with race guard
  const { loadSection } = useSectionLoader(setSections);

  // --- Photo modal & preview state (parent-owned) ---
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  // Keep a local preview URL so UI updates immediately after Update.
  // We sync it anytime the server value changes.
  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | null>(
    employee?.photo ?? null
  );
  useEffect(() => {
    setLocalPhotoUrl(employee?.photo ?? null);
  }, [employee?.photo]);

  // Use the hook you already have
  const {
    isSaving: isUploading,
    upload,
    remove,
  } = useEmployeePhotoPatch(params?.id);

  // Confirm = upload selected file
  const handleConfirmPhoto = useCallback(
    async (file: File) => {
      const ok = await notify.promise(upload(file), {
        success: "Profile photo updated successfully.",
        error: "Failed to update profile photo.",
      });
      if (ok) {
        // optimistic UI, then refresh real URL
        const blobUrl = URL.createObjectURL(file);
        setLocalPhotoUrl((prev) => {
          if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
          return blobUrl;
        });
        await refetch();
      }
      setPhotoModalOpen(false);
    },
    [upload, refetch]
  );

  // Remove = delete on server
  const handleRemovePhoto = useCallback(async () => {
    const ok = await notify.promise(remove(), {
      success: "Profile photo removed.",
      error: "Failed to remove profile photo.",
    });
    if (ok) {
      if (localPhotoUrl && localPhotoUrl.startsWith("blob:"))
        URL.revokeObjectURL(localPhotoUrl);
      setLocalPhotoUrl(null);
      await refetch();
    }
    setPhotoModalOpen(false);
  }, [remove, localPhotoUrl, refetch]);

  // with your notify helper:
  const onPhotoSelect = (file: File) =>
    notify.promise(upload(file), {
      success: "Profile photo updated successfully.",
      error: "Failed to update profile photo.",
    });

  // for removal:
  const onRemovePhoto = () =>
    notify.promise(remove(), {
      success: "Profile photo removed.",
      error: "Failed to remove profile photo.",
    });

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

  const buildLeaveMessage = useCallback(() => {
    const tabLabel = labelForTab(activeTab);
    if (isEditingTab && !isDirty) {
      return `You are currently in Edit mode for ${tabLabel}. What would you like to do?`;
    }
    // default when there are unsaved edits
    return `You have unsaved changes in ${tabLabel}. What would you like to do?`;
  }, [activeTab, isEditingTab, isDirty]);

  const attemptNavigate = useCallback(
    (href: string | "back") => {
      if (isDirty || isEditingTab) {
        setPendingHref(href);
        setLeaveMessage(buildLeaveMessage());
        setShowLeaveConfirm(true);
      } else {
        href === "back" ? router.back() : router.push(href);
      }
    },
    [isDirty, isEditingTab, router, buildLeaveMessage]
  );

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
    console.log("employeeDetails", data);
  }, [data, emp]);

  // warn on unload when dirty
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty && !isEditingTab) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [isDirty, isEditingTab]);

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
  const handleWrapperChange: React.FormEventHandler<HTMLDivElement> =
    useCallback(
      (e) => {
        if (activeTab === "training") return; // training dirty comes from child
        const t = e.target as HTMLElement;

        if (t.closest('[role="dialog"], [data-no-dirty]')) return;

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
      },
      [activeTab]
    );

  // ------------------------ Save helpers ------------------------

  const applyLocalPatch = useCallback((patch: Record<string, any>) => {
    // shallow-merge is fine because patch only includes changed leaf fields
    // (if you ever include nested objects like emergency_contact, you're already
    // emitting the full object, so shallow merge still works).
    setEmployeeDetails((prev) => ({ ...(prev || {}), ...patch }));
  }, []);

  const savePersonalTab = useCallback(async () => {
    const payload = personalPatchRef.current || {};
    const res = await savePersonal(payload);
    if (!res.ok) throw res.error;

    applyLocalPatch(payload);
    personalPatchRef.current = {};
    await refetch();

    return res;
  }, [savePersonal, refetch]);

  const saveEmploymentTab = useCallback(async () => {
    const payload = employmentPatchRef.current;
    const res = await saveEmployment(payload);
    if (!res.ok) throw res.error;

    applyLocalPatch(payload);
    employmentPatchRef.current = {}; // clear after success
    await refetch();

    return res;
  }, [saveEmployment, refetch]);

  const saveTrainingTab = useCallback(async () => {
    const collect = trainingCollectorRef.current;
    if (!collect) return { ok: true }; // nothing registered; no-op

    const { creates, updates, deletes, hasErrors } = collect();
    if (hasErrors)
      throw new Error("Please fix validation errors before saving.");

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
        ...(u.proof_of_completion !== undefined
          ? { proof_of_completion: u.proof_of_completion }
          : {}),
        clear_file: !!u.clear_file,
      });
    }
    for (const id of deletes) {
      await deleteTraining(params.id, id);
    }

    // On success, tell the form to refetch its list
    setTrainingRefreshKey((k) => k + 1);

    return { ok: true };
  }, [createTraining, updateTraining, deleteTraining, params.id]);

  // Helper function to extract user-friendly error messages
  const extractErrorMessage = useCallback((error: Error): string => {
    const errorMessage = error.message || "";
    
    // Handle Django field format errors (e.g., "Tin: TIN already registered...")
    if (errorMessage.includes(': ')) {
      const parts = errorMessage.split(': ');
      if (parts.length > 1) {
        const fieldName = parts[0].toLowerCase();
        const message = parts.slice(1).join(': ');
        
        // Check if this is a government ID validation error
        if (message.includes('TIN') || message.includes('SSS') || 
            message.includes('PAGIBIG') || message.includes('PhilHealth') ||
            fieldName === 'tin' || fieldName === 'sss' || 
            fieldName === 'pagibig' || fieldName === 'philhealth') {
          return message; // Return just the message without field prefix
        }
      }
    }
    
    // Direct check for government ID errors (fallback)
    if (errorMessage.includes('TIN') || 
        errorMessage.includes('SSS') || 
        errorMessage.includes('PAGIBIG') || 
        errorMessage.includes('PhilHealth')) {
      return errorMessage;
    }
    
    try {
      // Try to parse as JSON in case it's a stringified object
      const parsedError = JSON.parse(errorMessage);
      
      // Handle Django serializer validation errors
      if (typeof parsedError === 'object' && parsedError !== null) {
        const errors: string[] = [];
        
        // Extract specific field validation errors
        for (const [field, fieldErrors] of Object.entries(parsedError)) {
          if (Array.isArray(fieldErrors)) {
            errors.push(...fieldErrors);
          } else if (typeof fieldErrors === 'string') {
            errors.push(fieldErrors);
          }
        }
        
        if (errors.length > 0) {
          return errors.join(' ');
        }
      }
    } catch {
      // Not JSON, continue with fallback
    }
    
    // Fallback to original message or generic error
    return errorMessage || `Failed to save ${labelForTab(activeTab)}.`;
  }, [activeTab]);

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
  
    try {
      if (key === "personal") {
        await savePersonalTab();
      } else if (key === "employment") {
        await saveEmploymentTab();
      } else if (key === "training") {
        await saveTrainingTab();
      } else {
        // fallback demo save for other tabs
        await new Promise<void>((r) => setTimeout(r, 800));
        // Not calling refetch here because there's no actual API change
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

      // Success notification
      notify.success(`${labelForTab(key)} saved successfully.`);
      
      setConfirmBusy(false);
      if (activeTab === "personal")
        setEditMode((m) => ({ ...m, personal: false }));
      if (activeTab === "employment")
        setEditMode((m) => ({ ...m, employment: false }));
      setShowConfirm(false);

    } catch (error: any) {
      // Extract and show specific error message
      const errorMessage = extractErrorMessage(error);
      notify.error(errorMessage);
      
      setSections((prev) => ({
        ...prev,
        [key]: { ...prev[key], saving: false },
      }));
      setConfirmBusy(false);
    }
  }, [
    activeTab,
    sections,
    savePersonalTab,
    saveEmploymentTab,
    saveTrainingTab,
    extractErrorMessage,
  ]);

  // ------------------------ Tab click ------------------------
  const handleTabClick = useCallback(
    (key: TabKey) => {
      if (key === activeTab) return;
      if (isDirty || isEditingTab) {
        setPendingTab(key);
        setLeaveMessage(buildLeaveMessage());
        setShowLeaveConfirm(true);
        return;
      }
      setActiveTab(key);
      void loadSection(key);
    },
    [activeTab, isDirty, isEditingTab, loadSection, buildLeaveMessage]
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
  
  const { mutate: updateEmployeeToYP, isLoading: isUpdating } = useUpdateEmployeeToYP();

  const syncToYP = useCallback(() => {
    updateEmployeeToYP(
      {
        id: employeeDetails?.id as unknown as string,
        data: {
          first_name: employeeDetails?.firstname,
          last_name: employeeDetails?.lastname,
          middle_name: employeeDetails?.middlename,
          mobile: employeeDetails?.mobile,
          email: employeeDetails?.email,
          tin: employeeDetails?.tin,
          sss: employeeDetails?.sss,
          pagibig: employeeDetails?.pagibig,
          philhealth: employeeDetails?.philhealth,
          emergency_contact: employeeDetails?.emergency_contact,
          emergency_contact_name: employeeDetails?.emergency_contact?.name,
          emergency_contact_number: employeeDetails?.emergency_contact?.contact_number,
          gender: employeeDetails?.gender,
          birthdate: employeeDetails?.birthdate,
          system_id: employeeDetails?.system_id,
          location: employeeDetails?.location,
          position: employeeDetails?.position,
          department: employeeDetails?.department,
          employment_status: employeeDetails?.employment_status,
          address: employeeDetails?.address,
        },
      },
      {
        onSuccess: () => {
          notify.success("Employee synced to YP successfully.");
        },
        onError: (error: any) => {
          notify.error(error?.message || "Failed to sync employee to YP.");
        },
      }
    );
    console.log("syncToYP", employeeDetails);
  }, [updateEmployeeToYP, employeeDetails]);

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
            editing={editMode.personal}
            onPatchChange={(patch) => {
              Object.assign(personalPatchRef.current, patch);
              setSections((p) => ({
                ...p,
                personal: { ...p.personal, dirty: true },
              }));
            }}
            onErrorsChange={(hasErrors) =>
              markSectionErrors("personal", hasErrors)
            }
          />
        );

      case "employment":
        return (
          <EmploymentDetailsForm
            key={`employment-${resetKey.employment}`}
            emp={employeeDetails}
            editing={editMode.employment}
            onPatchChange={(patch) => {
              Object.assign(employmentPatchRef.current, patch);
              setSections((p) => ({
                ...p,
                employment: { ...p.employment, dirty: true },
              }));
            }}
            onErrorsChange={(hasErrors) =>
              markSectionErrors("employment", hasErrors)
            }
            refetch={refetch}
          />
        );

      case "training":
        return (
          <TrainingDevelopmentForm
            key={`training-${resetKey.training}`}
            employeeId={employeeDetails?.id as number | string}
            onErrorsChange={handleTrainingErrorsChange}
            onDirtyChange={handleTrainingDirtyChange}
            registerCollector={setTrainingCollector}
            refreshKey={trainingRefreshKey}
          />
        );

      case "disciplinary":
        return <DisciplinaryRecordsForm employeeId={params?.id} />;

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
            data-testid="back-link"
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
          <div className="flex items-center gap-2">
            <SmartButton
              id="edit-employee-201-btn"
              data-testid="save-btn"
              onClick={() => {
                if (requiresEdit && !isEditingTab) {
                  // EDIT: enable fields
                  setEditMode((m) => ({ ...m, [activeTab]: true }));
                  return;
                }
                // SAVE: open confirm modal (do NOT save immediately)
                setShowConfirm(true);
              }}
              disabled={
                requiresEdit
                  ? (isEditingTab ? !canSave : false)   // Edit is always enabled; Save requires valid+dirty
                  : !canSave                            // other tabs: Save only when valid+dirty
              }
              className="rounded-md bg-[#22c55e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#22c55e]/90 disabled:opacity-50"
            >
              {requiresEdit
                ? (isEditingTab ? (saving ? "Saving…" : "Save") : "Edit")
                : (saving ? "Saving…" : "Save")}
            </SmartButton>
            {['yahshua-payroll', 'yg-payroll'].includes(loginType) && (
            <button
              id="sync-to-yp-btn"
              disabled={isUpdating}
              onClick={() => {
                syncToYP();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isUpdating && (
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
              )}
              <span>Sync to YP</span>
            </button>
            )}
          </div>
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
              onOpenPhotoModal={() => setPhotoModalOpen(true)}
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
          message={leaveMessage}
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
              setEditMode((m) => ({ ...m, personal: false }));
            } else if (activeTab === "employment") {
              employmentPatchRef.current = {};
              setResetKey((k) => ({ ...k, employment: k.employment + 1 }));
              setEditMode((m) => ({ ...m, employment: false }));
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

      {photoModalOpen && (
        <UpdatePhotoModal
          open={photoModalOpen}
          onOpenChange={setPhotoModalOpen}
          currentPhotoUrl={localPhotoUrl}
          onConfirm={handleConfirmPhoto} // called when user clicks Update with a file
          onRemove={handleRemovePhoto} // called when user clicks Update with removal staged
          isProcessing={isUploading}
        />
      )}
    </>
  );
}
