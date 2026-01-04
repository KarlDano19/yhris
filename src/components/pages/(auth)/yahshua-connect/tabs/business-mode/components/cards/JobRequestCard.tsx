'use client';

import { MapPinIcon, StarIcon, ClockIcon, CurrencyDollarIcon, ChatBubbleLeftRightIcon, CheckIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface JobRequestCardProps {
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
  onAcceptJob?: (jobId: number) => void;
  onMessage?: (jobId: number) => void;
  onViewDetails?: (jobId: number) => void;
}

const JobRequestCard = ({
  id,
  title,
  clientName,
  clientInitials,
  clientLocation,
  distance,
  rating,
  hiresCount,
  description,
  time,
  priceRange,
  tags,
  urgent = false,
  status,
  onAcceptJob,
  onMessage,
  onViewDetails,
}: JobRequestCardProps) => {
  const isAccepted = status === 'accepted' || status === 'scheduled';
  
  // Generate initials from client name if not provided
  const getInitials = () => {
    if (clientInitials) return clientInitials;
    const names = clientName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return clientName.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5 relative">
      {/* Client Avatar - Top Right */}
      <div className="absolute top-5 right-5">
        <div className="w-12 h-12 rounded-full bg-savoy-blue flex items-center justify-center text-white font-semibold text-sm">
          {getInitials()}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3 pr-16">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {urgent && (
              <span className="inline-block px-2.5 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                Urgent
              </span>
            )}
          </div>
          
          {/* Client Name and Rating */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-900">{clientName}</span>
            <div className="flex items-center gap-0.5">
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">{rating}</span>
              <span className="text-xs text-gray-500 ml-1">({hiresCount || 0} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 pr-16">{description}</p>

      {/* Location, Time, and Distance */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4" />
          <span>{clientLocation}</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2">
          <PaperAirplaneIcon className="h-4 w-4" />
          <span>{distance}</span>
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <span className="text-sm font-semibold text-green-600">{priceRange}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {isAccepted ? (
          <>
            <button
              onClick={() => onMessage?.(id)}
              className="flex-1 px-4 py-2 border border-savoy-blue text-savoy-blue bg-white rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
            >
              Message
            </button>
            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <CheckIcon className="h-5 w-5" />
              Accepted
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onViewDetails?.(id)}
              className="flex-1 px-4 py-2 border border-savoy-blue text-savoy-blue bg-white rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors"
            >
              View Details
            </button>
            <button
              onClick={() => onAcceptJob?.(id)}
              className="flex-1 px-4 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-savoy-blue/90 transition-colors"
            >
              Accept Job
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default JobRequestCard;

