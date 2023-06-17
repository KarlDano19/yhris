import { PlusIcon } from "@heroicons/react/24/outline"
import { Draggable } from "react-beautiful-dnd"
import Person from "./Person"
import { BlockPropTypes as PropTypes } from "../types"

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  boxShadow: `${isDragging ? "rgba(149, 157, 165, 0.2) 0px 8px 24px" : "none"}`,
  ...draggableStyle,
})

export default function Block({
  index,
  stage,
  openMenuId,
  setOpenMenuId,
}: PropTypes) {
  const { id, applicants } = stage

  return (
    <Draggable key={id} draggableId={id.toString()} index={index}>
      {(provided, snapshot) => (
        <ul
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
          className="bg-[#EBF3FF] rounded-2xl px-7 py-2 h-[500px] relative"
        >
          {applicants.length ? (
            applicants.map((applicant) => {
              return (
                <Person
                  key={applicant.id}
                  applicant={applicant}
                  isOpenMenu={openMenuId === applicant.id}
                  setOpenMenuId={setOpenMenuId}
                  stage={stage}
                />
              )
            })
          ) : (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <PlusIcon className="text-[#CCE0FF] w-12 h-12" />
            </span>
          )}
        </ul>
      )}
    </Draggable>
  )
}
