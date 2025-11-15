import { Dispatch, Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import SalaryRangeModal from '../../../modals/SalaryRangeModal';
import CreateJobPageJobTitleInfo from '../../../modals/ModalPages/CreateJobPageJobTitleInfo';
import CreateJobPageJobType from '../../../modals/ModalPages/CreateJobPageJobType';
import CreateJobPageSalary from '../../../modals/ModalPages/CreateJobPageSalary';
import CreateJobPageJobDescription from '../../../modals/ModalPages/CreateJobPageJobDescription';
import CreateJobPageJobSettings from '../../../modals/ModalPages/CreateJobPageJobSettings';
import CreateJobPagePostAs from '../../../modals/ModalPages/CreateJobPagePostAs';
import CreateJobPagePreview from '../../../modals/ModalPages/CreateJobPagePreview';
import CreateJobPagePlatform from '../../../modals/ModalPages/CreateJobPagePlatform';
import useAddJobPostItems from '../hooks/useAddJobPostItems';
import useGetPositionItems from '@/components/hooks/useGetPositionItems';

import { XCircleIcon } from '@heroicons/react/24/solid';

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
  firstForm,
  secondForm,
  thirdForm,
  fourthForm,
  fifthForm,
  sixthForm,
  seventhForm,
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
  firstForm: ReturnType<typeof useForm>;
  secondForm: ReturnType<typeof useForm>;
  thirdForm: ReturnType<typeof useForm>;
  fourthForm: ReturnType<typeof useForm>;
  fifthForm: ReturnType<typeof useForm>;
  sixthForm: ReturnType<typeof useForm>;
  seventhForm: ReturnType<typeof useForm>;
}) {
  const cancelButtonRef = useRef(null);
  const { mutate, isLoading } = useAddJobPostItems();
  
  // Fetch positions data in the parent component
  const { data: positionData, refetch: refetchPositions } = useGetPositionItems();

  const customCloseModal = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    firstForm.reset();
    secondForm.reset();
    thirdForm.reset();
    fourthForm.reset();
    fifthForm.reset();
    sixthForm.reset();
    seventhForm.reset();
    setPageNumber(1);
    setIsOpen(false);
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
    // Include screening questions, auto-reject settings, and rejection feedback
    const jobSettings = {
      ...data,
      screeningQuestions: window.screeningQuestions || [],
      autoRejectEnabled: window.autoRejectEnabled !== undefined ? window.autoRejectEnabled : true,
      rejectionFeedback: window.rejectionFeedback || ''
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
                      positionData={positionData}
                      refetchPositions={refetchPositions}
                      fourthForm={fourthForm}
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
                      combinedFormData={combinedFormData}
                      positionData={positionData}
                      firstForm={firstForm}
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
                    />
                  </div>
                  <div style={{ display: pageNumber == 6 ? 'block' : 'none' }}>
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
                    />
                  </div>
                  <SalaryRangeModal
                    setPageNumber={setPageNumber}
                    isOpen={isSalaryRangeModalOpen}
                    setIsOpen={setIsSalaryRangeModalOpen}
                    setIsRangeBenefitsAdded={setIsRangeBenefitsAdded}
                    onSubmit={secondFormSubmit}
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
