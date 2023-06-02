import SelectChevronDown from "@/svg/SelectChevronDownDummy"
import { PencilIcon } from "@heroicons/react/24/outline"
import { StagePropTypes as PropTypes, StageType } from "../types"
import { initialActionState } from "../lib/initialActionState"
import { useEffect, useRef, useState } from "react"
import actionTypes from "../lib/actionTypes"

export default function Stage({
  stage,
  stageDropdownId,
  setStageDropdownId,
  setActionState,
  dispatch,
}: PropTypes) {
  const [title, setTitle] = useState(stage.title)
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSave = () => {
    let stageTitle
    if (title.trim() === "") {
      stageTitle = "Untitled"
      setTitle("Untitled")
    } else {
      stageTitle = title.split("\n").join("")
    }

    dispatch({
      type: actionTypes.SET_TITLE,
      payload: { title: stageTitle, stageId: stage.id },
    })
    setIsEditing(false)
  }

  useEffect(() => {
    if (!inputRef.current) return
    if (isEditing) {
      inputRef.current.select()
    } else {
      inputRef.current.blur()
    }
  }, [isEditing])

  useEffect(() => {
    if (stage.isNewStage) setIsEditing(true)
  }, [stage.isNewStage])

  const handleOpenDropdown = () => {
    if (stageDropdownId === stage.id) {
      setStageDropdownId(null)
      return
    }
    setStageDropdownId(stage.id)
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-[#ACB9CB] relative">
      <button
        type="button"
        className="p-4"
        onClick={() => setIsEditing((prev) => !prev)}
      >
        <PencilIcon className="w-5" />
      </button>
      <textarea
        rows={title.length <= 21 ? 1 : 2}
        maxLength={42}
        value={title}
        ref={inputRef}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            handleSave()
          }
        }}
        onChange={(e) => setTitle(e.target.value)}
        className={`${
          isEditing ? "pointer-events-auto" : "pointer-events-none"
        } outline-none bg-transparent hidden-scrollbar text-center font-semibold text-[15px] text-indigo-dye`}
      >
        {stage.title}
      </textarea>
      <button
        onClick={handleOpenDropdown}
        type="button"
        className="border border-[#ACB9CB] px-3 py-6 rounded-md"
      >
        <SelectChevronDown />
      </button>

      {/* dropdown */}
      {stageDropdownId === stage.id && (
        <div className="grid absolute left-0 right-0 bg-white text-indigo-dye border border-[#ACB9CB] top-full z-20 p-4 gap-3 shadow-md">
          <button
            onClick={() =>
              setActionState({
                ...initialActionState,
                stageId: stage.id,
                modal: {
                  title: `Set-up Stage Requirements: ${stage.title}`,
                  whichModal: "STAGE_REQUIREMENTS",
                  isOpen: true,
                },
              })
            }
            type="button"
            className="text-left"
          >
            Set-up Stage Requirements
          </button>
          {stage.id !== 1 && (
            <button
              onClick={() =>
                setActionState({
                  ...initialActionState,
                  stageId: stage.id,
                  modal: {
                    title: `Are you sure you want to remove stage? This process cannot be undone.`,
                    whichModal: "WARNING",
                    isOpen: true,
                  },
                })
              }
              type="button"
              className="text-left"
            >
              Remove Stage
            </button>
          )}
        </div>
      )}
    </div>
  )
}
