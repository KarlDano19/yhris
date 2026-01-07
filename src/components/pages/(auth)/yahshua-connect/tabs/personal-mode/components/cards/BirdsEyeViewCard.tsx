import { useState, Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { EyeIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Review {
  id: number;
  reviewerName: string;
  reviewerInitials: string;
  role: string;
  quote: string;
  date: string;
  rating: number;
}

interface BirdsEyeViewCardProps {
  userName: string;
  userInitial: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

const BirdsEyeViewCard = ({
  userName,
  userInitial,
  rating,
  reviewCount,
  reviews,
}: BirdsEyeViewCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return starValue <= rating ? (
        <StarIconSolid
          key={i}
          className="h-5 w-5 text-yellow-400"
        />
      ) : starValue - 0.5 <= rating ? (
        <div key={i} className="relative">
          <StarIconSolid className="h-5 w-5 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <StarIconSolid className="h-5 w-5 text-yellow-400" />
          </div>
        </div>
      ) : (
        <StarIcon key={i} className="h-5 w-5 text-gray-300" />
      );
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-savoy-blue/10 flex items-center justify-center">
              <EyeIcon className="h-5 w-5 text-savoy-blue" />
            </div>
            <div className="text-left">
              <span className="text-sm font-medium text-gray-700 block group-hover:text-savoy-blue">
                Birds-Eye View
              </span>
              <span className="text-xs text-gray-500">See all your reviews</span>
            </div>
          </div>
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold text-gray-900"
                    >
                      Reviews & Ratings
                    </Dialog.Title>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* User Profile Summary */}
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                        {userInitial}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{userName}</h4>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        {renderStars(rating)}
                      </div>
                      <p className="text-sm text-gray-600">{rating} ({reviewCount} reviews)</p>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-savoy-blue flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                              {review.reviewerInitials}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {review.reviewerName}
                                  </p>
                                  <p className="text-xs text-gray-500">{review.role}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 italic mb-2">
                            &quot;{review.quote}&quot;
                          </p>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default BirdsEyeViewCard;
