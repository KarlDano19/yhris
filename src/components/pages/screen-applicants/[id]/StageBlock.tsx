import { PlusIcon } from "@heroicons/react/24/outline"
import Person from "./Person"
import { StageBlockTypes as PropTypes } from "../types"

export default function StageBlock({
  stage,
  openMenuId,
  setOpenMenuId,
}: PropTypes) {
  const { applicants } = stage

  return (
    <div className="bg-[#EBF3FF] rounded-2xl px-7 py-2 h-[500px] relative">
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
    </div>
  )
}
