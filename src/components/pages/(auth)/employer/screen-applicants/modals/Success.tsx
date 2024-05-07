import { useContext, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useRef } from "react"
import Confetti from "@/svg/Confetti"
import { initialActionState } from "../lib/initialActionState"
import { ContextTypes, SuccessPropTypes as PropTypes } from "../types"
import StateContext from "../contexts/StateContext"

export default function Success({ title }: PropTypes) {
  const { setActionState }: ContextTypes = useContext(
    StateContext
  ) as ContextTypes
  const [isOpen, setIsOpen] = useState(false)
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    setIsOpen(true)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setActionState(initialActionState), 400)
  }

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-[460px] sm:max-w-4xl p-10 text-center">
                <div className="flex justify-center mb-4">
                  <Confetti />
                </div>
                <h3 className="text-center font-bold text-3xl text-green-600 mb-6">
                  Awesome!
                </h3>
                <h5 className="text-xl font-bold text-indigo-dye mb-12">
                  {title}
                </h5>
                <button
                  type="button"
                  className="text-lg text-center block w-full font-bold leading-6 text-white bg-savoy-blue shadow-sm p-3 rounded-md transition-all"
                  onClick={handleClose}
                >
                  CONTINUE
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
