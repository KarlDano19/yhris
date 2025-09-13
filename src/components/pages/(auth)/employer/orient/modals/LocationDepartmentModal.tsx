import { Dispatch, Fragment, useRef, useState, useMemo } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import Select from 'react-select';

import CustomToast from '@/components/CustomToast';
import useGetLocationItems from '../../settings/general-settings/employees/hooks/location/useGetLocationItems';
import useGetDepartmentItems from '../../settings/general-settings/employees/hooks/department/useGetDepartmentItems';
import useUpdateApplicantOrient from '../hooks/useUpdateApplicantOrient';
import CreateModal from '../../settings/general-settings/employees/modals/CreateModal';

import { XCircleIcon } from '@heroicons/react/24/solid';
import SelectChevronDown from '@/svg/SelectChevronDown';

interface Field {
  onChange: (value: any) => void;
  value: any;
}

type FormValues = {
  location: string;
  department: string;
};

export default function LocationDepartmentModal({
  selectedOrientId,
  orientItems,
  setOrientItems,
  isOpen,
  setIsOpen,
  setSuccessModal,
}: {
  selectedOrientId: string;
  orientItems: any;
  setOrientItems: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  setSuccessModal: Dispatch<boolean>;
}) {
  const cancelButtonRef = useRef(null);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>();
  const { mutate, isLoading } = useUpdateApplicantOrient();
  
  // State for modals
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
  const [newlyAddedLocations, setNewlyAddedLocations] = useState<number[]>([]);
  const [newlyAddedDepartments, setNewlyAddedDepartments] = useState<number[]>([]);
  
  // Fetch locations and departments with parameters like the Position hook
  const { data: locationData, refetch: refetchLocations } = useGetLocationItems({ 
    pageSize: 1000,  // Large page size to get all locations
    currentPage: 1
  });
  
  const { data: departmentData, refetch: refetchDepartments } = useGetDepartmentItems({ 
    pageSize: 1000,  // Large page size to get all departments
    currentPage: 1
  });
  
  // Transform location data for react-select with separation for newly added locations
  const locationOptions = useMemo(() => {
    if (!locationData?.records) return [];
    
    const allLocations = locationData.records.map((location: any) => ({
      value: location.id,
      label: location.name,
      isNew: newlyAddedLocations.includes(location.id)
    }));
    
    // Separate newly added locations from regular locations
    const newLocations = allLocations.filter((loc: any) => loc.isNew);
    const regularLocations = allLocations.filter((loc: any) => !loc.isNew);
    
    // Create options with separation
    const options = [];
    
    // Add newly added locations at the top with "New" label
    if (newLocations.length > 0) {
      options.push({
        label: "New Locations",
        options: newLocations.map((loc: any) => ({
          ...loc,
          label: `${loc.label} (New)`
        })),
        isDisabled: true
      });
    }
    
    // Add separator if there are both new and regular locations
    if (newLocations.length > 0 && regularLocations.length > 0) {
      options.push({
        label: "───────────────",
        options: [],
        isDisabled: true
      });
    }
    
    // Add regular locations
    if (regularLocations.length > 0) {
      options.push({
        label: "All Locations",
        options: regularLocations,
        isDisabled: true
      });
    }
    
    return options;
  }, [locationData?.records, newlyAddedLocations]);
  
  // Transform department data for react-select with separation for newly added departments
  const departmentOptions = useMemo(() => {
    if (!departmentData?.records) return [];
    
    const allDepartments = departmentData.records.map((department: any) => ({
      value: department.id,
      label: department.name,
      isNew: newlyAddedDepartments.includes(department.id)
    }));
    
    // Separate newly added departments from regular departments
    const newDepartments = allDepartments.filter((dept: any) => dept.isNew);
    const regularDepartments = allDepartments.filter((dept: any) => !dept.isNew);
    
    // Create options with separation
    const options = [];
    
    // Add newly added departments at the top with "New" label
    if (newDepartments.length > 0) {
      options.push({
        label: "New Departments",
        options: newDepartments.map((dept: any) => ({
          ...dept,
          label: `${dept.label} (New)`
        })),
        isDisabled: true
      });
    }
    
    // Add separator if there are both new and regular departments
    if (newDepartments.length > 0 && regularDepartments.length > 0) {
      options.push({
        label: "───────────────",
        options: [],
        isDisabled: true
      });
    }
    
    // Add regular departments
    if (regularDepartments.length > 0) {
      options.push({
        label: "All Departments",
        options: regularDepartments,
        isDisabled: true
      });
    }
    
    return options;
  }, [departmentData?.records, newlyAddedDepartments]);

  const onSubmit = handleSubmit((data) => {
    const itemIndex = orientItems.findIndex((item: any) => item.id === selectedOrientId);
    const orientItemCopy = JSON.parse(JSON.stringify(orientItems));
    
    orientItemCopy[itemIndex].id = selectedOrientId;
    orientItemCopy[itemIndex].actionType = 'update_status';
    orientItemCopy[itemIndex].emailType = 'location_department';
    orientItemCopy[itemIndex].location_id = data.location;
    orientItemCopy[itemIndex].department_id = data.department;
    orientItemCopy[itemIndex].isLocationDepartmentAssigned = true;
    
    const callbackReq = {
      onSuccess: (data: any) => {
        setOrientItems([...orientItemCopy]);
        setIsOpen(false);
        setSuccessModal(true);
        reset();
        toast.custom(() => <CustomToast message={'Location and Department successfully assigned.'} type='success' />, {
          duration: 5000,
        });
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type='error' />, {
          duration: 7000,
        });
      },
    };
    
    mutate(orientItemCopy[itemIndex], callbackReq);
  });

  const handleAddLocation = () => {
    setIsAddLocationModalOpen(true);
  };

  const handleAddDepartment = () => {
    setIsAddDepartmentModalOpen(true);
  };

  const handleLocationCreated = () => {
    // Refresh locations list and get the latest location
    refetchLocations().then(() => {
      // Find the most recently created location (highest ID)
      if (locationData?.records && locationData.records.length > 0) {
        const latestLocation = locationData.records.reduce((prev: any, current: any) => 
          (prev.id > current.id) ? prev : current
        );
        setNewlyAddedLocations(prev => [...prev, latestLocation.id]);
      }
    });
  };

  const handleDepartmentCreated = () => {
    // Refresh departments list and get the latest department
    refetchDepartments().then(() => {
      // Find the most recently created department (highest ID)
      if (departmentData?.records && departmentData.records.length > 0) {
        const latestDepartment = departmentData.records.reduce((prev: any, current: any) => 
          (prev.id > current.id) ? prev : current
        );
        setNewlyAddedDepartments(prev => [...prev, latestDepartment.id]);
      }
    });
  };

  const handleAssignmentCompleted = () => {
    // Clear newly added locations and departments when assignment is completed
    setNewlyAddedLocations([]);
    setNewlyAddedDepartments([]);
  };

  // Call handleAssignmentCompleted when the form is submitted
  const onSubmitWithCleanup = handleSubmit((data: any) => {
    handleAssignmentCompleted();
    onSubmit(data);
  });

  return (
    <>
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-[600px] max-h-[90vh] overflow-y-auto'>
                  <div className='flex bg-savoy-blue p-2 items-center'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>Assign Location & Department</h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={() => setIsOpen(false)} />
                  </div>
                  <form onSubmit={onSubmitWithCleanup}>      
                    <div className='px-6 pt-6 pb-6'>
                      <div className='sm:col-span-4 mt-4'>
                        <div>
                          <div className='flex items-center justify-between'>
                            <label htmlFor='location' className='block text-sm font-medium leading-6 text-gray-900'>
                              Location
                              <span className='text-red-600'>*</span>
                            </label>
                            <button
                              type='button'
                              onClick={handleAddLocation}
                              className='text-sm text-savoy-blue hover:text-blue-700 font-medium'
                            >
                              + Add New Location
                            </button>
                          </div>
                          <div className='mt-2'>
                            <Controller
                              name='location'
                              control={control}
                              rules={{ required: "Please select a location" }}
                              render={({ field: { onChange, value } }: { field: Field }) => (
                                <Select
                                  className='text-sm'
                                  classNamePrefix='select'
                                  options={locationOptions}
                                  value={locationOptions.flatMap(group => group.options).find((item: any) => item.value === value)}
                                  onChange={(val) => onChange(val?.value || '')}
                                  components={{
                                    DropdownIndicator: () => (
                                      <div className='pointer-events-none px-2'>
                                        <SelectChevronDown />
                                      </div>
                                    ),
                                    IndicatorSeparator: () => null,
                                  }}
                                  isClearable={false}
                                  noOptionsMessage={() => 'No locations available'}
                                  placeholder='Select a location...'
                                  formatGroupLabel={(group) => (
                                    <div className="text-xs font-semibold text-gray-500 py-1">
                                      {group.label}
                                    </div>
                                  )}
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    menu: (base) => ({ ...base, zIndex: 9999 }),
                                  }}
                                />
                              )}
                            />
                            {errors.location && (
                              <p className='text-xs text-red-600 mt-1'>
                                {errors.location.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className='sm:col-span-4 mt-6'>
                        <div>
                          <div className='flex items-center justify-between'>
                            <label htmlFor='department' className='block text-sm font-medium leading-6 text-gray-900'>
                              Department
                              <span className='text-red-600'>*</span>
                            </label>
                            <button
                              type='button'
                              onClick={handleAddDepartment}
                              className='text-sm text-savoy-blue hover:text-blue-700 font-medium'
                            >
                              + Add New Department
                            </button>
                          </div>
                          <div className='mt-2'>
                            <Controller
                              name='department'
                              control={control}
                              rules={{ required: "Please select a department" }}
                              render={({ field: { onChange, value } }: { field: Field }) => (
                                <Select
                                  className='text-sm'
                                  classNamePrefix='select'
                                  options={departmentOptions}
                                  value={departmentOptions.flatMap(group => group.options).find((item: any) => item.value === value)}
                                  onChange={(val) => onChange(val?.value || '')}
                                  components={{
                                    DropdownIndicator: () => (
                                      <div className='pointer-events-none px-2'>
                                        <SelectChevronDown />
                                      </div>
                                    ),
                                    IndicatorSeparator: () => null,
                                  }}
                                  isClearable={false}
                                  noOptionsMessage={() => 'No departments available'}
                                  placeholder='Select a department...'
                                  formatGroupLabel={(group) => (
                                    <div className="text-xs font-semibold text-gray-500 py-1">
                                      {group.label}
                                    </div>
                                  )}
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    menu: (base) => ({ ...base, zIndex: 9999 }),
                                  }}
                                />
                              )}
                            />
                            {errors.department && (
                              <p className='text-xs text-red-600 mt-1'>
                                {errors.department.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-center w-full px-6 space-x-8 pt-8 pb-8'>
                      <span className='mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
                        <button
                          type='button'
                          className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-blue-600 px-20 py-2 bg-white text-base leading-6 font-bold text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                          onClick={() => setIsOpen(false)}
                        >
                          Cancel
                        </button>
                      </span>
                      <button
                        type='submit'
                        className='inline-flex w-full justify-center rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 sm:ml-3 sm:w-auto'
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <div role='status'>
                            <svg
                              aria-hidden='true'
                              className='inline w-6 h-6 mr-2 text-gray-200 animate-spin fill-blue-600'
                              viewBox='0 0 100 101'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                fill='currentColor'
                              />
                              <path
                                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                fill='currentFill'
                              />
                            </svg>
                            <span className='sr-only'>Loading...</span>
                          </div>
                        )}
                        {!isLoading && 'Assign'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
          {/* Location Creation Modal */}
        <CreateModal
            module='location'
            isOpen={isAddLocationModalOpen}
            setIsOpen={setIsAddLocationModalOpen}
            refetch={handleLocationCreated}
        />

        {/* Department Creation Modal */}
        <CreateModal
            module='department'
            isOpen={isAddDepartmentModalOpen}
            setIsOpen={setIsAddDepartmentModalOpen}
            refetch={handleDepartmentCreated}
      />
        </Dialog>
      </Transition.Root>

      
    </>
  );
} 