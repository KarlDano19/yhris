import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import SalaryRangeModal from '../../modals/SalaryRangeModal';
import CreateJobPageJobTitleInfo from '../../modals/ModalPages/CreateJobPageJobTitleInfo';
import CreateJobPageJobType from '../../modals/ModalPages/CreateJobPageJobType';
import CreateJobPageSalary from '../../modals/ModalPages/CreateJobPageSalary';
import CreateJobPageJobDescription from '../../modals/ModalPages/CreateJobPageJobDescription';
import CreateJobPageJobSettings from '../../modals/ModalPages/CreateJobPageJobSettings';
import CreateJobPagePostAs from '../../modals/ModalPages/CreateJobPagePostAs';
import CreateJobPagePreview from '../../modals/ModalPages/CreateJobPagePreview';
import CreateJobPagePlatform from '../../modals/ModalPages/CreateJobPagePlatform';
import classNames from '@/helpers/classNames';

import useGetJobDetails from '../hooks/useGetJobPostDetails';
import useUpdateJobPostItems from '../hooks/useUpdateJobPostItems';
import useGetPositionItems from '@/components/hooks/useGetPositionItems';

import { XCircleIcon } from '@heroicons/react/24/solid';

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    screeningQuestions: any[];
    autoRejectEnabled: boolean;
    rejectionFeedback?: string;
    isVideoIntroEnabled?: boolean;
  }
}

type T_ModalData = {
  id: number | null;
  open: boolean;
};

export default function UpdateJobModal({
  refetch,
  isOpen,
  setIsOpen,
  openConfirmSocialShareModal,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
  openConfirmSocialShareModal: (social: string, og_url: string) => void;
}) {
  const cancelButtonRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isSalaryRangeModalOpen, setIsSalaryRangeModalOpen] = useState(false);
  const [isRangeBenefitsAdded, setIsRangeBenefitsAdded] = useState(false);
  const [userDeclinedSalary, setUserDeclinedSalary] = useState(false);
  const [combinedFormData, setCombinedFormData] = useState<any>({});
  const [fileProps, setFileProps] = useState<{ fileName?: string; fileSize?: number; file?: File }>({});
  const [screeningQuestions, setScreeningQuestions] = useState<any[]>([]);
  const [autoRejectEnabled, setAutoRejectEnabled] = useState(true);
  const [isVideoIntroEnabled, setIsVideoIntroEnabled] = useState(false);
  const [originalSharedTo, setOriginalSharedTo] = useState<string>('');

  const {
    data: jobPostDataDetails,
    refetch: refetchJobPostDetails,
    remove: removeJobPostDetails,
  } = useGetJobDetails(isOpen.id);

  useEffect(() => {
    if (isOpen.id) {
      refetchJobPostDetails();
    }
  }, [isOpen]);

  const firstForm = useForm();
  const secondForm = useForm();
  const thirdForm = useForm();
  const fourthForm = useForm();
  const fifthForm = useForm();
  const sixthForm = useForm();
  const seventhForm = useForm();
  const eighthForm = useForm();
  const { mutate, isLoading } = useUpdateJobPostItems();

  // Fetch positions data in the parent component
  const { data: positionData, refetch: refetchPositions } = useGetPositionItems();

  useEffect(() => {
    if (jobPostDataDetails) {
      firstForm.reset({
        jobTitle: jobPostDataDetails.job_title,
        placeAdvertise: jobPostDataDetails.advertise_to
          ? jobPostDataDetails.advertise_to.split(',').map((s: string) => s.trim())
          : [],
        country: jobPostDataDetails.country,
        language: jobPostDataDetails.language,
        position: jobPostDataDetails.position_id || jobPostDataDetails.position, 
      });
      secondForm.reset({
        jobType: jobPostDataDetails.job_type ? jobPostDataDetails.job_type.split(',') : [],
        workSetup: jobPostDataDetails.work_setup ? jobPostDataDetails.work_setup.split(',') : [],
        schedule: jobPostDataDetails.job_schedule ? jobPostDataDetails.job_schedule.split(',') : [],
        hireDate: new Date(jobPostDataDetails.date_required),
        hireCount: jobPostDataDetails.required_slot,
        hiredCount: jobPostDataDetails.hired_count || 0, // Store hired count for validation
      });
      if (jobPostDataDetails?.salary_range_type) {
        setIsRangeBenefitsAdded(true);
        setUserDeclinedSalary(false); // Reset declined flag since salary data exists
        thirdForm.reset({
          is_show_salary: jobPostDataDetails.is_show_salary,
          is_show_benefits: jobPostDataDetails.is_show_benefits,
          salary: {
            salaryType: jobPostDataDetails.salary_range_type,
            salaryRangeMin: jobPostDataDetails.minimum_amount,
            salaryRangeMax: jobPostDataDetails.maximum_amount,
            salaryValue: jobPostDataDetails.exact_amount,
          },
          rate: jobPostDataDetails.rate, // Move rate outside of salary object
          benefits: jobPostDataDetails.offered_benefits.split(','),
          otherBenefits: jobPostDataDetails.other_benefits,
        });
      }
      fourthForm.reset({
        is_show_roles: jobPostDataDetails.is_show_roles,
        is_show_remarks: jobPostDataDetails.is_show_remarks,
        jobDescription: jobPostDataDetails.job_description,
        qualifications: jobPostDataDetails.qualifications,
        notesRemarks: jobPostDataDetails.job_remark,
      });
      // Normalize screening questions for the Job Settings page
      if (jobPostDataDetails.screening_questions && jobPostDataDetails.screening_questions !== null) {
        const normalizedQuestions = jobPostDataDetails.screening_questions.map((q: any, idx: number) => ({
          id: q.id || q.question_id || idx + 1,
          question: q.question || q.text || '',
          idealAnswer: q.idealAnswer || q.ideal_answer || 'Yes',
          responseType: q.responseType || q.response_type || 'Yes / No',
          mustHave: q.mustHave !== undefined ? q.mustHave : (q.must_have !== undefined ? q.must_have : true),
          showToCandidates: q.showToCandidates !== undefined ? q.showToCandidates : (q.show_to_candidates !== undefined ? q.show_to_candidates : true),
          recommended: q.recommended !== undefined ? q.recommended : false,
          editable: q.editable !== undefined ? q.editable : false,
          degree: q.degree,
          presetId: q.presetId || q.preset_id,
        }));
        setScreeningQuestions(normalizedQuestions);
        setAutoRejectEnabled(
          jobPostDataDetails.auto_reject_enabled !== undefined
            ? jobPostDataDetails.auto_reject_enabled
            : true
        );
        
        // Load rejection feedback if available
        if (jobPostDataDetails.rejection_feedback) {
          window.rejectionFeedback = jobPostDataDetails.rejection_feedback;
        }
      }
      // Load video intro enabled setting
      setIsVideoIntroEnabled(
        jobPostDataDetails.is_video_intro_enabled !== undefined
          ? jobPostDataDetails.is_video_intro_enabled
          : false
      );
      fifthForm.reset();
      sixthForm.reset({
        postAs: jobPostDataDetails.poster_type,
        uploaded_image: jobPostDataDetails.uploaded_image,
      });
      seventhForm.reset({
        shared_to: jobPostDataDetails.shared_to.split(','),
        jobUrl: jobPostDataDetails.job_url,
      });

      // Capture original shared_to for comparison later
      setOriginalSharedTo(jobPostDataDetails.shared_to || '');
    }
  }, [jobPostDataDetails]);

  const firstFormSubmit = (data: any) => {
    const formData = { ...data };

    // Find the selected position and add its description to the data
    const selectedPosition = positionData?.find((pos: any) => pos.id === data.position);
    if (selectedPosition?.description) {
      formData.positionDescription = selectedPosition.description;
    }

    setCombinedFormData((prev: any) => ({ ...prev, ...formData }));
    setPageNumber(2);
  };

  const secondFormSubmit = () => {
    const data = secondForm.getValues();
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
    setPageNumber(3);
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
    // Include screening questions, auto-reject settings, and video intro in the form data
    setCombinedFormData((prev: any) => ({
      ...prev,
      ...data,
      screeningQuestions: screeningQuestions,
      autoRejectEnabled: autoRejectEnabled,
      isVideoIntroEnabled: isVideoIntroEnabled
    }));
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
    const data = eighthForm.getValues();
    // Get ALL current form values to ensure nothing is lost when user jumps between pages
    const page1Data = firstForm.getValues();
    const page2Data = secondForm.getValues();
    const page3Data = thirdForm.getValues();
    const page4Data = fourthForm.getValues();
    const page5Data = fifthForm.getValues();
    const posterData = sixthForm.getValues(); // Page 6: postAs, uploaded file
    const platformData = seventhForm.getValues(); // Page 7: shared_to, jobUrl
    const finalData = {
      ...combinedFormData,
      ...page1Data,
      ...page2Data,
      ...page3Data,
      ...page4Data,
      ...page5Data,
      ...posterData, // Poster type and uploaded file
      ...platformData, // Platform selection
      ...data // Page 8 data (confirmation)
    };

    // Ensure screening questions are included in the final data
    if (!finalData.screeningQuestions && screeningQuestions.length > 0) {
      finalData.screeningQuestions = screeningQuestions;
    }

    if (finalData.autoRejectEnabled === undefined) {
      finalData.autoRejectEnabled = autoRejectEnabled;
    }

    // Ensure rejection feedback is included in the final data
    if (!finalData.rejectionFeedback && window.rejectionFeedback) {
      finalData.rejectionFeedback = window.rejectionFeedback;
    }

    // Ensure video intro enabled is included in the final data
    if (finalData.isVideoIntroEnabled === undefined) {
      finalData.isVideoIntroEnabled = isVideoIntroEnabled;
    }

    // If user declined to add salary, remove salary-related fields
    if (userDeclinedSalary) {
      delete finalData.salary;
      delete finalData.rate;
      delete finalData.benefits;
      delete finalData.is_show_salary;
      delete finalData.is_show_benefits;
    }

    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });

        // Close the update modal first
        customCloseModal();
        setIsSalaryRangeModalOpen(false);

        // Trigger social share modal ONLY for NEWLY ADDED platforms
        if (data?.job_post?.shared_to && data?.job_post?.og_url) {
          // Parse original and new platforms
          const originalPlatforms = originalSharedTo
            ? originalSharedTo.split(',').map((p: string) => p.trim()).filter((p: string) => p !== '')
            : [];
          const newPlatforms = data.job_post.shared_to
            .split(',')
            .map((p: string) => p.trim())
            .filter((p: string) => p !== '');

          // Filter to get only newly added platforms
          const addedPlatforms = newPlatforms.filter((p: string) => !originalPlatforms.includes(p));

          // Only show modal if there are newly added platforms
          if (addedPlatforms.length > 0) {
            const addedPlatformsString = addedPlatforms.join(',');
            openConfirmSocialShareModal(addedPlatformsString, data.job_post.og_url);
          }
        }

        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate({jobPost: finalData, job_post_id: isOpen.id}, callbackReq);
  };

  // Handler for saving from any page (Pages 1-7)
  const handleSaveFromPage = (currentPageNumber: number, currentPageForm: any) => {
    // Validate current page only
    currentPageForm.handleSubmit(
      (validData: any) => {
        // Page-specific data processing
        let processedData = { ...validData };

        // Page 1: Add position description
        if (currentPageNumber === 1) {
          const selectedPosition = positionData?.find((pos: any) => pos.id === validData.position);
          if (selectedPosition?.description) {
            processedData.positionDescription = selectedPosition.description;
          }
        }

        // Page 5: Include screening questions, auto-reject settings, and video intro
        if (currentPageNumber === 5) {
          processedData.screeningQuestions = screeningQuestions;
          processedData.autoRejectEnabled = autoRejectEnabled;
          processedData.isVideoIntroEnabled = isVideoIntroEnabled;
        }

        // Build existing data from jobPostDataDetails to preserve required fields
        const existingData: any = {};
        if (jobPostDataDetails) {
          // Add shared_to (required field) from existing data if not in current changes
          if (jobPostDataDetails.shared_to) {
            existingData.shared_to = jobPostDataDetails.shared_to.split(',');
          }
        }

        // Get ALL current form values to ensure nothing is lost when user jumps between pages
        const page1Data = firstForm.getValues();
        const page2Data = secondForm.getValues();
        const page3Data = thirdForm.getValues();
        const page4Data = fourthForm.getValues();
        const page5Data = fifthForm.getValues();
        const page6Data = sixthForm.getValues(); // Important: postAs and uploaded file
        const page7Data = seventhForm.getValues();

        // Merge: existing data -> accumulated data -> all form values -> current page data
        // This ensures required fields are preserved when saving from any page
        const finalData = {
          ...existingData,
          ...combinedFormData,
          ...page1Data,
          ...page2Data,
          ...page3Data,
          ...page4Data,
          ...page5Data,
          ...page6Data, // Poster type and uploaded file
          ...page7Data,
          ...processedData // Current page overrides all
        };

        // Ensure screening questions are included in the final data
        if (!finalData.screeningQuestions && screeningQuestions.length > 0) {
          finalData.screeningQuestions = screeningQuestions;
        }

        if (finalData.autoRejectEnabled === undefined) {
          finalData.autoRejectEnabled = autoRejectEnabled;
        }

        // Ensure rejection feedback is included in the final data
        if (!finalData.rejectionFeedback && window.rejectionFeedback) {
          finalData.rejectionFeedback = window.rejectionFeedback;
        }

        // Ensure video intro enabled is included in the final data
        if (finalData.isVideoIntroEnabled === undefined) {
          finalData.isVideoIntroEnabled = isVideoIntroEnabled;
        }

        // If user declined to add salary, remove salary-related fields
        if (userDeclinedSalary) {
          delete finalData.salary;
          delete finalData.rate;
          delete finalData.benefits;
          delete finalData.is_show_salary;
          delete finalData.is_show_benefits;
        }

        // Call the mutation
        const callbackReq = {
          onSuccess: (data: any) => {
            toast.custom(() => <CustomToast message="Job posting updated successfully!" type='success' />, { duration: 5000 });
            customCloseModal();
            setIsSalaryRangeModalOpen(false);
            refetch();
          },
          onError: (err: any) => {
            toast.custom(() => <CustomToast message={err} type='error' />, {
              duration: 7000,
            });
          },
        };

        mutate({jobPost: finalData, job_post_id: isOpen.id}, callbackReq);
      },
      (errors: any) => {
        // Show validation error toast
        toast.custom(() => <CustomToast message="Please fix the errors on this page" type='error' />, {
          duration: 5000,
        });
      }
    )();
  };

  // Check if tab 3 should be enabled
  const isTab3Enabled = () => {
    // If user explicitly declined, tab 3 is disabled
    if (userDeclinedSalary) {
      return false;
    }

    const salaryData = thirdForm.getValues('salary');
    const rateData = thirdForm.getValues('rate');
    const benefitsData = thirdForm.getValues('benefits');
    const hasSalaryData = salaryData?.salaryType && rateData && benefitsData && benefitsData.length > 0;
    return isRangeBenefitsAdded || hasSalaryData;
  };

  const customCloseModal = () => {
    removeJobPostDetails();
    firstForm.reset();
    secondForm.reset();
    thirdForm.reset();
    fourthForm.reset();
    fifthForm.reset();
    sixthForm.reset();
    seventhForm.reset();
    eighthForm.reset();
    // Reset global variables used for screening questions
    setScreeningQuestions([]);
    setAutoRejectEnabled(true);
    setIsVideoIntroEnabled(false);
    setUserDeclinedSalary(false);
    setOriginalSharedTo('');

    setPageNumber(1);
    setIsOpen({ id: null, open: false });
  };

  return (
    <Transition.Root show={isOpen.open} as={Fragment}>
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
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Update Job Form</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>

                  {/* Tab Navigation */}
                  <div className='pt-4 pb-2 px-4'>
                    <div className='flex flex-row overflow-x-auto whitespace-nowrap space-x-4 scrollbar-hide'>
                      {/* Tab 1: Job Info */}
                      <div
                        className='flex space-x-2 transition-opacity cursor-pointer'
                        onClick={() => setPageNumber(1)}
                      >
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 1 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>1</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 1 ? 'text-savoy-blue' : 'hidden')}>Job Info</h1>
                      </div>

                      {/* Tab 2: Job Type */}
                      <div
                        className='flex space-x-2 transition-opacity cursor-pointer'
                        onClick={() => setPageNumber(2)}
                      >
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
                      <div
                        className='flex space-x-2 transition-opacity cursor-pointer'
                        onClick={() => setPageNumber(4)}
                      >
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 4 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>4</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 4 ? 'text-savoy-blue' : 'hidden')}>Job Description</h1>
                      </div>

                      {/* Tab 5: Job Settings */}
                      <div
                        className='flex space-x-2 transition-opacity cursor-pointer'
                        onClick={() => setPageNumber(5)}
                      >
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 5 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>5</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 5 ? 'text-savoy-blue' : 'hidden')}>Job Settings</h1>
                      </div>

                      {/* Tab 6: Post As */}
                      <div
                        className='flex space-x-2 transition-opacity cursor-pointer'
                        onClick={() => setPageNumber(6)}
                      >
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 6 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>6</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 6 ? 'text-savoy-blue' : 'hidden')}>Post As</h1>
                      </div>

                      {/* Tab 7: Preview */}
                      <div
                        className='flex space-x-2 transition-opacity cursor-pointer'
                        onClick={() => setPageNumber(7)}
                      >
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 7 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>7</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 7 ? 'text-savoy-blue' : 'hidden')}>Preview</h1>
                      </div>

                      {/* Tab 8: Platform */}
                      <div
                        className='flex space-x-2 transition-opacity cursor-pointer'
                        onClick={() => setPageNumber(8)}
                      >
                        <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', pageNumber === 8 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>8</h1>
                        <h1 className={classNames('self-center text-sm md:text-base font-semibold', pageNumber === 8 ? 'text-savoy-blue' : 'hidden')}>Platform</h1>
                      </div>
                    </div>
                    <div className='pl-0 pt-2'>
                      <h1 className='text-sm font-semibold text-gray-500'>Step {pageNumber} out of 8</h1>
                    </div>
                  </div>

                  <div style={{ display: pageNumber == 1 ? 'block' : 'none' }}>
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
                      isEdit={true}
                      onSave={() => handleSaveFromPage(1, firstForm)}
                      isLoading={isLoading}
                    />
                  </div>
                  <div style={{ display: pageNumber == 2 ? 'block' : 'none' }}>
                    <CreateJobPageJobType
                      control={secondForm.control}
                      setIsSalaryRangeModalOpen={setIsSalaryRangeModalOpen}
                      register={secondForm.register}
                      handleSubmit={secondForm.handleSubmit}
                      setValue={secondForm.setValue}
                      setPageNumber={setPageNumber}
                      getValues={secondForm.getValues}
                      secondFormSubmit={secondFormSubmit}
                      hiredCount={jobPostDataDetails?.hired_count || 0}
                      hasSalaryRange={isRangeBenefitsAdded}
                      thirdFormGetValues={thirdForm.getValues}
                      isEdit={true}
                      onSave={() => handleSaveFromPage(2, secondForm)}
                      isLoading={isLoading}
                    />
                  </div>
                  <div style={{ display: pageNumber == 3 ? 'block' : 'none' }}>
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
                      isEdit={true}
                      onSave={() => handleSaveFromPage(3, thirdForm)}
                      isLoading={isLoading}
                    />
                  </div>
                  <div style={{ display: pageNumber == 4 ? 'block' : 'none' }}>
                    <CreateJobPageJobDescription
                      setValue={fourthForm.setValue}
                      getValues={fourthForm.getValues}
                      register={fourthForm.register}
                      setPageNumber={setPageNumber}
                      onSubmit={fourthFormSubmit}
                      setFileProps={setFileProps}
                      hasSalaryRange={isRangeBenefitsAdded}
                      combinedFormData={combinedFormData}
                      positionData={positionData}
                      firstForm={firstForm}
                      isEdit={true}
                      onSave={() => handleSaveFromPage(4, fourthForm)}
                      isLoading={isLoading}
                    />
                  </div>
                  <div style={{ display: pageNumber == 5 ? 'block' : 'none' }}>
                    <CreateJobPageJobSettings
                      setPageNumber={setPageNumber}
                      onSubmit={fifthFormSubmit}
                      screeningQuestions={screeningQuestions}
                      setScreeningQuestions={setScreeningQuestions}
                      autoRejectEnabled={autoRejectEnabled}
                      setAutoRejectEnabled={setAutoRejectEnabled}
                      initialRejectionFeedback={jobPostDataDetails?.rejection_feedback || ''}
                      isVideoIntroEnabled={isVideoIntroEnabled}
                      setIsVideoIntroEnabled={setIsVideoIntroEnabled}
                      isEdit={true}
                      onSave={() => handleSaveFromPage(5, fifthForm)}
                      isLoading={isLoading}
                    />
                  </div>
                  <div style={{ display: pageNumber == 6 ? 'block' : 'none' }}>
                    <CreateJobPagePostAs
                      setValue={sixthForm.setValue}
                      getValues={sixthForm.getValues}
                      register={sixthForm.register}
                      setPageNumber={setPageNumber}
                      isRangeBenefitsAdded={isRangeBenefitsAdded}
                      onSubmit={sixthFormSubmit}
                      pageNumber={pageNumber}
                      isEdit={true}
                      onSave={() => handleSaveFromPage(6, sixthForm)}
                      isLoading={isLoading}
                    />
                  </div>
                  <div style={{ display: pageNumber == 7 ? 'block' : 'none' }}>
                    <CreateJobPagePreview
                      firstFormGetValues={firstForm.getValues}
                      secondFormGetValues={secondForm.getValues}
                      thirdFormGetValues={thirdForm.getValues}
                      fourthFormGetValues={fourthForm.getValues}
                      setPageNumber={setPageNumber}
                      onSubmit={seventhFormSubmit}
                      fileProps={fileProps}
                      isEdit={true}
                      onSave={() => handleSaveFromPage(7, seventhForm)}
                      isLoading={isLoading}
                    />
                  </div>
                  <div style={{ display: pageNumber == 8 ? 'block' : 'none' }}>
                    <CreateJobPagePlatform
                      isLoading={isLoading}
                      setValue={seventhForm.setValue}
                      getValues={seventhForm.getValues}
                      setPageNumber={setPageNumber}
                      register={seventhForm.register}
                      onSubmit={onSubmit}
                      pageNumber={pageNumber}
                      isEdit={true}
                    />

                  </div>
                  <SalaryRangeModal
                    setPageNumber={setPageNumber}
                    isOpen={isSalaryRangeModalOpen}
                    setIsOpen={setIsSalaryRangeModalOpen}
                    setIsRangeBenefitsAdded={setIsRangeBenefitsAdded}
                    setUserDeclinedSalary={setUserDeclinedSalary}
                    onSubmit={() => {
                      secondFormSubmit();
                    }}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
  );
}