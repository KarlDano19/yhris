import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";

import { XCircleIcon } from "@heroicons/react/24/solid";
import EmployeeProfile from "./tabs/EmployeeProfile";
import Reccomendation from "./tabs/Reccomendation";

function CreatePersonelMovementModal({
  refetch,
  isOpen,
  setIsOpen,
}: {
  refetch: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);
//   const { data: reportsData } = useGetWorkAccidentIlnessReportsItems();
  const { register, handleSubmit, reset, control, setValue, watch } =
    useForm();
  const [selectedTab, setSelectedTab] = useState(2);
//   const { mutate: addAnnualAccidentIllnessReport, isLoading: isLoadingAddAnnualAccidentIllnessReport } = useAddAnnualAccidentIllnessReport();

//   useEffect(() => {
//     if (reportsData && reportsData.records) {
//       const totalDisabling = reportsData.records.filter((report: any) => report.disabling_injury).length;
//       const totalNonDisabling = reportsData.records.filter((report: any) => !report.disabling_injury).length;
//       setValue("total_all_disabling_injuries_illnesses", totalDisabling);
//       setValue("total_non_disabling_injuries", totalNonDisabling);
//     }
//   }, [reportsData, setValue]);
  
  const onSubmit = handleSubmit((data) => {
    // const callbackReq = {
    //   onSuccess: (data: any) => {
    //     toast.custom(
    //       () => <CustomToast message={data.message} type="success" />,
    //       {
    //         duration: 5000,
    //       }
    //     );
    //     setIsOpen(false);
    //     reset();
    //     refetch();
    //   },
    //   onError: (err: any) => {
    //     const errorMessage = err.message || "An unexpected error occurred."; // Extract message from error
    //     toast.custom(
    //       () => <CustomToast message={errorMessage} type="error" />,
    //       {
    //         duration: 7000,
    //       }
    //     );
    //   },
    // };
    // addAnnualAccidentIllnessReport(data, callbackReq);
    console.log(data);
  });

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setIsOpen}
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
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                {selectedTab === 1 && (
                  <EmployeeProfile
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    register={register}
                    onSubmit={onSubmit}
                    setSelectedTab={setSelectedTab}
                    isLoading={true}
                  />
                )}
                {selectedTab === 2 && (
                  <Reccomendation
                    control={control}
                    register={register}
                    onSubmit={onSubmit}
                    setSelectedTab={setSelectedTab}
                    isLoading={true}
                    setValue={setValue}
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

export default CreatePersonelMovementModal;
