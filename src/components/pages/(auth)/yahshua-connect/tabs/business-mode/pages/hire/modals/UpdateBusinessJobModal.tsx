import { useState, useRef, useEffect } from 'react';

import toast from 'react-hot-toast';

import { useUpdateBusinessJobDetails } from '../hooks/useUpdateBusinessJobDetails';
import CustomToast from '@/components/CustomToast';
import Modal from '../../../../../components/Modal';
import JobInfoTab from './tabs/JobInfoTab';
import JobBudgetTab from './tabs/JobBudgetTab';
import JobPreviewTab from './tabs/JobPreviewTab';

import classNames from '@/helpers/classNames';

import { T_CreateBusinessJobData } from '@/types/business-mode';

interface UpdateBusinessJobModalProps {
  refetch: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formMethods: any;
  editingJobId: number | null;
  initialData: {
    jobTitle: string;
    category: string;
    description: string;
    location: string;
    latitude?: number | null;
    longitude?: number | null;
    budgetType: 'fixed' | 'hourly';
    budgetMin: string;
    budgetMax: string;
    scheduleStartDate: string;
    scheduleEndDate: string;
    scheduleTimeFrom: string;
    scheduleTimeTo: string;
  };
}

const UpdateBusinessJobModal = ({ refetch, isOpen, setIsOpen, formMethods, editingJobId, initialData }: UpdateBusinessJobModalProps) => {
  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors }, setError, clearErrors } = formMethods;
  const {
    mutate: updateBusinessJob,
    isLoading: isLoadingUpdateBusinessJob,
  } = useUpdateBusinessJobDetails();
  const [selectedTab, setSelectedTab] = useState(1);

  // Track the last loaded job to detect when we need to reload
  const lastLoadedJobRef = useRef<string>('');

  // Load initial data when modal opens or when initialData changes
  useEffect(() => {
    if (isOpen && initialData && editingJobId) {
      // Create a unique identifier for this job data
      const jobDataId = `${initialData.jobTitle}-${initialData.scheduleStartDate}-${editingJobId}`;

      // Only reload if this is different data than what we last loaded
      if (lastLoadedJobRef.current !== jobDataId) {
        setValue("jobTitle", initialData.jobTitle);
        setValue("category", initialData.category);
        setValue("description", initialData.description);
        setValue("location", initialData.location);
        setValue("latitude", initialData.latitude || null);
        setValue("longitude", initialData.longitude || null);
        setValue("budgetType", initialData.budgetType);
        setValue("budgetMin", initialData.budgetMin);
        setValue("budgetMax", initialData.budgetMax);
        setValue("scheduleStartDate", initialData.scheduleStartDate || '');
        setValue("scheduleEndDate", initialData.scheduleEndDate || '');
        setValue("scheduleTimeFrom", initialData.scheduleTimeFrom || '');
        setValue("scheduleTimeTo", initialData.scheduleTimeTo || '');
        
        // Reset to first tab and clear errors
        setSelectedTab(1);
        clearErrors();
        lastLoadedJobRef.current = jobDataId;
      }
    }

    // Reset ref when modal closes
    if (!isOpen) {
      lastLoadedJobRef.current = '';
    }
  }, [isOpen, initialData, editingJobId, setValue, clearErrors]);

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
    };

    // Set budget amounts based on type
    if (data.budgetType === 'hourly') {
      apiData.hourly_rate = parseFloat(data.budgetMin) || null;
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        setSelectedTab(1);
        setIsOpen(false);
      }}
      title="Edit Job"
      size="5xl"
    >
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
    </Modal>
  );
};

export default UpdateBusinessJobModal;