'use client';

import { useState, useRef, useEffect, Fragment } from 'react';

import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import SignatureCanvas from 'react-signature-canvas';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string | File) => void;
  onTransparencyCheck?: (result: {hasTransparency: boolean, message: string, type: 'success' | 'warning' | 'error'}) => void;
}

export default function SignatureModal({ isOpen, onClose, onSave, onTransparencyCheck }: SignatureModalProps) {
  const [signatureMode, setSignatureMode] = useState<'draw' | 'upload'>('draw');
  const [uploadedSignature, setUploadedSignature] = useState<File | null>(null);
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const cancelButtonRef = useRef(null);
  
  // Clear signature canvas when opening modal
  useEffect(() => {
    if (isOpen && signatureRef.current) {
      signatureRef.current.clear();
    }
  }, [isOpen]);
  
  // Add body class to prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // Fallback method for getting signature data
  const getSignatureDataFallback = () => {
    try {
      if (!signatureRef.current) return null;
      
      // Try direct access to canvas element
      const canvas = (signatureRef.current as any)._canvas as HTMLCanvasElement;
      if (canvas) {
        return canvas.toDataURL('image/png');
      }
      return null;
    } catch (error) {
      console.error('Fallback signature method failed:', error);
      return null;
    }
  };

  // Check if image has transparency
  const checkImageTransparency = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (!event.target?.result) {
          resolve(false);
          return;
        }
        
        const img = new Image();
        img.onload = () => {
          // Create canvas to analyze image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            resolve(false);
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image to canvas
          ctx.drawImage(img, 0, 0);
          
          // Check pixels for transparency
          try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            
            // Check if any pixel has alpha < 255 (transparent)
            for (let i = 3; i < imageData.length; i += 4) {
              if (imageData[i] < 255) {
                resolve(true);
                return;
              }
            }
            
            resolve(false);
          } catch (error) {
            console.error('Error analyzing image:', error);
            resolve(false);
          }
        };
        
        img.src = event.target.result as string;
      };
      
      reader.readAsDataURL(file);
    });
  };

  const handleSaveSignature = () => {
    try {
      if (signatureMode === 'draw') {
        if (!signatureRef.current || signatureRef.current.isEmpty()) {
          if (onTransparencyCheck) {
            onTransparencyCheck({
              hasTransparency: false,
              message: 'Please draw your signature before saving.',
              type: 'error'
            });
          }
          return;
        }
        
        // Try primary method
        try {
          const canvas = signatureRef.current.getCanvas();
          const signatureData = canvas.toDataURL('image/png');
          if (signatureData) {
            onSave(signatureData);
            onClose();
            return;
          }
        } catch (e) {
          console.log('Primary signature method failed, trying fallback');
        }
        
        // Try fallback method
        const fallbackData = getSignatureDataFallback();
        if (fallbackData) {
          onSave(fallbackData);
          onClose();
          return;
        }
        
        if (onTransparencyCheck) {
          onTransparencyCheck({
            hasTransparency: false,
            message: 'Could not capture signature. Please try again or use the upload option.',
            type: 'error'
          });
        }
      } else if (signatureMode === 'upload' && uploadedSignature) {
        onSave(uploadedSignature);
        onClose();
      } else {
        if (onTransparencyCheck) {
          onTransparencyCheck({
            hasTransparency: false,
            message: 'Please upload a signature file before saving.',
            type: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error saving signature:', error);
      if (onTransparencyCheck) {
        onTransparencyCheck({
          hasTransparency: false,
          message: 'There was an error saving your signature. Please try again.',
          type: 'error'
        });
      }
    }
  };
  
  const handleClearSignature = () => {
    if (signatureMode === 'draw' && signatureRef.current) {
      signatureRef.current.clear();
    } else if (signatureMode === 'upload') {
      setUploadedSignature(null);
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size <= 2 * 1024 * 1024) { // Max 2MB
        // Check if the image has transparency
        const hasTransparency = await checkImageTransparency(file);
        
        if (onTransparencyCheck) {
          if (!hasTransparency) {
            onTransparencyCheck({
              hasTransparency,
              message: 'Warning: Image does not have transparency. For best results, use a PNG with transparent background.',
              type: 'warning'
            });
          } else {
            onTransparencyCheck({
              hasTransparency,
              message: 'Image with transparency detected. Good choice!',
              type: 'success'
            });
          }
        }
        
        setUploadedSignature(file);
      } else {
        if (onTransparencyCheck) {
          onTransparencyCheck({
            hasTransparency: false,
            message: 'File size exceeds 2MB limit.',
            type: 'error'
          });
        }
      }
    }
  };
  
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        initialFocus={cancelButtonRef}
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
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:max-w-lg w-full">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    {signatureMode === 'draw' ? 'Draw Signature' : 'Upload Signature'}
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={onClose}
                  />
                </div>
                
                <div className="p-4">
                  {/* Toggle between draw and upload */}
                  <div className="flex space-x-4 mb-4">
                    <button
                      onClick={() => setSignatureMode('draw')}
                      className={`px-4 py-2 rounded-md ${
                        signatureMode === 'draw' 
                          ? 'bg-savoy-blue text-white' 
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      Draw Signature
                    </button>
                    <button
                      onClick={() => setSignatureMode('upload')}
                      className={`px-4 py-2 rounded-md ${
                        signatureMode === 'upload' 
                          ? 'bg-savoy-blue text-white' 
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      Upload Signature
                    </button>
                  </div>
                  
                  {/* Clear button */}
                  <div className="text-right mb-2">
                    <button
                      className="underline text-savoy-blue"
                      onClick={handleClearSignature}
                    >
                      Clear
                    </button>
                  </div>
                  
                  {signatureMode === 'draw' ? (
                    <div className="block w-full rounded-md border border-gray-300 text-gray-900 sm:text-sm sm:leading-6">
                      <SignatureCanvas
                        ref={signatureRef}
                        canvasProps={{
                          width: 470,
                          height: 200,
                          className: "w-full h-full"
                        }}
                        backgroundColor="rgba(0,0,0,0)"
                        minWidth={1}
                        maxWidth={2}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="block w-full rounded-md border border-gray-300 text-gray-900 sm:text-sm sm:leading-6 p-6">
                        {uploadedSignature ? (
                          <div className="flex flex-col items-center w-full">
                            <img 
                              src={URL.createObjectURL(uploadedSignature)} 
                              alt="Signature Preview" 
                              className="max-h-32 object-contain mb-4"
                              style={{ background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC42/Ixj3wAAAC5JREFUOVFj+M/A8J+BArDBwMDAyIAi+XcANRhk+KjBA6fBoC8IA20wKMyJBQDoJTChCgkjAAAAAABJRU5ErkJggg==") repeat' }}
                            />
                            <div className="flex gap-3 mb-2">
                              <p className="text-sm text-green-600">
                                {uploadedSignature.name}
                              </p>
                              <label 
                                className="text-savoy-blue text-sm hover:underline focus:outline-none cursor-pointer"
                              >
                                Change
                                <input 
                                  type="file"
                                  accept="image/png,image/jpeg,image/gif"
                                  className="hidden"
                                  onChange={handleFileUpload}
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px]">
                            <div className="text-gray-400 mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="12" y1="18" x2="12" y2="12"></line>
                                <line x1="9" y1="15" x2="15" y2="15"></line>
                              </svg>
                            </div>
                            <label className="text-savoy-blue hover:underline focus:outline-none cursor-pointer">
                              Click to upload signature image
                              <input 
                                type="file"
                                accept="image/png,image/jpeg,image/gif"
                                className="hidden"
                                onChange={handleFileUpload}
                              />
                            </label>
                            <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 2MB</p>
                            <p className="text-xs text-gray-500 mt-1">For best results, use PNG with transparent background</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <hr />
                <div className="mt-4 sm:flex sm:flex-row-reverse px-4">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto"
                    onClick={handleSaveSignature}
                  >
                    {signatureMode === 'draw' ? 'Sign' : 'Upload'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
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