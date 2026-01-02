'use client';

import { BookmarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
  logo: string;
  logoUrl?: string; // Optional company logo URL
  saved?: boolean;
  match?: number;
  applied?: boolean;
  onApply?: () => void;
  onSave?: () => void;
}

const JobCard = ({
  title,
  company,
  location,
  type,
  salary,
  tags,
  logo,
  logoUrl,
  saved = false,
  match,
  applied = false,
  onApply,
  onSave,
}: JobCardProps) => {
  const getMatchColor = (matchValue?: number) => {
    if (!matchValue) return 'bg-gray-200';
    if (matchValue >= 85) return 'bg-green-500';
    if (matchValue >= 70) return 'bg-yellow-400';
    return 'bg-gray-300';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-lg bg-savoy-blue flex items-center justify-center flex-shrink-0 overflow-hidden">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={company}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-white font-bold text-sm">${logo}</span>`;
                  }
                }}
              />
            ) : (
              <span className="text-white font-bold text-sm">{logo}</span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{company}</p>
          </div>
        </div>
        <button
          onClick={onSave}
          className="text-gray-400 hover:text-savoy-blue transition-colors flex-shrink-0"
        >
          {saved ? (
            <BookmarkIconSolid className="h-5 w-5 text-savoy-blue" />
          ) : (
            <BookmarkIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        <p>
          {location} | {salary}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Match Percentage Bar */}
      {match !== undefined && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getMatchColor(match)}`}
              style={{ width: `${match}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">{match}%</span>
        </div>
      )}

      {/* Action Button */}
      <div className="flex items-center justify-end gap-2">
        {applied ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
            <CheckIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Applied</span>
          </div>
        ) : (
          <button
            onClick={onApply}
            className="px-6 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;

