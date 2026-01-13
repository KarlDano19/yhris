import { XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import classNames from '@/helpers/classNames';

interface GigDetailsProps {
  gig: {
    id: number;
    title: string;
    category: string;
    postedDate: string;
    clientName: string;
    clientInitials?: string;
    clientPhoto?: string | null;
    rating: number;
    jobsPosted: number;
    skills: string[];
    budgetMin: number;
    budgetMax: number;
    duration: string;
    proposalsCount: number;
    description: string;
    requirements?: string[];
  };
  onClose: () => void;
  onSendProposal?: () => void;
}

const GigDetails = ({
  gig,
  onClose,
  onSendProposal,
}: GigDetailsProps) => {
  // Get initials from name
  const getInitials = () => {
    if (gig.clientInitials) return gig.clientInitials;
    const names = gig.clientName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return gig.clientName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header with Category, Title, and Close Button */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
              {gig.category}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{gig.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Client Information */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
        {/* Client Avatar */}
        <div className="relative">
          {gig.clientPhoto ? (
            <img
              src={gig.clientPhoto}
              alt={gig.clientName}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
              {getInitials()}
            </div>
          )}
        </div>

        {/* Client Name, Rating, and Jobs Posted */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-semibold text-gray-900">{gig.clientName}</span>
            <div className="flex items-center gap-1">
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">{gig.rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">{gig.jobsPosted} jobs posted</p>
        </div>
      </div>

      {/* Send Proposal Button */}
      <button
        onClick={onSendProposal}
        className="w-full px-4 py-3 bg-savoy-blue text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors mb-6"
      >
        Send Proposal
      </button>

      {/* Budget and Duration */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
        <div>
          <p className="text-sm text-gray-600 mb-1">Budget</p>
          <p className="text-base font-semibold text-gray-900">
            ₱{gig.budgetMin.toLocaleString()} - ₱{gig.budgetMax.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Duration</p>
          <p className="text-base font-semibold text-gray-900">{gig.duration}</p>
        </div>
      </div>

      {/* Project Description */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Project Description</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{gig.description}</p>
      </div>

      {/* Requirements */}
      {gig.requirements && gig.requirements.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Requirements</h3>
          <ul className="space-y-2">
            {gig.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-savoy-blue mt-1">•</span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills Required */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Skills Required</h3>
        <div className="flex flex-wrap gap-2">
          {gig.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Proposals and Posted Date */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{gig.proposalsCount} proposals received</span>
          <span>Posted {gig.postedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;

