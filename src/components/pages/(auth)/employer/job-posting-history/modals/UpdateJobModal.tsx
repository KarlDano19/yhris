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

import useGetJobDetails from '../hooks/useGetJobPostDetails';
import useUpdateJobPostItems from '../hooks/useUpdateJobPostItems';

import { XCircleIcon } from '@heroicons/react/24/solid';

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    screeningQuestions: any[];
    autoRejectEnabled: boolean;
    rejectionFeedback?: string;
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
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isSalaryRangeModalOpen, setIsSalaryRangeModalOpen] = useState(false);
  const [isRangeBenefitsAdded, setIsRangeBenefitsAdded] = useState(false);
  const [hasSalaryRange, setHasSalaryRange] = useState(false);
  const [combinedFormData, setCombinedFormData] = useState<any>({});
  const [fileProps, setFileProps] = useState<{ fileName?: string; fileSize?: number; file?: File }>({});
  const [screeningQuestions, setScreeningQuestions] = useState<any[]>([]);
  const [autoRejectEnabled, setAutoRejectEnabled] = useState(true);
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

  useEffect(() => {
    if (jobPostDataDetails) {
      firstForm.reset({
        jobTitle: jobPostDataDetails.job_title,
        placeAdvertise: jobPostDataDetails.advertise_to
          ? jobPostDataDetails.advertise_to.split(',').map((s: string) => s.trim())
          : [],
        country: jobPostDataDetails.country,
        language: jobPostDataDetails.language,
      });
      secondForm.reset({
        jobType: jobPostDataDetails.job_type ? jobPostDataDetails.job_type.split(',') : [],
        workSetup: jobPostDataDetails.work_setup ? jobPostDataDetails.work_setup.split(',') : [],
        schedule: jobPostDataDetails.job_schedule ? jobPostDataDetails.job_schedule.split(',') : [],
        hireDate: new Date(jobPostDataDetails.date_required),
        hireCount: jobPostDataDetails.required_slot,
      });
      if (jobPostDataDetails?.salary_range_type) {
        setHasSalaryRange(true);
        thirdForm.reset({
          is_show_salary: jobPostDataDetails.is_show_salary,
          is_show_benefits: jobPostDataDetails.is_show_benefits,
          salary: {
            salaryType: jobPostDataDetails.salary_range_type,
            salaryRangeMin: jobPostDataDetails.minimum_amount,
            salaryRangeMax: jobPostDataDetails.maximum_amount,
            salaryValue: jobPostDataDetails.exact_amount,
            rate: jobPostDataDetails.rate,
          },
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
      fifthForm.reset({
        postAs: jobPostDataDetails.poster_type,
        uploaded_image: jobPostDataDetails.uploaded_image,
      });
      sixthForm.reset();
      seventhForm.reset({
        shared_to: jobPostDataDetails.shared_to.split(','),
        jobUrl: jobPostDataDetails.job_url,
      });
    }
  }, [jobPostDataDetails]);

  const firstFormSubmit = (data: any) => {
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
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
    // Include screening questions and auto-reject settings in the form data
    setCombinedFormData((prev: any) => ({
      ...prev,
      ...data,
      screeningQuestions: screeningQuestions,
      autoRejectEnabled: autoRejectEnabled
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
    const finalData = { ...combinedFormData, ...data };
    
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
    
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
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
    
    setPageNumber(1);
    setIsOpen({ id: null, open: false });
  };

  return (
    <>
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
                  <div style={{ display: pageNumber == 1 ? 'block' : 'none' }}>
                    <CreateJobPageJobTitleInfo
                      control={firstForm.control}
                      Controller={Controller}
                      register={firstForm.register}
                      handleSubmit={firstForm.handleSubmit}
                      setPageNumber={setPageNumber}
                      onSubmit={firstFormSubmit}
                      errors={firstForm.formState.errors}
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
                      hasSalaryRange={hasSalaryRange}
                      secondFormSubmit={secondFormSubmit}
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
                      hasSalaryRange={hasSalaryRange}
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
                    />
                  </div>
                  <div style={{ display: pageNumber == 6 ? 'block' : 'none' }}>
                    <CreateJobPagePostAs
                      setValue={fifthForm.setValue}
                      getValues={fifthForm.getValues}
                      register={fifthForm.register}
                      setPageNumber={setPageNumber}
                      isRangeBenefitsAdded={isRangeBenefitsAdded}
                      onSubmit={sixthFormSubmit}
                      pageNumber={pageNumber}
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
                    onSubmit={() => {
                      secondFormSubmit();
                      setHasSalaryRange(true);
                    }}
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
