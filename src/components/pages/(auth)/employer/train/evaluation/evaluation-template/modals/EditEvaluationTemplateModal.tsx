import { Dispatch, Fragment, useEffect, useRef, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import classNames from '@/helpers/classNames';
import EvaluationInfoTab from '../tabs/EvaluationInfoTab';
import EvaluationFormTab from '../tabs/EvaluationFormTab';
import EvaluationCriterionTab from '../tabs/EvaluationCriterionTab';
import ViewModeTab from '../tabs/ViewModeTab';
import PreviewTab from '../tabs/PreviewTab';
import useGetEvaluationTemplateDetails from '../hooks/useGetEvaluationTemplateDetails';
import useUpdateEvaluationTemplate from '../hooks/useUpdateEvaluationTemplate';

import { XCircleIcon } from '@heroicons/react/24/solid';

export default function EditEvaluationModal({
  refetch,
  isOpen,
  setIsOpen,
  selectedEvaluationTemplateId,
}: {
  refetch: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  selectedEvaluationTemplateId: number | null;
}) {
  const cancelButtonRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState(1);
  const [isPreview, setIsPreview] = useState(false);
  const { register, handleSubmit, setValue, getValues, watch, control } = useForm();
  const {
    data: dataEvaluationDetail,
    refetch: refetchEvaluationDetail,
    remove: evaluationTemplateDetailRemove,
  } = useGetEvaluationTemplateDetails(selectedEvaluationTemplateId);
  const { mutate, isLoading } = useUpdateEvaluationTemplate();

  useEffect(() => {
    if (isOpen) {
      refetchEvaluationDetail();
    }
  }, [isOpen]);

  useEffect(() => {
    if (dataEvaluationDetail) {
      setValue('name', dataEvaluationDetail.name);
      setValue('evaluation_type', dataEvaluationDetail.evaluation_type);
      setValue('frequency', dataEvaluationDetail.frequency);
      setValue('evaluation_format', dataEvaluationDetail.evaluation_format);
      setValue('description', dataEvaluationDetail.description);
      setValue('rating_type', dataEvaluationDetail.rating_type);
      setValue('total_score', dataEvaluationDetail.total_score);
      setValue('passing_score', dataEvaluationDetail.passing_score);
      setValue('is_show_remarks', dataEvaluationDetail.is_show_remarks);
      setValue('is_show_criteria_comment', dataEvaluationDetail.is_show_criteria_comment);
      setValue('evaluation_criterion', dataEvaluationDetail.evaluation_criterion);
      setValue('criteria_rating_view_type', dataEvaluationDetail.criteria_rating_view_type);
    }
  }, [dataEvaluationDetail]);

  const customCloseModal = () => {
    evaluationTemplateDetailRemove();
    setIsOpen(false);
  };

  const onSubmit = handleSubmit((data: any) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        customCloseModal();
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
      },
    };
    mutate({ evaluationId: selectedEvaluationTemplateId, data: data }, callbackReq);
  });

  return (
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

        <div className='fixed inset-0 z-20 overflow-y-auto'>
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
              <Dialog.Panel
                className={classNames(
                  'relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full',
                  selectedTab === 1 && 'max-w-4xl',
                  selectedTab === 2 && 'max-w-4xl',
                  selectedTab === 3 && 'max-w-4xl',
                  selectedTab === 4 && 'max-w-4xl'
                )}
              >
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Edit Evaluation Template</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => customCloseModal()} />
                </div>
                {!isPreview && (
                  <div className='hidden sm:block pt-10 px-10'>
                    <div className='md:w-[76%] lg:w-[80%] mx-auto translate-y-[10px]'>
                      <div className='w-full bg-gray-200 rounded-full h-1'>
                        <div
                          className={classNames(
                            'bg-blue-600 h-1 rounded-full',
                            selectedTab === 1 && 'w-0',
                            selectedTab === 2 && 'w-[30%]',
                            selectedTab === 3 && 'w-[70%]',
                            selectedTab === 4 && 'w-[100%]'
                          )}
                        ></div>
                      </div>
                    </div>
                    <nav
                      className='mb-px flex relative justify-between w-[90%] mx-auto mt-[-9px]'
                      aria-label='edit-tabs'
                    >
                      <li
                        className='text-center text-sm font-semibold list-none flex flex-col items-center text-savoy-blue cursor-pointer'
                        onClick={() => setSelectedTab(1)}
                      >
                        <div className='bg-white px-2'>
                          <div
                            className={`h-8 w-8 bg-savoy-blue border-2 mb-2 rounded-lg flex justify-center items-center border-savoy-blue`}
                          >
                            <h1 className='text-white'>1</h1>
                          </div>
                        </div>
                        Basic Info
                      </li>
                      <li
                        className={classNames(
                          'text-center text-sm font-semibold list-none flex flex-col items-center',
                          selectedTab >= 2 ? 'text-savoy-blue' : 'text-gray-500'
                        )}
                        onClick={() => setSelectedTab(2)}
                      >
                        <div className='bg-white px-2'>
                          <div
                            className={classNames(
                              'h-8 w-8 border-2 mb-2 rounded-lg flex justify-center items-center cursor-pointer',
                              selectedTab >= 2 ? 'border-savoy-blue bg-savoy-blue' : 'border-gray-500 bg-gray-500'
                            )}
                          >
                            <h1 className='text-white'>2</h1>
                          </div>
                        </div>
                        Settings
                      </li>
                      <li
                        className={classNames(
                          'text-center text-sm font-semibold list-none flex flex-col items-center',
                          selectedTab >= 3 ? 'text-savoy-blue' : 'text-gray-500'
                        )}
                        onClick={() => setSelectedTab(3)}
                      >
                        <div className='bg-white px-2'>
                          <div
                            className={classNames(
                              'h-8 w-8 border-2 mb-2 rounded-lg flex justify-center items-center cursor-pointer',
                              selectedTab >= 3 ? 'border-savoy-blue bg-savoy-blue' : 'border-gray-500 bg-gray-500'
                            )}
                          >
                            <h1 className='text-white'>3</h1>
                          </div>
                        </div>
                        Add Criteria
                      </li>
                      <li
                        className={`
                    ${
                      selectedTab >= 4 ? 'text-savoy-blue' : 'text-gray-500'
                    } text-center text-sm font-semibold list-none flex flex-col items-center cursor-pointer`}
                        onClick={() => setSelectedTab(4)}
                      >
                        <div className='bg-white px-2'>
                          <div
                            className={classNames(
                              'h-8 w-8 border-2 mb-2 rounded-lg flex justify-center items-center',
                              selectedTab >= 4 ? 'border-savoy-blue bg-savoy-blue' : 'border-gray-500 bg-gray-500'
                            )}
                          >
                            <h1 className='text-white'>4</h1>
                          </div>
                        </div>
                        Design
                      </li>
                    </nav>
                  </div>
                )}
                {selectedTab === 1 && (
                  <EvaluationInfoTab
                    {...{
                      register,
                      handleSubmit,
                      setSelectedTab,
                    }}
                  />
                )}
                {selectedTab === 2 && (
                  <EvaluationFormTab
                    {...{
                      register,
                      watch,
                      setValue,
                      handleSubmit,
                      setSelectedTab,
                    }}
                  />
                )}
                {selectedTab === 3 && (
                  <EvaluationCriterionTab
                    {...{
                      control,
                      register,
                      watch,
                      setValue,
                      handleSubmit,
                      setSelectedTab,
                      getValues,
                    }}
                  />
                )}
                {selectedTab === 4 && (
                  <>
                    {!isPreview && (
                      <ViewModeTab
                        {...{
                          setIsPreview,
                          setValue,
                          getValues,
                          onSubmit,
                          setSelectedTab,
                          isLoading,
                        }}
                      />
                    )}
                    {isPreview && (
                      <PreviewTab
                        {...{
                          setIsPreview,
                          getValues,
                        }}
                      />
                    )}
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
