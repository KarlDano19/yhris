import Image from 'next/image';

import { StarIcon } from '@heroicons/react/24/solid';

interface ProfileCardProps {
  name: string;
  skills?: string[];
  initial: string;
  profileCompletion: number;
  rating?: number | null;
  reviewCount?: number;
  profilePhoto?: string | null;
}

const ProfileCard = ({ 
  name, 
  skills = [], 
  initial, 
  profileCompletion, 
  rating = null, 
  reviewCount = 0,
  profilePhoto = null 
}: ProfileCardProps) => {
  // Format skills with bullet points
  const skillsDisplay = skills.length > 0 ? skills.join(' • ') : 'Aspiring Professional';
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Gradient Header - Muted blue/purple to muted yellow/orange */}
      <div className="h-28 bg-gradient-to-r from-blue-300/60 via-purple-300/60 to-amber-200/60 relative">
        {/* Square Profile Picture - Overlapping the gradient */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-lg border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
            {profilePhoto && profilePhoto !== '/assets/no-user.png' ? (
              <Image
                src={profilePhoto}
                alt={name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold">
                {initial}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 px-6 pb-6">
        {/* Name - Centered, Bold, Dark */}
        <div className="text-center mb-2">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        </div>

        {/* Skills - Centered, Smaller, Light Gray */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">{skillsDisplay}</p>
        </div>

        {/* Rating - Centered with Star, Rating, and Review Count */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <StarIcon className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <span className="text-base font-bold text-gray-900">{rating !== null && rating !== undefined ? rating : 'N/A'}</span>
          <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
        </div>

        {/* Profile Completion - Label left, progress bar middle, percentage right */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 flex-shrink-0">Profile Completion</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-indigo-700 flex-shrink-0">{profileCompletion}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

