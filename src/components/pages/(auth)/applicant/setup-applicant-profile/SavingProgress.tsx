"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import SuccessPopAlert from "@/components/SuccessPopAlert";



interface SavingProgressProps {
  open: boolean;
  onClose: () => void;
}

const SavingProgress = ({ open, onClose }: SavingProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [successAlert, setSuccessAlert] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (open) {
      setProgress(0);

      interval = setInterval(() => {
        setProgress((prevProgress) => Math.min(prevProgress + 1, 101));
      }, 60);

      setTimeout(() => {
        clearInterval(interval);
        onClose();
        setSuccessAlert(true);
      }, 6000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [open]);

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
            <div className="flex min-h-full flex-col items-center justify-center">
              <h1 className="text-xl md:text-5xl text-white font-medium mb-10">
                Saving your recording...
              </h1>
              <div className="w-[70%] bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-[#FFC107] h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <SuccessPopAlert
        message="Successfully saved recording."
        open={successAlert}
        onClose={() => setSuccessAlert(false)}
      />
    </>
  );
};

export default SavingProgress;
