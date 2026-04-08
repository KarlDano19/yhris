import TalentDetails from './TalentDetails';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { MapPinIcon } from '@heroicons/react/24/outline';
import classNames from '@/helpers/classNames';

interface TalentCardProps {
  talent: {
    id: number;
    name: string;
    title: string;
    rating: number;
    reviews: number;
    jobsDone: number;
    location: string;
    hourlyMin: number;
    hourlyMax: number;
    skills: string[];
    languages: string[];
    availability?: string;
    education?: string;
    about?: string;
    photo?: string | null;
    portfolio_url?: string | null;
    description?: string | null;
    setup_preference?: string | null;
  };
  isSelected: boolean;
  isTalentView: boolean;
  isTalentModalOpen: boolean;
  onTalentClick: (talentId: number) => void;
  onCloseDetails: () => void;
  onBookNow?: () => void;
}

const TalentCard = ({
  talent,
  isSelected,
  isTalentView,
  isTalentModalOpen,
  onTalentClick,
  onCloseDetails,
  onBookNow,
}: TalentCardProps) => {
  // Get initials from name
  const getInitials = () => {
    const names = talent.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return talent.name.substring(0, 2).toUpperCase();
  };

  return (
    <div>
      <div
        className={classNames(
          'bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all',
          isTalentView && isSelected ? 'border-green-500' : 'border-gray-200'
        )}
        onClick={() => onTalentClick(talent.id)}
      >
      {/* Avatar and Basic Info */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="relative">
          {talent.photo ? (
            <img
              src={talent.photo}
              alt={talent.name}
              className="h-14 w-14 rounded-lg object-cover"
            />
          ) : (
            <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-semibold text-lg">
              {getInitials()}
            </div>
          )}
          {/* Verified Badge */}
          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="text-xs text-white">✓</span>
          </div>
        </div>

        {/* Name and Title */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-base font-semibold text-gray-900">{talent.name}</h3>
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-sm text-gray-600 mb-2">{talent.title}</p>

          {/* Rating and Jobs Done */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold text-gray-900">{talent.rating}</span>
              <span className="text-gray-500">({talent.reviews})</span>
            </div>
            <span className="text-gray-300">•</span>
            <span>{talent.jobsDone} jobs done</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPinIcon className="h-4 w-4" />
            <span>{talent.location}</span>
          </div>
        </div>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {talent.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-200"
          >
            {skill}
          </span>
        ))}
        {talent.skills.length > 4 && (
          <span className="px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-200">
            +{talent.skills.length - 4}
          </span>
        )}
      </div>

      {/* Hourly Rate and Availability */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-600">Hourly Rate</p>
          <p className="text-sm font-semibold text-gray-900">
            ₱{talent.hourlyMin.toLocaleString()} - ₱{talent.hourlyMax.toLocaleString()}/hr
          </p>
        </div>
        {talent.availability && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              talent.availability === 'Available Now'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {talent.availability === 'Available Now' ? talent.availability : 'Limited Availability'}
          </span>
        )}
      </div>
      </div>
      {/* Mobile Talent Details Preview */}
      {isTalentView && isSelected && (
        <div className='lg:border-l lg:border-gray-300 xl:pl-10 xl:pr-5 py-3 lg:w-[64%] lg:hidden block'>
          <div
            className={classNames(
              'card border border-green-500 rounded-md sticky top-10',
              isTalentModalOpen ? '' : 'hidden'
            )}
          >
            <div className='flex justify-end px-3 mt-2'>
              <button onClick={onCloseDetails}>
                <XMarkIcon className='h-5 w-5 text-indigo-dye' />
              </button>
            </div>
            <TalentDetails
              talent={talent}
              onClose={onCloseDetails}
              onBookNow={onBookNow}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TalentCard;

