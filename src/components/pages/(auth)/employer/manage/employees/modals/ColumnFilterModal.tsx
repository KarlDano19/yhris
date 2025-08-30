'use client';

import React, { useState, useEffect, useRef, Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { XCircleIcon } from '@heroicons/react/24/solid';

interface ColumnFilterModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  visibleColumns: Record<string, boolean>;
  onColumnToggle: (columnKey: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const columnDefinitions = [
  { key: 'date_hired', label: 'Date Hired' },
  { key: 'system_id', label: 'System ID' },
  { key: 'employee_id', label: 'Employee ID' },
  { key: 'firstname', label: 'First Name' },
  { key: 'middlename', label: 'Middle Name' },
  { key: 'lastname', label: 'Last Name' },
  { key: 'location', label: 'Location' },
  { key: 'position', label: 'Position' },
  { key: 'department', label: 'Department' },
  { key: 'email', label: 'Email' },
  { key: 'mobile', label: 'Contact No.' },
  { key: 'gender', label: 'Gender' },
  { key: 'address', label: 'Address' },
];

const ColumnFilterModal: React.FC<ColumnFilterModalProps> = ({
  isOpen,
  setIsOpen,
  visibleColumns,
  onColumnToggle,
  onReset,
  onApply,
}) => {
  const cancelButtonRef = useRef(null);
  const [tempVisibleColumns, setTempVisibleColumns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      setTempVisibleColumns({ ...visibleColumns });
    }
  }, [isOpen, visibleColumns]);

  const handleToggle = (columnKey: string) => {
    setTempVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const handleReset = () => {
    const defaultColumns: Record<string, boolean> = {
      date_hired: false,
      system_id: false,
      employee_id: false,
      firstname: true,
      middlename: true,
      lastname: true,
      location: true,
      position: true,
      department: true,
      email: true,
      mobile: false,
      gender: false,
      address: false,
    };
    setTempVisibleColumns(defaultColumns);
  };

  const handleApply = () => {
    // Update the parent component's state
    Object.keys(tempVisibleColumns).forEach(key => {
      if (tempVisibleColumns[key] !== visibleColumns[key]) {
        onColumnToggle(key);
      }
    });
    onApply();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempVisibleColumns({ ...visibleColumns });
    setIsOpen(false);
  };

  const selectedCount = Object.values(tempVisibleColumns).filter(Boolean).length;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={() => setIsOpen(false)}>
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
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all w-full mx-4 sm:my-8 sm:mx-8 sm:max-w-2xl'>
                <div className='flex bg-savoy-blue p-2 items-center'>
                  <h3 className='flex-1 text-white ml-2 font-semibold'>
                    Filter Columns ({selectedCount} of {columnDefinitions.length})
                  </h3>
                  <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                </div>
                <div className='mx-4 md:mx-6 my-4'>
                  <div className='px-2 sm:px-4 pt-4 pb-6'>
                    <div className='mb-4'>
                      <p className='text-sm text-gray-600'>
                        Select which columns to display in the table.
                      </p>
                    </div>

                    <div className='max-h-96 overflow-y-auto mb-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {columnDefinitions.map((column) => (
                          <label key={column.key} className='flex items-center space-x-3 cursor-pointer p-3 rounded-md hover:bg-gray-50'>
                            <input
                              type='checkbox'
                              checked={tempVisibleColumns[column.key] || false}
                              onChange={() => handleToggle(column.key)}
                              className='h-4 w-4 text-savoy-blue focus:ring-savoy-blue border-gray-300 rounded'
                            />
                            <span className='text-sm text-gray-700'>{column.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className='mt-5 sm:mt-4 flex flex-col-reverse sm:flex-row-reverse gap-3 px-2 sm:px-4'>
                    <button
                      onClick={handleApply}
                      className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                    >
                      Apply
                    </button>
                    <button
                      onClick={handleReset}
                      className='inline-flex w-full justify-center rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:w-auto'
                    >
                      Reset to Default
                    </button>
                    <button
                      type='button'
                      className='inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-savoy-blue shadow-sm ring-1 ring-inset ring-savoy-blue hover:bg-gray-50 sm:w-auto'
                      onClick={() => setIsOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ColumnFilterModal;
