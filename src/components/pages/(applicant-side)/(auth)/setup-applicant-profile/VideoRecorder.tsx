"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { XCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import {
  VideoCameraIcon,
  VideoCameraSlashIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline";
import MicrophoneSlashIcon from "@/svg/MicrophoneSlashIcon";
import SavingProgress from "./SavingProgress";



interface VideoRecorderProps {
  open: boolean;
  onClose: () => void;
}

const VideoRecorder = ({ open, onClose }: VideoRecorderProps) => {
  const [isCameraOpen, setCamera] = useState(true);
  const [isMicrophoneOpen, setMicrophone] = useState(true);
  const [isRecording, setRecording] = useState(false);
  const [doneRecording, setDoneRecording] = useState(false);

  const handleRecord = () => {
    if (!isRecording) {
      setRecording(true);
    } else {
      setRecording(false);
      setDoneRecording(true);
      onClose();
    }
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className={`relative z-10 `}
          onClose={onClose}
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#1E2836] text-left shadow-xl transition-all sm:my-8 w-full md:max-w-xl lg:max-w-5xl">
                  <div className="header bg-indigo-dye rounded-md flex justify-between px-4 py-2">
                    <h6 className="text-[#ACB9CB] font-medium">
                      Record Intro Video
                    </h6>
                    <button tabIndex={-1} onClick={onClose}>
                      <XCircleIcon className="h-7 w-7 text-[#ACB9CB]" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-5">
                    <div className="lg:col-span-3 border-r border-[#ACB9CB] p-8">
                      <div className="video-container w-full h-56 lg:h-[55vh] bg-[#446085] rounded-md flex items-center">
                        {isCameraOpen ? (
                          <h5 className="text-white text-xl font-bold mx-auto">
                            Camera is open
                          </h5>
                        ) : (
                          <UserIcon className="h-3/4 text-white mx-auto" />
                        )}
                      </div>
                      <span className="text-white mt-1">00:00/00:00</span>
                      <div className="flex justify-center mt-3 space-x-8">
                        <button
                          className="h-14 w-14 bg-[#446085] p-3 rounded-full"
                          tabIndex={-1}
                          onClick={() => setCamera(!isCameraOpen)}
                        >
                          {isCameraOpen ? (
                            <VideoCameraIcon className="h-full w-full text-[#1E2836]" />
                          ) : (
                            <VideoCameraSlashIcon className="h-full w-full text-[#1E2836]" />
                          )}
                        </button>
                        <button
                          className="h-14 w-14 bg-[#446085] p-[15px] rounded-full"
                          tabIndex={-1}
                          onClick={() => setMicrophone(!isMicrophoneOpen)}
                        >
                          {isMicrophoneOpen ? (
                            <MicrophoneIcon className="h-full w-full text-[#1E2836]" />
                          ) : (
                            <MicrophoneSlashIcon className="h-full w-full" />
                          )}
                        </button>
                        <button
                          className={`${
                            isRecording ? "bg-[#D65846]" : "bg-[#446085]"
                          } h-14 w-14 p-3 rounded-full`}
                          tabIndex={-1}
                          onClick={handleRecord}
                        >
                          <div className="h-full w-full rounded-full border-4 border-[#1E2836]"></div>
                        </button>
                      </div>
                    </div>
                    <div className="lg:col-span-2 px-8 pb-8 lg:pb-0 lg:py-8">
                      <h6 className="text-xl text-white font-bold">
                        Guide Questions
                      </h6>
                      <div className="h-40 lg:h-[62vh] overflow-y-scroll">
                        <ol className="text-white mt-2 list-decimal ml-5">
                          <li>
                            In 1-2 minutes, please tell me about yourself.
                          </li>
                          <li>
                            If ever you will be hired in our company, when can
                            you start to work?
                          </li>
                          <li>
                            Why do you want to leave your current job? Or why
                            did you leave your previous job?
                          </li>
                          <li>What do you consider to be your strengths?</li>
                          <li>
                            What do you consider to be your greatest weakness?
                          </li>
                          <li>
                            What was your worst experience (in
                            school/organization) and how did you handle it?
                          </li>
                          <li>
                            What device are you using of to record this video?
                            Do you own it?
                          </li>
                          <li>How fast is your internet connection?</li>
                          <li>Please show your workplace at home.</li>
                          <div className="ml-2">
                            <li>
                              How do you respond when working under pressure?
                              Share your experience.
                            </li>
                            <li>
                              Is it okay for you to work overtime? Why or why
                              not?
                            </li>
                            <li>
                              What skills do you think are necessary to be a
                              successful remote worker?
                            </li>
                          </div>
                        </ol>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <SavingProgress
        open={doneRecording}
        onClose={() => setDoneRecording(false)}
      />
    </>
  );
};

export default VideoRecorder;
