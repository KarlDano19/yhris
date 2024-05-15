import { Dispatch, Fragment, useRef, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import useAddEvaluation from '../hooks/useAddEvaluation';
import EvaluationInfoTab from '../tabs/EvaluationInfoTab';
import EvaluationFormTab from '../tabs/EvaluationFormTab';
import EvaluationCriterionTab from '../tabs/EvaluationCriterionTab';
import ViewModeTab from '../tabs/ViewModeTab';
import PreviewTab from '../tabs/PreviewTab';

import { XCircleIcon } from '@heroicons/react/24/solid';

export default function CreateEvaluationModal({
  refetch,
  isOpen,
  setIsOpen,
  mainSetIsOpen,
}: {
  refetch: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  mainSetIsOpen: Dispatch<boolean>;
}) {
  const [currentTab, setCurrentTab] = useState(1);
  const [isPreview, setIsPreview] = useState(false);
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, setValue, getValues, watch, control, reset } = useForm<any>({
    defaultValues: {
      criteria_rating_view_type: 'default',
      total_score: 1,
      passing_score: 1,
      is_show_remarks: false,
      is_show_criteria_comment: false,
      rating_type: 'none',
      evaluation_criterion: [
        {
          id: uuidv4(),
          criterion: [
            {
              id: uuidv4(),
              title: '',
              max_score: 1,
              is_disable_comment: true,
            },
          ],
        },
      ],
    },
  });
  const { mutate, isLoading } = useAddEvaluation();

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        setIsOpen(false);
        mainSetIsOpen(false);
        reset();
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
      },
    };
    mutate(data, callbackReq);
  });

  return (
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
                className={`${
                  currentTab === 2
                    ? 'sm:my-8 sm:w-[60%] sm:max-w-2xl'
                    : currentTab === 3
                    ? 'sm:my-8 sm:w-[60%] sm:max-w-2xl'
                    : currentTab === 4
                    ? 'sm:my-8 sm:w-[60%] sm:max-w-2xl'
                    : 'sm:my-8 sm:w-[30%] sm:max-w-2xl'
                }relative overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all`}
              >
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>
                    {!isPreview && 'Create Evaluation Template'}
                    {isPreview && 'Preview'}
                  </h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                {!isPreview && (
                  <div className='hidden sm:block pt-10 px-10'>
                    <div className='md:w-[76%] lg:w-[80%] mx-auto translate-y-[10px]'>
                      <div className='w-full bg-gray-200 rounded-full h-1'>
                        <div
                          className={`${
                            currentTab === 2
                              ? 'w-[30%]'
                              : currentTab === 3
                              ? 'w-[70%]'
                              : currentTab === 4
                              ? 'w-[100%]'
                              : 'w-0'
                          } bg-blue-600 h-1 rounded-full`}
                        ></div>
                      </div>
                    </div>

                    <nav className='-mb-px flex relative justify-between w-[90%] mx-auto mt-[-9px]' aria-label='Tabs'>
                      <li
                        className={`text-center text-sm font-semibold list-none flex flex-col items-center text-savoy-blue`}
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
                        className={`
                    ${
                      currentTab >= 2 ? 'text-savoy-blue' : 'text-gray-500'
                    } text-center text-sm font-semibold list-none flex flex-col items-center`}
                      >
                        <div className='bg-white px-2'>
                          <div
                            className={`${
                              currentTab >= 2 ? 'border-savoy-blue bg-savoy-blue' : 'border-gray-500 bg-gray-500'
                            } h-8 w-8 border-2 mb-2 rounded-lg flex justify-center items-center`}
                          >
                            <h1 className='text-white'>2</h1>
                          </div>
                        </div>
                        Settings
                      </li>
                      <li
                        className={`
                    ${
                      currentTab >= 3 ? 'text-savoy-blue' : 'text-gray-500'
                    } text-center text-sm font-semibold list-none flex flex-col items-center`}
                      >
                        <div className='bg-white px-2'>
                          <div
                            className={`${
                              currentTab >= 3 ? 'border-savoy-blue bg-savoy-blue' : 'border-gray-500 bg-gray-500'
                            }  h-8 w-8 border-2 mb-2 rounded-lg flex justify-center items-center`}
                          >
                            <h1 className='text-white'>3</h1>
                          </div>
                        </div>
                        Add Criteria
                      </li>
                      <li
                        className={`
                    ${
                      currentTab >= 4 ? 'text-savoy-blue' : 'text-gray-500'
                    } text-center text-sm font-semibold list-none flex flex-col items-center`}
                      >
                        <div className='bg-white px-2'>
                          <div
                            className={`${
                              currentTab >= 4 ? 'border-savoy-blue bg-savoy-blue' : 'border-gray-500 bg-gray-500'
                            }  h-8 w-8 border-2 mb-2 rounded-lg flex justify-center items-center`}
                          >
                            <h1 className='text-white'>4</h1>
                          </div>
                        </div>
                        Design
                      </li>
                    </nav>
                  </div>
                )}
                {currentTab === 1 && (
                  <EvaluationInfoTab
                    {...{
                      register,
                      handleSubmit,
                      setCurrentTab,
                    }}
                  />
                )}
                {currentTab === 2 && (
                  <EvaluationFormTab
                    {...{
                      register,
                      watch,
                      setValue,
                      handleSubmit,
                      setCurrentTab,
                    }}
                  />
                )}
                {currentTab === 3 && (
                  <EvaluationCriterionTab
                    {...{
                      control,
                      register,
                      watch,
                      setValue,
                      handleSubmit,
                      setCurrentTab,
                    }}
                  />
                )}
                {currentTab === 4 && (
                  <>
                    {!isPreview && (
                      <ViewModeTab
                        {...{
                          setIsPreview,
                          setValue,
                          getValues,
                          onSubmit,
                          setCurrentTab,
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
