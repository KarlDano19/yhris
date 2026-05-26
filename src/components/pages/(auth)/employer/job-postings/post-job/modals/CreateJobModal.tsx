import { Dispatch, Fragment, useRef, useEffect, useState, useMemo } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import ConfirmModal from '@/components/ConfirmModal';
import useGetPositionItems from '@/components/hooks/useGetPositionItems';
import SalaryRangeModal from '../../modals/SalaryRangeModal';
import SaveDraftModal from './SaveDraftModal';
import LoadDraftModal from './LoadDraftModal';
import CreateJobPageJobTitleInfo from '../../modals/modal-pages/CreateJobPageJobTitleInfo';
import CreateJobPageJobType from '../../modals/modal-pages/CreateJobPageJobType';
import CreateJobPageSalary from '../../modals/modal-pages/CreateJobPageSalary';
import CreateJobPageJobDescription from '../../modals/modal-pages/CreateJobPageJobDescription';
import CreateJobPageJobSettings from '../../modals/modal-pages/CreateJobPageJobSettings';
import CreateJobPagePostAs from '../../modals/modal-pages/CreateJobPagePostAs';
import CreateJobPagePreview from '../../modals/modal-pages/CreateJobPagePreview';
import CreateJobPagePlatform from '../../modals/modal-pages/CreateJobPagePlatform';
import useAddJobPostItems from '../hooks/useAddJobPostItems';
import { useCreateJobDraft } from '../hooks/useCreateJobDraft';
import useGetJobDrafts from '../hooks/useGetJobDrafts';
import { useDeleteJobDraft } from '../hooks/useDeleteJobDraft';

import { XCircleIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

import { T_JobPostingDraft } from '@/types/job_posting';

import { draftStorage } from '@/helpers/draftStorage';
import classNames from '@/helpers/classNames';
import { QUALIFICATION_TEMPLATE } from '@/helpers/constants';

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function convertKeysToSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof File || obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map((item) => (typeof item === 'object' && item !== null && !(item instanceof File) && !(item instanceof Date) ? convertKeysToSnakeCase(item) : item));
  if (typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([key, val]) => [camelToSnake(key), typeof val === 'object' && val !== null && !(val instanceof File) && !(val instanceof Date) ? convertKeysToSnakeCase(val) : val]));
  }
  return obj;
}

function convertKeysToCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map((item) => (typeof item === 'object' && item !== null ? convertKeysToCamelCase(item) : item));
  if (typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([key, val]) => [snakeToCamel(key), typeof val === 'object' && val !== null ? convertKeysToCamelCase(val) : val]));
  }
  return obj;
}

export default function CreateJobModal({
  isOpen,
  setIsOpen,
  openConfirmSocialShareModal,
  pageNumber,
  setPageNumber,
  isSalaryRangeModalOpen,
  setIsSalaryRangeModalOpen,
  isRangeBenefitsAdded,
  setIsRangeBenefitsAdded,
  combinedFormData,
  setCombinedFormData,
  fileProps,
  setFileProps,
  screeningQuestions,
  setScreeningQuestions,
  autoRejectEnabled,
  setAutoRejectEnabled,
  isVideoIntroEnabled,
  setIsVideoIntroEnabled,
  firstForm,
  secondForm,
  thirdForm,
  fourthForm,
  fifthForm,
  sixthForm,
  seventhForm,
  autoLoadDraftId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  openConfirmSocialShareModal: (social: string, og_url: string) => void;
  pageNumber: number;
  setPageNumber: Dispatch<number>;
  isSalaryRangeModalOpen: boolean;
  setIsSalaryRangeModalOpen: Dispatch<boolean>;
  isRangeBenefitsAdded: boolean;
  setIsRangeBenefitsAdded: Dispatch<boolean>;
  combinedFormData: any;
  setCombinedFormData: Dispatch<any>;
  fileProps: { fileName?: string; fileSize?: number; file?: File };
  setFileProps: Dispatch<{ fileName?: string; fileSize?: number; file?: File }>;
  screeningQuestions: any[];
  setScreeningQuestions: Dispatch<any[]>;
  autoRejectEnabled: boolean;
  setAutoRejectEnabled: Dispatch<boolean>;
  isVideoIntroEnabled: boolean;
  setIsVideoIntroEnabled: Dispatch<boolean>;
  firstForm: ReturnType<typeof useForm>;
  secondForm: ReturnType<typeof useForm>;
  thirdForm: ReturnType<typeof useForm>;
  fourthForm: ReturnType<typeof useForm>;
  fifthForm: ReturnType<typeof useForm>;
  sixthForm: ReturnType<typeof useForm>;
  seventhForm: ReturnType<typeof useForm>;
  autoLoadDraftId?: number | null;
}) {
  const cancelButtonRef = useRef(null);
  const { mutate, isLoading } = useAddJobPostItems();
  const createDraftMutation = useCreateJobDraft();
  const { data: backendDrafts = [], isLoading: isDraftsLoading } = useGetJobDrafts();
  const deleteDraftMutation = useDeleteJobDraft();

  // Fetch positions data in the parent component
  const { data: positionData, refetch: refetchPositions } = useGetPositionItems();

  // Draft management state
  const [isSaveDraftModalOpen, setIsSaveDraftModalOpen] = useState(false);
  const [isLoadDraftModalOpen, setIsLoadDraftModalOpen] = useState(false);
  const [isStartOverModalOpen, setIsStartOverModalOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<T_JobPostingDraft | null>(null);
  const [localDraftCleared, setLocalDraftCleared] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const autoLoadFiredRef = useRef(false);

  const allDrafts = useMemo(() => {
    const combinedDrafts = [...backendDrafts];
    if (!localDraftCleared) {
      const localDraft = draftStorage.load();
      if (localDraft && localDraft.data && Object.keys(localDraft.data).length > 0) {
        const localDraftObject: T_JobPostingDraft = {
          id: 0,
          draft_data: localDraft.data,
          source: 'browser_close',
          job_title: localDraft.data.job_title || 'Untitled Job',
          position: localDraft.data.position || null,
          uploaded_job_description: null,
          uploaded_custom_poster: null,
          created_at: localDraft.timestamp ? new Date(localDraft.timestamp).toISOString() : new Date().toISOString(),
          updated_at: localDraft.timestamp ? new Date(localDraft.timestamp).toISOString() : new Date().toISOString(),
        };
        combinedDrafts.unshift(localDraftObject);
      }
    }
    return combinedDrafts;
  }, [backendDrafts, localDraftCleared]);


  // Auto-load a specific draft when opened via "Resume" from Job Posting History
  useEffect(() => {
    if (
      isOpen &&
      autoLoadDraftId !== undefined &&
      autoLoadDraftId !== null &&
      !isDraftsLoading &&
      allDrafts.length > 0 &&
      !autoLoadFiredRef.current
    ) {
      const draftToLoad = allDrafts.find((d) => d.id === autoLoadDraftId);
      if (draftToLoad) {
        autoLoadFiredRef.current = true;
        handleLoadDraftClick(draftToLoad);
      }
    }
  }, [isOpen, autoLoadDraftId, isDraftsLoading, allDrafts]);

  // Auto-save to localStorage whenever form data changes
  useEffect(() => {
    if (isOpen && Object.keys(combinedFormData).length > 0) {
      draftStorage.save(getAllFormData());
    }
  }, [combinedFormData, pageNumber, isOpen]);

  // Listen for session expiration
  useEffect(() => {
    const handleSessionExpiring = () => {
      if (Object.keys(combinedFormData).length > 0) {
        const posterFile = sixthForm.getValues('postAsUpload');
        createDraftMutation.mutate({
          draft_data: getAllFormData(),
          source: 'session_expiry',
          ...(fileProps.file && { uploaded_job_description: fileProps.file }),
          ...(posterFile instanceof File && { uploaded_custom_poster: posterFile }),
        });
      }
    };

    window.addEventListener('session-expiring', handleSessionExpiring);
    return () => window.removeEventListener('session-expiring', handleSessionExpiring);
  }, [combinedFormData, pageNumber]);


  const customCloseModal = () => {
    if (Object.keys(combinedFormData).length > 0) {
      setIsSaveDraftModalOpen(true);
    } else {
      setIsOpen(false);
      draftStorage.clear();
    }
  };

  const resetForm = (closeModal: boolean = true) => {
    setSelectedDraft(null);
    setCombinedFormData({});
    draftStorage.clear();
    setLocalDraftCleared(false);

    // Reset all state
    setPageNumber(1);
    setIsRangeBenefitsAdded(false);
    setScreeningQuestions([]);
    setAutoRejectEnabled(true);
    setIsVideoIntroEnabled(false);
    setFileProps({});

    // Reset all forms with explicit values so draft-loaded defaultValues don't persist
    firstForm.reset({ country: 'Philippines', language: 'English' });
    secondForm.reset({
      jobType: undefined,
      workSetup: undefined,
      schedule: undefined,
      hireCount: 1,
      hireDate: null,
      otherJobType: '',
      otherWorkSetup: '',
      otherSchedule: '',
    });
    thirdForm.reset({ salary: { salaryType: '' } });
    fourthForm.reset({
      jobDescription: '',
      qualifications: QUALIFICATION_TEMPLATE[0],
      notesRemarks: '',
    });
    fifthForm.reset({});
    sixthForm.reset({ postAs: '', postAsUpload: null, uploaded_image: null });
    seventhForm.reset({});

    // Force React Select to clear
    setTimeout(() => {
      firstForm.resetField('position', { defaultValue: '' });
      firstForm.setValue('position', '', { shouldValidate: false, shouldDirty: false });
      firstForm.resetField('placeAdvertise', { defaultValue: [] });
      firstForm.setValue('placeAdvertise', [], { shouldValidate: false, shouldDirty: false });
    }, 0);

    // Force complete remount of form components
    setFormKey(prev => prev + 1);

    // Close modal if requested
    if (closeModal) {
      setIsOpen(false);
    }
  };


  // Collect current values from all forms so drafts capture every page regardless of current step
  // Converts camelCase form values → snake_case for draft storage (T_JobPostingDraftData)
  const getAllFormData = () => convertKeysToSnakeCase({
    ...combinedFormData,
    ...firstForm.getValues(),
    ...secondForm.getValues(),
    ...thirdForm.getValues(),
    ...fourthForm.getValues(),
    ...fifthForm.getValues(),
    ...sixthForm.getValues(),
    ...seventhForm.getValues(),
  });

  const handleSaveDraft = () => {
    const posterFile = sixthForm.getValues('postAsUpload');
    createDraftMutation.mutate(
      {
        draft_data: getAllFormData(),
        source: 'manual',
        ...(fileProps.file && { uploaded_job_description: fileProps.file }),
        ...(posterFile instanceof File && { uploaded_custom_poster: posterFile }),
      },
      {
        onSuccess: () => {
          toast.custom(() => <CustomToast message="Draft saved successfully." type="success" />, {
            duration: 3000,
          });
          setIsSaveDraftModalOpen(false);
          draftStorage.clear();
          resetForm();
        },
        onError: (error: any) => {
          toast.custom(
            () => <CustomToast message={error.message || 'Failed to save draft.'} type="error" />,
            { duration: 5000 }
          );
        },
      }
    );
  };

  const handleDiscardDraft = () => {
    // Close the save draft modal first
    setIsSaveDraftModalOpen(false);
    // Reset form and close the main modal
    resetForm(true);
  };

  const handleLoadDraftClick = (draft: T_JobPostingDraft) => {
    // Convert snake_case draft data (T_JobPostingDraftData) → camelCase for React Hook Form
    const draftData: any = convertKeysToCamelCase(draft.draft_data);

    if (draftData && typeof draftData === 'object') {
      // Page 1 - Job Info
      firstForm.reset({
        country: draftData.country || 'Philippines',
        language: draftData.language || 'English',
        jobTitle: draftData.jobTitle || '',
        position: draftData.position || '',
        placeAdvertise: draftData.placeAdvertise || draftData.advertiseTo || '',
      });

      // Page 2 - Job Type
      let hireDateValue: Date | null = null;
      if (draftData.hireDate || draftData.dateRequired) {
        const dateStr = draftData.hireDate || draftData.dateRequired;
        try {
          hireDateValue = dateStr ? new Date(dateStr) : null;
        } catch (e) {
          hireDateValue = null;
        }
      }

      secondForm.reset({
        jobType: draftData.jobType || '',
        workSetup: draftData.workSetup || '',
        schedule: draftData.schedule || draftData.jobSchedule || '',
        hireCount: draftData.hireCount || draftData.requiredSlot || '',
        hireDate: hireDateValue,
      });

      // Page 3 - Salary & Benefits
      const salaryData = draftData.salary || {};
      thirdForm.reset({
        salary: {
          salaryType: salaryData.salaryType || '',
          salaryRangeMin: salaryData.salaryRangeMin || '',
          salaryRangeMax: salaryData.salaryRangeMax || '',
          salaryValue: salaryData.salaryValue || '',
        },
        rate: draftData.rate || '',
        isShowSalary: draftData.isShowSalary ?? false,
        isShowBenefits: draftData.isShowBenefits ?? false,
        benefits: draftData.benefits || [],
      });
      setIsRangeBenefitsAdded(!!draftData.salary?.salaryType);

      // Page 4 - Job Description
      fourthForm.reset({
        jobDescription: draftData.jobDescription || draftData.positionDescription || '',
        qualifications: draftData.qualifications || '',
        notesRemarks: draftData.jobRemark || draftData.notesRemarks || '',
        isShowRoles: draftData.isShowRoles ?? false,
        isShowRemarks: draftData.isShowRemarks ?? false,
      });

      // Page 5 - Job Settings
      setScreeningQuestions(draftData.screeningQuestions || []);
      setAutoRejectEnabled(draftData.autoRejectEnabled || false);
      setIsVideoIntroEnabled(draftData.isVideoIntroEnabled || false);

      // Page 6 - Post As
      sixthForm.reset({
        postAs: draftData.postAs || '',
        ...(draft.uploaded_custom_poster && { uploaded_image: draft.uploaded_custom_poster }),
      });

      // Page 8 - Platform
      seventhForm.reset({
        postIn: draftData.sharedTo || '',
        jobUrl: draftData.jobUrl || '',
      });

      setCombinedFormData(draftData);
      setPageNumber(1);
    }

    setSelectedDraft(draft);
    setIsLoadDraftModalOpen(false);
  };

  const handleDeleteDraft = (draftId: number) => {
    // Handle local draft deletion (id === 0)
    if (draftId === 0) {
      draftStorage.clear();
      setLocalDraftCleared(true);
      toast.custom(() => <CustomToast message="Local draft cleared successfully" type="success" />, {
        duration: 3000,
      });
      return;
    }

    // Handle backend draft deletion
    deleteDraftMutation.mutate(draftId, {
      onSuccess: () => {
        toast.custom(() => <CustomToast message="Draft deleted successfully" type="success" />, {
          duration: 3000,
        });
      },
      onError: (error: any) => {
        toast.custom(() => <CustomToast message={error.message || 'Failed to delete draft'} type="error" />, {
          duration: 5000,
        });
      },
    });
  };

  const firstFormSubmit = (data: any) => {
    // Find the selected position and add its description to the data
    const selectedPosition = positionData?.find((pos: any) => pos.id === data.position);
    
    if (selectedPosition?.description) {
      data.positionDescription = selectedPosition.description;
    }
    
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
    setPageNumber(2);
  };

  const secondFormSubmit = () => {
    const data = secondForm.getValues();
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
  };

  const thirdFormSubmit = () => {
    const data = thirdForm.getValues();
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
    setPageNumber(4);
  };

  const fourthFormSubmit = () => {
    const data = fourthForm.getValues();
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
    setPageNumber(5);
  };

  const fifthFormSubmit = () => {
    const data = fifthForm.getValues();
    // Include screening questions, auto-reject settings, rejection feedback, and video intro
    const jobSettings = {
      ...data,
      screeningQuestions: window.screeningQuestions || [],
      autoRejectEnabled: window.autoRejectEnabled !== undefined ? window.autoRejectEnabled : true,
      rejectionFeedback: window.rejectionFeedback || '',
      isVideoIntroEnabled: window.isVideoIntroEnabled || false
    };
    setCombinedFormData((prev: any) => ({ ...prev, ...jobSettings }));
    setPageNumber(6);
  };

  const sixthFormSubmit = () => {
    const data = sixthForm.getValues();
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
    setPageNumber(7);
  };
  const seventhFormSubmit = () => {
    const data = seventhForm.getValues();
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
    setPageNumber(8);
  };

  const onSubmit = () => {
    const data = seventhForm.getValues();
    const finalData = { ...combinedFormData, ...data };
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
        resetForm();
        setIsSalaryRangeModalOpen(false);
        openConfirmSocialShareModal(data.job_post.shared_to, data.job_post.og_url);
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(finalData, callbackReq);
  };

  // Check if tab 3 should be enabled (in create mode, only enabled after adding salary/benefits)
  const isTab3Enabled = () => {
    return isRangeBenefitsAdded;
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => customCloseModal()}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                  <div className='flex bg-savoy-blue p-2 items-center rounded-t-lg'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Job Form</h3>
                    <button
                      type="button"
                      onClick={() => setIsStartOverModalOpen(true)}
                      className='mr-2 p-1.5 text-white hover:bg-white/10 rounded-md transition-colors'
                      title="Start Over"
                    >
                      <ArrowPathIcon className='w-6 h-6' />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLoadDraftModalOpen(true)}
                      className='relative mr-2 p-1.5 text-white hover:bg-white/10 rounded-md transition-colors'
                      title="Load Draft"
                    >
                      <DocumentTextIcon className='w-6 h-6' />
                      {allDrafts.length > 0 && (
                        <span className='absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full'>
                          {allDrafts.length}
                        </span>
                      )}
                    </button>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>

                  {/* Tab Navigation */}
                  <div className='pt-4 pb-2 px-4'>
                    <div className='flex flex-row overflow-x-auto whitespace-nowrap space-x-4 scrollbar-hide'>
                      {/* Tab 1: Job Info */}
                      <div className='flex space-x-2 transition-opacity'>
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 1 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>1</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 1 ? 'text-savoy-blue' : 'hidden')}>Job Info</h1>
                      </div>

                      {/* Tab 2: Job Type */}
                      <div className='flex space-x-2 transition-opacity'>
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 2 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>2</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 2 ? 'text-savoy-blue' : 'hidden')}>Job Type</h1>
                      </div>

                      {/* Tab 3: Salary & Benefits */}
                      <div
                        className={classNames(
                          'flex space-x-2 transition-opacity',
                          isTab3Enabled() ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        )}
                        onClick={() => {
                          if (isTab3Enabled()) {
                            setPageNumber(3);
                          }
                        }}
                      >
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 3 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>3</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 3 ? 'text-savoy-blue' : 'hidden')}>Salary & Benefits</h1>
                      </div>

                      {/* Tab 4: Job Description */}
                      <div className='flex space-x-2 transition-opacity'>
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 4 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>4</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 4 ? 'text-savoy-blue' : 'hidden')}>Job Description</h1>
                      </div>

                      {/* Tab 5: Job Settings */}
                      <div className='flex space-x-2 transition-opacity'>
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 5 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>5</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 5 ? 'text-savoy-blue' : 'hidden')}>Job Settings</h1>
                      </div>

                      {/* Tab 6: Post As */}
                      <div className='flex space-x-2 transition-opacity'>
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 6 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>6</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 6 ? 'text-savoy-blue' : 'hidden')}>Post As</h1>
                      </div>

                      {/* Tab 7: Preview */}
                      <div className='flex space-x-2 transition-opacity'>
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 7 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>7</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 7 ? 'text-savoy-blue' : 'hidden')}>Preview</h1>
                      </div>

                      {/* Tab 8: Platform */}
                      <div className='flex space-x-2 transition-opacity'>
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 8 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>8</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 8 ? 'text-savoy-blue' : 'hidden')}>Platform</h1>
                      </div>
                    </div>
                    <div className='pl-0 pt-2'>
                      <h1 className='text-sm font-semibold text-gray-500'>Step {pageNumber} out of 8</h1>
                    </div>
                  </div>

                  <div key={`page1-${formKey}`} style={{ display: pageNumber == 1 ? 'block' : 'none' }}>
                    <CreateJobPageJobTitleInfo
                      control={firstForm.control}
                      Controller={Controller}
                      register={firstForm.register}
                      handleSubmit={firstForm.handleSubmit}
                      setPageNumber={setPageNumber}
                      onSubmit={firstFormSubmit}
                      errors={firstForm.formState.errors}
                      positionData={positionData}
                      refetchPositions={refetchPositions}
                      fourthForm={fourthForm}
                    />
                  </div>
                  <div key={`page2-${formKey}`} style={{ display: pageNumber == 2 ? 'block' : 'none' }}>
                    <CreateJobPageJobType
                      control={secondForm.control}
                      setIsSalaryRangeModalOpen={setIsSalaryRangeModalOpen}
                      register={secondForm.register}
                      handleSubmit={secondForm.handleSubmit}
                      setValue={secondForm.setValue}
                      setPageNumber={setPageNumber}
                      getValues={secondForm.getValues}
                      hasSalaryRange={isRangeBenefitsAdded}
                      secondFormSubmit={secondFormSubmit}
                      thirdFormGetValues={thirdForm.getValues}
                    />
                  </div>
                  <div key={`page3-${formKey}`} style={{ display: pageNumber == 3 ? 'block' : 'none' }}>
                    <CreateJobPageSalary
                      watch={thirdForm.watch}
                      setValue={thirdForm.setValue}
                      register={thirdForm.register}
                      trigger={thirdForm.trigger}
                      setPageNumber={setPageNumber}
                      setFocus={thirdForm.setFocus}
                      getValues={thirdForm.getValues}
                      onSubmit={thirdFormSubmit}
                      pageNumber={pageNumber}
                    />
                  </div>
                  <div key={`page4-${formKey}`} style={{ display: pageNumber == 4 ? 'block' : 'none' }}>
                    <CreateJobPageJobDescription
                      setValue={fourthForm.setValue}
                      getValues={fourthForm.getValues}
                      register={fourthForm.register}
                      watch={fourthForm.watch}
                      setPageNumber={setPageNumber}
                      onSubmit={fourthFormSubmit}
                      setFileProps={setFileProps}
                      combinedFormData={combinedFormData}
                      positionData={positionData}
                      firstForm={firstForm}
                      uploadedJobDescriptionUrl={selectedDraft?.uploaded_job_description ?? null}
                    />
                  </div>
                  <div key={`page5-${formKey}`} style={{ display: pageNumber == 5 ? 'block' : 'none' }}>
                    <CreateJobPageJobSettings
                      setPageNumber={setPageNumber}
                      onSubmit={fifthFormSubmit}
                      screeningQuestions={screeningQuestions}
                      setScreeningQuestions={setScreeningQuestions}
                      autoRejectEnabled={autoRejectEnabled}
                      setAutoRejectEnabled={setAutoRejectEnabled}
                      isVideoIntroEnabled={isVideoIntroEnabled}
                      setIsVideoIntroEnabled={setIsVideoIntroEnabled}
                    />
                  </div>
                  <div key={`page6-${formKey}`} style={{ display: pageNumber == 6 ? 'block' : 'none' }}>
                    <CreateJobPagePostAs
                      setValue={sixthForm.setValue}
                      register={sixthForm.register}
                      setPageNumber={setPageNumber}
                      getValues={sixthForm.getValues}
                      isRangeBenefitsAdded={isRangeBenefitsAdded}
                      onSubmit={sixthFormSubmit}
                      pageNumber={pageNumber}
                    />
                  </div>
                  <div key={`page7-${formKey}`} style={{ display: pageNumber == 7 ? 'block' : 'none' }}>
                    <CreateJobPagePreview
                      firstFormGetValues={firstForm.getValues}
                      secondFormGetValues={secondForm.getValues}
                      thirdFormGetValues={thirdForm.getValues}
                      fourthFormGetValues={fourthForm.getValues}
                      setPageNumber={setPageNumber}
                      onSubmit={seventhFormSubmit}
                      fileProps={fileProps}
                    />
                  </div>
                  <div key={`page8-${formKey}`} style={{ display: pageNumber == 8 ? 'block' : 'none' }}>
                    <CreateJobPagePlatform
                      isLoading={isLoading}
                      setValue={seventhForm.setValue}
                      getValues={seventhForm.getValues}
                      setPageNumber={setPageNumber}
                      register={seventhForm.register}
                      onSubmit={onSubmit}
                      pageNumber={pageNumber}
                    />
                  </div>
                  <SalaryRangeModal
                    setPageNumber={setPageNumber}
                    isOpen={isSalaryRangeModalOpen}
                    setIsOpen={setIsSalaryRangeModalOpen}
                    setIsRangeBenefitsAdded={setIsRangeBenefitsAdded}
                    onSubmit={secondFormSubmit}
                  />

                  {/* Draft Modals - Rendered inside Dialog.Panel to prevent parent modal from closing */}
                  <ConfirmModal
                    message={'Are you sure you want to start over?\nAll unsaved progress will be lost.'}
                    isOpen={isStartOverModalOpen}
                    setIsOpen={setIsStartOverModalOpen}
                    confirmAction={() => {
                      setIsStartOverModalOpen(false);
                      resetForm(false);
                    }}
                    isLoading={false}
                  />
                  <SaveDraftModal
                    isOpen={isSaveDraftModalOpen}
                    onClose={() => setIsSaveDraftModalOpen(false)}
                    onSave={handleSaveDraft}
                    onDiscard={handleDiscardDraft}
                    isSaving={createDraftMutation.isLoading}
                  />
                  <LoadDraftModal
                    isOpen={isLoadDraftModalOpen}
                    onClose={() => setIsLoadDraftModalOpen(false)}
                    drafts={allDrafts}
                    onLoadDraft={handleLoadDraftClick}
                    onDeleteDraft={handleDeleteDraft}
                    isLoading={isDraftsLoading}
                    isDeleting={deleteDraftMutation.isLoading}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}