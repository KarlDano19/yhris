import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";

import { XCircleIcon } from "@heroicons/react/24/solid";
import EmployeeProfile from "./tabs/EmployeeProfile";
import Reccomendation from "./tabs/Reccomendation";
import useEditPersonelMovementDetails from "../hooks/useEditPersonelMovementDetails";
import useGetAddPersonelMovementDetails from "../hooks/useGetAddPersonelMovementDetails";

type T_ModalData = {
    id: number;
    open: boolean;
  };

function EditPersonelMovementModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset, control, setValue, watch } =
    useForm();
  const [selectedTab, setSelectedTab] = useState(1);
  const { data: personelMovementData, refetch: refetchPersonelMovement, remove: removePersonelMovement } = useGetAddPersonelMovementDetails(isOpen.id);
  const { mutate: editPersonelMovement, isLoading: isLoadingEditPersonelMovement } = useEditPersonelMovementDetails();

  useEffect(() => {
    if (isOpen) {
      refetchPersonelMovement();
    }
  }, [isOpen]);

  useEffect(() => {
    if (personelMovementData) {
      setValue("date", personelMovementData.date);
      setValue("employee", personelMovementData.employee);
      setValue("position", personelMovementData.position);
      setValue("reason", personelMovementData.reason);
      setValue("status", personelMovementData.status);
      setValue("processed_by", personelMovementData.processed_by);
      setValue("start_date", personelMovementData.start_date);
      setValue("hr_recommendation", personelMovementData.hr_recommendation);
      setValue("manager_recommendation", personelMovementData.manager_recommendation);
      setValue("manager_signature", personelMovementData.manager_signature);
      setValue("hr_signature", personelMovementData.hr_signature);
    }
  }, [personelMovementData]);
  
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
        customCloseModal();
        refetch();
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
    console.log(data);
    editPersonelMovement({ personel_movement_id: isOpen.id, data: data }, callbackReq);
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
                    Personal Movement Form (PMF)
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
                  />
                )}
                {selectedTab === 2 && (
                  <Reccomendation
                    register={register}
                    onSubmit={onSubmit}
                    setSelectedTab={setSelectedTab}
                    isLoading={isLoadingEditPersonelMovement}
                    setValue={setValue}
                    hasHrRecommendation={true}
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

export default EditPersonelMovementModal;
