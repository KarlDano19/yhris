import React, { Dispatch, Fragment, useRef, useState } from "react";

import { Transition, Dialog } from "@headlessui/react";

import { PlusIcon, MinusIcon, XCircleIcon } from "@heroicons/react/24/outline";

const TrainModal = ({
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
      question: "How do I create a new evaluation template?",
      answer: (
        <ul className="list-disc pl-5">
          <p>To create a new evaluation template, follow these steps:</p>
          <li>Access the Evaluation Template module: Go to the HRIS system and locate the &quot;Evaluation Template&quot; module.</li>
          <li>Click the &quot;Create&quot; button: This will open a new window or form where you can input the details of your new evaluation template.</li>
          <li>Enter the required information: Fill in the necessary fields such as template name, evaluation type, frequency, and any specific criteria or questions you want to include in the evaluation.</li>
          <li>Save the template: Once you&apos;ve completed all the required fields, click the &apos;Save&apos; button to create the new evaluation template.</li>
        </ul>
      ),
    },
    {
      id: 2,
      question: "How do I create a new evaluation schedule?",
      answer: (
        <ul className="list-disc pl-5">
          <p>To create a new evaluation schedule, follow these steps:</p>
          <li>Access the Evaluation Scheduler module: Go to the HRIS system and locate the &quot;Evaluation Scheduler&quot; module.</li>
          <li>Click the &quot;Create&quot; button: This will open a new window or form where you can input the details of your new evaluation schedule.</li>
          <li>Enter the required information: Fill in the necessary fields such as schedule name, evaluation template, evaluation period, evaluation schedule, and recipients.</li>
          <li>Save the schedule: Once you&apos;ve completed all the required fields, click the &apos;Save&apos; button to create the new evaluation schedule.</li>
        </ul>
      ),
    },
    {
      id: 3,
      question: "How do I create a new policy?",
      answer: (
        <ul className="list-disc pl-5">
          <p>To create a new policy, follow these steps:</p>
          <li>Access the Policy module: Go to the HRIS system and locate the &quot;Policy&quot; module.</li>
          <li>Click the &quot;Create&quot; button: This will open a new window or form where you can input the details of your new policy.</li>
          <li>Enter the required information: Fill in the necessary fields such as policy name, policy details, and any specific criteria or questions you want to include in the policy.</li>
          <li>Save the policy: Once you&apos;ve completed all the required fields, click the &apos;Save&apos; button to create the new policy.</li>
        </ul>
      ),
    },
    {
      id: 4,
      question: "How do I create a new benefit?",
      answer: (
        <ul className="list-disc pl-5">
          <p>To create a new benefit, follow these steps:</p>
          <li>Access the Benefit module: Go to the HRIS system and locate the &quot;Benefit&quot; module.</li>
          <li>Click the &apos;Create&apos; button: This will open a new window or form where you can input the details of your new benefit.</li>
          <li>Enter the required information: Fill in the necessary fields such as benefit name, benefit details, and any specific criteria or questions you want to include in the benefit.</li>
          <li>Save the benefit: Once you&apos;ve completed all the required fields, click the &apos;Save&apos; button to create the new benefit.</li>
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
                    Train FAQ
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
                <div className='px-6 mb-6 flex gap-6 mt-4 justify-end'>
                  <button
                    type='button'
                    className='justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0'
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

export default TrainModal;    