import { Dispatch, Fragment, useRef, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';
import useUploadEmployeeIssueAttachments from '../hooks/useUploadEmployeeIssueAttachments';
import useGetEmployeeIssueDetails from '../hooks/useGetEmployeeIssueDetails';

import { XCircleIcon } from '@heroicons/react/24/solid';

function UploadDecisionAttachmentModal({ isOpen, setIsOpen }: { isOpen: any; setIsOpen: Dispatch<any> }) {
  const cancelButtonRef = useRef(null);
  const [toSaveData, setToSaveData] = useState<{ decision_attachment?: File }>();
  const { handleSubmit, reset } = useForm();
  const { data: employeeIssueData, remove: removeEmployeeIssue } = useGetEmployeeIssueDetails(isOpen.id);
  const { mutate: uploadEmployeeIssueAttachments, isLoading } = useUploadEmployeeIssueAttachments();

  const customCloseModal = () => {
    removeEmployeeIssue();
    setIsOpen(null);
  };

  const uploadOnChange = ({ target }: { target: any }) => {
    const file = target.files[0];
    if (!file) return;
    if (file.size <= 5000000) {
      setToSaveData({ decision_attachment: file });
    } else {
      toast.custom(() => <CustomToast message={'Maximum file size is 5mb.'} type='error' />, {
        duration: 2000,
      });
    }
  };

  const onSubmit = handleSubmit(() => {
    if (!toSaveData?.decision_attachment) {
      toast.custom(() => <CustomToast message='Please select a file to upload' type='error' />, {
        duration: 5000,
      });
      return;
    }

    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(() => <CustomToast message={data.message} type='success' />, { duration: 5000 });
        setIsOpen(false);
        reset();
        setToSaveData(undefined);
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err.message || 'An error occurred'} type='error' />, {
          duration: 5000,
        });
      },
    };

    if (isOpen?.id && toSaveData?.decision_attachment) {
      uploadEmployeeIssueAttachments(
        {
          employee_issue_id: isOpen.id,
          decision_attachment: toSaveData.decision_attachment,
        },
        callbackReq
      );
    } else {
      toast.custom(() => <CustomToast message='Missing required information' type='error' />, {
        duration: 5000,
      });
    }
  });

  return (
    <>
      <Transition.Root show={isOpen ? true : false} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={customCloseModal}>
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
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Upload Decision Attachment</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={customCloseModal} />
                  </div>
                  <form onSubmit={onSubmit}>
                    <div>
                      <div className='flex flex-col gap-2'>
                        <div className='flex flex-wrap gap-2 justify-center'>
                          {employeeIssueData?.attachments && (
                            <>
                              <object data={employeeIssueData.attachments} width='100%' height='500px' />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='px-4 pt-4 pb-6'>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='attachment' className='block text-sm font-medium leading-6 text-gray-900'>
                          Attachment (Optional)
                        </label>
                        <div className='mt-2'>
                          <input
                            id='attachment'
                            type='file'
                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semiboldfile:bg-violet-50 file:text-savoy-blue hover:file:bg-violet-100'
                            onChange={uploadOnChange}
                            accept='image/jpeg, image/png, application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                          />
                        </div>
                        <p className='text-xs mt-1 text-gray-400'>Maximum file size: 5mb</p>
                      </div>
                    </div>
                    <hr />
                    <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                      <button
                        type='submit'
                        className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                        disabled={isLoading}
                      >
                        {isLoading ? 'Uploading...' : 'Upload'}
                      </button>
                      <button
                        type='button'
                        className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto'
                        onClick={customCloseModal}
                        ref={cancelButtonRef}
                      >
                        Close
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default UploadDecisionAttachmentModal;
