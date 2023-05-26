import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { Draggable } from "react-beautiful-dnd"
import { PropTypes } from "./types"

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  boxShadow: `${isDragging ? "rgba(149, 157, 165, 0.2) 0px 8px 24px" : "none"}`,
  ...draggableStyle,
})

export default function ColumnBlock({
  applicants,
  job,
  key,
  draggableId,
  index,
}: PropTypes) {
  return (
    <Draggable key={key} draggableId={draggableId} index={index}>
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
            applicants.map((applicant, index) => {
              return (
                <li
                  onDragStart={() => console.log("dragging")}
                  onDrop={() => console.log("dropped!")}
                  draggable
                  key={applicant.id}
                  className={`${
                    index !== job.applicants.length - 1 &&
                    "border-b border-b-[#ACB9CB]"
                  } flex items-center py-6 gap-2`}
                >
                  <div className="w-8 h-8 overflow-hidden rounded-full">
                    <Image
                      src={applicant.image}
                      alt={applicant.name}
                      width="50"
                      height="50"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-indigo-dye font-semibold text-sm">
                    {applicant.name}
                  </p>
                  <button type="button" className="ml-auto text-indigo-dye">
                    <EllipsisVerticalIcon className="w-7 h-7" />
                  </button>
                </li>
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
