import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react"
import ModalLayout from "./ModalLayout"
import { ChecklistPropTypes as PropTypes } from "../types"
import { initialActionState } from "../lib/initialActionState"
import { useForm } from "react-hook-form"
import { camelize } from "@/helpers/camelize"
import ModalFooterLayout from "../layouts/ModalFooterLayout"

const status = [
  {
    id: "ongoing",
    value: "ongoing",
    title: "Ongoing",
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
  {
    id: "passed",
    value: "passed",
    title: "Passed",
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
  const [checks, setChecks] = useState<string[]>([])
  const [isDisabled, setIsDisabled] = useState(true)


  useEffect(() => {
    if (requirements.length === checks.length) 
      setIsDisabled(false)
    else 
      setIsDisabled(true)
  }, [checks.length, requirements.length])

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
  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setChecks(prev => [...prev, e.target.id])
    } else {
      const newChecks = checks.filter(item => item !== e.target.id)
      setChecks(newChecks)
    }
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
                      {...register(camelize(item), {
                        onChange: handleCheckbox,
                      })}
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
              const disabled = id === "passed" && isDisabled
              return (
                <div
                  key={id}
                  className={`${disabled && "opacity-75"} flex items-center gap-4 text-indigo-dye text-[15px]`}
                >
                  <input
                    {...register("status")}
                    type="radio"
                    id={id}
                    value={value}
                    className="w-5 h-5"
                    disabled={disabled}
                    checked={disabled ? false : undefined}
                  />
                  <label htmlFor={id}>{title}</label>
                </div>
              )
            })}
          </div>
        </div>
        <hr />
        <ModalFooterLayout>
          <button
            onClick={handleClose}
            type="button"
            className="border border-[#355FD0] rounded-lg py-2 px-6 text-[#355FD0] hover:bg-[#355FD0]/[.15]"
          >
            Close
          </button>
          <button
            type="submit"
            className="rounded-lg py-2 px-6 bg-[#355FD0] text-white hover:bg-[#3156bd]"
          >
            Update
          </button>
        </ModalFooterLayout>
      </form>
    </ModalLayout>
  )
}
