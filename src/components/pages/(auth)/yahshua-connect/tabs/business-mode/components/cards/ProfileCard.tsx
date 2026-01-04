'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface ProfileCardProps {
  name: string;
  title: string;
  rating: number;
  reviewsCount: number;
  initial: string;
  availableForBookings?: boolean;
  earnings?: number;
  spending?: number;
  onAvailabilityChange?: (isAvailable: boolean) => void;
}

const ProfileCard = ({ 
  name, 
  title, 
  rating, 
  reviewsCount, 
  initial,
  availableForBookings: initialAvailableForBookings = true,
  earnings,
  spending,
  onAvailabilityChange,
}: ProfileCardProps) => {
  const [availableForBookings, setAvailableForBookings] = useState(initialAvailableForBookings);

  const handleToggle = () => {
    const newValue = !availableForBookings;
    setAvailableForBookings(newValue);
    onAvailabilityChange?.(newValue);
  };

  // Format amount with K notation
  const formatAmount = (amount: number): string => {
    if (amount >= 1000) {
      const kValue = amount / 1000;
      return `₱${kValue % 1 === 0 ? kValue.toFixed(0) : kValue.toFixed(1)}k`;
    }
    return `₱${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Image */}
      <div className="h-24 bg-gradient-to-r from-blue-400 to-cyan-300 relative">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
              {initial}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 px-6 pb-4 text-center">
        <h3 className="text-lg font-bold text-indigo-dye mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{title}</p>
        
        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-700">{rating}</span>
          </div>
          <span className="text-xs text-gray-500">({reviewsCount} reviews)</span>
        </div>

        {/* Available Toggle */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-4">
          <span className="text-sm font-medium text-gray-700">Available for bookings</span>
          <button
            type="button"
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-savoy-blue focus:ring-offset-2 ${
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

        {/* Earnings and Spending */}
        {(earnings !== undefined || spending !== undefined) && (
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
      </div>
    </div>
  );
};

export default ProfileCard;

