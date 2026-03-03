'use client';

import { useState } from 'react';

import toast from 'react-hot-toast';

import { ArrowLeftIcon, ArrowRightStartOnRectangleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import CustomToast from '@/components/CustomToast';
import ModalLayout from '@/components/ModalLayout';

import useGetAllJobPostItems from '@/components/hooks/useGetAllJobPostItems';
import useGetJobPostDetails from '../../hooks/useGetJobPostDetails';
import useMoveApplicantToJob from '../../hooks/useMoveApplicantToJob';

interface MoveToAnotherJobModalProps {
  appliedJobId: number;
  currentJobPostingId: string;
  applicantName?: string;
  onClose: () => void;
}

type Step = 'select-job' | 'select-stage';

export default function MoveToAnotherJobModal({
  appliedJobId,
  currentJobPostingId,
  applicantName,
  onClose,
}: MoveToAnotherJobModalProps) {
  const [step, setStep] = useState<Step>('select-job');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const { data: jobPostings, isLoading: isLoadingJobs } = useGetAllJobPostItems();
  const { data: jobDetails, isLoading: isLoadingStages } = useGetJobPostDetails(selectedJobId);
  const stages = jobDetails?.job_stages || [];
  const { mutate: moveApplicant, isLoading: isMoving } = useMoveApplicantToJob(appliedJobId);

  const currentJobId = parseInt(currentJobPostingId, 10);

  const filteredJobs = Array.isArray(jobPostings)
    ? jobPostings.filter((job: any) => {
        if (job.id === currentJobId) return false;
        if (!search.trim()) return true;
        return job.job_title?.toLowerCase().includes(search.toLowerCase());
      })
    : [];

  const selectedJob = Array.isArray(jobPostings)
    ? jobPostings.find((j: any) => j.id === selectedJobId)
    : null;

  const handleSelectJob = (jobId: number) => {
    setSelectedJobId(jobId);
    setSelectedStageId(null);
  };

  const handleNext = () => {
    if (selectedJobId) setStep('select-stage');
  };

  const handleBack = () => {
    setStep('select-job');
    setSelectedStageId(null);
  };

  const handleTransfer = () => {
    if (!selectedJobId || !selectedStageId) return;

    moveApplicant(
      { job_posting_id: selectedJobId, job_stage_id: selectedStageId },
      {
        onSuccess: (res: any) => {
          toast.custom(() => (
            <CustomToast message={res?.message} type="success" />
          ), { duration: 4000 });
          onClose();
        },
        onError: (err: any) => {
          toast.custom(() => (
            <CustomToast message={err.message || 'Failed to transfer applicant.'} type="error" />
          ), { duration: 7000 });
        },
      }
    );
  };

  return (
    <ModalLayout
      title="Transfer Applicant to Another Job"
      isOpen={true}
      handleClose={onClose}
    >
      <div className="p-6 space-y-4">
        {applicantName && (
          <p className="text-sm text-gray-500">
            Reassigning <span className="font-semibold text-gray-700">{applicantName}</span> to a new position.
          </p>
        )}

        {/* ── STEP 1: Select Job Posting ── */}
        {step === 'select-job' && (
          <>
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for active job titles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-savoy-blue"
              />
            </div>

            {/* Job Postings List */}
            <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-md divide-y divide-gray-100">
              {isLoadingJobs ? (
                <div className="p-4 text-center text-sm text-gray-500">Loading job postings...</div>
              ) : filteredJobs.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">No active job postings found.</div>
              ) : (
                filteredJobs.map((job: any) => {
                  const isSelected = job.id === selectedJobId;
                  return (
                    <label
                      key={job.id}
                      className={`relative flex items-start gap-3 p-3 pl-4 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {isSelected && <span className="absolute left-0 top-0 bottom-0 w-1 bg-savoy-blue rounded-l" />}
                      <input
                        type="radio"
                        name="job-posting"
                        value={job.id}
                        checked={isSelected}
                        onChange={() => handleSelectJob(job.id)}
                        className="mt-1 accent-savoy-blue"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isSelected ? 'text-savoy-blue' : 'text-gray-800'}`}>
                          {job.job_title}
                        </p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
                          {job.position || 'General'}{' '}
                          {job.remaining_slots != null && (
                            <span className="text-yellow-500 normal-case">· {job.remaining_slots} {job.remaining_slots !== 1 ? 'Openings' : 'Opening'}</span>
                          )}
                        </p>
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            {/* Footer – Step 1 */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedJobId}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-savoy-blue rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2: Select Stage ── */}
        {step === 'select-stage' && (
          <>
            {/* Selected job context */}
            {selectedJob && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-savoy-blue truncate">{selectedJob.job_title}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {selectedJob.position || 'General'}{' '}
                    {selectedJob.remaining_slots != null && (
                      <span className="text-yellow-500 normal-case">· {selectedJob.remaining_slots} {selectedJob.remaining_slots !== 1 ? 'Openings' : 'Opening'}</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Stage list */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Select a stage to place the applicant in:</p>
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md divide-y divide-gray-100">
                {isLoadingStages ? (
                  <div className="p-4 text-center text-sm text-gray-500">Loading stages...</div>
                ) : !Array.isArray(stages) || stages.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">No active stages found for this job.</div>
                ) : (
                  stages.map((stage: any) => {
                    const isSelected = stage.id === selectedStageId;
                    return (
                      <label
                        key={stage.id}
                        className={`relative flex items-center gap-3 p-3 pl-4 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        {isSelected && <span className="absolute left-0 top-0 bottom-0 w-1 bg-savoy-blue rounded-l" />}
                        <input
                          type="radio"
                          name="job-stage"
                          value={stage.id}
                          checked={isSelected}
                          onChange={() => setSelectedStageId(stage.id)}
                          className="accent-savoy-blue"
                        />
                        <span className={`text-sm font-medium ${isSelected ? 'text-savoy-blue' : 'text-gray-800'}`}>
                          {stage.title}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Footer – Step 2 */}
            <div className="flex justify-between gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleTransfer}
                  disabled={!selectedStageId || isMoving}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-savoy-blue rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                  {isMoving ? 'Transferring...' : 'Transfer Applicant'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </ModalLayout>
  );
}
