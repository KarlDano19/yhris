import { PlusIcon } from "@heroicons/react/24/outline"
import Person from "./Person"
import { useParams } from "next/navigation";
import { ContextTypes, StageBlockTypes as PropTypes } from "../types"
import { useContext } from "react"
import StateContext from "../contexts/StateContext"
import actionTypes from "../lib/actionTypes"
import toast from "react-hot-toast";
import CustomToast from "@/components/CustomToast";
import useAddStage from "../hooks/useAddStage";
import { useQueryClient } from '@tanstack/react-query';

export default function StageBlock({
  stage,
  index,
  openMenuId,
  setOpenMenuId,
}: PropTypes) {
  const params = useParams();
  const queryClient = useQueryClient();
  const { mutate: addMutate, isLoading: isAddLoading } = useAddStage();
  const { actionState, dispatch }: ContextTypes = useContext(
    StateContext
  ) as ContextTypes
  const { applicants } = stage
  const handleAddStage = () => {
    const callbackReq = {
      onSuccess: (data: any) => {
        dispatch({
          type: actionTypes.ADD_STAGE,
          payload: { id: data.job_stage_id, addType: "adjacent", index },
        })
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    const data: any = {
      title: "Untitled",
      job_posting: params.id,
      order_by: index,
      add_type: "adjacent"
    }
    addMutate(data, callbackReq);
  }

  return (
    <div className="bg-[#EBF3FF] rounded-2xl px-7 py-2 h-[500px] relative overflow-y-auto">
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
        <button
          onClick={handleAddStage}
          type="button"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 flex hover:bg-savoy-blue/[.025] rounded-2xl transition-all"
        >
          <PlusIcon className="text-[#CCE0FF] w-12 h-12 m-auto" />
        </button>
      )}
    </div>
  )
}
