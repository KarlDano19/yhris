import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import EmployeeProfile from "./tabs/EmployeeProfile";
import Recommendation from "./tabs/Recommendation";
import useEditPersonelMovementDetails from "../hooks/useEditPersonelMovementDetails";
import useGetAddPersonelMovementDetails from "../hooks/useGetAddPersonelMovementDetails";
import useGetPersonnelMovementApprovals from "../hooks/useGetPersonnelMovementApprovals";
import useSubmitApproval from "../hooks/useSubmitApproval";

import { XCircleIcon } from "@heroicons/react/24/solid";

type T_ModalData = {
    id: number;
    open: boolean;
  };

function PrintPersonelMovementModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors }, setError, clearErrors } =
    useForm();
  const [selectedTab, setSelectedTab] = useState(1);
  const { data: personelMovementData, refetch: refetchPersonelMovement, remove: removePersonelMovement } = useGetAddPersonelMovementDetails(isOpen.id);
  const { mutate: editPersonelMovement, isLoading: isLoadingEditPersonelMovement } = useEditPersonelMovementDetails();
  const { approvals, currentUserApproval, refetch: refetchApprovals } = useGetPersonnelMovementApprovals(isOpen.id);
  const { mutate: submitApproval, isLoading: isLoadingSubmitApproval } = useSubmitApproval();

  useEffect(() => {
    if (isOpen) {
      refetchPersonelMovement();
      refetchApprovals();
    }
  }, [isOpen]);

  useEffect(() => {
    if (personelMovementData) {
      personelMovementData['created_at'] = Intl.DateTimeFormat('en-US').format(new Date(personelMovementData.created_at));
    }
  }, [personelMovementData]);

  useEffect(() => {
    if (personelMovementData) {
      setValue("id", personelMovementData.id);
      setValue("created_at", personelMovementData.created_at);
      setValue("date", personelMovementData.date);
      setValue("employee", personelMovementData.employee);
      setValue("current_position", personelMovementData.current_position);
      setValue("new_position", personelMovementData.new_position);
      setValue("reason", personelMovementData.reason);
      setValue("status", personelMovementData.status);
      setValue("processed_by", personelMovementData.processed_by);
      setValue("start_date", personelMovementData.start_date);
      setValue("proposed_rate", personelMovementData.proposed_rate);
      setValue("percentage_increase", personelMovementData.percentage_increase);
    }
  }, [personelMovementData]);

  useEffect(() => {
    if (currentUserApproval) {
      setValue("recommendation", currentUserApproval.recommendation || "");
      setValue("signature", currentUserApproval.signature || "");
    }
  }, [currentUserApproval]);
  
  const customCloseModal = () => {
    reset();
    removePersonelMovement();
    setIsOpen(null);
  };

  const onSubmit = handleSubmit((data) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(
          () => <CustomToast message={data.message} type="success" />,
          {
            duration: 5000,
          }
        );
        // Refetch all necessary data
        refetchApprovals();
        refetchPersonelMovement();
        refetch();
        customCloseModal();
      },
      onError: (err: any) => {
        const errorMessage = err.message || "An unexpected error occurred.";
        toast.custom(
          () => <CustomToast message={errorMessage} type="error" />,
          {
            duration: 7000,
          }
        );
      },
    };

    if (currentUserApproval) {
      // If there's a current approval, submit the approval
      // Process signature data before submission
      let signatureData = data.signature;
      
      // Handle File objects from drawn or uploaded signatures
      if (signatureData instanceof File) {
        // For File objects, we'll need to create a FormData object
        const formData = new FormData();
        formData.append('recommendation', data.recommendation);
        formData.append('signature', signatureData);
        formData.append('status', data.status || "approved");
        
        submitApproval(
          { 
            personnel_movement_id: isOpen.id, 
            data: formData
          }, 
          callbackReq
        );
      } else {
        // For string URLs or other data types
        submitApproval(
          { 
            personnel_movement_id: isOpen.id, 
            data: {
              recommendation: data.recommendation,
              signature: signatureData,
              status: data.status || "approved"
            }
          }, 
          callbackReq
        );
      }
    } else {
      // Otherwise, update the PMF details
      editPersonelMovement(
        { 
          personel_movement_id: isOpen.id, 
          data: {
            employee: data.employee,
            current_position: data.current_position,
            new_position: data.new_position,
            reason: data.reason,
            start_date: data.start_date,
            proposed_rate: data.proposed_rate
          }
        }, 
        callbackReq
      );
    }
  });

  return (
    <Transition.Root show={isOpen.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => customCloseModal()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Update Personal Movement Form (PMF)
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => customCloseModal()}
                  />
                </div>
                {selectedTab === 1 && (
                  <EmployeeProfile
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    isLoading={isLoadingEditPersonelMovement}
                    isEdit={true}
                  />
                )}
                {selectedTab === 2 && (
                  <Recommendation
                    register={register}
                    onSubmit={onSubmit}
                    setSelectedTab={setSelectedTab}
                    isLoading={isLoadingSubmitApproval}
                    setValue={setValue}
                    hasHrRecommendation={true}
                    approvals={approvals}
                    currentUserApproval={currentUserApproval}
                    watch={watch}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default PrintPersonelMovementModal;
