'use client';

import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { formatDistanceToNow } from 'date-fns';

import {
  PencilSquareIcon,
  TrashIcon,
  ClockIcon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

import BackButton from '@/components/BackButton';
import CustomToast from '@/components/CustomToast';
import LoadingSpinner from '@/components/LoadingSpinner';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';

import useGetPolicyHandbook from './hooks/useGetPolicyHandbook';
import { useUpdatePolicyHandbook } from './hooks/useUpdatePolicyHandbook';
import { useDeletePolicySection } from './hooks/useDeletePolicySection';
import { useCopyPolicyHandbookForLLM } from './hooks/useCopyPolicyHandbookForLLM';
import { useSyncPolicyHandbookFromHris } from './hooks/useSyncPolicyHandbookFromHris';
import { useExportPolicyHandbookPDF } from './hooks/useExportPolicyHandbookPDF';
import useGetOrgStructureForHandbook from './hooks/useGetOrgStructureForHandbook';
import SectionModal from './modals/SectionModal';
import VersionHistoryModal from './modals/VersionHistoryModal';
import OrgStructureDiagram from './components/OrgStructureDiagram';

import { PolicyHandbookSectionData } from '@/types/policyHandbook';

const CATEGORY_LABELS: Record<string, string> = {
  pay_schedule: 'Pay Schedule',
  rate_calculation: 'Rate Calculation',
  overtime_rules: 'Premium & Overtime Rules',
  night_differential: 'Night Differential',
  timekeeping: 'Timekeeping Rules',
  geotagging_geofencing: 'Geotagging & Geofencing',
  government_contributions: 'Government Contributions',
  tax_settings: 'Withholding Tax',
  de_minimis_benefits: 'De Minimis Benefits',
  thirteenth_month_pay: '13th Month Pay',
  payslip_components: 'Payslip Components',
  custom: 'Custom Formulas',
  approval_workflow: 'Approval Workflows',
  roles_permissions: 'Roles & Permissions',
  employee_id_format: 'Employee ID Format',
  onboarding_checklist: 'Onboarding Checklist',
  company_directives: 'Create Memo/Policy',
  designed_benefits: 'Designed Benefits',
  safety_health_policy: 'Safety & Health Policy',
  evaluation_templates: 'Evaluation Templates',
  company_surveys: 'Surveys & Forms',
  org_structure: 'Org Structure',
  job_posting: 'Post a Job',
  screen_applicant: 'Screen Applicants',
  offboarding: 'Offboarding',
  employee_201: 'Employee 201',
  employee_list: 'Employee List',
  dole_ec_logbook: 'Employee Compensation Logbook',
  dole_work_accident_illness: 'Work Accident/Illness Report',
  dole_work_environment: 'Work Environment Measurement',
  dole_awair: 'Annual WAIR Data Report',
  dole_health_safety_org: 'Health & Safety Org Report',
  dole_shc_minutes: 'SHC Minutes of Meetings',
  dole_annual_medical: 'Annual Medical Report',
};

// Groups the sidebar by theme - order here is the sidebar's display order
const CATEGORY_GROUPS: { key: string; label: string; categories: string[] }[] = [
  {
    key: 'payroll_compensation',
    label: 'Payroll & Compensation',
    categories: [
      'pay_schedule',
      'rate_calculation',
      'overtime_rules',
      'night_differential',
      'timekeeping',
      'geotagging_geofencing',
      'government_contributions',
      'tax_settings',
      'de_minimis_benefits',
      'thirteenth_month_pay',
      'payslip_components',
      'custom',
    ],
  },
  {
    key: 'administration_access',
    label: 'Administration & Access',
    categories: ['approval_workflow', 'roles_permissions', 'employee_id_format'],
  },
  {
    key: 'hr_people_management',
    label: 'HR & People Management',
    categories: [
      'onboarding_checklist',
      'company_directives',
      'designed_benefits',
      'safety_health_policy',
      'evaluation_templates',
      'company_surveys',
      'org_structure',
      'job_posting',
      'screen_applicant',
      'offboarding',
      'employee_201',
      'employee_list',
    ],
  },
  {
    key: 'dole_compliance',
    label: 'DOLE Compliance',
    categories: [
      'dole_ec_logbook',
      'dole_work_accident_illness',
      'dole_work_environment',
      'dole_awair',
      'dole_health_safety_org',
      'dole_shc_minutes',
      'dole_annual_medical',
    ],
  },
];

// Strips HTML tags so search can match against a section's actual readable content, not markup
const stripHtml = (html: string): string => html.replace(/<[^>]+>/g, ' ');

const Content = () => {
  const { data: handbook, isLoading } = useGetPolicyHandbook();
  const { mutate: updateHandbook } = useUpdatePolicyHandbook();
  const { mutate: deleteSection, isLoading: isDeleting } = useDeletePolicySection();
  const { mutate: exportForLLM, isLoading: isCopying } = useCopyPolicyHandbookForLLM();
  const { mutate: syncFromHris, isLoading: isSyncing } = useSyncPolicyHandbookFromHris();
  const { mutate: exportPDF, isLoading: isExportingPDF } = useExportPolicyHandbookPDF();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const [sectionModal, setSectionModal] = useState<{ open: boolean; section: PolicyHandbookSectionData | null }>({
    open: false,
    section: null,
  });
  const [historyModal, setHistoryModal] = useState<{ open: boolean; sectionId: number | null; title?: string }>({
    open: false,
    sectionId: null,
  });
  const [deleteModal, setDeleteModal] = useState<DeleteModalData | null>({ open: false });

  const sections: PolicyHandbookSectionData[] = handbook?.sections ?? [];
  const filteredSections = sections.filter((section) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      section.title.toLowerCase().includes(query) ||
      (CATEGORY_LABELS[section.category] ?? section.category).toLowerCase().includes(query) ||
      (section.description ?? '').toLowerCase().includes(query) ||
      stripHtml(section.body).toLowerCase().includes(query)
    );
  });

  // Keep the selection valid as sections load, get filtered out, or get deleted
  useEffect(() => {
    if (filteredSections.length === 0) {
      if (selectedSectionId !== null) setSelectedSectionId(null);
      return;
    }
    if (!filteredSections.some((section) => section.id === selectedSectionId)) {
      setSelectedSectionId(filteredSections[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handbook?.id, searchQuery, sections.length]);

  const selectedSection = filteredSections.find((section) => section.id === selectedSectionId) ?? null;

  // A section is flagged as changed-since-publish only once the handbook has actually been
  // published at least once, and only if it was edited after that publish timestamp
  const isChangedSincePublish = (section: PolicyHandbookSectionData) =>
    handbook?.status === 'published' &&
    !!handbook.published_at &&
    new Date(section.updated_at).getTime() > new Date(handbook.published_at).getTime();

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups((previous) => {
      const next = new Set(previous);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  // Org Structure is the one section shown as a visual diagram - only fetched while it's selected
  const { data: orgStructureRoots } = useGetOrgStructureForHandbook(selectedSection?.category === 'org_structure');

  const handleStartEditTitle = () => {
    setTitleInput(handbook?.title ?? '');
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    updateHandbook(
      { title: titleInput },
      {
        onSuccess: () => {
          setIsEditingTitle(false);
          toast.custom(() => <CustomToast message='Title updated successfully.' type='success' />);
        },
        onError: (error: Error) => {
          toast.custom(() => <CustomToast message={error.message} type='error' />);
        },
      }
    );
  };

  const handleToggleStatus = () => {
    const nextStatus = handbook?.status === 'published' ? 'draft' : 'published';
    updateHandbook(
      { status: nextStatus },
      {
        onSuccess: () => {
          toast.custom(() => <CustomToast message={`Handbook marked as ${nextStatus}.`} type='success' />);
        },
        onError: (error: Error) => {
          toast.custom(() => <CustomToast message={error.message} type='error' />);
        },
      }
    );
  };

  const handleConfirmDelete = (data?: DeleteModalData) => {
    if (!data?.sectionId) return;
    deleteSection(data.sectionId, {
      onSuccess: () => {
        setDeleteModal(null);
        toast.custom(() => <CustomToast message='Section deleted successfully.' type='success' />);
      },
      onError: (error: Error) => {
        toast.custom(() => <CustomToast message={error.message} type='error' />);
      },
    });
  };

  const handleSyncFromHris = () => {
    syncFromHris(undefined, {
      onSuccess: (data) => {
        const message =
          data.synced_count > 0
            ? `Synced ${data.synced_count} section(s) from HRIS.`
            : 'Nothing to sync yet — configure Approval Workflows, Roles, or Employee ID Settings in HRIS first.';
        toast.custom(() => <CustomToast message={message} type={data.synced_count > 0 ? 'success' : 'info'} />);
      },
      onError: (error: Error) => {
        toast.custom(() => (
          <CustomToast message={`${error.message} Try Copy for LLM to keep working in another AI instead.`} type='error' />
        ));
      },
    });
  };

  const handleCopyForLLM = () => {
    exportForLLM(undefined, {
      onSuccess: async ({ content }) => {
        try {
          await navigator.clipboard.writeText(content);
          toast.custom(() => <CustomToast message='Handbook copied — paste it into Claude, ChatGPT, or Gemini.' type='success' />);
        } catch {
          toast.custom(() => <CustomToast message='Could not access the clipboard in this browser.' type='error' />);
        }
      },
      onError: (error: Error) => {
        toast.custom(() => <CustomToast message={error.message} type='error' />);
      },
    });
  };

  const handleExportPDF = () => {
    exportPDF(undefined, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'policy-handbook.pdf';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.custom(() => <CustomToast message='Handbook exported as PDF.' type='success' />);
      },
      onError: (error: Error) => {
        toast.custom(() => <CustomToast message={error.message} type='error' />);
      },
    });
  };

  return (
    <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 pb-16'>
      <div className='flex p-4'>
        <BackButton label='Manage' href='/manage' />
      </div>

      <div className='px-2 md:px-8 lg:px-4'>
        {isLoading && (
          <div className='flex justify-center py-16'>
            <LoadingSpinner size='lg' showText text='Loading policy handbook...' />
          </div>
        )}

        {!isLoading && (
          <>
            {/* Header */}
            <div className='flex flex-wrap items-start justify-between gap-4 mb-4'>
              <div>
                <div className='flex items-center gap-2'>
                  {isEditingTitle ? (
                    <>
                      <input
                        type='text'
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        className='text-xl font-bold text-indigo-dye border-b border-savoy-blue focus:outline-none'
                        autoFocus
                      />
                      <button onClick={handleSaveTitle} className='text-sm text-savoy-blue font-semibold'>
                        Save
                      </button>
                      <button onClick={() => setIsEditingTitle(false)} className='text-sm text-gray-500'>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className='text-xl font-bold text-indigo-dye'>{handbook?.title ?? 'Policy Handbook'}</h2>
                      <button
                        onClick={handleStartEditTitle}
                        data-tooltip-id='edit-title-tooltip'
                        data-tooltip-content='Edit Title'
                        data-tooltip-place='top'
                      >
                        <PencilSquareIcon className='w-4 h-4 text-gray-400 hover:text-savoy-blue' />
                      </button>
                      <button
                        onClick={handleToggleStatus}
                        className={`text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full ${
                          handbook?.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                        data-tooltip-id='status-tooltip'
                        data-tooltip-content='Click to toggle Draft / Published'
                        data-tooltip-place='top'
                      >
                        {handbook?.status ?? 'draft'}
                      </button>
                    </>
                  )}
                </div>
                <p className='text-sm text-gray-500 mt-1'>
                  A plain-language guide to your company&rsquo;s payroll rules and policies.
                </p>
              </div>

              <button
                onClick={handleCopyForLLM}
                disabled={isCopying}
                className='flex items-center gap-1.5 bg-savoy-blue text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-50'
                data-tooltip-id='copy-for-llm-tooltip'
                data-tooltip-content="If Gemini or Sync from HRIS isn't available, use this to keep going in another AI"
                data-tooltip-place='top'
              >
                <ClipboardDocumentIcon className='w-4 h-4' />
                {isCopying ? 'Copying...' : 'Copy for LLM'}
              </button>
            </div>

            {/* Search */}
            <div className='relative max-w-md mb-4'>
              <MagnifyingGlassIcon className='w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search policies...'
                className='w-full border border-gray-300 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-savoy-blue'
              />
            </div>

            {/* AI assistant callout */}
            <div className='flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6'>
              <SparklesIcon className='w-5 h-5 text-savoy-blue flex-none mt-0.5' />
              <div>
                <p className='font-semibold text-indigo-dye text-sm'>Gemini having trouble, or want a second opinion?</p>
                <p className='text-sm text-gray-600 mt-0.5'>
                  Click <span className='font-semibold'>Copy for LLM</span> above and paste the copied handbook into ChatGPT, Claude, or
                  Gemini directly in your browser. It's a fallback for whenever AI generation here isn't available &mdash; the whole
                  handbook comes with it, so the AI you paste it into has the full context.
                </p>
              </div>
            </div>

            {/* Toolbar */}
            <div className='flex justify-end gap-3 mb-4'>
              <button
                onClick={handleSyncFromHris}
                disabled={isSyncing}
                className='flex items-center gap-1 border border-savoy-blue text-savoy-blue text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-50 disabled:opacity-50'
                data-tooltip-id='sync-tooltip'
                data-tooltip-content='Generate sections from settings already configured in HRIS - approval workflows, roles, org structure, and more'
                data-tooltip-place='top'
              >
                <ArrowPathIcon className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync from HRIS'}
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className='flex items-center gap-1 border border-savoy-blue text-savoy-blue text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-50 disabled:opacity-50'
                data-tooltip-id='export-pdf-tooltip'
                data-tooltip-content='Download the whole handbook as a PDF'
                data-tooltip-place='top'
              >
                <DocumentArrowDownIcon className='w-4 h-4' />
                {isExportingPDF ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>

            {sections.length === 0 && (
              <div className='bg-white shadow rounded-lg p-10 text-center text-gray-500'>
                No policies yet. Click <span className='font-semibold'>Sync from HRIS</span> to pull in whatever&rsquo;s already
                configured.
              </div>
            )}

            {sections.length > 0 && (
              <div className='flex flex-col lg:flex-row gap-6 items-start'>
                {/* Sidebar */}
                <div className='w-full lg:w-64 flex-none bg-white shadow rounded-lg overflow-hidden'>
                  <div className='px-4 py-3 border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400'>
                    Contents
                  </div>
                  <nav className='max-h-[32rem] overflow-y-auto'>
                    {filteredSections.length === 0 && <p className='p-4 text-sm text-gray-400'>No matching policies.</p>}
                    {CATEGORY_GROUPS.map((group) => {
                      const groupSections = filteredSections.filter((section) => group.categories.includes(section.category));
                      if (groupSections.length === 0) return null;

                      const isCollapsed = collapsedGroups.has(group.key);

                      return (
                        <div key={group.key} className='border-b border-gray-100 last:border-b-0'>
                          <button
                            onClick={() => toggleGroup(group.key)}
                            className='flex items-center justify-between w-full px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:bg-gray-50'
                          >
                            <span>{group.label}</span>
                            {isCollapsed ? (
                              <ChevronRightIcon className='w-3.5 h-3.5 text-gray-400' />
                            ) : (
                              <ChevronDownIcon className='w-3.5 h-3.5 text-gray-400' />
                            )}
                          </button>
                          {!isCollapsed &&
                            groupSections.map((section) => (
                              <button
                                key={section.id}
                                onClick={() => setSelectedSectionId(section.id)}
                                className={`flex items-center justify-between gap-2 w-full text-left px-4 py-2.5 text-sm border-l-4 transition-colors ${
                                  section.id === selectedSectionId
                                    ? 'border-savoy-blue bg-blue-50 text-savoy-blue font-semibold'
                                    : 'border-transparent text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <span className='truncate'>{section.title}</span>
                                {isChangedSincePublish(section) && (
                                  <span
                                    className='w-1.5 h-1.5 rounded-full bg-amber-500 flex-none'
                                    data-tooltip-id='changed-since-publish-tooltip'
                                    data-tooltip-content='Changed since last published'
                                    data-tooltip-place='right'
                                  />
                                )}
                              </button>
                            ))}
                        </div>
                      );
                    })}
                  </nav>
                </div>

                {/* Content pane */}
                <div className='flex-1 min-w-0 bg-white shadow rounded-lg p-6'>
                  {selectedSection ? (
                    <>
                      <div className='flex items-start justify-between gap-4'>
                        <div>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-xs font-semibold uppercase tracking-wide text-savoy-blue bg-blue-50 px-2 py-0.5 rounded'>
                              {CATEGORY_LABELS[selectedSection.category] ?? selectedSection.category}
                            </span>
                            {selectedSection.section_type === 'dynamic_summary' && (
                              <span className='text-xs font-semibold uppercase tracking-wide text-teal-700 bg-teal-50 px-2 py-0.5 rounded'>
                                Synced from HRIS
                              </span>
                            )}
                            {selectedSection.is_ai_generated && (
                              <span className='text-xs font-semibold uppercase tracking-wide text-purple-700 bg-purple-50 px-2 py-0.5 rounded'>
                                AI Generated
                              </span>
                            )}
                            {isChangedSincePublish(selectedSection) && (
                              <span className='flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 px-2 py-0.5 rounded'>
                                <ExclamationTriangleIcon className='w-3.5 h-3.5' />
                                Changed since published
                              </span>
                            )}
                          </div>
                          <h3 className='text-lg font-bold text-indigo-dye'>{selectedSection.title}</h3>
                          {selectedSection.description && (
                            <p className='text-sm text-gray-500 mt-1'>{selectedSection.description}</p>
                          )}
                          {selectedSection.last_generated_at && (
                            <p className='text-xs text-gray-400 mt-1'>
                              Generated {formatDistanceToNow(new Date(selectedSection.last_generated_at), { addSuffix: true })}
                            </p>
                          )}
                        </div>

                        <div className='flex items-center gap-3 flex-none'>
                          <button
                            onClick={() => setHistoryModal({ open: true, sectionId: selectedSection.id, title: selectedSection.title })}
                            data-tooltip-id='history-tooltip'
                            data-tooltip-content='View History'
                            data-tooltip-place='top'
                          >
                            <ClockIcon className='w-5 h-5 text-gray-400 hover:text-savoy-blue' />
                          </button>
                          <button
                            onClick={() => setSectionModal({ open: true, section: selectedSection })}
                            data-tooltip-id='edit-section-tooltip'
                            data-tooltip-content='Edit Section'
                            data-tooltip-place='top'
                          >
                            <PencilSquareIcon className='w-5 h-5 text-gray-400 hover:text-savoy-blue' />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, sectionId: selectedSection.id })}
                            data-tooltip-id='delete-section-tooltip'
                            data-tooltip-content='Delete Section'
                            data-tooltip-place='top'
                          >
                            <TrashIcon className='w-5 h-5 text-gray-400 hover:text-red-500' />
                          </button>
                        </div>
                      </div>

                      {selectedSection.category === 'org_structure' && orgStructureRoots && orgStructureRoots.length > 0 && (
                        <div className='mt-4'>
                          <OrgStructureDiagram roots={orgStructureRoots} />
                        </div>
                      )}

                      <div
                        className='policy-handbook-content'
                        dangerouslySetInnerHTML={{ __html: selectedSection.body || '<p class="text-gray-400">No content yet.</p>' }}
                      />
                    </>
                  ) : (
                    <p className='text-sm text-gray-400'>Select a policy from the list on the left.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <SectionModal
        isOpen={sectionModal.open}
        handleClose={() => setSectionModal({ open: false, section: null })}
        section={sectionModal.section}
      />

      <VersionHistoryModal
        isOpen={historyModal.open}
        handleClose={() => setHistoryModal({ open: false, sectionId: null })}
        sectionId={historyModal.sectionId}
        sectionTitle={historyModal.title}
      />

      <DeleteModal
        isOpen={deleteModal ?? { open: false }}
        setIsOpen={setDeleteModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        customText='this section'
      />

      <Tooltip id='edit-title-tooltip' />
      <Tooltip id='status-tooltip' />
      <Tooltip id='copy-for-llm-tooltip' />
      <Tooltip id='sync-tooltip' />
      <Tooltip id='export-pdf-tooltip' />
      <Tooltip id='changed-since-publish-tooltip' />
      <Tooltip id='history-tooltip' />
      <Tooltip id='edit-section-tooltip' />
      <Tooltip id='delete-section-tooltip' />
    </div>
  );
};

export default Content;
