import {
  Dispatch,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { T_SendNTEModal } from "@/types/globals";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";

export default function SignatureModal({
  isOpen,
  setIsOpen,
  setSignatureUrl,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  setSignatureUrl: any;
}) {
  const signatureCanvasRef = useRef<any>(null);
  const cancelButtonRef = useRef(null);

  const clearSignature = () => {
    signatureCanvasRef.current.clear();
  };

  const saveSignature = () => {
    const dataUrl = signatureCanvasRef.current.toDataURL();
    setSignatureUrl(dataUrl);
    setIsOpen(false);
  };

  return (
    <Transition.Root show={isOpen ? true : false} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={cancelButtonRef}
        onClose={() => setIsOpen(false)}
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Draw Signature
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                <div className="p-4">
                  <button
                    className="text-right w-full underline"
                    onClick={clearSignature}
                  >
                    Clear
                  </button>
                  <div className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 mt-2">
                    <SignatureCanvas
                      ref={signatureCanvasRef}
                      canvasProps={{
                        width: 900,
                        height: 200,
                        className: "",
                      }}
                    />
                  </div>
                </div>
                <hr />
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse px-4">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
                    onClick={saveSignature}
                  >
                    Sign
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
