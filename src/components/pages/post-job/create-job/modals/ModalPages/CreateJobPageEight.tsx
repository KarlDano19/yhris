import { Dispatch, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Confetti from "@/svg/Confetti";
export default function CreateJobPageEight({
  onSubmit,
  isOpen,
  setIsOpen,
}: {
  onSubmit: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={cancelButtonRef}
        onClose={setIsOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white p-7 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg space-y-5">
                <div className="flex justify-center">
                  <Confetti />
                </div>
                <h3 className="text-center font-semibold text-3xl text-green-600">
                  Awesome!
                </h3>
                <h5 className="text-xl font-bold text-indigo-dye">
                  You have successfully set-up your company.
                </h5>
                <button
                  type="button"
                  className="text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all"
                  onClick={() => {
                    onSubmit();
                  }}
                >
                  CONTINUE
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
