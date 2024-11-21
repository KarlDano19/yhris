import React, { Dispatch, Fragment, useRef, useState } from "react";

import { Transition, Dialog } from "@headlessui/react";

import { PlusIcon, MinusIcon, XCircleIcon } from "@heroicons/react/24/outline";

const ManageModal = ({
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
      question: "How do I create a new incident report for an employee issue?",
      answer: (
        <ul className="list-disc pl-5">
          <p>To create a new incident report, follow these steps:</p>
          <li>Navigate to the &quot;Address Employee Issue&quot; page.</li>
          <li>Click the green Create button on the right side of the screen.</li>
          <li>Fill in the necessary details about the incident, including the date, employee name, and the nature of the issue.</li>
          <li>Complete the fields for investigation and any decisions made.</li>
          <li>Once all details are entered, save the report to log it in the system.</li>
        </ul>
      ),
    },
    {
      id: 2,
      question: "How do I create a memo in the HRIS?",
      answer: (
        <ul className="list-disc pl-5">
          <p>To create a new incident report, follow these steps:</p>
          <li>Go to the &quot;Create Memo/Policy&quot; page.</li>
          <li>Click the Create button on the right side and select Create Memo from the dropdown menu.</li>
          <li>Enter the necessary details for the memo, such as the title and content.</li>
          <li>Save the memo to make it available for employees to view.</li>
        </ul>
      ),
    },
    {
      id: 3,
      question: "How do I create a policy in the HRIS?",
      answer: (
        <ul className="list-disc pl-5">
          <p>To create a new policy, follow these steps:</p>
          <li>Go to the &quot;Create Memo/Policy&quot; page.</li>
          <li>Click the Create button on the right side and select Create Policy from the dropdown menu.</li>
          <li>Fill in the required fields for the policy, including the title and policy details.</li>
          <li>Save the policy to ensure it is accessible to all relevant employees.</li>
        </ul>
      ),
    },
    {
      id: 4,
      question: "How do I design a company benefit?",
      answer: (
        <ul className="list-disc pl-5">
          <p>To design a company benefit, follow these steps:</p>
          <li>Go to the &quot;Design Benefits&quot; page.</li>
          <li>Click the Create button on the right side and select Create.</li>
          <li>Fill in the required fields for the benefit details, including the title and policy details.</li>
          <li>Save the policy to ensure it is accessible to all relevant employees.</li>
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
                    Manage FAQ
                  </h2>
                </div>
                <div className="px-6">
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="border-2 border-yellow-500 rounded"
                        >
                            <div
                            className="flex justify-between items-center p-4 cursor-pointer bg-white hover:bg-gray-100"
                            onClick={() => handleToggle(faq.id)}
                            >
                            <h2 className="font-semibold">{faq.question}</h2>
                            {activeIndex === faq.id ? (
                                <MinusIcon className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <PlusIcon className="h-5 w-5 text-yellow-500" />
                            )}
                            </div>
                            {activeIndex === faq.id && (
                            <div className="p-4 bg-gray-50">{faq.answer}</div>
                            )}
                        </div>
                        ))}
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

export default ManageModal;