import { Fragment } from 'react';

import Image from 'next/image';

import { Dialog, Transition } from '@headlessui/react';

import useGetBusinessJobDetails from '../hooks/useGetBusinessJobDetails';

import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import {
  XMarkIcon,
  ClockIcon,
  CalendarIcon,
  PaperAirplaneIcon,
  CurrencyDollarIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import { formatDateToLocal } from '@/helpers/date';
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

  // Format price range
  const formatPriceRange = () => {
    if (data?.budget_type === 'hourly_rate' && data?.hourly_rate) {
      return `₱ ${formatPrice(data.hourly_rate)}/hour`;
    } else if (data?.budget_type === 'fixed_rate' && data?.min_amount && data?.max_amount) {
      return `₱ ${formatPrice(data.min_amount)} - ₱ ${formatPrice(data.max_amount)}`;
    } else if (data?.min_amount) {
      return `₱ ${formatPrice(data.min_amount)}`;
    } else if (data?.max_amount) {
      return `₱ ${formatPrice(data.max_amount)}`;
    }
    return 'Price not specified';
  };

  // Format distance
  const formatDistance = () => {
    if (data?.distance_km !== null && data?.distance_km !== undefined) {
      return `${data.distance_km} km away`;
    }
    return 'Distance not available';
  };

  // Format status text (replace underscores with spaces and capitalize)
  const formatStatus = (status: string) => {
    if (!status) return '';
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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
                          data?.has_applied
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-savoy-blue hover:bg-blue-700'
                        }`}
                      >
                        {data?.has_applied ? 'Message Client' : 'Accept This Job'}
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
                                  {!isLoading ? data?.job_title || 'Loading job title...' : 'Loading job title...'}
                                </h5>
                                {data?.category && (
                                  <h6 className="text-indigo-dye text-xs md:text-sm mt-1 break-words">
                                    <span className="font-medium text-savoy-blue">Category:</span> {data.category}
                                  </h6>
                                )}
                                <h6 className="text-indigo-dye text-xs md:text-sm mt-1 break-words">
                                  {!isLoading ? data?.location || 'Loading location...' : 'Loading location...'}
                                </h6>
                              </div>
                            </div>
                          </div>
                          {data?.is_urgent && (
                            <div className="flex-shrink-0">
                              <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                                Urgent
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Client Information */}
                        {data?.created_by_name && (
                          <div className="border-t border-gray-300 my-4 pt-4">
                            <h5 className="text-lg md:text-xl font-semibold text-indigo-dye mb-3">Client Information</h5>
                            <div className="flex items-start gap-4">
                              {data.created_by_photo && data.created_by_photo !== '/assets/no-user.png' ? (
                                <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                  <Image
                                    src={data.created_by_photo}
                                    alt={data.created_by_name}
                                    width={56}
                                    height={56}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-savoy-blue flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
                                  {getInitials(data.created_by_name)}
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {data.created_by_name}
                                </h3>
                                <div className="flex items-center gap-1">
                                  <StarIconSolid className="h-4 w-4 text-yellow-400" />
                                  <span className="text-sm font-semibold text-gray-700">
                                    {data.created_by_rating || 0}
                                  </span>
                                  <span className="text-sm text-gray-500 ml-1">
                                    ({data.created_by_reviews_count || 0} reviews)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Job Details - Only show if there's data to display */}
                        {(!isLoading && (
                          data?.description ||
                          (data?.distance_km !== null && data?.distance_km !== undefined) ||
                          data?.contract_start_date ||
                          data?.contract_end_date ||
                          data?.time_from ||
                          data?.time_to ||
                          data?.budget_type ||
                          data?.min_amount ||
                          data?.max_amount ||
                          data?.hourly_rate ||
                          data?.status
                        )) && (
                          <div className="border-t border-gray-300 my-4 pt-4">
                            <h5 className="text-lg md:text-xl font-semibold text-indigo-dye mb-3">Job Details</h5>
                            <div className="details mt-2 space-y-3">
                              {/* Description */}
                              {data?.description && (
                                <div>
                                  <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                                    <ClipboardDocumentIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                                    Description
                                  </h6>
                                  <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px] break-words">
                                    {data.description}
                                  </p>
                                </div>
                              )}

                              {/* Distance */}
                              {data?.distance_km !== null && data?.distance_km !== undefined && (
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

                              {/* Contract Dates */}
                              {data?.contract_start_date && (
                                <div>
                                  <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                                    <CalendarIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                                    Contract Period
                                  </h6>
                                  <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]">
                                    {formatDateToLocal(data.contract_start_date, true)}
                                    {data.contract_end_date && (
                                      <> - {formatDateToLocal(data.contract_end_date, true)}</>
                                    )}
                                    {!data.contract_end_date && (
                                      <span className="text-gray-500"> (Single day)</span>
                                    )}
                                  </p>
                                </div>
                              )}

                              {/* Work Hours */}
                              {(data?.time_from || data?.time_to) && (
                                <div>
                                  <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                                    <ClockIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                                    Work Hours
                                  </h6>
                                  <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]">
                                    {data.time_from && data.time_to
                                      ? `${data.time_from} - ${data.time_to}`
                                      : data.time_from || data.time_to}
                                  </p>
                                </div>
                              )}

                              {/* Budget/Price */}
                              {(data?.budget_type || data?.min_amount || data?.max_amount || data?.hourly_rate) && (
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

                              {/* Status */}
                              {data?.status && (
                                <div>
                                  <h6 className="text-sm md:text-[15px] flex items-center text-savoy-blue font-medium mb-1">
                                    <CheckCircleIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                                    Status
                                  </h6>
                                  <p className="text-xs md:text-[13px] text-indigo-dye mt-1 ml-[28px]">
                                    {formatStatus(data.status)}
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

