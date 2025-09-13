import { Dispatch, Fragment, useRef } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import useGetEmployeeIssueDetails from '../hooks/useGetEmployeeIssueDetails';

import { XCircleIcon } from '@heroicons/react/24/solid';

// Helper to always return an array of strings
const parseArrayField = (field: any) => {
  if (Array.isArray(field) && field.length === 1 && typeof field[0] === "string" && field[0].includes(",")) {
    return field[0].split(",").map((s: string) => s.trim());
  }
  if (typeof field === "string") {
    try {
      // Try to parse JSON string
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Not JSON, treat as comma-separated
      return field.split(",").map((s: string) => s.trim());
    }
  }
  return Array.isArray(field) ? field : field ? [field] : [];
};

function DecisionAttachmentViewModal({ isOpen, setIsOpen }: { isOpen: any; setIsOpen: Dispatch<any> }) {
  const cancelButtonRef = useRef(null);
  const { data: employeeIssueData, remove: removeEmployeeIssue } = useGetEmployeeIssueDetails(isOpen.id);

  const customCloseModal = () => {
    removeEmployeeIssue();
    setIsOpen(null);
  };

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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all my-2 sm:my-4 w-full max-w-4xl h-[98vh] sm:h-[95vh]'>
                  <div className='flex bg-savoy-blue p-2 items-center rounded-t-lg'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Decision Summary</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={customCloseModal} />
                  </div>
                  <div className='h-full flex flex-col overflow-hidden'>
                    <div className='flex-1 p-4 overflow-hidden'>
                      <div className='flex flex-col gap-4 h-full'>
                        <div>
                          <label className='block text-sm font-bold text-gray-700 mb-1'>To:</label>
                          <div className='flex flex-wrap gap-2'>
                            {parseArrayField(employeeIssueData?.decision_to).map((email: string, idx: number) => (
                              <span
                                key={idx}
                                className='bg-[#ACB9CB] rounded-md flex items-center gap-2 py-0 px-4 text-left justify-start text-sm'
                              >
                                {email}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {employeeIssueData?.nte_attachment && (
                          <div className='flex-1'>
                            <label className='block text-sm font-bold text-gray-700 mb-1'>NTE Attachment:</label>
                            <div className='h-full overflow-hidden'>
                              <iframe 
                                src={employeeIssueData.nte_attachment} 
                                width='100%' 
                                height='90%' 
                                className='min-h-[500px] sm:min-h-0 border-0'
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default DecisionAttachmentViewModal;
