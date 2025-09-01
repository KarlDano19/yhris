import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { Controller } from "react-hook-form";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import CustomDatePicker from "@/components/CustomDatePicker";
import useGetEmployeeItems from "@/components/hooks/useGetEmployeeItems";

import { XCircleIcon } from "@heroicons/react/24/solid";
import SelectChevronDown from "@/svg/SelectChevronDown";
import MeetingInfo from "./tabs/MeetingInfo";
import DiscussionDetails from "./tabs/DiscussionDetails";
import MeetingSignature from "./tabs/MeetingSignature";
import useUpdateShcMinutesMeeting from "../hooks/useUpdateShcMinutesMeeting";
import useGetMinutesMeetingDetails from "../hooks/useGetMinutesMeetingDetails";

type T_ModalData = {
  id: number;
  open: boolean;
};

function UpdateShcMinutesMeetingModal({
  refetch,
  isOpen,
  setIsOpen,
  formMethods,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
  formMethods: any;
}) {
  const cancelButtonRef = useRef(null);
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const { data: employeeData } = useGetEmployeeItems();
  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors }, setError, clearErrors } = formMethods;
  const {data: minutesMeetingData, remove: removeMinutesMeeting, refetch: refetchMinutesMeeting} = useGetMinutesMeetingDetails(isOpen.id);
  const {
    mutate: updateShcMinutesMeeting,
    isLoading: isLoadingUpdateShcMinutesMeeting,
  } = useUpdateShcMinutesMeeting();
  const [selectedTab, setSelectedTab] = useState(1);

  const onSubmit = handleSubmit((data: any) => {
    const callbackReq = {
              onSuccess: (data: any) => {
          toast.custom(
            () => <CustomToast message={data.message} type="success" />,
            {
              duration: 5000,
            }
          );
          setIsOpen({ id: 0, open: false });
          setSelectedTab(1);
          refetch();
        },
      onError: (err: any) => {
        const errorMessage = err.message || "An unexpected error occurred."; // Extract message from error
        toast.custom(() => <CustomToast message={errorMessage} type="error" />, {
          duration: 7000,
        });
      },
    };
    updateShcMinutesMeeting({ data, shc_meeting_minutes_id: isOpen.id }, callbackReq);
  });

  useEffect(() => {
    if (employeeData) {
      setEmployeeItems(employeeData);
    }
  }, [employeeData]);

  useEffect(() => {
    if (minutesMeetingData) {
        setValue("date_of_meeting", minutesMeetingData.date_of_meeting);
        setValue("time_of_meeting", minutesMeetingData.time_of_meeting);
        setValue("venue", minutesMeetingData.venue);
        setValue("attendees", minutesMeetingData.attendees);
        setValue("absentees", minutesMeetingData.absentees);
        setValue("details_of_meeting", minutesMeetingData.details_of_meeting);
        setValue("prepared_by", minutesMeetingData.prepared_by);
        setValue("position", minutesMeetingData.position);
        setValue("signature", minutesMeetingData.signature);
    }
  }, [minutesMeetingData, setValue]);

  const customCloseModal = () => {
    reset();
    removeMinutesMeeting();
    setSelectedTab(1);
    setIsOpen(null);
  };

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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all my-4 w-full max-w-full mx-2 md:my-8 md:w-full md:max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Edit Work Accident/Illness Report
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => customCloseModal()}
                  />
                </div>
                {selectedTab === 1 && (
                  <MeetingInfo
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                    watch={watch}
                  />
                )}
                {selectedTab === 2 && (
                  <DiscussionDetails
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                    watch={watch}
                  />
                )}
                {selectedTab === 3 && (
                  <MeetingSignature
                    control={control}
                    register={register}
                    onSubmit={onSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
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

export default UpdateShcMinutesMeetingModal;
