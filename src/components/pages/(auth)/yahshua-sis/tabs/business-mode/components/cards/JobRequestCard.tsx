'use client';

import { MapPinIcon, StarIcon, ClockIcon, MapIcon, CurrencyDollarIcon, UserIcon } from '@heroicons/react/24/outline';

interface JobRequestCardProps {
  id: number;
  title: string;
  clientName: string;
  clientLocation: string;
  distance: string;
  rating: number;
  hiresCount: number;
  description: string;
  time: string;
  priceRange: string;
  tags: string[];
  urgent?: boolean;
}

const JobRequestCard = ({
  title,
  clientName,
  clientLocation,
  distance,
  rating,
  hiresCount,
  description,
  time,
  priceRange,
  tags,
  urgent = false,
}: JobRequestCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-savoy-blue transition-all p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {urgent && (
            <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded mb-2">
              Urgent
            </span>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <MapIcon className="h-4 w-4" />
            <span className="font-medium">{distance}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        </div>
      </div>

      {/* Client Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{clientName}</span>
        </div>
        <div className="flex items-center gap-1">
          <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold">{rating}</span>
          <span className="text-xs text-gray-500">({hiresCount} hires)</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <ClockIcon className="h-4 w-4 text-gray-500" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPinIcon className="h-4 w-4 text-gray-500" />
          <span>{clientLocation}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
          <span className="font-semibold">{priceRange}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 bg-savoy-blue text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Accept Job
        </button>
        <button className="px-4 py-2.5 border border-savoy-blue text-savoy-blue rounded-lg font-medium hover:bg-blue-50 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default JobRequestCard;

