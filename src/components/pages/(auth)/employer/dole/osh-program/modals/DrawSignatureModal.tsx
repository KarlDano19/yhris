import {
    Dispatch,
    Fragment,
    useRef,
    useEffect,
  } from "react";

  import SignatureCanvas from "react-signature-canvas";
  import { Dialog, Transition } from "@headlessui/react";
  import { XCircleIcon } from "@heroicons/react/24/solid";

  export default function SignatureModal({
    isOpen,
    setIsOpen,
    setSignatureUrl,
    setPreviewUrl,
  }: {
    isOpen: boolean;
    setIsOpen: Dispatch<boolean>;
    setSignatureUrl: any;
    setPreviewUrl: (url: string) => void;
  }) {
    const signatureCanvasRef = useRef<any>(null);
    const cancelButtonRef = useRef(null);
  
    const clearSignature = () => {
      signatureCanvasRef.current.clear();
      setPreviewUrl('');
    };

    // Update preview whenever the signature changes
    useEffect(() => {
      const updatePreview = () => {
        if (signatureCanvasRef.current && !signatureCanvasRef.current.isEmpty()) {
          const dataUrl = signatureCanvasRef.current.toDataURL();
          setPreviewUrl(dataUrl);
        } else {
          setPreviewUrl('');
        }
      };

      if (signatureCanvasRef.current) {
        signatureCanvasRef.current.off('endStroke');
        signatureCanvasRef.current.on('endStroke', updatePreview);
        // Also update on mouseup/touchend to catch single strokes
        signatureCanvasRef.current.on('mouseup', updatePreview);
        signatureCanvasRef.current.on('touchend', updatePreview);
      }

      return () => {
        if (signatureCanvasRef.current) {
          signatureCanvasRef.current.off('endStroke');
          signatureCanvasRef.current.off('mouseup');
          signatureCanvasRef.current.off('touchend');
        }
      };
    }, [setPreviewUrl]);

    // Clear preview when modal is closed
    useEffect(() => {
      if (!isOpen) {
        setPreviewUrl('');
      }
    }, [isOpen, setPreviewUrl]);
  
    const saveSignature = () => {
      const dataUrl = signatureCanvasRef.current.toDataURL();
      
      // Convert data URL to File object
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "signature.png", { type: "image/png" });
      
      setSignatureUrl(file);
      setPreviewUrl(dataUrl); // Keep the preview visible after saving
      setIsOpen(false);
    };
  
    return (
      <Transition.Root show={isOpen ? true : false} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-full max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
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
                      className="text-right w-full underline text-sm sm:text-base"
                      onClick={clearSignature}
                    >
                      Clear
                    </button>
                    <div id="memo-canvas" className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 mt-2 overflow-x-auto">
                      <div className="w-full">
                        <SignatureCanvas
                          ref={signatureCanvasRef}
                          canvasProps={{
                            width: 900,
                            height: 200,
                            className: "mx-auto block rounded bg-white border",
                            style: { width: '100%', maxWidth: 900, height: 200 }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="mt-5 sm:mt-4 flex flex-col-reverse gap-2 sm:flex-row-reverse sm:gap-0 px-4">
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
  