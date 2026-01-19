import { useState, useEffect } from 'react';

import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import { useGetBusinessJobDetails } from '../hooks/useGetBusinessJobDetails';
import { useUpdateBusinessJobDetails } from '../hooks/useUpdateBusinessJobDetails';
import CustomToast from '@/components/CustomToast';
import Modal from '../../../../../components/Modal';
import JobInfoTab from './tabs/JobInfoTab';
import JobBudgetTab from './tabs/JobBudgetTab';
import JobPreviewTab from './tabs/JobPreviewTab';
import LoadingSpinner from '@/components/LoadingSpinner';

import classNames from '@/helpers/classNames';

import { T_CreateBusinessJobData } from '@/types/business-mode';

interface UpdateBusinessJobModalProps {
  refetch: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingJobId: number | null;
}

const UpdateBusinessJobModal = ({ refetch, isOpen, setIsOpen, editingJobId }: UpdateBusinessJobModalProps) => {
  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors }, setError, clearErrors } = useForm();

  // Fetch job details using the hook
  const {
    data: jobDetails,
    isLoading: isLoadingJobDetails,
    refetch: refetchJobDetails
  } = useGetBusinessJobDetails(editingJobId, isOpen);

  const {
    mutate: updateBusinessJob,
    isLoading: isLoadingUpdateBusinessJob,
  } = useUpdateBusinessJobDetails();

  const [selectedTab, setSelectedTab] = useState(1);

  // Refetch when modal opens
  useEffect(() => {
    if (isOpen && editingJobId) {
      refetchJobDetails();
    }
  }, [isOpen, editingJobId]);

  // Set form values when job details are loaded
  useEffect(() => {
    if (jobDetails) {
      setValue("jobTitle", jobDetails.job_title);
      setValue("category", jobDetails.category);
      setValue("description", jobDetails.description);
      setValue("location", jobDetails.location);
      setValue("latitude", jobDetails.latitude || null);
      setValue("longitude", jobDetails.longitude || null);

      // Set locationData object for LocationPickerMap component
      if (jobDetails.location && jobDetails.latitude && jobDetails.longitude) {
        setValue("locationData", {
          address: jobDetails.location,
          latitude: jobDetails.latitude,
          longitude: jobDetails.longitude,
        });
      }

      setValue("budgetType", jobDetails.budget_type === 'hourly_rate' ? 'hourly' : 'fixed');
      setValue("budgetMin", jobDetails.budget_type === 'hourly_rate'
        ? (jobDetails.hourly_rate?.toString() || '')
        : (jobDetails.min_amount?.toString() || ''));
      setValue("budgetMax", jobDetails.max_amount?.toString() || '');
      setValue("scheduleStartDate", jobDetails.contract_start_date || '');
      setValue("scheduleEndDate", jobDetails.contract_end_date || '');
      setValue("scheduleTimeFrom", jobDetails.time_from || '');
      setValue("scheduleTimeTo", jobDetails.time_to || '');
      setValue("isProofFileRequired", jobDetails.is_proof_file_required ?? true);
      setValue("isDailyProgressApprovalRequired", jobDetails.is_daily_progress_approval_required ?? true);

      // Set hourly rate specific settings
      if (jobDetails.budget_type === 'hourly_rate') {
        setValue("isStrictSchedule", jobDetails.is_strict_schedule ?? false);
        setValue("isDailyProgressRequired", jobDetails.is_daily_progress_required ?? false);
        setValue("clockInMinutesBefore", jobDetails.clock_in_minutes_before ?? 60);
        setValue("clockOutMinutesAfter", jobDetails.clock_out_minutes_after ?? 60);
      }

      // Reset to first tab and clear errors
      setSelectedTab(1);
      clearErrors();
    }
  }, [jobDetails, setValue, clearErrors]);

  const onSubmit = handleSubmit((data: any) => {
    if (!editingJobId) return;

    // Round coordinates to 6 decimal places to stay within backend's validation limit
    const roundedLatitude = data.latitude ? Math.round(data.latitude * 1000000) / 1000000 : null;
    const roundedLongitude = data.longitude ? Math.round(data.longitude * 1000000) / 1000000 : null;

    // Prepare API payload
    const apiData: T_CreateBusinessJobData = {
      job_title: data.jobTitle,
      category: data.category || 'Other',
      description: data.description,
      location: data.location,
      latitude: roundedLatitude,
      longitude: roundedLongitude,
      budget_type: data.budgetType === 'hourly' ? 'hourly_rate' : 'fixed_rate',
      contract_start_date: data.scheduleStartDate,
      contract_end_date: data.scheduleEndDate || null,
      time_from: data.scheduleTimeFrom || null,
      time_to: data.scheduleTimeTo || null,
      is_proof_file_required: data.isProofFileRequired ?? true,
      is_daily_progress_approval_required: data.isDailyProgressApprovalRequired ?? true,
    };

    // Set budget amounts based on type
    if (data.budgetType === 'hourly') {
      apiData.hourly_rate = parseFloat(data.budgetMin) || null;
      // Include hourly rate specific settings
      apiData.is_strict_schedule = data.isStrictSchedule ?? false;
      apiData.is_daily_progress_required = data.isDailyProgressRequired ?? false;
      apiData.clock_in_minutes_before = parseInt(data.clockInMinutesBefore) || 60;
      apiData.clock_out_minutes_after = parseInt(data.clockOutMinutesAfter) || 60;
    } else {
      apiData.min_amount = parseFloat(data.budgetMin) || null;
      apiData.max_amount = data.budgetMax ? parseFloat(data.budgetMax) : parseFloat(data.budgetMin) || null;
    }

    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(
          () => <CustomToast message={data?.message || "Job updated successfully"} type="success" />,
          {
            duration: 5000,
          }
        );
        setIsOpen(false);
        setSelectedTab(1);
        refetch();
      },
      onError: (err: any) => {
        const errorMessage = err?.message || err?.response?.data?.message || "An unexpected error occurred.";
        toast.custom(() => <CustomToast message={errorMessage} type="error" />, {
          duration: 7000,
        });
      },
    };
    updateBusinessJob({ jobId: editingJobId, ...apiData }, callbackReq);
  });

  const handleCloseModal = () => {
    reset();
    setSelectedTab(1);
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title="Edit Job"
      size="5xl"
    >
      {isLoadingJobDetails ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="hidden sm:block pt-6 pb-6">
            <div className="md:w-[76%] lg:w-[80%] mx-auto translate-y-[10px]">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className={classNames(
                    'bg-savoy-blue h-1 rounded-full transition-all duration-300',
                    selectedTab === 1 && 'w-0',
                    selectedTab === 2 && 'w-[50%]',
                    selectedTab === 3 && 'w-[100%]',
                  )}
                ></div>
              </div>
            </div>
            <nav
              className="mb-px flex relative justify-between w-[90%] mx-auto mt-[-9px]"
              aria-label="post-job-tabs"
            >
              <li
                onClick={() => setSelectedTab(1)}
                className="text-center text-sm font-semibold list-none flex flex-col items-center text-savoy-blue cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="bg-white px-2">
                  <div className="h-8 w-8 bg-savoy-blue border-2 mb-2 rounded-lg flex justify-center items-center border-savoy-blue">
                    <h1 className="text-white">1</h1>
                  </div>
                </div>
                Job Info
              </li>
              <li
                onClick={() => setSelectedTab(2)}
                className={classNames(
                  'text-center text-sm font-semibold list-none flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity',
                  selectedTab >= 2 ? 'text-savoy-blue' : 'text-gray-500'
                )}
              >
                <div className="bg-white px-2">
                  <div
                    className={classNames(
                      'h-8 w-8 border-2 mb-2 rounded-lg flex justify-center items-center',
                      selectedTab >= 2 ? 'border-savoy-blue bg-savoy-blue' : 'border-gray-500 bg-gray-500'
                    )}
                  >
                    <h1 className="text-white">2</h1>
                  </div>
                </div>
                Budget & Schedule
              </li>
              <li
                onClick={() => setSelectedTab(3)}
                className={classNames(
                  'text-center text-sm font-semibold list-none flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity',
                  selectedTab >= 3 ? 'text-savoy-blue' : 'text-gray-500'
                )}
              >
                <div className="bg-white px-2">
                  <div
                    className={classNames(
                      'h-8 w-8 border-2 mb-2 rounded-lg flex justify-center items-center',
                      selectedTab >= 3 ? 'border-savoy-blue bg-savoy-blue' : 'border-gray-500 bg-gray-500'
                    )}
                  >
                    <h1 className="text-white">3</h1>
                  </div>
                </div>
                Preview
              </li>
            </nav>
          </div>

          {/* Tab Content */}
          {selectedTab === 1 && (
            <JobInfoTab
              control={control}
              register={register}
              setSelectedTab={setSelectedTab}
              errors={errors}
              setError={setError}
              clearErrors={clearErrors}
              watch={watch}
              setValue={setValue}
            />
          )}

          {selectedTab === 2 && (
            <JobBudgetTab
              control={control}
              register={register}
              handleSubmit={handleSubmit}
              setSelectedTab={setSelectedTab}
              setValue={setValue}
              watch={watch}
              errors={errors}
              setError={setError}
              clearErrors={clearErrors}
            />
          )}

          {selectedTab === 3 && (
            <JobPreviewTab
              control={control}
              register={register}
              onSubmit={onSubmit}
              setSelectedTab={setSelectedTab}
              setValue={setValue}
              watch={watch}
              isLoading={isLoadingUpdateBusinessJob}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default UpdateBusinessJobModal;
