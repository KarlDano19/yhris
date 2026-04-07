'use client';

import { AcademicCapIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

import { T_Training } from '@/types/personal-mode';

const Content = () => {

  const allTrainings: T_Training[] = [
    {
      id: 1,
      title: 'Mastering Design System',
      duration: '3 hrs',
      level: 'Intermediate',
      instructor: 'Sarah Chen',
      rating: 4.8,
      students: 1250,
      free: true,
      progress: 0,
    },
    {
      id: 2,
      title: 'UX Psychology Fundamentals',
      duration: '5 hrs',
      level: 'Beginner',
      instructor: 'Dr. Michael Park',
      rating: 4.9,
      students: 3420,
      free: true,
      progress: 45,
    },
    {
      id: 3,
      title: 'Advanced Prototyping',
      duration: '4 hrs',
      level: 'Advanced',
      instructor: 'Lisa Wong',
      rating: 4.7,
      students: 890,
      free: false,
      price: 499,
      progress: 0,
    },
  ];


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      return starValue <= rating ? (
        <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
      ) : null;
    });
  };

  return (
    <div className="space-y-6">
      {/* Training Hub Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Training Hub</h2>

                {/* Training List */}
                <div className="space-y-4">
                  {allTrainings.map((training) => (
                    <div
                      key={training.id}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <AcademicCapIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{training.title}</h3>
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <span>
                            {training.duration} • {training.level}
                          </span>
                          <div className="flex items-center gap-1">
                            {renderStars(training.rating)}
                            <span className="ml-1">{training.rating}</span>
                          </div>
                          {training.free ? (
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                              FREE
                            </span>
                          ) : (
                            <span className="text-sm font-semibold text-gray-700">
                              ₱{training.price}
                            </span>
                          )}
                        </div>
                        {training.progress > 0 && (
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-savoy-blue rounded-full transition-all"
                                style={{ width: `${training.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {training.progress}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
    </div>
  );
};

export default Content;
