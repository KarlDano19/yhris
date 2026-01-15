import { CheckCircleIcon, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import classNames from '@/helpers/classNames';

interface TalentDetailsProps {
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
  onClose: () => void;
  onBookNow?: () => void;
}

const TalentDetails = ({
  talent,
  onClose,
  onBookNow,
}: TalentDetailsProps) => {
  // Get initials from name
  const getInitials = () => {
    const names = talent.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return talent.name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header with Close Button */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            {talent.photo ? (
              <img
                src={talent.photo}
                alt={talent.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-semibold text-xl">
                {getInitials()}
              </div>
            )}
            {/* Verified Badge */}
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-xs text-white">✓</span>
            </div>
          </div>

          {/* Name and Title */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{talent.name}</h2>
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">{talent.title}</p>
            <div className="flex items-center gap-1">
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900">{talent.rating}</span>
              <span className="text-xs text-gray-500">({talent.reviews} reviews)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={onBookNow}
          className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Book Now
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-gray-900">{talent.jobsDone}</p>
          <p className="text-xs text-gray-600">Jobs Done</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-gray-900">{talent.reviews}</p>
          <p className="text-xs text-gray-600">Reviews</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-600">Portfolio</p>
        </div>
      </div>

      {/* Hourly Rate and Availability */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
        <div>
          <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
          <p className="text-lg font-bold text-gray-900">
            ₱{talent.hourlyMin.toLocaleString()} - ₱{talent.hourlyMax.toLocaleString()}/hr
          </p>
        </div>
        {talent.availability && (
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              talent.availability === 'Available Now'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {talent.availability === 'Available Now' ? talent.availability : 'Limited Availability'}
          </span>
        )}
      </div>

      {/* About */}
      {talent.about && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{talent.about}</p>
        </div>
      )}

      {/* Skills */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {talent.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-sm font-medium border border-green-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Education */}
      {talent.education && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Education</h3>
          <p className="text-sm text-gray-700">{talent.education}</p>
        </div>
      )}

      {/* Languages */}
      {talent.languages && talent.languages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Languages</h3>
          <p className="text-sm text-gray-700">{talent.languages.join(', ')}</p>
        </div>
      )}

      {/* Response Time */}
      <div className="pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Response Time:</span> Usually responds within 2 hours
        </p>
      </div>
    </div>
  );
};

export default TalentDetails;

