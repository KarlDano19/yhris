"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { Employee } from "@/types/employee-201-records/employee";
import { useEmployee } from "./hooks/useEmployee"; // adjust if your hook path differs
import { toDisplayEmployee } from "./utils/toDisplayEmployee";
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

// ✅ Toasts
import toast from "react-hot-toast";

export interface ContentProps {
  params: { id: string };
  emp?: Partial<Employee>;
  hasActiveSubscription: boolean;
}

type SectionState = {
  loaded: boolean;
  loading: boolean;
  dirty: boolean;
  saving: boolean;
  savedAt?: number;
};

type SectionMap = Record<TabKey, SectionState>;

const sectionOrder: TabKey[] = [
  "personal",
  "employment",
  "training",
  "disciplinary",
  "performance",
  "benefits",
  "documents",
];

export default function Employee201Content({
  params,
  emp,
  hasActiveSubscription,
}: ContentProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmBusy, setConfirmBusy] = useState(false); // 🔄 modal loading state
  const router = useRouter();
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [pendingTab, setPendingTab] = useState<TabKey | null>(null);

  // initialize per-section state
  const [sections, setSections] = useState<SectionMap>(() =>
    sectionOrder.reduce((acc, key) => {
      acc[key] = { loaded: false, loading: false, dirty: false, saving: false };
      return acc;
    }, {} as SectionMap)
  );

  // global dirty = any section dirty
  const isDirty = useMemo(
    () => Object.values(sections).some((s) => s.dirty),
    [sections]
  );

  function attemptNavigate(href: string | "back") {
    if (isDirty) {
      setPendingHref(href);
      setShowLeaveConfirm(true);
    } else {
      href === "back" ? router.back() : router.push(href);
    }
  }

  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [isDirty]);

  const { data, isLoading } = useEmployee(params?.id);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowConfirm(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const employee = toDisplayEmployee(data, emp);
  const employeeDetails: Partial<Employee> | undefined = data ?? emp;

  // --- Mock API layer ---
  const mockFetchSection = (key: TabKey) =>
    new Promise<void>((resolve) =>
      setTimeout(resolve, 600 + Math.random() * 600)
    );
  const mockSaveSection = (key: TabKey) =>
    new Promise<void>((resolve, reject) =>
      setTimeout(() => {
        // flip a coin to demonstrate error toast occasionally (optional)
        // Math.random() < 0.9 ? resolve() : reject(new Error("Network error"));
        resolve();
      }, 700 + Math.random() * 800)
    );

  // Load the initial tab once parent data loaded
  useEffect(() => {
    if (!isLoading) {
      loadSection(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  async function loadSection(key: TabKey) {
    setSections((prev) => {
      const s = prev[key];
      if (!s || s.loaded || s.loading) return prev;
      return { ...prev, [key]: { ...s, loading: true } };
    });
    await mockFetchSection(key);
    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], loading: false, loaded: true },
    }));
  }

  // 🔄 Save current section with toast loading + modal busy state
  async function saveCurrentSection() {
    const key = activeTab;
    const s = sections[key];
    if (!s) return;

    // nothing to save — just close the modal
    if (!s.dirty) {
      setShowConfirm(false);
      return;
    }

    setConfirmBusy(true);
    setSections((prev) => ({ ...prev, [key]: { ...prev[key], saving: true } }));

    const savePromise = (async () => {
      await mockSaveSection(key);
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

    await toast.promise(savePromise, {
      loading: `Saving ${labelForTab(key)}…`,
      success: `${labelForTab(key)} saved successfully!`,
      error: `Failed to save ${labelForTab(key)}.`,
    });

    setConfirmBusy(false);
    setShowConfirm(false); // stay on the same tab
  }

  // Tab click: block if current tab is dirty; otherwise load on demand
  const handleTabClick = (key: TabKey) => {
    if (key === activeTab) return;
    const curDirty = sections[activeTab]?.dirty;

    if (curDirty) {
      setPendingTab(key);
      setShowLeaveConfirm(true);
      return;
    }

    setActiveTab(key);
    void loadSection(key);
  };

  // Per-section change tracking: current section only
  const onSectionChange = () => {
    setSections((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], dirty: true },
    }));
  };

  const renderActiveForm = () => {
    const s = sections[activeTab];
    if (!s || s.loading || !s.loaded) {
      // lightweight skeleton while the section loads
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
        return <PersonalInfoForm emp={employeeDetails} />;
      case "employment":
        return <EmploymentDetailsForm emp={employeeDetails} />;
      case "training":
        return <TrainingDevelopmentForm emp={employeeDetails} />;
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

  const saving = sections[activeTab]?.saving;

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
            disabled={
              isLoading ||
              sections[activeTab]?.loading ||
              sections[activeTab]?.saving
            }
            className="rounded-md bg-[#355fd0] px-5 py-2 text-sm font-semibold text-white hover:bg-[#355fd0]/90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2">
          {isLoading ? (
            <EmployeeHeaderSkeleton />
          ) : (
            <EmployeeHeader
              employee={employee}
              activeTab={activeTab}
              setActiveTab={handleTabClick}
            />
          )}
        </div>

        {/* DYNAMIC FORM */}
        <div className="mt-6 mb-24 space-y-8" onChange={onSectionChange}>
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
          // 🆕 Pass busy flag so the modal can show a spinner & disable buttons
          // Make sure your ConfirmModal accepts `busy?: boolean`
          busy={confirmBusy as any}
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
            // Discard only CURRENT section changes
            setSections((prev) => ({
              ...prev,
              [activeTab]: { ...prev[activeTab], dirty: false },
            }));
            setShowLeaveConfirm(false);

            toast("Discarded changes.", { icon: "⚠️" });

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
          }}
          onSaveAndLeave={async () => {
            // Save current section only, then proceed
            const key = activeTab;
            const s = sections[key];

            if (!s?.dirty) {
              setShowLeaveConfirm(false);
              if (pendingTab) {
                setActiveTab(pendingTab);
                void loadSection(pendingTab);
                setPendingTab(null);
                return;
              }
              if (pendingHref) {
                pendingHref === "back"
                  ? router.back()
                  : router.push(pendingHref);
                setPendingHref(null);
              }
              return;
            }

            setSections((prev) => ({
              ...prev,
              [key]: { ...prev[key], saving: true },
            }));

            const leavePromise = (async () => {
              await mockSaveSection(key);
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

            await toast.promise(leavePromise, {
              loading: `Saving ${labelForTab(key)}…`,
              success: `${labelForTab(key)} saved.`,
              error: `Failed to save ${labelForTab(key)}.`,
            });

            setShowLeaveConfirm(false);

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
          }}
        />
      )}
    </>
  );
}

/** Helper: human-readable tab labels for toasts */
function labelForTab(key: TabKey) {
  switch (key) {
    case "personal":
      return "Personal Information";
    case "employment":
      return "Employment Details";
    case "training":
      return "Training & Development";
    case "disciplinary":
      return "Disciplinary Records";
    case "performance":
      return "Performance & Evaluation";
    case "benefits":
      return "Benefits & Compliance";
    case "documents":
      return "Document Repository";
    default:
      return key;
  }
}
