import React, { useState, useEffect, useRef } from "react"

const SetJob = ({
  id,
  jobTitle,
  setIsJobPreviewOpen,
}: {
  id: number
  jobTitle: string
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
