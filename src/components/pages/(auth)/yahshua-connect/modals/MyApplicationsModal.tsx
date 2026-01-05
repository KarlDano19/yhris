'use client';

import { Fragment, useMemo } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import useGetApplicationByUser from '../hooks/useGetApplicationByUser';

import { formatDateToLocal } from '@/helpers/date';

import { XMarkIcon, CheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface MyApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyApplicationsModal = ({ isOpen, onClose }: MyApplicationsModalProps) => {
  const { data: applicationsData, isLoading } = useGetApplicationByUser({});

  // Transform API data to match the display format
  const transformedApplications = useMemo(() => {
    if (!applicationsData || !Array.isArray(applicationsData)) return [];

    return applicationsData.map((application: any) => {
      // Get company initials for logo
      const getCompanyInitials = (companyName: string) => {
        if (!companyName) return '?';
        const words = companyName.trim().split(/\s+/);
        if (words.length >= 2) {
          return (words[0][0] + words[1][0]).toUpperCase();
        }
        return companyName.substring(0, 2).toUpperCase();
      };

      return {
        id: application.id,
        title: application.job_title || 'Untitled Job',
        company: application.employer_name || 'Unknown Company',
        logo: getCompanyInitials(application.employer_name || '?'),
        appliedDate: formatDateToLocal(application.created_at, true) || 'N/A',
        status: application.job_stages_title || application.status || 'Pending',
      };
    });
  }, [applicationsData]);
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'under review':
        return 'bg-yellow-100 text-yellow-700';
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
                    My Applications
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
                      <div className="text-gray-500">Loading applications...</div>
                    </div>
                  ) : transformedApplications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <DocumentTextIcon className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-center">No applications yet</p>
                      <p className="text-sm text-gray-400 text-center mt-1">Start applying to jobs to see them here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transformedApplications.map((application) => (
                        <div
                          key={application.id}
                          className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg bg-savoy-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {application.logo}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{application.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{application.company}</p>
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  application.status
                                )}`}
                              >
                                {application.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                Applied: {application.appliedDate}
                              </span>
                            </div>
                          </div>
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

export default MyApplicationsModal;



