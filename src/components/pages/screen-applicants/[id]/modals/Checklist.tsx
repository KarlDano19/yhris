import { useEffect, useState } from "react"
import ModalLayout from "./ModalLayout"
import { ChecklistPropTypes as PropTypes } from "../../types"

export default function Checklist({
  title,
  id,
  setId,
  requirements,
  handleSubmit,
}: PropTypes) {
  const [isOpen, setIsOpen] = useState(false)
  const status = [
    {
      id: "ongoing",
      name: "status",
      title: "Ongoing",
    },
    {
      id: "passed",
      name: "status",
      title: "Passed",
    },
    {
      id: "withdrawn",
      name: "status",
      title: "Withdrawn",
    },
    {
      id: "rejected",
      name: "status",
      title: "Rejected",
    },
  ]

  const titleCase = (str: any) => str.charAt(0).toUpperCase() + str.slice(1)

  useEffect(() => {
    id && setIsOpen(true)
  }, [id])
  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setId(null), 400)
  }
  const handleOnSubmit = (e: any) => {
    e.preventDefault()
    setIsOpen(false)
    setTimeout(() => handleSubmit(), 400)
  }

  return (
    <ModalLayout title={title} isOpen={isOpen} handleClose={handleClose}>
      <form onSubmit={handleOnSubmit}>
        <div className="p-8">
          {requirements.length > 0 && (
            <div className="grid gap-4 mb-8">
              {requirements.map((item) => {
                return (
                  <div
                    key={item}
                    className="flex items-center gap-4 text-indigo-dye text-[15px]"
                  >
                    <input type="checkbox" id={item} className="w-5 h-5" />
                    <label htmlFor={item}>{titleCase(item)}</label>
                  </div>
                )
              })}
            </div>
          )}

          <div className="grid gap-4">
            <p className="font-medium">Status</p>
            {status.map((item) => {
              const { title, ...rest } = item
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 text-indigo-dye text-[15px]"
                >
                  <input type="radio" {...rest} className="w-5 h-5" />
                  <label htmlFor={item.id}>{title}</label>
                </div>
              )
            })}
          </div>
        </div>
        <hr />
        <div className="flex items-center gap-2 text-[15px] font-bold justify-end px-8 py-4">
          <button
            onClick={handleClose}
            type="button"
            className="border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg py-2 px-6 bg-[#355FD0] text-white hover:bg-[#3156bd]"
          >
            Update
          </button>
        </div>
      </form>
    </ModalLayout>
  )
}
