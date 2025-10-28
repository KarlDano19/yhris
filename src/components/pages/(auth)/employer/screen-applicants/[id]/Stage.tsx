import { ContextTypes, BlockPropTypes as PropTypes } from "../types"
import StageHeader from "./StageHeader"
import StageBlock from "./StageBlock"
import StageTabs from "./StageTabs"
import { useContext, useEffect, useState } from "react"
import StateContext from "../contexts/StateContext"
import { FilterValues } from "@/components/common/Filter"

interface StageProps extends PropTypes {
  filters?: FilterValues;
}

const getItemStyle = (isDragging: boolean, draggableStyle: any, isDisabled: boolean, isFinalStage: boolean) => ({
  ...draggableStyle,
  opacity: isDisabled ? 0.5 : 1,
  pointerEvents: isDisabled ? 'none' : 'auto',
  filter: isDisabled ? 'grayscale(30%)' : 'none',
  cursor: isFinalStage ? 'not-allowed' : 'grab',
})

export default function Stage({ stage, index, provided, snapshot, jobPostDetailsRefetch, appliedApplicantRefetch, filters }: StageProps) {
  const { actionState }: ContextTypes = useContext(StateContext) as ContextTypes
  const [stageDropdownId, setStageDropdownId] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [activeTab, setActiveTab] = useState('Applicants')

  // Check if user has permissions for this stage
  const permissions = stage.permissions || {
    can_view: false,
    can_move: false,
    can_update: false,
    is_visible: true
  }
  
  const isStageDisabled = !permissions.can_view && !permissions.can_move && !permissions.can_update
  const canInteract = permissions.can_move || permissions.can_update

  useEffect(() => {
    setStageDropdownId(null)
    setOpenMenuId(null)
  }, [actionState.modal.isOpen])

  const tabFilters: FilterValues = {
    status: filters?.status || ['Ongoing', 'Passed', 'Withdrawn', 'Rejected', 'Hired'],
  };

  return (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, isStageDisabled, stage.is_final_stage || false)}
      className={`flex flex-col gap-2 p-3 rounded-2xl transition-all duration-200 relative ${
        isStageDisabled 
          ? 'bg-gray-100 border-2 border-dashed border-gray-300' 
          : stage.is_final_stage
          ? 'bg-white shadow-lg border-2 border-black'
          : 'bg-white shadow-sm hover:shadow-md'
      }`}
    >
      
      
      {/* Disabled overlay with tooltip */}
      {isStageDisabled && (
        <div className="absolute inset-0 z-5 flex items-center justify-center bg-gray-200 bg-opacity-40 rounded-2xl pointer-events-none">
          <div className="text-center p-2">
            <div className="text-gray-600 text-xs font-medium mb-1">
              🔒 No Access
            </div>
            <div className="text-gray-500 text-xs">
              Contact admin for access
            </div>
          </div>
        </div>
      )}

      <StageHeader
        index={index}
        stage={stage}
        stageDropdownId={stageDropdownId}
        setStageDropdownId={setStageDropdownId}
        jobPostDetailsRefetch={jobPostDetailsRefetch}
        appliedApplicantRefetch={appliedApplicantRefetch}
        permissions={permissions}
        isDisabled={isStageDisabled}
      />
      
      <StageTabs 
        stage={stage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filters={filters}
        isDisabled={isStageDisabled}
      />
      
      <StageBlock
        stage={stage}
        index={index}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        filters={tabFilters}
        permissions={permissions}
        isDisabled={isStageDisabled}
      />
    </li>
  )
}
