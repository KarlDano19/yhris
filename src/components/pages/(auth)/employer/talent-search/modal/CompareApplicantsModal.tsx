import { Dispatch, Fragment, useRef, useEffect, useState } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { XCircleIcon, Squares2X2Icon } from "@heroicons/react/24/solid";
import useCreateApplicantComparison from "../hook/useCreateApplicantComparison";
import Image from 'next/image';
import { formatWorkExperienceDateRange } from '@/helpers/date';
import ColorPaletteModal from '../../analytics/modals/ColorPaletteModal';

const METRIC_COLOR_STORAGE_KEY = 'talentCompareMetricColors';
const DEFAULT_METRIC_COLORS = ['#2563eb', '#22c55e', '#2c3f58'];
const METRIC_NAMES = ['Experience', 'Skills', 'Salary'];

type T_CompareModalData = {
  applicantIds: number[];
  open: boolean;
};

function CompareApplicantsModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_CompareModalData;
  setIsOpen: Dispatch<T_CompareModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [metricColors, setMetricColors] = useState<string[]>(DEFAULT_METRIC_COLORS);

  const {
    mutate: createComparison,
    data: comparisonData,
    isLoading,
    isError,
    reset: resetComparison,
  } = useCreateApplicantComparison();

  const applicants = comparisonData?.applicants || [];

  const customCloseModal = () => {
    refetch();
    resetComparison();
    setIsOpen(null);
  };

  useEffect(() => {
    if (isOpen.open && isOpen.applicantIds.length > 0) {
      createComparison(isOpen.applicantIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen.open, isOpen.applicantIds]);

  useEffect(() => {
    const savedColors = localStorage.getItem(METRIC_COLOR_STORAGE_KEY);
    if (savedColors) {
      try {
        setMetricColors(JSON.parse(savedColors));
      } catch (error) {
        console.error('Error loading saved metric colors:', error);
      }
    }
  }, []);

  const handleColorPaletteSave = (colors: string[]) => {
    setMetricColors(colors);
    localStorage.setItem(METRIC_COLOR_STORAGE_KEY, JSON.stringify(colors));
  };

  const renderProfileSection = (applicant: any) => {
    if (!applicant) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">No data available</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full gap-4">
        {/* Basic Info */}
        <div className="flex items-start gap-4">
          <Image
            src={applicant.photo || '/assets/no-photo.png'}
            alt={applicant.firstname || 'Applicant'}
            width={100}
            height={100}
            className="rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-lg mb-1 break-words">
              {applicant.firstname} {applicant.lastname}
            </h4>
            <p className="text-sm text-gray-500 mb-1">{applicant.gender}</p>
            <p className="text-sm text-gray-500 mb-1">{applicant.nationality}</p>
            <p className="text-sm text-gray-500 break-words">{applicant.email}</p>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="grid grid-cols-2 gap-4">
          <div className="min-w-0">
            <div className="font-bold text-sm text-gray-700 mb-1">Location</div>
            <div className="text-sm break-words">{applicant.location || 'Not specified'}</div>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-gray-700 mb-1">Contact</div>
            <div className="text-sm break-words">{applicant.contact_number || applicant.mobile || 'Not specified'}</div>
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="font-bold text-sm text-gray-700 mb-1">Education</div>
          <div className="text-sm break-words">{applicant.education || 'Not specified'}</div>
        </div>

        {/* Skills */}
        {applicant.skills && (
          <div>
            <div className="font-bold text-sm text-gray-700 mb-1">Skills</div>
            <div className="text-sm break-words">
              {Array.isArray(applicant.skills) ? applicant.skills.join(', ') : applicant.skills}
            </div>
          </div>
        )}

        {/* Expected Salary */}
        <div>
          <div className="font-bold text-sm text-gray-700 mb-1">Expected Salary</div>
          <div className="text-sm">
            {applicant.expected_salary ? `₱${applicant.expected_salary.toLocaleString()}` : 'Not specified'}
          </div>
        </div>

        {/* Work Experience Summary */}
        <div>
          <div className="font-bold text-sm text-gray-700 mb-2">Work Experience</div>
          {applicant.work_experience && applicant.work_experience.length > 0 ? (
            <div className="space-y-2">
              {applicant.work_experience.slice(0, 3).map((exp: any, index: number) => (
                <div key={index} className="border-l-2 border-blue-200 pl-3 min-w-0">
                  <div className="font-medium text-sm break-words">{exp.position}</div>
                  <div className="text-xs text-gray-600 break-words">{exp.companyOrg}</div>
                  <div className="text-xs text-gray-500">
                    {formatWorkExperienceDateRange(exp.dateFrom, exp.dateTo, true)}
                  </div>
                </div>
              ))}
              {applicant.work_experience.length > 3 && (
                <div className="text-xs text-gray-500 italic">
                  +{applicant.work_experience.length - 3} more experiences
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No work experience</div>
          )}
        </div>
      </div>
    );
  };

  const showQuickComparison = applicants.length > 0 ? (() => {
    const maxExp = Math.max(...applicants.map((a: any) => a.work_experience?.length || 0), 1);
    const maxSkills = Math.max(...applicants.map((a: any) => Array.isArray(a.skills) ? a.skills.length : 0), 1);
    const maxSalary = Math.max(...applicants.map((a: any) => a.expected_salary || 0), 1);
    return (
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-lg">Quick Comparison</h4>
          <button
            onClick={() => setIsColorModalOpen(true)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
            title="Customize colors"
          >
            <Squares2X2Icon className="w-4 h-4" />
            Colors
          </button>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {applicants.map((applicant: any, idx: number) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 shadow flex flex-col items-center">
              <div className="font-semibold text-base mb-2 text-center">{applicant.firstname} {applicant.lastname}</div>
              {/* Experience Bar */}
              <div className="w-full mb-3">
                <div className="text-xs font-bold text-gray-700 mb-1">EXPERIENCE</div>
                <div className="w-full bg-gray-200 rounded-full h-4 flex items-center">
                  <div
                    className="h-4 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-300"
                    style={{ width: `${((applicant.work_experience?.length || 0) / maxExp) * 100}%`, minWidth: '2.5rem', backgroundColor: metricColors[0] }}
                  >
                    <span className="pl-2">{applicant.work_experience?.length || 0}</span>
                  </div>
                </div>
              </div>
              {/* Skills Bar */}
              <div className="w-full mb-3">
                <div className="text-xs font-bold text-gray-700 mb-1">SKILLS</div>
                <div className="w-full bg-gray-200 rounded-full h-4 flex items-center">
                  <div
                    className="h-4 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-300"
                    style={{ width: `${((Array.isArray(applicant.skills) ? applicant.skills.length : 0) / maxSkills) * 100}%`, minWidth: '2.5rem', backgroundColor: metricColors[1] }}
                  >
                    <span className="pl-2">{Array.isArray(applicant.skills) ? applicant.skills.length : 0}</span>
                  </div>
                </div>
              </div>
              {/* Salary Bar */}
              <div className="w-full mb-1">
                <div className="text-xs font-bold text-gray-700 mb-1">SALARY</div>
                <div className="w-full bg-gray-200 rounded-full h-4 flex items-center">
                  <div
                    className="h-4 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-300"
                    style={{ width: `${((applicant.expected_salary || 0) / maxSalary) * 100}%`, minWidth: '2.5rem', backgroundColor: metricColors[2] }}
                  >
                    <span className="pl-2">{applicant.expected_salary ? `₱${applicant.expected_salary.toLocaleString()}` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  })() : null;

  return (
    <>
    <Transition show={isOpen.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => customCloseModal()}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-6xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Compare Profiles
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => customCloseModal()}
                  />
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto" key={isOpen.applicantIds.join(',')}>
                  {isLoading && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading profiles...</p>
                    </div>
                  )}

                  {isError && (
                    <div className="text-center py-8">
                      <p className="text-red-600">Failed to load comparison. Please try again.</p>
                    </div>
                  )}

                  {!isLoading && !isError && applicants.length > 0 && (
                    <>
                      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
                        {applicants.map((applicant: any) => (
                          <div key={applicant.id} className="border rounded-lg p-4 min-w-0">
                            {renderProfileSection(applicant)}
                          </div>
                        ))}
                      </div>

                      {/* Comparison Summary */}
                      {showQuickComparison}
                    </>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>

    <ColorPaletteModal
      isOpen={isColorModalOpen}
      onClose={() => setIsColorModalOpen(false)}
      onSave={handleColorPaletteSave}
      currentColors={metricColors}
      departmentNames={METRIC_NAMES}
    />
    </>
  );
}

export default CompareApplicantsModal;
