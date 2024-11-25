import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
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
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
}) {
  const cancelButtonRef = useRef(null);
  const [employeeItems, setEmployeeItems] = useState<any>([]);
  const { data: employeeData } = useGetEmployeeItems();
  const { register, handleSubmit, reset, control, setValue, watch } = useForm();
  const {data: minutesMeetingData, remove: removeMinutesMeeting, refetch: refetchMinutesMeeting} = useGetMinutesMeetingDetails(isOpen.id);
  const {
    mutate: updateShcMinutesMeeting,
    isLoading: isLoadingUpdateShcMinutesMeeting,
  } = useUpdateShcMinutesMeeting();
  const [selectedTab, setSelectedTab] = useState(1);

  const onSubmit = handleSubmit((data) => {
   
    console.log(data);
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
        setValue("submitted_by", minutesMeetingData.submitted_by);
        setValue("position", minutesMeetingData.position);

    }
  })

  const customCloseModal = () => {
    reset();
    removeMinutesMeeting();
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
                    Create Work Accident/Illness Report
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
