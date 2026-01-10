import { useState, useEffect } from 'react';

import Image from 'next/image';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useToggleAvailability from '../hooks/useToggleAvailability';

import { StarIcon } from '@heroicons/react/24/solid';

interface ProfileCardProps {
  name: string;
  about?: string | null;
  title?: string;
  initial: string;
  profileCompletion?: number;
  rating?: number | null;
  reviewCount?: number;
  profilePhoto?: string | null;
  // Business mode props
  availableForBookings?: boolean;
  earnings?: number;
  spending?: number;
  onAvailabilityChange?: (isAvailable: boolean) => void;
}

const ProfileCard = ({ 
  name, 
  about = null,
  title,
  initial, 
  profileCompletion,
  rating = null, 
  reviewCount = 0,
  profilePhoto = null,
  availableForBookings: initialAvailableForBookings,
  earnings,
  spending,
  onAvailabilityChange,
}: ProfileCardProps) => {
  // Initialize state with the prop value, defaulting to false if undefined
  // This ensures we don't show true before API data loads
  const [availableForBookings, setAvailableForBookings] = useState(
    initialAvailableForBookings !== undefined ? initialAvailableForBookings : false
  );
  const toggleAvailabilityMutation = useToggleAvailability();
  
  // Determine business mode: only if earnings, spending, or onAvailabilityChange are explicitly provided
  const isBusinessMode = earnings !== undefined || spending !== undefined || onAvailabilityChange !== undefined;

  // Update local state when prop changes (only if prop is actually provided, not undefined)
  useEffect(() => {
    if (initialAvailableForBookings !== undefined) {
      setAvailableForBookings(initialAvailableForBookings);
    }
  }, [initialAvailableForBookings]);

  const handleToggle = async () => {
    try {
      const result = await toggleAvailabilityMutation.mutateAsync();
      
      // Update local state with the server response
      setAvailableForBookings(result.available_for_bookings);
      
      // Call the callback with the new value
      onAvailabilityChange?.(result.available_for_bookings);
      
      // Show success toast
      toast.custom(
        () => <CustomToast message={result.message} type="success" />,
        { duration: 3000 }
      );
    } catch (error: any) {
      // Show error toast
      const errorMessage = error || 'Failed to update availability';
      toast.custom(
        () => <CustomToast message={errorMessage} type="error" />,
        { duration: 5000 }
      );
    }
  };

  // Format amount with K notation
  const formatAmount = (amount: number): string => {
    if (amount >= 1000) {
      const kValue = amount / 1000;
      return `₱${kValue % 1 === 0 ? kValue.toFixed(0) : kValue.toFixed(1)}k`;
    }
    return `₱${amount.toLocaleString()}`;
  };

  // Format about text - truncate if too long
  const aboutDisplay = about && about.trim() ? about.trim() : 'No description available';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Gradient Header - Same style for both modes */}
      <div className="h-28 bg-gradient-to-r from-blue-300/60 via-purple-300/60 to-amber-200/60 relative">
        {/* Profile Picture - Square with shadow for both modes */}
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
      <div className="pt-14 px-6 pb-6 text-center">
        {/* Name - Centered, Bold, Dark */}
        <div className="text-center mb-2">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        </div>

        {/* Description - Same for both modes */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 line-clamp-3">{aboutDisplay}</p>
        </div>

        {/* Rating - Centered with Star, Rating, and Review Count - Same style for both modes */}
        <div className={`flex items-center justify-center gap-1.5 ${isBusinessMode ? 'mb-4' : profileCompletion !== undefined && profileCompletion < 100 ? 'mb-6' : ''}`}>
          <StarIcon className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          <span className="text-base font-bold text-gray-900">{rating !== null && rating !== undefined ? rating : 'N/A'}</span>
          <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
        </div>

        {/* Business Mode: Available Toggle - Only show if onAvailabilityChange is provided */}
        {isBusinessMode && onAvailabilityChange !== undefined && (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-4">
            <span className="text-sm font-medium text-gray-700">Available for bookings</span>
            <button
              type="button"
              onClick={handleToggle}
              disabled={toggleAvailabilityMutation.isLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                availableForBookings ? 'bg-green-500' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={availableForBookings}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                availableForBookings ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        )}

        {/* Business Mode: Earnings and Spending */}
        {isBusinessMode && (earnings !== undefined || spending !== undefined) && (
          <div className="grid grid-cols-2 gap-3">
            {earnings !== undefined && (
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-lg font-bold text-green-600">{formatAmount(earnings)}</p>
                <p className="text-xs text-green-700 font-medium">Earnings</p>
              </div>
            )}
            {spending !== undefined && (
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-lg font-bold text-red-600">{formatAmount(spending)}</p>
                <p className="text-xs text-red-700 font-medium">Spending</p>
              </div>
            )}
          </div>
        )}

        {/* Personal Mode: Profile Completion - Show when not 100% complete */}
        {!isBusinessMode && profileCompletion !== undefined && profileCompletion !== null && profileCompletion < 100 && (
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
        )}
      </div>
    </div>
  );
};

export default ProfileCard;

