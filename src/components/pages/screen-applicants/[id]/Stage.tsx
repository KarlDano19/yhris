import { ContextTypes, BlockPropTypes as PropTypes } from "../types"
import StageHeader from "./StageHeader"
import StageBlock from "./StageBlock"
import { useContext, useEffect, useState } from "react"
import StateContext from "../contexts/StateContext"

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  ...draggableStyle,
})

export default function Stage({ stage, index, provided, snapshot }: PropTypes) {
  const { actionState }: ContextTypes = useContext(StateContext) as ContextTypes
  const [stageDropdownId, setStageDropdownId] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)

  useEffect(() => {
    // closes dropdowns & menus after showing modals
    setStageDropdownId(null)
    setOpenMenuId(null)
  }, [actionState.modal.isOpen])

  return (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
      className="flex flex-col gap-2 bg-white p-3 rounded-2xl"
    >
      <StageHeader
        stage={stage}
        stageDropdownId={stageDropdownId}
        setStageDropdownId={setStageDropdownId}
      />
      <StageBlock
        stage={stage}
        index={index}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
      />
    </li>
  )
}
