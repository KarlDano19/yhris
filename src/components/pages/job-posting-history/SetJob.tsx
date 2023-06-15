import React, {
  Dispatch,
  useState,
  Fragment,
  FocusEventHandler,
  useEffect,
  useRef,
} from "react"
import CopyJob from "./CopyJob"
import { T_CreateJob } from "@/types/globals"
import { Menu, Transition } from "@headlessui/react"

const SetJob = ({
  id,
  jobTitle,
  setIsSetJobInactiveModalOpen,
  item,
  setIsJobPreviewOpen,
}: {
  id: number
  jobTitle: string
  setIsSetJobInactiveModalOpen: Dispatch<boolean>
  item: T_CreateJob | any
  setIsJobPreviewOpen: any
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // handles both left and right clicks
  const handleClicks = (e: any) => {
    if (e.type === "click") {
      setIsJobPreviewOpen({
        isOpen: true,
        id,
      })
    } else if (e.type === "contextmenu") {
      e.preventDefault()
      setIsOpen(true)
    }
  }

  // closes menu after loosing focus just like <Menu.Items>
  const handleBlur: FocusEventHandler<HTMLDivElement> = (e) => {
    const target = e.relatedTarget
    const parent = e.currentTarget
    if (parent.contains(target)) return
    setIsOpen(false)
  }
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => menuRef?.current?.focus(), 100)
    }
  })

  return (
    <div className="inline-flex">
      <div className="relative -ml-px">
        <button
          onClick={handleClicks}
          onContextMenu={handleClicks}
          className="underline"
        >
          {jobTitle}
        </button>
        <Transition
          show={isOpen}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div
            ref={menuRef}
            onBlur={handleBlur}
            tabIndex={0}
            className="absolute -right-14 z-10 -mr-1 mt-2 w-auto origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="py-1">
              <button
                className="block px-8 py-2 text-sm text-gray-800 hover:bg-green-500 hover:text-white"
                onClick={() => {
                  setIsSetJobInactiveModalOpen(true)
                  setIsOpen(false)
                }}
              >
                Set Job to Inactive
              </button>
              <CopyJob item={item} setIsOpen={setIsOpen} />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  )
}

export default SetJob
