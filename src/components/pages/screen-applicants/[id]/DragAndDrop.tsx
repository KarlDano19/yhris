import React, { useContext } from "react"
import { DragDropContext, Draggable } from "react-beautiful-dnd"
import { StrictModeDroppable } from "../layouts/StrictModeDroppable"
import Stage from "./Stage"
import actionTypes from "../lib/actionTypes"
import StateContext from "../contexts/StateContext"
import { ContextTypes, StageType } from "../types"

type PropTypes = {
  containerRef: React.MutableRefObject<HTMLElement | null>
  gridCols: React.CSSProperties
}

export default function DragAndDrop({ containerRef, gridCols }: PropTypes) {
  const { state, dispatch }: ContextTypes = useContext(
    StateContext
  ) as ContextTypes

  return (
    <DragDropContext
      onDragEnd={(result) =>
        dispatch({ type: actionTypes.DRAG_BLOCK, payload: result })
      }
    >
      <StrictModeDroppable droppableId="stage" direction="horizontal">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={(el) => {
              provided.innerRef(el)
              containerRef.current = el
            }}
            style={gridCols}
            className="grid mb-4 overflow-auto transition-all"
          >
            {state.map((stage: StageType, index: number) => (
              <Draggable
                key={stage.id}
                draggableId={stage.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <Stage
                    stage={stage}
                    index={index}
                    provided={provided}
                    snapshot={snapshot}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
}
