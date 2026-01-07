'use client';

import { useState } from 'react';
import { CurrencyDollarIcon, ChatBubbleLeftRightIcon, CalendarIcon, MapPinIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import JobChatModal from '../find-work/modals/JobChatModal';
import { useMyJobsData } from '../../hooks/useMyJobsData';

const Content = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedJobForMessage, setSelectedJobForMessage] = useState<{
    id: number;
    clientName: string;
    clientInitials?: string;
    title: string;
  } | null>(null);
  const [startedJobIds, setStartedJobIds] = useState<Set<number>>(new Set());

  const { activeJobs, reviews } = useMyJobsData();

  const handleMessageJob = (job: { id: number; clientName: string; clientInitials?: string; title: string }) => {
    setSelectedJobForMessage({
      id: job.id,
      clientName: job.clientName,
      clientInitials: job.clientInitials,
      title: job.title,
    });
    setIsChatModalOpen(true);
  };

  const handleStartJob = (jobId: number) => {
    setStartedJobIds(prev => new Set(prev).add(jobId));
    // TODO: Implement API call to start job
    console.log('Starting job:', jobId);
  };


  return (
    <div className="space-y-6">
      {/* My Jobs Header */}
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">My Active Jobs</h2>
          <p className="text-sm text-gray-600">Manage your active and upcoming jobs</p>
        </div>

        {/* Active Jobs List */}
        <div className="space-y-4">
          {activeJobs.map((job) => (
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
                {startedJobIds.has(job.id) ? (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                    In Progress
                  </span>
                ) : job.status === 'accepted' && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                    Scheduled
                  </span>
                )}
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold">
                  {job.clientInitials}
                </div>
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

              {/* Payment Waiting Banner */}
              {startedJobIds.has(job.id) && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">Waiting for client payment before completion</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleMessageJob(job)}
                  className="flex-1 px-4 py-2 border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Message
                </button>
                {startedJobIds.has(job.id) ? (
                  <button className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg font-medium cursor-not-allowed">
                    Awaiting Payment
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartJob(job.id)}
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
        <JobChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedJobForMessage(null);
          }}
          clientName={selectedJobForMessage.clientName}
          clientInitials={selectedJobForMessage.clientInitials || selectedJobForMessage.clientName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
          jobTitle={selectedJobForMessage.title}
        />
      )}
    </div>
  );
};

export default Content;
