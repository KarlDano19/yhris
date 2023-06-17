import { ChangeEvent, ChangeEventHandler, FormEventHandler, useContext, useEffect, useState } from "react"
import ModalLayout from "./ModalLayout"
import { ApplicantType, ContextTypes, ChecklistPropTypes as PropTypes, StateType } from "../types"
import { initialActionState } from "../lib/initialActionState"
import { useForm } from "react-hook-form"
import ModalFooterLayout from "../layouts/ModalFooterLayout"
import StateContext from "../contexts/StateContext"
import titleCase from "@/helpers/titleCase"

type DataTypes = {
  checklists: string[],
  status: string
}

const statuses = [
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
  handleFormSubmit,
}: PropTypes) {
  const {state, actionState, setActionState}: ContextTypes = useContext(StateContext) as ContextTypes
  const { getValues, setValue } = useForm()
  const [isOpen, setIsOpen] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  let applicant: ApplicantType | undefined
  state.forEach(stage => {
    if (stage.id === actionState.stageId) {
      applicant = stage.applicants.find(applicant => applicant.id === actionState.applicantId)
    }
  })
  const [checks, setChecks] = useState<string[]>(applicant?.checklists || [])

  useEffect(() => {
    // determining if all checklists are checked in the form
    setIsDisabled(requirements.length !== checks.filter(check => requirements.includes(check)).length)
  }, [checks.length, requirements.length])

  useEffect(() => { setIsOpen(true) }, [])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setActionState(initialActionState), 400)
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    const data: DataTypes = {} as DataTypes
    data.checklists = checks
    data.status = getValues("status") || applicant?.status
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
      <form onSubmit={onSubmit}>
        <div className="p-8">
          {requirements?.length > 0 && (
            <div className="grid gap-4 mb-8">
              {requirements.map((requirement) => {
                return (
                  <div
                    key={requirement}
                    className="flex items-center gap-4 text-indigo-dye text-[15px]"
                  >
                    <input
                      checked={checks.some(check => check === requirement)}
                      onChange={handleCheckbox}
                      id={requirement}
                      type="checkbox"
                      className="w-5 h-5"
                    />
                    <label htmlFor={requirement}>{titleCase(requirement)}</label>
                  </div>
                )
              })}
            </div>
          )}
          <div className="grid gap-4">
            <p className="font-medium">Status</p>
            {statuses.map((status) => {
              const { title, id } = status
              const disabled = id === "passed" && isDisabled
              
              return (
                <div
                  key={id}
                  className={`${disabled && "opacity-75"} flex items-center gap-4 text-indigo-dye text-[15px]`}
                >
                  <input
                    onChange={e => setValue("status", e.target.id)}
                    defaultChecked={applicant?.status === id}
                    checked={disabled ? false : getValues("status") === id ? true : undefined}
                    disabled={disabled}
                    id={id}
                    type="radio"
                    name="status"
                    className="w-5 h-5"
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
