'use client';

import { useState, useMemo } from 'react';

import ChatModal from '../../../../modals/ChatModal';
import useGetMyAppliedJobs from './hooks/useGetMyAppliedJobs';

import { CurrencyDollarIcon, ChatBubbleLeftRightIcon, CalendarIcon, MapPinIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ActiveJob {
  id: number;
  applicationId: number;
  title: string;
  clientName: string;
  clientInitials: string;
  clientPhoto: string | null;
  clientId: number;
  location: string;
  time: string;
  priceRange: string;
  status: string;
  workStatus: string;
  paymentStatus: string;
  urgent: boolean;
}

const Content = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedJobForMessage, setSelectedJobForMessage] = useState<{
    id: number;
    clientId: number;
    clientName: string;
    clientInitials: string;
    title: string;
  } | null>(null);

  // Fetch my applied jobs where I've been accepted (hired)
  // Note: Remove application_status filter to show all applied jobs for now
  const { data, isLoading, isError } = useGetMyAppliedJobs({
    page_size: 50,
  });

  // Transform API data to ActiveJob format
  const activeJobs: ActiveJob[] = useMemo(() => {
    if (!data?.records) return [];

    return data.records.map((job: any) => {
      // Format time
      let timeStr = '';
      if (job.date) {
        const date = new Date(job.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
        
        if (job.time_from && job.time_to) {
          timeStr = `${formattedDate}, ${job.time_from} - ${job.time_to}`;
        } else {
          timeStr = formattedDate;
        }
      }

      // Format price range
      let priceRange = '';
      if (job.budget_type === 'fixed_rate') {
        if (job.min_amount && job.max_amount) {
          priceRange = `₱${job.min_amount.toLocaleString()} - ₱${job.max_amount.toLocaleString()}`;
        } else if (job.min_amount) {
          priceRange = `₱${job.min_amount.toLocaleString()}`;
        }
      } else if (job.budget_type === 'hourly_rate' && job.hourly_rate) {
        priceRange = `₱${job.hourly_rate.toLocaleString()}/hr`;
      }

      // Get initials from client name
      const getInitials = (name: string) => {
        if (!name) return 'NA';
        return name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
      };

      return {
        id: job.id,
        applicationId: job.application_id,
        title: job.job_title,
        clientName: job.created_by_name || 'Unknown',
        clientInitials: getInitials(job.created_by_name || 'NA'),
        clientPhoto: job.created_by_photo || null,
        clientId: job.created_by,
        location: job.location || 'Location not specified',
        time: timeStr,
        priceRange: priceRange || 'Budget not specified',
        status: job.application_status,
        workStatus: job.application_work_status || 'not_started',
        paymentStatus: job.application_payment_status || 'pending',
        urgent: job.is_urgent || false,
      };
    });
  }, [data]);

  const handleMessageJob = (job: ActiveJob) => {
    setSelectedJobForMessage({
      id: job.id,
      clientId: job.clientId,
      clientName: job.clientName,
      clientInitials: job.clientInitials,
      title: job.title,
    });
    setIsChatModalOpen(true);
  };

  const handleStartJob = (applicationId: number) => {
    // TODO: Implement API call to start job
    console.log('Starting job with application ID:', applicationId);
  };


  return (
    <div className="space-y-6">
      {/* My Jobs Header */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">My Jobs</h2>
          <p className="text-sm text-gray-600">Manage your job applications and active jobs</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-savoy-blue"></div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-800">Failed to load jobs. Please try again later.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && activeJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No job applications found</p>
            <p className="text-gray-400 text-sm mt-1">Apply to jobs in the Find Work section</p>
          </div>
        )}

        {/* Active Jobs List */}
        <div className="space-y-4">
          {!isLoading && !isError && activeJobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white border-2 rounded-xl p-5 hover:shadow-md transition-all ${
                job.urgent ? 'border-red-500' : 'border-gray-200'
              }`}
            >
              {/* Header with Status Badges */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    {job.urgent && (
                      <span className="inline-block px-2.5 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
                {job.status === 'pending' ? (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">
                    Pending Approval
                  </span>
                ) : job.workStatus === 'started' ? (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                    In Progress
                  </span>
                ) : job.workStatus === 'completed' ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                    Completed
                  </span>
                ) : job.status === 'accepted' ? (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                    Scheduled
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                    {job.status}
                  </span>
                )}
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-3 mb-4">
                {job.clientPhoto ? (
                  <img
                    src={job.clientPhoto}
                    alt={job.clientName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold">
                    {job.clientInitials}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{job.clientName}</p>
                </div>
              </div>

              {/* Job Details */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span>{job.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold text-green-600">{job.priceRange}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-gray-500" />
                  <span>{job.location}</span>
                </div>
              </div>

              {/* Payment Status Banner */}
              {job.workStatus === 'completed' && job.paymentStatus === 'pending' && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">Waiting for client payment</p>
                </div>
              )}

              {job.workStatus === 'completed' && job.paymentStatus === 'paid' && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-800">Payment received - Job completed!</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleMessageJob(job)}
                  className="flex-1 px-4 py-2 border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Message Client
                </button>
                {job.status === 'pending' ? (
                  <button className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed">
                    Awaiting Client Response
                  </button>
                ) : job.workStatus === 'completed' ? (
                  <button className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed">
                    {job.paymentStatus === 'paid' ? 'Completed' : 'Awaiting Payment'}
                  </button>
                ) : job.workStatus === 'started' ? (
                  <button
                    onClick={() => handleStartJob(job.applicationId)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Mark as Complete
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartJob(job.applicationId)}
                    className="flex-1 px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Start Job
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page-specific Modals */}
      {/* Chat Modal */}
      {selectedJobForMessage && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedJobForMessage(null);
          }}
          recipientId={selectedJobForMessage.clientId}
          recipientName={selectedJobForMessage.clientName}
          recipientInitials={selectedJobForMessage.clientInitials}
          jobId={selectedJobForMessage.id}
          jobTitle={selectedJobForMessage.title}
        />
      )}
    </div>
  );
};

export default Content;
