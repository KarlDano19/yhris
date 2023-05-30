import { useEffect, useState } from "react"
import ModalLayout from "./ModalLayout"
import { ChecklistPropTypes as PropTypes } from "../../types"
import { initialActionState } from "../../lib/initialActionState"
import { useForm } from "react-hook-form"
import { camelize } from "../../lib/camelize"

const status = [
  {
    id: "ongoing",
    value: "ongoing",
    title: "Ongoing",
  },
  {
    id: "passed",
    value: "passed",
    title: "Passed",
  },
  {
    id: "withdrawn",
    value: "withdrawn",
    title: "Withdrawn",
  },
  {
    id: "rejected",
    value: "rejected",
    title: "Rejected",
  },
]

export default function Checklist({
  title,
  requirements,
  setActionState,
  handleFormSubmit,
}: PropTypes) {
  const { register, handleSubmit } = useForm()
  const titleCase = (str: any) => str.charAt(0).toUpperCase() + str.slice(1)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(true)
  }, [])
  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setActionState(initialActionState), 400)
  }
  const onSubmit = (data: any) => {
    setIsOpen(false)
    setTimeout(() => handleFormSubmit(data), 400)
  }

  return (
    <ModalLayout title={title} isOpen={isOpen} handleClose={handleClose}>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <div className="p-8">
          {requirements?.length > 0 && (
            <div className="grid gap-4 mb-8">
              {requirements.map((item) => {
                return (
                  <div
                    key={item}
                    className="flex items-center gap-4 text-indigo-dye text-[15px]"
                  >
                    <input
                      type="checkbox"
                      {...register(camelize(item))}
                      id={item}
                      className="w-5 h-5"
                    />
                    <label htmlFor={item}>{titleCase(item)}</label>
                  </div>
                )
              })}
            </div>
          )}
          <div className="grid gap-4">
            <p className="font-medium">Status</p>
            {status.map((item) => {
              const { title, id, value } = item
              return (
                <div
                  key={id}
                  className="flex items-center gap-4 text-indigo-dye text-[15px]"
                >
                  <input
                    {...register("status")}
                    type="radio"
                    id={id}
                    value={value}
                    className="w-5 h-5"
                  />
                  <label htmlFor={id}>{title}</label>
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
