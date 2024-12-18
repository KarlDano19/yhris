import { Dispatch, Fragment, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import SalaryRangeModal from './SalaryRangeModal';
import CreateJobPageOne from './ModalPages/CreateJobPageOne';
import CreateJobPageTwo from './ModalPages/CreateJobPageTwo';
import CreateJobPageThree from './ModalPages/CreateJobPageThree';
import CreateJobPageFour from './ModalPages/CreateJobPageFour';
import CreateJobPageFive from './ModalPages/CreateJobPageFive';
import CreateJobPageSix from './ModalPages/CreateJobPageSix';
import CreateJobPageSeven from './ModalPages/CreateJobPageSeven';
import useAddJobPostItems from '../hooks/useAddJobPostItems';

import { XCircleIcon } from '@heroicons/react/24/solid';

import { CREATEJOB_TEMPLATE, QUALIFICATION_TEMPLATE } from '@/helpers/constants';

export default function CreateJobModal({
  isOpen,
  setIsOpen,
  openConfirmSocialShareModal,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  openConfirmSocialShareModal: (social: string, og_url: string) => void;
}) {
  const cancelButtonRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isSalaryRangeModalOpen, setIsSalaryRangeModalOpen] = useState(false);
  const [isRangeBenefitsAdded, setIsRangeBenefitsAdded] = useState(false);
  const [combinedFormData, setCombinedFormData] = useState<any>({});
  const [fileProps, setFileProps] = useState<{ fileName?: string; fileSize?: number; file?: File }>({});
  const firstForm = useForm<any>({
    defaultValues: {
      country: 'Philippines',
      language: 'English',
    },
  });
  const secondForm = useForm();
  const thirdForm = useForm<any>({
    defaultValues: {
      salary: {
        salaryType: 'Range',
      },
    },
  });
  const fourthForm = useForm<any>({
    defaultValues: {
      jobDescription: CREATEJOB_TEMPLATE[0],
      qualifications: QUALIFICATION_TEMPLATE[0],
    },
  });
  const fifthForm = useForm();
  const sixthForm = useForm();
  const seventhForm = useForm();
  const { mutate, isLoading } = useAddJobPostItems();

  const customCloseModal = () => {
    firstForm.reset();
    secondForm.reset();
    thirdForm.reset();
    fourthForm.reset();
    fifthForm.reset();
    sixthForm.reset();
    seventhForm.reset();
    setIsOpen(false);
  };

  const firstFormSubmit = (data: any) => {
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
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
    setPageNumber(6);
  };

  const sixthFormSubmit = () => {
    const data = sixthForm.getValues();
    setCombinedFormData((prev: any) => ({ ...prev, ...data }));
    setPageNumber(7);
  };

  const onSubmit = () => {
    const data = seventhForm.getValues();
    const finalData = { ...combinedFormData, ...data };
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
        customCloseModal();
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
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Job Form</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                  </div>
                  <div style={{ display: pageNumber == 1 ? 'block' : 'none' }}>
                    <CreateJobPageOne
                      control={firstForm.control}
                      Controller={Controller}
                      register={firstForm.register}
                      handleSubmit={firstForm.handleSubmit}
                      setPageNumber={setPageNumber}
                      onSubmit={firstFormSubmit}
                    />
                  </div>
                  <div style={{ display: pageNumber == 2 ? 'block' : 'none' }}>
                    <CreateJobPageTwo
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
                    <CreateJobPageThree
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
                    <CreateJobPageFour
                      setValue={fourthForm.setValue}
                      getValues={fourthForm.getValues}
                      register={fourthForm.register}
                      setPageNumber={setPageNumber}
                      onSubmit={fourthFormSubmit}
                      setFileProps={setFileProps}
                    />
                  </div>
                  <div style={{ display: pageNumber == 5 ? 'block' : 'none' }}>
                    <CreateJobPageFive
                      setValue={fifthForm.setValue}
                      register={fifthForm.register}
                      setPageNumber={setPageNumber}
                      getValues={fifthForm.getValues}
                      isRangeBenefitsAdded={isRangeBenefitsAdded}
                      onSubmit={fifthFormSubmit}
                    />
                  </div>
                  <div style={{ display: pageNumber == 6 ? 'block' : 'none' }}>
                    <CreateJobPageSix
                      firstFormGetValues={firstForm.getValues}
                      fourthFormGetValues={fourthForm.getValues}
                      setPageNumber={setPageNumber}
                      onSubmit={sixthFormSubmit}
                      fileProps={fileProps}
                    />
                  </div>
                  <div style={{ display: pageNumber == 7 ? 'block' : 'none' }}>
                    <CreateJobPageSeven
                      isLoading={isLoading}
                      setValue={seventhForm.setValue}
                      setPageNumber={setPageNumber}
                      onSubmit={onSubmit}
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
