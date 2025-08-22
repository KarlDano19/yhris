import { Dispatch, Fragment, useRef, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import useGetApplicantDetails from "../hook/useGetApplicantDetails";
import Image from 'next/image';

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
  
  // Create individual hooks for each applicant (max 5 for performance)
  const { data: applicant1Data, refetch: refetch1, isLoading: isLoading1 } = useGetApplicantDetails(isOpen.applicantIds[0] || 0);
  const { data: applicant2Data, refetch: refetch2, isLoading: isLoading2 } = useGetApplicantDetails(isOpen.applicantIds[1] || 0);
  const { data: applicant3Data, refetch: refetch3, isLoading: isLoading3 } = useGetApplicantDetails(isOpen.applicantIds[2] || 0);
  const { data: applicant4Data, refetch: refetch4, isLoading: isLoading4 } = useGetApplicantDetails(isOpen.applicantIds[3] || 0);
  const { data: applicant5Data, refetch: refetch5, isLoading: isLoading5 } = useGetApplicantDetails(isOpen.applicantIds[4] || 0);
  
  const applicantData = [applicant1Data, applicant2Data, applicant3Data, applicant4Data, applicant5Data];
  const isLoadingArray = [isLoading1, isLoading2, isLoading3, isLoading4, isLoading5];
  const refetchArray = [refetch1, refetch2, refetch3, refetch4, refetch5];
  
  const customCloseModal = () => {
    refetch();
    setIsOpen(null);
  };

  useEffect(() => {
    if (isOpen.open && isOpen.applicantIds.length > 0) {
      refetchArray.forEach(refetch => refetch());
    }
  }, [isOpen.open, isOpen.applicantIds, refetchArray]);

  const renderProfileSection = (applicant: any, isLoading: boolean, side: 'left' | 'right') => {
    if (isLoading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      );
    }

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
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">
              {applicant.firstname} {applicant.lastname}
            </h4>
            <p className="text-sm text-gray-500 mb-1">{applicant.gender}</p>
            <p className="text-sm text-gray-500 mb-1">{applicant.nationality}</p>
            <p className="text-sm text-gray-500">{applicant.email}</p>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-bold text-sm text-gray-700 mb-1">Location</div>
            <div className="text-sm">{applicant.location || 'Not specified'}</div>
          </div>
          <div>
            <div className="font-bold text-sm text-gray-700 mb-1">Contact</div>
            <div className="text-sm">{applicant.contact_number || applicant.mobile || 'Not specified'}</div>
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="font-bold text-sm text-gray-700 mb-1">Education</div>
          <div className="text-sm">{applicant.education || 'Not specified'}</div>
        </div>

        {/* Skills */}
        {applicant.skills && (
          <div>
            <div className="font-bold text-sm text-gray-700 mb-1">Skills</div>
            <div className="text-sm">
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
                <div key={index} className="border-l-2 border-blue-200 pl-3">
                  <div className="font-medium text-sm">{exp.position}</div>
                  <div className="text-xs text-gray-600">{exp.companyOrg}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(exp.dateFrom).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    -{' '}
                    {exp.dateTo === 'Present' || exp.dateTo === 'present'
                      ? 'Present'
                      : new Date(exp.dateTo).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
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

  const showQuickComparison = applicantData.slice(0, isOpen.applicantIds.length).every(data => data) ? (() => {
    const applicants = applicantData.slice(0, isOpen.applicantIds.length);
    const maxExp = Math.max(...applicants.map(a => a.work_experience?.length || 0), 1);
    const maxSkills = Math.max(...applicants.map(a => Array.isArray(a.skills) ? a.skills.length : 0), 1);
    const maxSalary = Math.max(...applicants.map(a => a.expected_salary || 0), 1);
    return (
      <div className="mt-8 border-t pt-6">
        <h4 className="font-semibold text-lg mb-4">Quick Comparison</h4>
        <div className={`grid gap-6 ${
          applicants.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
          applicants.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
          applicants.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
        }`}>
          {applicants.map((applicant, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 shadow flex flex-col items-center">
              {/* Optionally add photo here if available */}
              {/* <Image src={applicant.photo || '/assets/no-photo.png'} alt={applicant.firstname || 'Applicant'} width={60} height={60} className="rounded-full mb-2" /> */}
              <div className="font-semibold text-base mb-2 text-center">{applicant.firstname} {applicant.lastname}</div>
              {/* Experience Bar */}
              <div className="w-full mb-3">
                <div className="text-xs font-bold text-gray-700 mb-1">EXPERIENCE</div>
                <div className="w-full bg-gray-200 rounded-full h-4 flex items-center">
                  <div
                    className="bg-blue-600 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-300"
                    style={{ width: `${((applicant.work_experience?.length || 0) / maxExp) * 100}%`, minWidth: '2.5rem' }}
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
                    className="bg-green-500 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-300"
                    style={{ width: `${((Array.isArray(applicant.skills) ? applicant.skills.length : 0) / maxSkills) * 100}%`, minWidth: '2.5rem' }}
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
                    className="bg-[#2c3f58] h-4 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all duration-300"
                    style={{ width: `${((applicant.expected_salary || 0) / maxSalary) * 100}%`, minWidth: '2.5rem' }}
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
    <Transition.Root show={isOpen.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => customCloseModal()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-6xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Compare Profiles
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => customCloseModal()}
                  />
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                  <div className={`grid gap-6 ${
                    isOpen.applicantIds.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 
                    isOpen.applicantIds.length === 3 ? 'grid-cols-1 lg:grid-cols-3' : 
                    'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
                  }`}>
                    {isOpen.applicantIds.slice(0, 5).map((applicantId, index) => {
                      const applicant = applicantData[index];
                      const isLoading = isLoadingArray[index];
                      const colors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-orange-600', 'text-pink-600'];
                      
                      return (
                        <div key={applicantId} className="border rounded-lg p-4">
                          {renderProfileSection(applicant, isLoading, 'left')}
                        </div>
                      );
                    })}
                  </div>

                  {/* Comparison Summary */}
                  {showQuickComparison}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default CompareApplicantsModal; 