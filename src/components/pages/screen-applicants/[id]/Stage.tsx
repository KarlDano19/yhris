import SelectChevronDown from "@/svg/SelectChevronDownDummy"
import { PencilIcon } from "@heroicons/react/24/outline"
import { StagePropTypes as PropTypes } from "../types"

export default function Stage({
  stage,
  stageDropdownId,
  setStageDropdownId,
  setStageRequirementsId,
  stages,
  setStages,
}: PropTypes) {
  const handleOpenDropdown = () => {
    if (stageDropdownId === stage.id) {
      setStageDropdownId(null)
      return
    }
    setStageDropdownId(stage.id)
  }

  const handleRemoveStage = () => {
    // modal appears
    const newStages = stages.filter((item) => item.id !== stage.id)
    setStages(newStages)
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
            onClick={() => setStageRequirementsId(stage.id)}
            type="button"
            className="text-left"
          >
            Set-up Stage Requirements
          </button>
          {stage.id !== 1 && (
            <button
              onClick={handleRemoveStage}
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
