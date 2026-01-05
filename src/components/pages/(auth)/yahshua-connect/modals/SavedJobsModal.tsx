'use client';

import { Fragment, useMemo } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useGetSavedJobs from '../hooks/useGetSavedJobs';
import useUpdateSavedJobs from '../hooks/useUpdateSavedJobs';

import { XMarkIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

import formatPrice from '@/helpers/currencyFormat';

interface SavedJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SavedJobsModal = ({ isOpen, onClose }: SavedJobsModalProps) => {
  const { data: savedJobsData, isLoading, refetch } = useGetSavedJobs();
  const deleteSavedJobMutation = useUpdateSavedJobs();

  // Transform API data to match the display format
  const transformedSavedJobs = useMemo(() => {
    if (!savedJobsData || !Array.isArray(savedJobsData)) return [];

    return savedJobsData.map((savedJob: any) => {
      const job = savedJob.job_posting || {};
      
      // Get company initials for logo
      const getCompanyInitials = (companyName: string) => {
        if (!companyName) return '?';
        const words = companyName.trim().split(/\s+/);
        if (words.length >= 2) {
          return (words[0][0] + words[1][0]).toUpperCase();
        }
        return companyName.substring(0, 2).toUpperCase();
      };

      // Format salary
      const formatSalary = () => {
        if (!job.salary_range_type) return 'Salary not disclosed';
        
        if (job.salary_range_type === 'Range' && job.minimum_amount && job.maximum_amount) {
          return `₱ ${formatPrice(parseFloat(job.minimum_amount))} - ₱ ${formatPrice(parseFloat(job.maximum_amount))}`;
        } else if (job.exact_amount) {
          return `₱ ${formatPrice(parseFloat(job.exact_amount))}`;
        }
        return 'Salary not disclosed';
      };

      return {
        id: job.id || savedJob.job_posting_id,
        savedJobId: savedJob.id,
        title: job.job_title || 'Untitled Job',
        company: job.employer_name || 'Unknown Company',
        location: job.advertise_to || 'Location not specified',
        salary: formatSalary(),
        logo: getCompanyInitials(job.employer_name || '?'),
        logoUrl: job.company_logo || undefined,
        saved: true,
      };
    });
  }, [savedJobsData]);

  const handleUnsave = (jobPostingId: number) => {
    deleteSavedJobMutation.mutate(jobPostingId, {
      onSuccess: () => {
        toast.custom(
          () => <CustomToast message="Job removed from saved jobs" type="success" />,
          { duration: 3000 }
        );
        refetch(); // Refetch to update the list
      },
      onError: (error: any) => {
        const errorMessage = error?.message || error || 'Failed to remove job from saved jobs';
        toast.custom(
          () => <CustomToast message={errorMessage} type="error" />,
          { duration: 4000 }
        );
      },
    });
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <Dialog.Title as="h3" className="text-xl font-bold text-gray-900">
                    Saved Jobs
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-gray-500">Loading saved jobs...</div>
                    </div>
                  ) : transformedSavedJobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <BookmarkIcon className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-center">No saved jobs yet</p>
                      <p className="text-sm text-gray-400 text-center mt-1">Start saving jobs to see them here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transformedSavedJobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg bg-savoy-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                            {job.logoUrl ? (
                              <img 
                                src={job.logoUrl} 
                                alt={job.company}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<span class="text-white font-bold text-sm">${job.logo}</span>`;
                                  }
                                }}
                              />
                            ) : (
                              <span>{job.logo}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                            <p className="text-sm text-gray-600 mb-1">
                              {job.company} • {job.location}
                            </p>
                            <p className="text-sm font-semibold text-savoy-blue mb-2">{job.salary}</p>
                          </div>
                          <button
                            onClick={() => handleUnsave(job.id)}
                            className="text-savoy-blue hover:text-blue-700 transition-colors flex-shrink-0"
                            title="Remove from saved jobs"
                          >
                            <BookmarkIconSolid className="h-6 w-6" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SavedJobsModal;



