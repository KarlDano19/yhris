import {
  Dispatch,
  Fragment,
  useRef,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import SignatureCanvas from "react-signature-canvas";

import { XCircleIcon } from "@heroicons/react/24/solid";

export default function DrawSignatureModal({
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XCircleIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900 mb-4"
                    >
                      Draw Your Signature
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        Use your mouse or touch to draw your signature below.
                      </p>
                      <div className="border-2 border-gray-300 rounded-lg p-2">
                        <SignatureCanvas
                          ref={signatureCanvasRef}
                          canvasProps={{
                            className: "signature-canvas w-full h-32",
                            style: { border: "none" }
                          }}
                          backgroundColor="transparent"
                          penColor="black"
                        />
                      </div>
                      <div className="flex justify-between mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={clearSignature}
                        >
                          Clear
                        </button>
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => setIsOpen(false)}
                            ref={cancelButtonRef}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            onClick={saveSignature}
                          >
                            Save Signature
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
