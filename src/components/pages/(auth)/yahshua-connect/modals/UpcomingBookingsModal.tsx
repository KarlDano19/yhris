

import { ClockIcon, MapPinIcon, CurrencyDollarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';

interface Booking {
  id: number;
  title: string;
  clientName: string;
  location: string;
  time: string;
  priceRange: string;
  clientInitials?: string;
}

interface UpcomingBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onMessage?: (booking: Booking) => void;
}

const UpcomingBookingsModal = ({ isOpen, onClose, bookings, onMessage }: UpcomingBookingsModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upcoming Bookings"
      size="2xl"
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto -mx-5 px-5">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 mb-1">{booking.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{booking.clientName}</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                Scheduled
              </span>
            </div>

            {/* Job Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <ClockIcon className="h-4 w-4 text-gray-500" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPinIcon className="h-4 w-4 text-gray-500" />
                <span>{booking.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-green-600">{booking.priceRange}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => onMessage?.(booking)}
                className="flex-1 px-4 py-2 border border-savoy-blue text-savoy-blue bg-white rounded-lg font-medium hover:bg-savoy-blue/5 transition-colors flex items-center justify-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default UpcomingBookingsModal;

