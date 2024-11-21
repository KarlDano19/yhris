import React, { Dispatch, Fragment, useRef, useState } from "react";

import { Transition, Dialog } from "@headlessui/react";

import { PlusIcon, MinusIcon, XCircleIcon } from "@heroicons/react/24/outline";

const EmployeeKitModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) => {
  const cancelButtonRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index: any) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      id: 1,
      question: "How do I initiate the separation process for an employee?",
      answer: (
        <ul className="list-disc pl-5">
          <p>To initiate the separation process for an employee, follow these steps:</p>
          <li>Access the Employee Separation module: Go to the HRIS system and locate the &quot;Employee Separation&quot; module.</li>
          <li>Click the &apos;Create&apos; button: This will open a new window or form where you can input the details of your new separation.</li>
          <li>Enter the required information: Fill in the necessary fields such as the employee&apos;s name, position, department, date of separation, and reason for leaving.</li>
          <li>Review and submit: Once you&apos;ve completed all the required fields, review the information and click the &apos;Create&apos; button to initiate the separation process.</li>
        </ul>
      ),
    },
    {
      id: 2,
      question: "What happens after I initiate the separation process?",
      answer: (
        <ul className="list-disc pl-5">
          <p>Once you initiate the separation process, the system will automatically generate the necessary documents, such as the Letter of Separation and Quitclaim. You will also need to complete the final payroll and other relevant paperwork.</p>
        </ul>
      ),
    },
    {
      id: 3,
      question: "How can I track the status of an employee separation?",
      answer: (
        <ul className="list-disc pl-5">
          <p>You can track the status of an employee separation by using the search functionality within the Employee Separation module. You can filter the results by date of separation, employee name, or reason for leaving.</p>
        </ul>
      ),
    },
  ];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => setIsOpen(false)}>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-1/2'>
                <div className='px-4 pt-5 pb-6'>
                  <h2 className='text-xl font-semibold text-left'>
                    Employee Kit FAQ
                  </h2>
                </div>
                <div className="px-6">
                    <div className="space-y-4">
                        <p className="text-center">No FAQs for now</p>
                    </div>
                </div>
                <div className='px-6 mb-6 flex gap-6 mt-4'>
                  <button
                    type='button'
                    className='w-1/2 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0'
                    onClick={() => setIsOpen(false)}
                    ref={cancelButtonRef}
                    tabIndex={-1}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EmployeeKitModal;        