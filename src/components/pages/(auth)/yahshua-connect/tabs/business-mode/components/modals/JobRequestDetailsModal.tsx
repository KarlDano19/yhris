

import { MapPinIcon, ClockIcon, PaperAirplaneIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import Modal from '../../../../components/Modal';

interface JobRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: number;
    title: string;
    clientName: string;
    clientInitials?: string;
    clientLocation: string;
    distance: string;
    rating: number;
    hiresCount: number;
    description: string;
    time: string;
    priceRange: string;
    tags: string[];
    urgent?: boolean;
    status?: 'pending' | 'accepted' | 'scheduled' | 'completed' | 'cancelled';
  };
  onAcceptJob: (jobId: number) => void;
}

const JobRequestDetailsModal = ({
  isOpen,
  onClose,
  job,
  onAcceptJob,
}: JobRequestDetailsModalProps) => {
  // Generate initials from client name if not provided
  const getInitials = () => {
    if (job.clientInitials) return job.clientInitials;
    const names = job.clientName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return job.clientName.substring(0, 2).toUpperCase();
  };

  const handleAcceptJob = () => {
    onAcceptJob(job.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Job Request Details"
      size="2xl"
      footerContent={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleAcceptJob}
            className="px-6 py-2.5 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors"
          >
            Accept This Job
          </button>
        </div>
      }
    >
      <div className="max-h-[70vh] overflow-y-auto -mx-5 px-5">
                  {/* Job Overview */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h2>
                      {job.tags && job.tags.length > 0 && (
                        <p className="text-sm text-gray-600">{job.tags[0]}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">{job.priceRange}</p>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-14 h-14 rounded-lg bg-savoy-blue flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
                      {getInitials()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {job.clientName}
                      </h3>
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">{job.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">
                          ({job.hiresCount} previous hires)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-700">{job.description}</p>
                  </div>

                  {/* Job Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <MapPinIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Location</p>
                          <p className="text-sm font-semibold text-gray-900">{job.clientLocation}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <ClockIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Schedule</p>
                          <p className="text-sm font-semibold text-gray-900">{job.time}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <PaperAirplaneIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Distance</p>
                          <p className="text-sm font-semibold text-gray-900">{job.distance}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Budget</p>
                          <p className="text-sm font-semibold text-green-600">{job.priceRange}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Required Skills */}
                  {job.tags && job.tags.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
      </div>
    </Modal>
  );
};

export default JobRequestDetailsModal;

