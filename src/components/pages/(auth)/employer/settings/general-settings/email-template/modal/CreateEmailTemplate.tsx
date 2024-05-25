import { Dispatch, Fragment, useMemo, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon} from '@heroicons/react/24/solid';
import React from 'react';
import dynamic from "next/dynamic"
import 'react-quill/dist/quill.snow.css'

export default function EmailTemplateModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const [file, setFile] = useState<File | null>(null);
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }),[]);

  const toggleCc = () => {
    setShowCc(!showCc);
  };

  const toggleBcc = () => {
    setShowBcc(!showBcc);
  };

  const handleDrag = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setFile(e?.dataTransfer?.files[0]);
  };

  const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files) {
      setFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>Create Email Template</h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                {/* <form onSubmit={onSubmit}> */}
                <div className='px-4 pt-4 pb-6 space-x-10'>
                    <div className='sm:col-span-4 mt-2 w-full space-y-2'>
                      <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                        Subject<span className='text-red-600'> *</span>
                      </label>
                      <input
                        id='Subject'
                        type='text'
                        className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                      />
                      <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                        To<span className='text-red-600'> *</span>
                      </label>
                        <div className="relative">
                            <input
                            id="to"
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-24 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                                <button
                                    type="button"
                                    className="bg-gray-200 rounded-md px-2 py-1 text-xs"
                                    onClick={toggleCc}
                                >
                                    Cc
                                </button>
                                <button
                                    type="button"
                                    className="bg-gray-200 rounded-md px-2 py-1 text-xs"
                                    onClick={toggleBcc}
                                >
                                    Bcc
                                </button>
                            </div>
                        </div>
                        {showCc && (
                            <div>
                            <label htmlFor="cc" className="block text-sm font-medium leading-6 text-gray-900">
                                Cc<span className="text-red-600"></span>
                            </label>
                            <div className="relative">
                                <input
                                id="cc"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-24 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                                    <button
                                        type="button"
                                        className="bg-gray-200 rounded-md px-2 py-1 text-xs"
                                        onClick={toggleBcc}
                                    >
                                        Bcc
                                    </button>
                                </div>
                                </div>
                            </div>
                        )}

                        {showBcc && (
                            <div>
                            <label htmlFor="bcc" className="block text-sm font-medium leading-6 text-gray-900">
                                Bcc<span className="text-red-600"></span>
                            </label>
                            <input
                                id="bcc"
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            />
                            </div>
                        )}
                      <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                        Body<span className='text-red-600'> *</span>
                      </label>
                      {/* <textarea
                        id='Body'
                        rows={5}
                        className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                      /> */}
                      <ReactQuill theme="snow" value={value} onChange={setValue} />
                      <label htmlFor='reason' className='block text-sm font-medium leading-6 text-gray-900'>
                        Attachements<span className='text-red-600'></span>
                      </label>
                        <div className="">
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className='block w-full rounded-md border-0 py-14 px-3 text-[#ACB9CB] shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 text-center'
                            >
                                <label
                                    className={`${file === null
                                    ? "file-preview cursor-pointer hover:bg-blue hover:text-blue-600 text-base leading-normal"
                                    : "hidden"
                                    }`}>
                                    Drop file to upload
                                    <input
                                    name="csvUpload"
                                    id="csvUpload"
                                    ref={inputRef}
                                    type="file"
                                    className="sr-only"
                                    onChange={handleChange}
                                    />
                                </label>
                                <div
                                    className={`${file !== null ? "file-preview" : "hidden"
                                    }`}>
                                    <p className="text-sm text-slate-800 font-light">
                                    {file?.name}
                                    </p>
                                    <p
                                    className="underline text-blue-500 cursor-pointer"
                                    onClick={() => setFile(null)}>
                                    Remove File
                                    </p>
                                </div>
                            </div>
                            <h1 className="text-xs pl-2">Maximum file size: 10 mb</h1>
                        </div>
                </div>
                </div>
                <hr />
                  <div className='mt-5 sm:mt-4 sm:flex sm:flex-row px-4 justify-end space-x-4'>
                    <button
                      type='button'
                      className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue  hover:bg-gray-100 sm:mt-0 sm:w-auto'
                      onClick={() => setIsOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Close
                    </button>
                    <button
                      type='button'
                      className='mt-3 inline-flex w-full justify-center rounded-md bg-savoy-blue px-5 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-blue-400 sm:mt-0 sm:w-auto'
                      onClick={() => setIsOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Save
                    </button>
                  </div>
                {/* </form> */}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
