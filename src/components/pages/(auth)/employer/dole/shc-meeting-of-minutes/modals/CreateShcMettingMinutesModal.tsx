import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

import CustomToast from "@/components/CustomToast";
import useAddShcMeetingMinutes from "../hooks/useAddShcMinutesMeeting";
import DiscussionDetails from "./tabs/DiscussionDetails";
import MeetingSignature from "./tabs/MeetingSignature";

import { XCircleIcon } from "@heroicons/react/24/solid";
import MeetingInfo from "./tabs/MeetingInfo";

function CreateShcMettingMinutesModal({
  refetch,
  isOpen,
  setIsOpen,
  formMethods,
}: {
  refetch: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  formMethods: any;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors }, setError, clearErrors } = formMethods;
  const {
    mutate: addShcMeetingMinutes,
    isLoading: isLoadingAddShcMeetingMinutes,
  } = useAddShcMeetingMinutes();
  const [selectedTab, setSelectedTab] = useState(1);

  const resetForm = () => {
    reset();
    setIsOpen(false);
    setSelectedTab(1);
  };

  const onSubmit = handleSubmit((data: any) => {
    const callbackReq = {
              onSuccess: (data: any) => {
          toast.custom(
            () => <CustomToast message={data.message} type="success" />,
            {
              duration: 5000,
            }
          );
          resetForm();
          refetch();
        },
      onError: (err: any) => {
        const errorMessage = err.message || "An unexpected error occurred."; // Extract message from error
        toast.custom(() => <CustomToast message={errorMessage} type="error" />, {
          duration: 7000,
        });
      },
    };
    addShcMeetingMinutes(data, callbackReq);
  });

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => {setIsOpen(false)}}
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
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all my-4 w-full max-w-full mx-2 md:my-8 md:w-full md:max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center rounded-t-lg">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Create SHC Meeting of Minutes
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                {selectedTab === 1 && (
                  <MeetingInfo
                    control={control}
                    register={register}
                    setSelectedTab={setSelectedTab}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                    watch={watch}
                    setValue={setValue}
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

export default CreateShcMettingMinutesModal;
