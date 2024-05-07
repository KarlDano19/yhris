import { Dispatch, Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Dialog, Transition } from '@headlessui/react';

import { XCircleIcon } from '@heroicons/react/24/solid';
import { T_CreateJob } from '@/types/globals';
import SalaryRangeModal from './SalaryRangeModal';
import CreateJobPageOne from './ModalPages/CreateJobPageOne';
import CreateJobPageTwo from './ModalPages/CreateJobPageTwo';
import CreateJobPageThree from './ModalPages/CreateJobPageThree';
import CreateJobPageFour from './ModalPages/CreateJobPageFour';
import CreateJobPageFive from './ModalPages/CreateJobPageFive';
import CreateJobPageSix from './ModalPages/CreateJobPageSix';
import CreateJobPageSeven from './ModalPages/CreateJobPageSeven';
import CreateJobPageEight from './ModalPages/CreateJobPageEight';
import CustomToast from '@/components/CustomToast';
import useAddJobPostItems from '../hooks/useAddJobPostItems';
import { CREATEJOB_TEMPLATE, QUALIFICATION_TEMPLATE } from '@/helpers/constants';

export default function CreateJobModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: Dispatch<boolean> }) {
  const { mutate, isLoading } = useAddJobPostItems();
  const { register, handleSubmit, watch, setValue, getValues, trigger, setFocus, control, reset } =
    useForm<T_CreateJob>({
      defaultValues: {
        salary: {
          salaryType: 'Range',
        },
        country: 'Philippines',
        language: 'English',
        jobDescription: CREATEJOB_TEMPLATE[0],
        qualifications: QUALIFICATION_TEMPLATE[0],
      },
    });

  const [pageNumber, setPageNumber] = useState(1);
  const [isSalaryRangeModalOpen, setIsSalaryRangeModalOpen] = useState(false);
  const [isCreateJobPageEightModalOpen, setIsCreateJobPageEightModalOpen] = useState(false);
  const [isRangeBenefitsAdded, setIsRangeBenefitsAdded] = useState(false);
  const cancelButtonRef = useRef(null);

  const onSubmit = handleSubmit((data: T_CreateJob) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
        setIsOpen(false);
        setIsSalaryRangeModalOpen(false);
        socialMediaShare(data.job_post.shared_to, data.job_post.og_url);
        reset();
        setPageNumber(1);
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    mutate(data, callbackReq);
  });

  const socialMediaShare = (social: string, og_url: string) => {
    const encoded_url = encodeURIComponent(og_url);
    if (social === 'Facebook') {
      og_url = `${encoded_url}%3Fsource%3Dfacebook`;
      shareFb(og_url);
      return;
    }
    if (social === 'LinkedIn') {
      og_url = `${encoded_url}%3Fsource%3Dlinkedin`;
      shareLinkedIn(og_url);
      return;
    }
  };

  const shareFb = (og_url: string) => {
    const FBSharer = `https://www.facebook.com/sharer/sharer.php?u=${og_url}`;
    window.open(FBSharer);
  };

  const shareLinkedIn = (og_url: string) => {
    const LinkedInSharer = `https://www.linkedin.com/sharing/share-offsite/?url=${og_url}`;
    window.open(LinkedInSharer);
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setIsOpen}>
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Job Form</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                  </div>
                  {pageNumber == 1 && (
                    <CreateJobPageOne register={register} handleSubmit={handleSubmit} setPageNumber={setPageNumber} />
                  )}
                  {pageNumber == 2 && (
                    <CreateJobPageTwo
                      control={control}
                      setIsSalaryRangeModalOpen={setIsSalaryRangeModalOpen}
                      watch={watch}
                      register={register}
                      handleSubmit={handleSubmit}
                      setValue={setValue}
                      setPageNumber={setPageNumber}
                      getValues={getValues}
                    />
                  )}
                  {pageNumber == 3 && (
                    <CreateJobPageThree
                      watch={watch}
                      setValue={setValue}
                      register={register}
                      trigger={trigger}
                      setPageNumber={setPageNumber}
                      setFocus={setFocus}
                      getValues={getValues}
                    />
                  )}
                  {pageNumber == 4 && (
                    <CreateJobPageFour
                      setValue={setValue}
                      getValues={getValues}
                      register={register}
                      setPageNumber={setPageNumber}
                    />
                  )}
                  {pageNumber == 5 && (
                    <CreateJobPageFive
                      setValue={setValue}
                      watch={watch}
                      register={register}
                      setPageNumber={setPageNumber}
                      getValues={getValues}
                      isRangeBenefitsAdded={isRangeBenefitsAdded}
                    />
                  )}
                  {pageNumber == 6 && (
                    <CreateJobPageSix
                      getValues={getValues}
                      setValue={setValue}
                      watch={watch}
                      register={register}
                      setPageNumber={setPageNumber}
                    />
                  )}
                  {pageNumber == 7 && (
                    <CreateJobPageSeven
                      isLoading={isLoading}
                      setValue={setValue}
                      setPageNumber={setPageNumber}
                      onSubmit={onSubmit}
                    />
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <CreateJobPageEight isOpen={isCreateJobPageEightModalOpen} setIsOpen={setIsCreateJobPageEightModalOpen} />
      <SalaryRangeModal
        setPageNumber={setPageNumber}
        isOpen={isSalaryRangeModalOpen}
        setIsOpen={setIsSalaryRangeModalOpen}
        setIsRangeBenefitsAdded={setIsRangeBenefitsAdded}
      />
    </>
  );
}
