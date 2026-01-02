'use client';

import { StarIcon } from '@heroicons/react/24/solid';

interface Review {
  id: number;
  clientName: string;
  clientInitials: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsCardProps {
  reviews: Review[];
}

const ReviewsCard = ({ reviews }: ReviewsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Reviews</h3>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {review.clientInitials}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-gray-900">{review.clientName}</h4>
              </div>
              <div className="flex items-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-3 w-3 ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600 mb-1">{review.comment}</p>
              <span className="text-xs text-gray-500">{review.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsCard;

