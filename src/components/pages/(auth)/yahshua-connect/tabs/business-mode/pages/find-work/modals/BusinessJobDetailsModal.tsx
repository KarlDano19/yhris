import { Fragment, useState, useEffect } from 'react';

import Image from 'next/image';

import { Dialog, Transition } from '@headlessui/react';

import useGetBusinessJobDetails from '../hooks/useGetBusinessJobDetails';

import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import {
  XMarkIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  CurrencyDollarIcon,
  ClipboardDocumentIcon,
  StarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import formatPrice from '@/helpers/currencyFormat';

interface BusinessJobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number | null;
  onAcceptJob: (jobId: number) => void;
}

const BusinessJobDetailsModal = ({
  isOpen,
  onClose,
  jobId,
  onAcceptJob,
}: BusinessJobDetailsModalProps) => {
  const { data, isLoading } = useGetBusinessJobDetails(jobId);
  const [jobDetailData, setJobDetailData] = useState<any>({});

  useEffect(() => {
    if (data) {
      setJobDetailData(data);
    }
  }, [data]);

  const handleAcceptJob = () => {
    if (jobId) {
      onAcceptJob(jobId);
      // Don't close the modal here - let the parent component handle modal state transitions
      // Parent will close this modal and open chat modal if already applied
    }
  };

  // Generate initials from client name
  const getInitials = (clientName?: string) => {
    if (!clientName) return '?';
    const words = clientName.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return clientName.substring(0, 2).toUpperCase();
  };

  // Format date and time
  const formatDateTime = () => {
    if (!jobDetailData.date) return 'Date not specified';
    
    const dateStr = jobDetailData.date;
    const date = new Date(dateStr);
    const dateFormatted = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    if (jobDetailData.time_from && jobDetailData.time_to) {
      return `${dateFormatted}, ${jobDetailData.time_from} - ${jobDetailData.time_to}`;
    } else if (jobDetailData.time_from) {
      return `${dateFormatted}, ${jobDetailData.time_from}`;
    }
    return dateFormatted;
  };

  // Format price range
  const formatPriceRange = () => {
    if (jobDetailData.budget_type === 'Range' && jobDetailData.min_amount && jobDetailData.max_amount) {
      return `₱ ${formatPrice(jobDetailData.min_amount)} - ₱ ${formatPrice(jobDetailData.max_amount)}`;
    } else if (jobDetailData.hourly_rate) {
      return `₱ ${formatPrice(jobDetailData.hourly_rate)}/hour`;
    } else if (jobDetailData.min_amount) {
      return `₱ ${formatPrice(jobDetailData.min_amount)}`;
    } else if (jobDetailData.max_amount) {
      return `₱ ${formatPrice(jobDetailData.max_amount)}`;
    }
    return 'Price not specified';
  };

  // Format distance
  const formatDistance = () => {
    if (jobDetailData.distance_km !== null && jobDetailData.distance_km !== undefined) {
      return `${jobDetailData.distance_km} km away`;
    }
    return 'Distance not available';
  };

  if (!jobId) return null;

  return (
    <Transition show={isOpen} as={Fragment} appear={true}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
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

        {/* Slide-in panel from right */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen sm:w-[85vw] md:w-[50vw]">
                  <div className="flex h-screen flex-col overflow-hidden bg-white shadow-2xl">
                    {/* Header with Accept Job button and Close button */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                      <button
                        type="button"
                        onClick={handleAcceptJob}
                        className={`px-6 py-2 text-white rounded-lg font-medium transition-colors text-sm ${
                          jobDetailData?.has_applied
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-savoy-blue hover:bg-blue-700'
                        }`}
                      >
                        {jobDetailData?.has_applied ? 'Message Client' : 'Accept This Job'}
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Job Details Content */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-4 md:p-6">
                        {/* Job Header */}
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <span className="mt-1 flex-shrink-0">
                                <ClipboardDocumentIcon className="h-5 w-5 md:h-6 md:w-6" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-lg md:text-xl font-semibold text-indigo-dye break-words">
                                  {!isLoading ? jobDetailData?.job_title || 'Loading job title...' : 'Loading job title...'}
                                </h5>
                                {jobDetailData?.category && (
                                  <h6 className="text-indigo-dye text-xs md:text-sm mt-1 break-words">
                                    Category: {jobDetailData.category}
                                  </h6>
                                )}
                                <h6 className="text-indigo-dye text-xs md:text-sm mt-1 break-words">
                                  {!isLoading ? jobDetailData?.location || 'Loading location...' : 'Loading location...'}
                                </h6>
                              </div>
                            </div>
                          </div>
                          {jobDetailData?.is_urgent && (
                            <div className="flex-shrink-0">
                              <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                                Urgent
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Client Information */}
                        {jobDetailData?.created_by_name && (
                          <div className="border-t border-gray-300 my-4 pt-4">
                            <h5 className="text-lg md:text-xl font-semibold text-indigo-dye mb-3">Client Information</h5>
                            <div className="flex items-start gap-4">
                              {jobDetailData.created_by_photo && jobDetailData.created_by_photo !== '/assets/no-user.png' ? (
                                <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                  <Image
                                    src={jobDetailData.created_by_photo}
                                    alt={jobDetailData.created_by_name}
                                    width={56}
                                    height={56}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-savoy-blue flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
                                  {getInitials(jobDetailData.created_by_name)}
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {jobDetailData.created_by_name}
                                </h3>
                                <div className="flex items-center gap-1">
                                  <StarIconSolid className="h-4 w-4 text-yellow-400" />
                                  <span className="text-sm font-semibold text-gray-700">
                                    {jobDetailData.created_by_rating || 0}
                                  </span>
                                  <span className="text-sm text-gray-500 ml-1">
                                    ({jobDetailData.created_by_reviews_count || 0} reviews)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Job Details - Only show if there's data to display */}
                        {(!isLoading && (
                          jobDetailData?.description ||
                          jobDetailData?.location ||
                          (jobDetailData?.distance_km !== null && jobDetailData?.distance_km !== undefined) ||
                          jobDetailData?.date ||
                          jobDetailData?.budget_type ||
                          jobDetailData?.min_amount ||
                          jobDetailData?.max_amount ||
                          jobDetailData?.hourly_rate ||
                          jobDetailData?.category ||
                          jobDetailData?.status
                        )) && (
                          <div className="border-t border-gray-300 my-4 pt-4">
                            <h5 className="text-lg md:text-xl font-semibold text-indigo-dye mb-3">Job Details</h5>
                            <div className="details mt-2 space-y-3">
                              {/* Description */}
                              {jobDetailData?.description && (
                                <div>
                                  <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                                    <ClipboardDocumentIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                                    Description
                                  </h6>
                                  <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px] break-words">
                                    {jobDetailData.description}
                                  </p>
                                </div>
                              )}

                              {/* Location */}
                              {jobDetailData?.location && (
                                <div>
                                  <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                                    <MapPinIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                                    Location
                                  </h6>
                                  <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px] break-words">
                                    {jobDetailData.location}
                                  </p>
                                </div>
                              )}

                              {/* Distance */}
                              {jobDetailData?.distance_km !== null && jobDetailData?.distance_km !== undefined && (
                                <div>
                                  <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                                    <PaperAirplaneIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                                    Distance
                                  </h6>
                                  <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]">
                                    {formatDistance()}
                                  </p>
                                </div>
                              )}

                              {/* Schedule */}
                              {jobDetailData?.date && (
                                <div>
                                  <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                                    <ClockIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                                    Schedule
                                  </h6>
                                  <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]">
                                    {formatDateTime()}
                                  </p>
                                </div>
                              )}

                              {/* Budget/Price */}
                              {(jobDetailData?.budget_type || jobDetailData?.min_amount || jobDetailData?.max_amount || jobDetailData?.hourly_rate) && (
                                <div>
                                  <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                                    <CurrencyDollarIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                                    Budget
                                  </h6>
                                  <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px] break-words">
                                    {formatPriceRange()}
                                  </p>
                                </div>
                              )}

                              {/* Category */}
                              {jobDetailData?.category && (
                                <div>
                                  <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                                    <StarIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                                    Category
                                  </h6>
                                  <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]">
                                    {jobDetailData.category}
                                  </p>
                                </div>
                              )}

                              {/* Status */}
                              {jobDetailData?.status && (
                                <div>
                                  <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                                    <CheckCircleIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                                    Status
                                  </h6>
                                  <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px] capitalize">
                                    {jobDetailData.status}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
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

export default BusinessJobDetailsModal;

