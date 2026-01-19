import { useState, useEffect } from 'react';

import Link from 'next/link';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useAddSavedJobs from '../pages/jobs/hooks/useAddSavedJobs';
import useUpdateSavedJobs from '../../../hooks/useUpdateSavedJobs';

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
  onCardClick?: () => void;
  isSelected?: boolean;
  isHighlighted?: boolean;
}

const JobCard = ({
  id,
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
  onCardClick,
  isSelected = false,
  isHighlighted = false,
}: JobCardProps) => {
  const [isSaved, setIsSaved] = useState(saved);
  const [isSaving, setIsSaving] = useState(false);
  
  const addSavedJobMutation = useAddSavedJobs();
  const deleteSavedJobMutation = useUpdateSavedJobs();

  // Sync saved state from props
  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);

  const getMatchColor = (matchValue?: number) => {
    if (!matchValue) return 'bg-gray-200';
    if (matchValue === 100) return 'bg-green-500';
    return 'bg-yellow-400';
  };

  const handleSaveToggle = () => {
    if (isSaving) return;

    setIsSaving(true);
    const wasSaved = isSaved;

    // Optimistically update UI
    setIsSaved(!wasSaved);

    if (wasSaved) {
      // Unsave the job
      deleteSavedJobMutation.mutate(id, {
        onSuccess: () => {
          toast.custom(
            () => <CustomToast message="Job removed from saved jobs" type="success" />,
            { duration: 3000 }
          );
        },
        onError: (error: any) => {
          setIsSaved(wasSaved); // Revert on error
          const errorMessage = error?.message || error || 'Failed to remove job from saved jobs';
          toast.custom(
            () => <CustomToast message={errorMessage} type="error" />,
            { duration: 4000 }
          );
        },
        onSettled: () => {
          setIsSaving(false);
        },
      });
    } else {
      // Save the job
      addSavedJobMutation.mutate(id, {
        onSuccess: () => {
          toast.custom(
            () => <CustomToast message="Job saved successfully" type="success" />,
            { duration: 3000 }
          );
        },
        onError: (error: any) => {
          setIsSaved(wasSaved); // Revert on error
          const errorMessage = error?.message || error || 'Failed to save job';
          toast.custom(
            () => <CustomToast message={errorMessage} type="error" />,
            { duration: 4000 }
          );
        },
        onSettled: () => {
          setIsSaving(false);
        },
      });
    }
  };

  return (
    <div
      id={`job-${id}`}
      className={`bg-white rounded-lg shadow-sm border p-5 hover:shadow-md transition-shadow cursor-pointer ${
        isSelected ? 'border-savoy-blue border-2' : 'border-gray-200'
      } ${isHighlighted ? 'ring-4 ring-yellow-300 ring-opacity-60' : ''}`}
      onClick={onCardClick}
    >
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
          onClick={(e) => {
            e.stopPropagation();
            handleSaveToggle();
          }}
          disabled={isSaving}
          className="text-gray-400 hover:text-savoy-blue transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          title={isSaved ? 'Remove from saved jobs' : 'Save job'}
        >
          {isSaved ? (
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
          <Link 
            href={`/job-applicant-form/${id}`}
            onClick={(e) => {
              e.stopPropagation();
              onApply?.();
            }}
            className="px-6 py-2 bg-savoy-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm inline-block text-center"
          >
            Apply Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default JobCard;

