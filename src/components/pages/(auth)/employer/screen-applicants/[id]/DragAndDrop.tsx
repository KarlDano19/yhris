import React, { useContext, useMemo } from "react"
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
import { FilterOptions } from "./Filter";

type PropTypes = {
  containerRef: React.MutableRefObject<HTMLElement | null>
  gridCols: React.CSSProperties
  jobPostDetailsRefetch: any
  appliedApplicantRefetch: any
  filters?: FilterOptions
}

export default function DragAndDrop({ containerRef, gridCols, jobPostDetailsRefetch, appliedApplicantRefetch, filters }: PropTypes) {
  const params = useParams();
  const { mutate, isLoading } = useDragStage();
  const { state, dispatch }: ContextTypes = useContext(
    StateContext
  ) as ContextTypes
  
  // Sort stages to ensure final stage is always at the end
  const sortedStages = useMemo(() => {
    const stages = [...state];
    stages.sort((a, b) => {
      if (a.is_final_stage) return 1;  // Final stage goes to end
      if (b.is_final_stage) return -1; // Final stage goes to end
      return 0; // Keep original order for others
    });
    return stages;
  }, [state]);
  
  // Calculate grid columns for all stages
  const allStagesGridCols = {
    gridTemplateColumns: `repeat(${sortedStages.length}, 300px)`
  };
    
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
            style={{
              ...allStagesGridCols,
              scrollbarWidth: 'thin',
              scrollbarColor: '#2d3e58 #f1f1f1'
            }}
            className="grid mb-4 overflow-auto transition-all pb-2.5"
          >
            {sortedStages.map((stage: StageType, index: number) => {
              return (
                <Draggable
                  key={stage.id}
                  draggableId={stage.id.toString()}
                  index={index}
                  isDragDisabled={stage.isNewStage || stage.is_final_stage}
                >
                  {(provided, snapshot) => (
                    <Stage
                      stage={stage}
                      index={index}
                      provided={provided}
                      snapshot={snapshot}
                      jobPostDetailsRefetch={jobPostDetailsRefetch}
                      appliedApplicantRefetch={appliedApplicantRefetch}
                      filters={filters}
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
