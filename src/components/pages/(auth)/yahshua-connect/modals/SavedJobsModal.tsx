import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import Modal from '../components/Modal';
import CustomToast from '@/components/CustomToast';
import useGetSavedJobs from '../hooks/useGetSavedJobs';
import useUpdateSavedJobs from '../hooks/useUpdateSavedJobs';

import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

import formatPrice from '@/helpers/currencyFormat';
import { T_SavedJob } from '@/types/personal-mode';

interface SavedJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SavedJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightJobId?: number | null;
}

const SavedJobsModal = ({ isOpen, onClose, highlightJobId }: SavedJobsModalProps) => {
  const { data: savedJobsData, isLoading, refetch } = useGetSavedJobs();
  const deleteSavedJobMutation = useUpdateSavedJobs();
  const [transformedSavedJobs, setTransformedSavedJobs] = useState<T_SavedJob[]>([]);
  const [selectedSavedJobId, setSelectedSavedJobId] = useState<number | null>(null);
  const router = useRouter();

  // If parent passes a highlightJobId (from notification), reflect it in selected state
  useEffect(() => {
    if (highlightJobId != null) {
      setSelectedSavedJobId(highlightJobId);
    }
  }, [highlightJobId]);

  // Scroll to and highlight the selected saved job when selection changes
  useEffect(() => {
    if (selectedSavedJobId == null) return;
    // Delay to ensure modal and list have rendered
    const t = setTimeout(() => {
      try {
        const el = document.getElementById(`saved-job-${selectedSavedJobId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-4', 'ring-yellow-300', 'ring-opacity-60');
          setTimeout(() => {
            el.classList.remove('ring-4', 'ring-yellow-300', 'ring-opacity-60');
          }, 3000);
        }
      } catch (err) {
        // ignore failures
      }
    }, 120);
    return () => clearTimeout(t);
  }, [selectedSavedJobId]);

  // Transform API data to match the display format
  useEffect(() => {
    if (!savedJobsData || !Array.isArray(savedJobsData)) {
      setTransformedSavedJobs([]);
      return;
    }

    const transformed = savedJobsData.map((savedJob: any) => {
      const job = savedJob.job_posting || {};
      
      // Get company initials for logo
      const getCompanyInitials = (companyName: string) => {
        if (!companyName) return '?';
        const words = companyName.trim().split(/\s+/);
        if (words.length >= 2) {
          return (words[0][0] + words[1][0]).toUpperCase();
        }
        return companyName.substring(0, 2).toUpperCase();
      };

      // Format salary
      const formatSalary = () => {
        if (!job.salary_range_type) return 'Salary not disclosed';
        
        if (job.salary_range_type === 'Range' && job.minimum_amount && job.maximum_amount) {
          return `₱ ${formatPrice(parseFloat(job.minimum_amount))} - ₱ ${formatPrice(parseFloat(job.maximum_amount))}`;
        } else if (job.exact_amount) {
          return `₱ ${formatPrice(parseFloat(job.exact_amount))}`;
        }
        return 'Salary not disclosed';
      };

      return {
        id: job.id || savedJob.job_posting_id,
        savedJobId: savedJob.id,
        title: job.job_title || 'Untitled Job',
        company: job.employer_name || 'Unknown Company',
        location: job.advertise_to || 'Location not specified',
        salary: formatSalary(),
        logo: getCompanyInitials(job.employer_name || '?'),
        logoUrl: job.company_logo || undefined,
        saved: true,
      };
    });

    setTransformedSavedJobs(transformed);
  }, [savedJobsData]);

  // If highlightJobId refers to a savedJobId or job id, resolve it to the transformed job.id
  useEffect(() => {
    if (highlightJobId == null) return;
    if (!transformedSavedJobs || transformedSavedJobs.length === 0) return;
    const found = transformedSavedJobs.find((j: any) =>
      j.id === highlightJobId ||
      j.savedJobId === highlightJobId ||
      j.savedJobId === Number(highlightJobId)
    );
    if (found) {
      setSelectedSavedJobId(found.id);
    }
  }, [highlightJobId, transformedSavedJobs]);

  const handleUnsave = (jobPostingId: number) => {
    deleteSavedJobMutation.mutate(jobPostingId, {
      onSuccess: () => {
        toast.custom(
          () => <CustomToast message="Job removed from saved jobs" type="success" />,
          { duration: 3000 }
        );
        refetch(); // Refetch to update the list
      },
      onError: (error: any) => {
        const errorMessage = error?.message || error || 'Failed to remove job from saved jobs';
        toast.custom(
          () => <CustomToast message={errorMessage} type="error" />,
          { duration: 4000 }
        );
      },
    });
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Saved Jobs"
      size="2xl"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading saved jobs...</div>
        </div>
      ) : transformedSavedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <BookmarkIcon className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">No saved jobs yet</p>
          <p className="text-sm text-gray-400 text-center mt-1">Start saving jobs to see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="max-h-[70vh] sm:max-h-[60vh] overflow-y-auto pr-2 space-y-4">
            {transformedSavedJobs.map((job) => (
            <div
              id={`saved-job-${job.id}`}
              key={job.id}
              onClick={() => {
                setSelectedSavedJobId(job.id);
                router.push(`job-applicant-form/${job.id}`);
              }}
              role="button"
              className={`flex items-start gap-4 p-4 border rounded-xl transition-colors ${
                selectedSavedJobId === job.id ? 'border-savoy-blue border-2' : 'border-gray-200 hover:bg-gray-50'
              } cursor-pointer`}
            >
              <div className="w-12 h-12 rounded-lg bg-savoy-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                {job.logoUrl ? (
                  <img 
                    src={job.logoUrl} 
                    alt={job.company}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-white font-bold text-sm">${job.logo}</span>`;
                      }
                    }}
                  />
                ) : (
                  <span>{job.logo}</span>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                <p className="text-sm text-gray-600 mb-1">
                  {job.company} • {job.location}
                </p>
                <p className="text-sm font-semibold text-savoy-blue mb-2">{job.salary}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnsave(job.id);
                }}
                className="text-savoy-blue hover:text-blue-700 transition-colors flex-shrink-0"
                title="Remove from saved jobs"
              >
                <BookmarkIconSolid className="h-6 w-6" />
              </button>
            </div>
          ))}
            </div>
        </div>
      )}
    </Modal>
  );
};

export default SavedJobsModal;



