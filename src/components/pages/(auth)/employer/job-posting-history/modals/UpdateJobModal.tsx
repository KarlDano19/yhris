import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import SalaryRangeModal from '../../modals/SalaryRangeModal';
import CreateJobPageOne from '../../modals/ModalPages/CreateJobPageJobTitleInfo';
import CreateJobPageTwo from '../../modals/ModalPages/CreateJobPageJobType';
import CreateJobPageThree from '../../modals/ModalPages/CreateJobPageSalary';
import CreateJobPageFour from '../../modals/ModalPages/CreateJobPageJobDescription';
import CreateJobPageFive from '../../modals/ModalPages/CreateJobPagePostAs';
import CreateJobPageSix from '../../modals/ModalPages/CreateJobPagePreview';
import CreateJobPageSeven from '../../modals/ModalPages/CreateJobPagePlatform';

import useGetJobDetails from '../hooks/useGetJobPostDetails';
import useUpdateJobPostItems from '../hooks/useUpdateJobPostItems';

import { XCircleIcon } from '@heroicons/react/24/solid';

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
  const { mutate, isLoading } = useUpdateJobPostItems();

  useEffect(() => {
    if (jobPostDataDetails) {
      firstForm.reset({
        jobTitle: jobPostDataDetails.job_title,
        placeAdvertise: jobPostDataDetails.advertise_to,
        country: jobPostDataDetails.country,
        language: jobPostDataDetails.language,
      });
      secondForm.reset({
        jobType: jobPostDataDetails.job_type.split(','),
        schedule: jobPostDataDetails.job_schedule.split(','),
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
                      hasSalaryRange={hasSalaryRange}
                      secondFormSubmit={secondFormSubmit}
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
                      pageNumber={pageNumber}
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
                      hasSalaryRange={hasSalaryRange}
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
                      pageNumber={pageNumber}
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
