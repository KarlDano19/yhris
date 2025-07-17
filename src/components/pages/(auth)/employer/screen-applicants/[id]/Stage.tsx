import { ContextTypes, BlockPropTypes as PropTypes } from "../types"
import StageHeader from "./StageHeader"
import StageBlock from "./StageBlock"
import StageTabs from "./StageTabs"
import { useContext, useEffect, useState } from "react"
import StateContext from "../contexts/StateContext"
import { FilterOptions } from "./Filter"

interface StageProps extends PropTypes {
  filters?: FilterOptions;
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  ...draggableStyle,
})

export default function Stage({ stage, index, provided, snapshot, jobPostDetailsRefetch, appliedApplicantRefetch, filters }: StageProps) {
  const { actionState }: ContextTypes = useContext(StateContext) as ContextTypes
  const [stageDropdownId, setStageDropdownId] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [activeTab, setActiveTab] = useState('Good Fit')

  useEffect(() => {
    // closes dropdowns & menus after showing modals
    setStageDropdownId(null)
    setOpenMenuId(null)
  }, [actionState.modal.isOpen])

  // Update filters based on active tab
  const tabFilters: FilterOptions = {
    rating: [activeTab],
    status: filters?.status || ['Ongoing', 'Passed', 'Withdrawn', 'Rejected'],
  };

  return (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
      className="flex flex-col gap-2 bg-white p-3 rounded-2xl"
    >
      <StageHeader
        index={index}
        stage={stage}
        stageDropdownId={stageDropdownId}
        setStageDropdownId={setStageDropdownId}
        jobPostDetailsRefetch={jobPostDetailsRefetch}
        appliedApplicantRefetch={appliedApplicantRefetch}
      />
      <StageTabs 
        stage={stage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filters={filters}
      />
      <StageBlock
        stage={stage}
        index={index}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        filters={tabFilters}
      />
    </li>
  )
}
