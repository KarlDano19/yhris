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
      </div>
    </div>
  )
}

export default SetJob
