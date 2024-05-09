import { Dispatch, Fragment, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import useAddEvaluation from '../hooks/useAddEvaluation';

import DetailsTab from '../evaluation-details/Tab'
import FormTab from '../evaluation-form/Tab'
import TemplateTab from '../evaluation-template/Tab'

import { XCircleIcon } from '@heroicons/react/24/solid';
import SelectChevronDown from '@/svg/SelectChevronDown';

export default function CreateEvaluationModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset } = useForm<any>();
  const [evalDetails, setEvalDetails] = useState(false)
  const [openEvalDetailsModal, setOpenEvalDetailsModal] = useState(false)
  const [evalForm, setEvalForm] = useState(false)
  const [openEvalFormModal, setOpenEvalFormModal] = useState(false)
  const [evalTemplate, setEvalTemplate] = useState(false)
  const [openEvalTemplateModal, setOpenEvalTemplateModal] = useState(false)

  const [currentTab, setCurrentTab] = useState(1);
  const { mutate, isLoading } = useAddEvaluation();

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: async (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 4000 });
        setIsOpen(false);
        reset();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, { duration: 4000 });
      },
    };
    mutate(data, callbackReq);
  });

  const submitEvalDetails = (data:any) => {
    setCurrentTab(currentTab + 1);
    console.log(data)
  }

  const submitEvalForm = (data:any) => {
    if (currentTab === 2 && evalForm === false) {
      setOpenEvalFormModal(true)
    }else{
      setCurrentTab(currentTab + 1)
    }
    console.log(data)
  }

  const finalSubmit = (data:any) => {
    console.log(data)
    const callBackReq = {
      onSuccess: (data:any) => {
        if(!data.error){
          toast.success("Evaluation Template Successfully Created")
        }
      },
      onError: (err: any) => {
        toast.error("error")
      }
    }
    mutate(data,callBackReq)
  }

  const method = useForm();

  const renderButtons= () =>
    (
      <div
        className={`${
          currentTab <= 1 ? "justify-end" : "justify-between"
        } md:flex mt-10 md:mt-12 mb-7`}
      >
        <button
          type="button"
          className={`${
            currentTab <= 1 ? "hidden" : ""
          } w-full mb-5 md:mb-0 md:w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
          onClick={prevTab}
        >
          BACK
        </button>
        <button
          type="submit"
          className="w-full md:w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          // onClick={nextTab}
        >
          {currentTab < 3 ? "NEXT" : (
            isLoading ? (
              <div
                className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Submit"
            )
          )}
        </button>
      </div>
    )
  const prevTab = () => {
    if (currentTab > 1) {
      setCurrentTab(currentTab - 1);
    }
  };


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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Create Evaluation Template</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                {/* <form onSubmit={onSubmit}> */}
                  <div className='px-4 pt-4 pb-6'>
                    {currentTab === 2 ? (
                      <FormProvider {...method}>
                        <form onSubmit={method.handleSubmit(submitEvalForm)}>
                          <FormTab />
                          {renderButtons()}
                        </form>
                      </FormProvider>
                    ) : currentTab === 3 ? (
                      <FormProvider {...method}>
                        <form onSubmit={method.handleSubmit(finalSubmit)}>
                          <TemplateTab />
                          {renderButtons()}
                        </form>
                      </FormProvider>
                    ) : (
                      <FormProvider {...method}>
                        <form onSubmit={method.handleSubmit(submitEvalDetails)}>
                          <DetailsTab />
                          {renderButtons()}
                        </form>
                      </FormProvider>
                    )}
                  </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
