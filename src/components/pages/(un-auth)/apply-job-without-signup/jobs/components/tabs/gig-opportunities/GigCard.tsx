import GigDetails from './GigDetails';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import classNames from '@/helpers/classNames';

interface GigCardProps {
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
  isSelected: boolean;
  isGigView: boolean;
  isGigModalOpen: boolean;
  onGigClick: (gigId: number) => void;
  onCloseDetails: () => void;
  onSendProposal?: () => void;
}

const GigCard = ({
  gig,
  isSelected,
  isGigView,
  isGigModalOpen,
  onGigClick,
  onCloseDetails,
  onSendProposal,
}: GigCardProps) => {
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
    <div>
      <div
        className={classNames(
          'bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all',
          isGigView && isSelected ? 'border-savoy-blue' : 'border-gray-200'
        )}
        onClick={() => onGigClick(gig.id)}
      >
      {/* Category and Posted Date */}
      <div className="flex items-center justify-between mb-3">
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
          {gig.category}
        </span>
        <span className="text-xs text-gray-500">{gig.postedDate}</span>
      </div>

      {/* Job Title */}
      <h3 className="text-base font-semibold text-gray-900 mb-3">
        {gig.title}
      </h3>

      {/* Client Information */}
      <div className="flex items-center gap-3 mb-3">
        {/* Client Avatar */}
        <div className="relative">
          {gig.clientPhoto ? (
            <img
              src={gig.clientPhoto}
              alt={gig.clientName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
              {getInitials()}
            </div>
          )}
        </div>

        {/* Client Name and Rating */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">{gig.clientName}</span>
            <div className="flex items-center gap-1">
              <StarIconSolid className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-700">{gig.rating}</span>
            </div>
          </div>
          <p className="text-xs text-gray-600">{gig.jobsPosted} jobs posted</p>
        </div>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {gig.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
          >
            {skill}
          </span>
        ))}
        {gig.skills.length > 3 && (
          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
            +{gig.skills.length - 3}
          </span>
        )}
      </div>

      {/* Budget, Duration, and Proposals */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-0.5">Budget</p>
            <p className="text-sm font-semibold text-gray-900">
              ₱{gig.budgetMin.toLocaleString()} - ₱{gig.budgetMax.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-0.5">Duration</p>
            <p className="text-sm font-semibold text-gray-900">{gig.duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <UserGroupIcon className="h-4 w-4" />
          <span>{gig.proposalsCount} proposals</span>
        </div>
      </div>
      </div>
      {/* Mobile Gig Details Preview */}
      {isGigView && isSelected && (
        <div className='lg:border-l lg:border-gray-300 xl:pl-10 xl:pr-5 py-3 lg:w-[64%] lg:hidden block'>
          <div
            className={classNames(
              'card border border-savoy-blue rounded-md sticky top-10',
              isGigModalOpen ? '' : 'hidden'
            )}
          >
            <div className='flex justify-end px-3 mt-2'>
              <button onClick={onCloseDetails}>
                <XMarkIcon className='h-5 w-5 text-indigo-dye' />
              </button>
            </div>
            <GigDetails
              gig={gig}
              onClose={onCloseDetails}
              onSendProposal={onSendProposal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GigCard;

