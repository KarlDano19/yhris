'use client';

import { BookmarkIcon } from '@heroicons/react/24/outline';

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
  logo: string;
  saved?: boolean;
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
  saved = false,
  onApply,
  onSave,
}: JobCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
            <span className="text-yellow-600 font-bold">{logo}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{company}</p>
          </div>
        </div>
        <button
          onClick={onSave}
          className="text-gray-400 hover:text-yellow-500 transition-colors"
        >
          <BookmarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        <p>
          {location} | {type} | {salary}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={onApply}
        className="w-full bg-savoy-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Apply Now!
      </button>
    </div>
  );
};

export default JobCard;

