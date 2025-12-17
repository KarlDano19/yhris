'use client';

import { ClockIcon } from '@heroicons/react/24/outline';

interface Booking {
  id: number;
  title: string;
  client: string;
  location: string;
  time: string;
  price: number;
}

interface UpcomingBookingsCardProps {
  bookings: Booking[];
}

const UpcomingBookingsCard = ({ bookings }: UpcomingBookingsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Upcoming Bookings</h3>
      
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">{booking.title}</h4>
                <p className="text-xs text-gray-600">
                  {booking.client} • {booking.location}
                </p>
              </div>
              <span className="text-sm font-bold text-green-600">₱{booking.price}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <ClockIcon className="h-3 w-3" />
              <span className="font-medium">{booking.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingBookingsCard;

