'use client';

import { useState, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import Modal from '../components/Modal';

import { formatDateToLocal } from '@/helpers/date';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { T_Application } from '@/types/personal-mode';

interface MyApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyApplicationsModal = ({ isOpen, onClose }: MyApplicationsModalProps) => {
  // Get applications data from cache
  const queryClient = useQueryClient();
  const cachedApplications = queryClient
    .getQueryCache()
    .find(['jobAppliedCache', {}]) as {
    state: { data: { data?: any[]; } | any[] } | undefined;
  };
  const applicationsData = cachedApplications?.state?.data;
  const isLoading = !applicationsData;
  const [transformedApplications, setTransformedApplications] = useState<T_Application[]>([]);

  // Transform API data to match the display format
  useEffect(() => {
    if (!applicationsData) {
      setTransformedApplications([]);
      return;
    }

    // Handle response structure (data might be wrapped in 'data' field or at root level)
    const applications = Array.isArray(applicationsData)
      ? applicationsData
      : (applicationsData as any)?.data || [];

    if (!Array.isArray(applications)) {
      setTransformedApplications([]);
      return;
    }

    const transformed = applications.map((application: any) => {
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
        id: application.id || application.job_posting_id, 
        title: application.job_title || 'Untitled Job',
        company: application.employer_name || 'Unknown Company',
        logo: getCompanyInitials(application.employer_name || '?'),
        appliedDate: formatDateToLocal(application.created_at, true) || 'N/A',
        status: application.job_stages_title || application.status || 'Pending',
        applied_job_status: application.status || application.applied_job_status,
        applied_job_updated_at: application.updated_at || application.applied_job_updated_at,
      };
    });

    setTransformedApplications(transformed);
  }, [applicationsData]);
  const getApplicationStatusBadge = (application: T_Application) => {
    const status = application.applied_job_status;
    const updatedAt = application.applied_job_updated_at;
    
    // Compute rejection expiry: 15 days from updatedAt
    if (status === 'rejected' && updatedAt) {
      try {
        const updatedDate = new Date(updatedAt);
        const now = new Date();
        const diffMs = now.getTime() - updatedDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        if (diffDays <= 15) {
          return {
            text: 'Rejected',
            className: 'bg-red-100 text-red-700 ',
          };
        }
        // If rejection expired, fallthrough to show Applied
      } catch (e) {
        // parsing error -> show Applied
      }
    }

    if (status === 'hired' || status === 'passed') {
      return {
        text: 'Hired',
        className: 'bg-green-100 text-green-700',
      };
    }

    if (status === 'ongoing') {
      return {
        text: 'Ongoing',
        className: 'bg-blue-100 text-blue-700',
      };
    }

    // default: Applied
    return {
      text: 'Applied',
      className: 'bg-gray-100 text-gray-700',
    };
  };

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="My Applications"
      size="2xl"
    >
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
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {transformedApplications.map((application) => (
            <div
              key={application.id}
              className="flex sm:flex-row flex-col sm:items-start items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-savoy-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {application.logo}
              </div>
              <div className="flex-1 min-w-0 flex sm:flex-row flex-col sm:items-start items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1 break-words">{application.title}</h4>
                  <p className="text-sm text-gray-600 mb-2 break-words">{application.company}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Stage status badge (existing) */}
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-sm ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Applied: {application.appliedDate}
                    </span>
                  </div>
                </div>
                {/* Application status badge (new, on the right) */}
                <div className="flex-shrink-0">
                  {(() => {
                    const badge = getApplicationStatusBadge(application);
                    return (
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-sm ${badge.className}`}
                      >
                        {badge.text}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default MyApplicationsModal;



