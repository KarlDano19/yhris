import React, { useContext } from "react"
import { DragDropContext, Draggable } from "react-beautiful-dnd"
import { StrictModeDroppable } from "../layouts/StrictModeDroppable"
import Stage from "./Stage"
import { useParams } from "next/navigation";
import actionTypes from "../lib/actionTypes"
import StateContext from "../contexts/StateContext"
import { ContextTypes, StageType } from "../types"
import toast from "react-hot-toast";
import CustomToast from "@/components/CustomToast";
import useDragStage from '../hooks/useDragStage';

type PropTypes = {
  containerRef: React.MutableRefObject<HTMLElement | null>
  gridCols: React.CSSProperties
  jobPostDetailsRefetch: any
  appliedApplicantRefetch: any
}

export default function DragAndDrop({ containerRef, gridCols, jobPostDetailsRefetch, appliedApplicantRefetch }: PropTypes) {
  const params = useParams();
  const { mutate, isLoading } = useDragStage();
  const { state, dispatch }: ContextTypes = useContext(
    StateContext
  ) as ContextTypes
    
  const dragStage = (result: any) => {
    const callbackReq = {
      onSuccess: () => {
        jobPostDetailsRefetch();
        appliedApplicantRefetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    dispatch({ type: actionTypes.DRAG_BLOCK, payload: result });
    let data = {
      job_id: params.id,
      source: result.source.index,
      destination: result.destination.index,
    }
    mutate(data, callbackReq);
  }

  return (
    <DragDropContext
      onDragEnd={(result) => (
        dragStage(result)
      )}
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
            {state.map((stage: StageType, index: number) => {
              return (
                <Draggable
                  key={stage.id}
                  draggableId={stage.id.toString()}
                  index={index}
                  isDragDisabled={stage.isNewStage}
                >
                  {(provided, snapshot) => (
                    <Stage
                      stage={stage}
                      index={index}
                      provided={provided}
                      snapshot={snapshot}
                      jobPostDetailsRefetch={jobPostDetailsRefetch}
                      appliedApplicantRefetch={appliedApplicantRefetch}
                    />
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </ul>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
}
