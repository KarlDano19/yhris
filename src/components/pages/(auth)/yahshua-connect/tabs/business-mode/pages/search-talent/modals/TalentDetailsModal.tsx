import { Fragment, useMemo } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import {
  XMarkIcon,
  StarIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import type { Talent } from '@/types/business-mode';
import { useGetTalentDetail } from '../hooks/useGetTalentDetail';
import LoadingSpinner from '@/components/LoadingSpinner';

interface TalentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  talent: Talent | null;
  onMessage?: () => void;
  onBookNow?: () => void;
}

const TalentDetailsModal = ({ isOpen, onClose, talent, onMessage, onBookNow }: TalentDetailsModalProps) => {
  // Fetch detailed talent information
  const { data: talentDetail, isLoading } = useGetTalentDetail(talent?.id || null, isOpen);

  // Merge talent data with detailed API data (API data takes precedence)
  const displayTalent = useMemo(() => {
    if (!talent) return null;

    if (talentDetail) {
      return {
        ...talent,
        // Use backend data (ApplicantRetrieveProfileSerializer fields)
        name: talentDetail.name, // Already combined: "firstname lastname"
        title: talentDetail.education || talentDetail.description || talent.title,
        rating: talentDetail.average_rating || 0,
        reviews: talentDetail.reviews_count || 0,
        jobsDone: talentDetail.jobs_done_count || 0,
        portfolioCount: talentDetail.portfolio?.length || 0, // Calculate from portfolio array
        skills: talentDetail.skills || [], // Always array from backend
        languages: talent.languages, // Keep from original (not in backend)
        education: talentDetail.education,
        about: talentDetail.description,
        photo: talentDetail.photo, // Full URL with MEDIA_URL prefix
        cv: talentDetail.cv, // Full URL with MEDIA_URL prefix
        work_experience: talentDetail.work_experience || [], // Always array
        certifications: talentDetail.certifications || [], // Always array
        portfolio: talentDetail.portfolio || [], // Always array
        // Additional fields from backend
        college: talentDetail.college,
        educational_attainment: talentDetail.educational_attainment,
        setup_preference: talentDetail.setup_preference,
        expected_salary: talentDetail.expected_salary,
        portfolio_url: talentDetail.portfolio_url,
      };
    }

    return talent;
  }, [talent, talentDetail]);

  if (!displayTalent) return null;

  return (
    <Transition show={isOpen} as={Fragment} appear={true}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen sm:w-[85vw] md:w-[50vw]">
                  <div className="flex h-screen flex-col overflow-hidden bg-white shadow-2xl">
                    {/* Header with Action Buttons and Close button */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (onBookNow) {
                              onBookNow();
                            }
                          }}
                          className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm"
                        >
                          Book Now
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (onMessage) {
                              onMessage();
                            }
                          }}
                          className="px-6 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors text-sm"
                        >
                          Message
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Talent Details Content */}

                    <div className="flex-1 overflow-y-auto">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <LoadingSpinner size="lg" color="blue" showText text="Loading talent details..." />
                        </div>
                      ) : (
                        <div className="p-4 md:p-6">
                        {/* Talent Header */}
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="relative flex-shrink-0">
                                {displayTalent.photo ? (
                                  <img
                                    src={displayTalent.photo}
                                    alt={displayTalent.name}
                                    className="h-16 w-16 rounded-2xl object-cover"
                                  />
                                ) : (
                                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center text-xl font-semibold">
                                    {displayTalent.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .substring(0, 2)
                                    .toUpperCase()}
                                  </div>
                                )}
                                {/* Premium badge */}
                                <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-yellow-400 flex items-center justify-center">
                                  <StarIcon className="h-3 w-3 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-lg md:text-xl font-semibold text-gray-900 break-words">
                                    {displayTalent.name}
                                  </h5>
                                  <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                                </div>
                                <h6 className="text-gray-600 text-xs md:text-sm mt-1 break-words">
                                  {displayTalent.title}
                                </h6>
                                <div className="flex items-center gap-1 mt-1">
                                  <StarIcon className="h-4 w-4 text-yellow-500" />
                                  <span className="text-sm text-gray-700">
                                    {displayTalent.rating ? displayTalent.rating.toFixed(1) : '0.0'} ({displayTalent.reviews} reviews)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-2xl font-bold text-gray-900">{displayTalent.jobsDone}</p>
                            <p className="text-sm text-gray-600 mt-1">Jobs Done</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-2xl font-bold text-gray-900">{displayTalent.reviews}</p>
                            <p className="text-sm text-gray-600 mt-1">Reviews</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-2xl font-bold text-gray-900">{displayTalent.portfolioCount || 0}</p>
                            <p className="text-sm text-gray-600 mt-1">Portfolio</p>
                          </div>
                        </div>

                        {/* Expected Salary & Availability */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Expected Salary</p>
                              <p className="text-lg font-bold text-green-700">
                                {displayTalent.expected_salary
                                  ? `₱${displayTalent.expected_salary.toLocaleString()}/month`
                                  : 'Not specified'
                                }
                              </p>
                            </div>
                            {displayTalent.availability && (
                              <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                {displayTalent.availability}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* About Section */}
                        {displayTalent.about && (
                          <div>
                            <h4 className="text-base font-bold text-gray-900 mb-2">About</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">{displayTalent.about}</p>
                          </div>
                        )}

                        {/* Skills Section */}
                        {displayTalent.skills && displayTalent.skills.length > 0 && (
                          <div>
                            <h4 className="text-base font-bold text-gray-900 mb-3">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {displayTalent.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education & Languages */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {displayTalent.education && (
                            <div>
                              <h4 className="text-base font-bold text-gray-900 mb-2">Education</h4>
                              <p className="text-sm text-gray-700">{displayTalent.education}</p>
                            </div>
                          )}
                          {displayTalent.languages && displayTalent.languages.length > 0 && (
                            <div>
                              <h4 className="text-base font-bold text-gray-900 mb-2">Languages</h4>
                              <p className="text-sm text-gray-700">{displayTalent.languages.join(', ')}</p>
                            </div>
                          )}
                        </div>

                        {/* Work Experience */}
                        {talentDetail?.work_experience && talentDetail.work_experience.length > 0 && (
                          <div>
                            <h4 className="text-base font-bold text-gray-900 mb-3">Work Experience</h4>
                            <div className="space-y-3">
                              {talentDetail.work_experience.map((exp: any, index: number) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                  <p className="font-semibold text-gray-900">{exp.position || exp.job_title}</p>
                                  <p className="text-sm text-gray-600">{exp.company}</p>
                                  {exp.duration && (
                                    <p className="text-xs text-gray-500 mt-1">{exp.duration}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Certifications */}
                        {talentDetail?.certifications && talentDetail.certifications.length > 0 && (
                          <div>
                            <h4 className="text-base font-bold text-gray-900 mb-3">Certifications</h4>
                            <div className="flex flex-wrap gap-2">
                              {talentDetail.certifications.map((cert: any, index: number) => (
                                <span
                                  key={index}
                                  className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200"
                                >
                                  {typeof cert === 'string' ? cert : cert.name || cert.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Response Time */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 text-gray-500" />
                          <span>Usually responds within 2 hours</span>
                        </div>
                        </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TalentDetailsModal;

