'use client';

import { BookmarkIcon } from '@heroicons/react/24/outline';

interface AlmostThereJobCardProps {
  title: string;
  company: string;
  matchPercentage: number;
  missingSkills: string[];
  logo: string;
  onViewDetails?: () => void;
  onSave?: () => void;
}

const AlmostThereJobCard = ({
  title,
  company,
  matchPercentage,
  missingSkills,
  logo,
  onViewDetails,
  onSave,
}: AlmostThereJobCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="mb-4">
        <h3 className="font-bold text-gray-900 mb-1">Almost-There Jobs</h3>
        <p className="text-sm text-gray-600">
          You're just a few steps away from these opportunities.
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
            <span className="text-yellow-600 font-bold text-sm">{logo}</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
            <p className="text-xs text-gray-600">{company}</p>
          </div>
          <button
            onClick={onSave}
            className="text-gray-400 hover:text-yellow-500 transition-colors"
          >
            <BookmarkIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all"
              style={{ width: `${matchPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600">{matchPercentage}% Match</p>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-700 mb-2">Complete these to increase match:</p>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill) => (
              <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onViewDetails}
          className="w-full border border-savoy-blue text-savoy-blue py-2 px-4 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default AlmostThereJobCard;

