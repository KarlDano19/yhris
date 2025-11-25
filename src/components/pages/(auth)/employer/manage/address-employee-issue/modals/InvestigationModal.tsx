import { Dispatch, Fragment, useRef, useState, DragEvent, ChangeEvent } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

import CustomDatePicker from '@/components/CustomDatePicker';
import CustomToast from '@/components/CustomToast';
import ConfirmModal from '@/components/ConfirmModal';
import UnsavedChangesModal from '@/components/UnsavedChangesModal';
import useAddInvestigationReportItems from '../hooks/useAddInvestigationReportItems';
import { formatDateToLocal } from '@/helpers/date';

import SelectChevronDown from '@/svg/SelectChevronDown';

import { T_Investigation, T_InvestigationModal } from '@/types/globals';

export default function InvestigationModal({
  employeeIssueItems,
  setEmployeeIssueItems,
  isOpen,
  setIsOpen,
}: {
  employeeIssueItems: any;
  setEmployeeIssueItems: any;
  isOpen: T_InvestigationModal | null;
  setIsOpen: Dispatch<T_InvestigationModal | null>;
}) {
  const { mutate, isLoading } = useAddInvestigationReportItems();
  const { register, handleSubmit, reset, control, setValue, watch } = useForm<T_Investigation>();
  const InvestigationDateInputRef = useRef<HTMLInputElement>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [toAddData, setToAddData] = useState<any>(null);
  const [toSaveData, setToSaveData] = useState<any>(null);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState<boolean>(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<(() => void) | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const cancelButtonRef = useRef(null);

  // Function to check if there are unsaved changes
  const hasUnsavedChanges = () => {
    const formData = watch();
    return (
      (formData.witness && formData.witness.trim() !== '') ||
      (formData.presider && formData.presider.trim() !== '') ||
      (formData.isAttendHearing && formData.isAttendHearing !== 'Select...' && formData.isAttendHearing.trim() !== '') ||
      (formData.resultOfInvestigation && formData.resultOfInvestigation.trim() !== '') ||
      (formData.decision && formData.decision !== 'Select...' && formData.decision.trim() !== '') ||
      (formData.other && formData.other.trim() !== '') ||
      toSaveData?.attachments
    );
  };

  // Function to handle confirmation modal close (cancel)
  const handleUnsavedChangesCancel = () => {
    setIsUnsavedChangesModalOpen(false);
    setPendingCloseAction(null);
  };

  // Function to handle confirmation modal confirm (proceed with close)
  const handleUnsavedChangesConfirm = () => {
    setIsUnsavedChangesModalOpen(false);
    const action = pendingCloseAction;
    setPendingCloseAction(null);
    
    // Execute the pending close action
    if (action) {
      action();
    }
  };

  // Function to reset all form data
  const resetFormData = () => {
    reset();
    setToSaveData(null);
    setToAddData(null);
    setFile(null);
    setIsDragActive(false);
    setValue('attachments', undefined as unknown as T_Investigation['attachments']);
  };

  // Function to handle modal close with unsaved changes check
  const handleModalClose = (closeAction: () => void) => {
    if (hasUnsavedChanges()) {
      setPendingCloseAction(() => closeAction);
      setIsUnsavedChangesModalOpen(true);
    } else {
      closeAction();
    }
  };

  const onSubmit = handleSubmit((data) => {
    if (isOpen && isOpen.id) {
      const currentDate = new Date();
      const submissionDate = typeof data.date === 'object' && 'getTime' in data.date ? data.date : currentDate;
      const itemIndex = employeeIssueItems.findIndex((item: any) => item.id === isOpen.id);
      const employeeIssueItemsCopy = JSON.parse(JSON.stringify(employeeIssueItems));
      employeeIssueItemsCopy[itemIndex].investigateForm.employee_issue = isOpen.id;
      employeeIssueItemsCopy[itemIndex].investigateForm.date = submissionDate;
      employeeIssueItemsCopy[itemIndex].investigateForm.witness = data.witness;
      employeeIssueItemsCopy[itemIndex].investigateForm.presider = data.presider;
      employeeIssueItemsCopy[itemIndex].investigateForm.isAttendHearing = data.isAttendHearing;
      employeeIssueItemsCopy[itemIndex].investigateForm.resultOfInvestigation = data.resultOfInvestigation;
      employeeIssueItemsCopy[itemIndex].investigateForm.decision = data.decision;
      employeeIssueItemsCopy[itemIndex].investigateForm.other = data.other;
      const attachments = toSaveData?.attachments;
      employeeIssueItemsCopy[itemIndex].investigateForm.attachments = attachments;
      employeeIssueItemsCopy[itemIndex].isInvestigated = true;
      employeeIssueItemsCopy[itemIndex].investigatedDate = formatDateToLocal(currentDate.toISOString());
      const copySaveData = {
        ...employeeIssueItemsCopy[itemIndex].investigateForm,
        attachments,
      };
      setToSaveData((prev: any) => ({ ...(prev ?? {}), ...copySaveData }));
      setToAddData([...employeeIssueItemsCopy]);
      setIsConfirmModalOpen(true);
    } else {
      toast.custom(() => <CustomToast message='Incomplete information.' type='error' />, { duration: 4000 });
    }
  });
  const saveData = () => {
    const callbackReq = {
      onSuccess: (data: any) => {
        setEmployeeIssueItems([...toAddData]);
        toast.custom(() => <CustomToast message='Investigated succesfully.' type='success' />, { duration: 5000 });
        // Reset form data before closing modal to prevent unsaved changes detection
        resetFormData();
        setIsConfirmModalOpen(false);
        setIsOpen(null);
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
        setIsConfirmModalOpen(false);
      },
    };
    mutate(toSaveData, callbackReq);
  };
  const handleFileSelection = (selectedFile: File | null) => {
    if (!selectedFile) return;
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.custom(() => <CustomToast message={'Maximum file size is 10mb.'} type='error' />, {
        duration: 2000,
      });
      return;
    }
    setFile(selectedFile);
    setToSaveData((prev: any) => ({ ...(prev ?? {}), attachments: selectedFile }));
    setValue('attachments', selectedFile as unknown as T_Investigation['attachments']);
  };

  const handleDrag = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setIsDragActive(true);
    } else if (event.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    const droppedFile = event.dataTransfer?.files?.[0] ?? null;
    handleFileSelection(droppedFile);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const selectedFile = event.target.files?.[0] ?? null;
    handleFileSelection(selectedFile);
    event.target.value = '';
  };

  const handleRemoveFile = () => {
    setFile(null);
    setToSaveData((prev: any) => {
      if (!prev) return null;
      const next = { ...prev };
      delete next.attachments;
      return Object.keys(next).length ? next : null;
    });
    setValue('attachments', undefined as unknown as T_Investigation['attachments']);
  };
  return (
    <>
      <Transition.Root show={isOpen ? true : false} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => {
          // Don't close investigation modal if confirmation modal is open
          if (isConfirmModalOpen) {
            return;
          }
          handleModalClose(() => {
            resetFormData();
            setIsOpen(null);
          });
        }}>
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
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Investigation Report Template</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => {
                      // Don't close investigation modal if confirmation modal is open
                      if (isConfirmModalOpen) {
                        return;
                      }
                      handleModalClose(() => {
                        resetFormData();
                        setIsOpen(null);
                      });
                    }} />
                  </div>
                  <form onSubmit={onSubmit}>
                    <div className='px-4 pt-4 pb-6'>
                      <div>
                        <label
                          htmlFor='dateOfInvestigation'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Date of Investigation
                          <span className='text-red-600'>*</span>
                        </label>
                        <div className='relative mt-2'>
                          <Controller
                            control={control}
                            name='date'
                            render={({ field }) => (
                              <CustomDatePicker
                                id='investigation-report-datepicker'
                                placeholder={'mm/dd/yyyy'}
                                className={
                                  'block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none'
                                }
                                selected={field.value}
                                pickerOnChange={(date: any) => field.onChange(date)}
                                inputOnChange={(value: any) => field.onChange(value)}
                                required={true}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='witness' className='block text-sm font-medium leading-6 text-gray-900'>
                          Witness<span className='text-red-600'>*</span>
                        </label>
                        <div className='mt-2'>
                          <input
                            id='witness'
                            {...register('witness', { required: true })}
                            type='name'
                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='presider' className='block text-sm font-medium leading-6 text-gray-900'>
                          Presider<span className='text-red-600'>*</span>
                        </label>
                        <div className='mt-2'>
                          <input
                            id='presider'
                            {...register('presider', { required: true })}
                            type='name'
                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='isAttendHearing' className='block text-sm font-medium leading-6 text-gray-900'>
                          Did the employee attend the hearing
                          <span className='text-red-600'>*</span>
                        </label>
                        <div className='relative mt-2'>
                          <select
                            id='isAttendHearing'
                            {...register('isAttendHearing', { required: true })}
                            className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                          >
                            <option value=''>Select...</option>
                            <option>YES</option>
                            <option>NO</option>
                          </select>
                          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                            <SelectChevronDown />
                          </div>
                        </div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label
                          htmlFor='resultOfInvestigation'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Result of Investigation
                          <span className='text-red-600'>*</span>
                        </label>
                        <div className='mt-2'>
                          <textarea
                            rows={4}
                            {...register('resultOfInvestigation', {
                              required: true,
                            })}
                            id='resultOfInvestigation'
                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='decision' className='block text-sm font-medium leading-6 text-gray-900'>
                          Decision <span className='text-red-600'>*</span>
                        </label>
                        <div className='relative mt-2'>
                          <select
                            id='decision'
                            {...register('decision', { required: true })}
                            className='appearance-none block w-full rounded-md border-0 py-2 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6'
                          >
                            <option value=''>Select...</option>
                            <option>First Warning</option>
                            <option>Second Warning</option>
                            <option>Final Warning</option>
                            <option>1-3 Days Suspension</option>
                            <option>5 Days Suspension</option>
                            <option>Terminate</option>
                            <option>Other...</option>
                          </select>
                          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                            <SelectChevronDown />
                          </div>
                        </div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='other' className='block text-sm font-medium leading-6 text-gray-900'>
                          If you selected other, please specify the decision.
                        </label>
                        <div className='mt-2'>
                          <input
                            id='other'
                            {...register('other', { required: false })}
                            type='name'
                            className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>
                      <div className='sm:col-span-4 mt-4'>
                        <label htmlFor='attachment' className='block text-sm font-medium leading-6 text-gray-900'>
                        Attachment
                        </label>
                        <div className='mt-2'>
                          <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`block w-full rounded-md border-0 py-14 px-3 text-center text-[#ACB9CB] shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 ${
                              isDragActive ? 'bg-blue-50 text-savoy-blue ring-savoy-blue' : ''
                            }`}
                          >
                            <label
                              className={`${
                                file === null ? 'file-preview cursor-pointer hover:text-savoy-blue text-base leading-normal' : 'hidden'
                              }`}
                            >
                              Drop file to upload
                              <input
                                id='attachment'
                                {...register('attachments')}
                                type='file'
                                className='sr-only'
                                onChange={handleChange}
                                accept='image/jpeg, image/png, application/msword, application/pdf, text/csv, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                              />
                            </label>

                            {file !== null && (
                              <div className='file-preview'>
                                <p className='text-sm text-slate-800 font-light'>{file.name}</p>
                                <div className='flex gap-2 mt-2 justify-center'>
                                  <a
                                    href={URL.createObjectURL(file)}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-500 hover:underline text-sm'
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    View File
                                  </a>
                                  <button
                                    type='button'
                                    className='underline text-blue-500 cursor-pointer text-sm'
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleRemoveFile();
                                    }}
                                  >
                                    Remove File
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <p className='text-xs pl-2 mt-1 text-gray-500'>Maximum file size: 10 mb</p>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4'>
                      <button
                        type='submit'
                        className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                      >
                        Create
                      </button>
                      <button
                        type='button'
                        className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto'
                        onClick={() => {
                          // Don't close investigation modal if confirmation modal is open
                          if (isConfirmModalOpen) {
                            return;
                          }
                          handleModalClose(() => {
                            resetFormData();
                            setIsOpen(null);
                          });
                        }}
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
      
      <ConfirmModal
        message='Are you sure that you have investigated the reported incident?'
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        confirmAction={saveData}
        isLoading={isLoading}
      />
      
      {/* Unsaved Changes Confirmation Modal */}
      {isUnsavedChangesModalOpen && (
        <UnsavedChangesModal
          isOpen={isUnsavedChangesModalOpen}
          onClose={handleUnsavedChangesCancel}
          onConfirm={handleUnsavedChangesConfirm}
          isLoading={false}
          isSwitchingEmployee={false}
          contentType="investigation"
        />
      )}
    </>
  );
}