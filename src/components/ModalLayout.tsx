import { Fragment, useRef } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XCircleIcon } from "@heroicons/react/24/solid"
import { ModalLayoutTypes as PropTypes } from "./pages/(auth)/employer/screen-applicants/types"

export default function ModalLayout({ children, title, isOpen, handleClose, nestedModals }: PropTypes) {
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-30"
        initialFocus={cancelButtonRef}
        onClose={handleClose}
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center gap-4">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    {title}
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer self-start"
                    onClick={handleClose}
                  />
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
        
        {/* Nested Modals */}
        {nestedModals}
      </Dialog>
    </Transition.Root>
  )
}
