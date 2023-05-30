import SelectChevronDown from "@/svg/SelectChevronDownDummy"
import { PencilIcon } from "@heroicons/react/24/outline"
import { StagePropTypes as PropTypes, StageType } from "../types"
import { initialActionState } from "../lib/initialActionState"

export default function Stage({
  stage,
  state,
  stageDropdownId,
  setStageDropdownId,
  setActionState,
}: PropTypes) {
  const stageTitle = state?.find(
    (item: StageType) => item.id === stage.id
  ).title

  const handleOpenDropdown = () => {
    if (stageDropdownId === stage.id) {
      setStageDropdownId(null)
      return
    }
    setStageDropdownId(stage.id)
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-[#ACB9CB] relative">
      <span className="p-4">
        <PencilIcon className="w-3" />
      </span>
      <p className="font-semibold text-[15px] text-indigo-dye text-center">
        {stage.title}
      </p>
      <button
        onClick={handleOpenDropdown}
        type="button"
        className="border border-[#ACB9CB] px-4 py-6 rounded-md"
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
                  title: `Set-up Stage Requirements: ${stageTitle}`,
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
