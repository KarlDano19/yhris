import { Fragment, useRef, useState, useEffect, useMemo } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { XCircleIcon } from '@heroicons/react/24/solid';
import 'react-quill/dist/quill.snow.css';

import CustomToast from '@/components/CustomToast';
import useGetPositionItems from '@/components/hooks/useGetPositionItems';
import CreateModal from '../../general-settings/employees/modals/CreateModal';
import EditModal from '../../general-settings/employees/modals/EditModal';

import SelectChevronDown from '@/svg/SelectChevronDownDummy';

interface OrgStructure {
  id: number | string; // Match OrgChart interface
  description: string;
  position_name: string;
  position?: number;
  parent?: number | null;
  parent_position_name?: string;
  order?: number;
  is_active?: boolean;
  children?: OrgStructure[];
  employees?: any[];
  primary_employee?: any;
  isAddButton?: boolean;
}

interface PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (positionName: string, description: string, positionId: number) => void;
  editingPosition?: OrgStructure;
  orgData?: OrgStructure | null;
}

export default function PositionModal({ isOpen, onClose, onSave, editingPosition, orgData }: PositionModalProps) {
  const cancelButtonRef = useRef(null);
  const [positionName, setPositionName] = useState(editingPosition?.position_name || '');
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddPositionModalOpen, setIsAddPositionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<{ id: number; open: boolean } | null>(null);

  // Fetch all positions for the dropdown (no pagination needed for select view type)
  const { data: positionData, refetch: refetchPositions } = useGetPositionItems();

  // Helper function to check if an item was created within 24 hours
  const isWithin24Hours = (createdAt: string | Date): boolean => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24;
  };

  // Helper function to collect all used position names from org structure
  const getUsedPositionNames = (node: OrgStructure): string[] => {
    const usedNames: string[] = [];
    if (node.position_name && !node.isAddButton) {
      usedNames.push(node.position_name);
    }
    if (node.children) {
      node.children.forEach(child => {
        usedNames.push(...getUsedPositionNames(child));
      });
    }
    return usedNames;
  };
  
  // Transform position data for react-select with separation for newly added positions
  const positionOptions = useMemo(() => {
    if (!positionData || !Array.isArray(positionData)) return [];
    
    // Get all used position names from the org structure
    const usedPositionNames = orgData ? getUsedPositionNames(orgData) : [];
    
    const allPositions = positionData
      .map((position: any) => ({
        value: position.id,
        label: position.name,
        createdAt: position.created_at,
        description: position.description,
        id: position.id
      }))
      .filter((position: any) => {
        // Filter out positions that are already used, unless we're editing this position
        if (editingPosition && position.label === editingPosition.position_name) {
          return true; // Allow the current position when editing
        }
        return !usedPositionNames.includes(position.label);
      });
    
    // Filter and sort newly added positions (within 24 hours of creation)
    const newPositions = allPositions
      .filter((pos: any) => isWithin24Hours(pos.createdAt))
      .sort((a: any, b: any) => {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return bDate.getTime() - aDate.getTime(); // Most recent first
      });
    
    // Filter and sort regular positions alphabetically
    const regularPositions = allPositions
      .filter((pos: any) => !isWithin24Hours(pos.createdAt))
      .sort((a: any, b: any) => a.label.localeCompare(b.label)); // Alphabetical order
    
    // Create options with separation
    const options = [];
    
    // Add newly added positions at the top with "New" label
    if (newPositions.length > 0) {
      options.push({
        label: "New Positions",
        options: newPositions.map((pos: any) => ({
          ...pos,
          label: `${pos.label}`
        })),
        isDisabled: true
      });
    }
    
    // Add separator if there are both new and regular positions
    if (newPositions.length > 0 && regularPositions.length > 0) {
      options.push({
        label: "───────────────",
        options: [],
        isDisabled: true
      });
    }
    
    // Add regular positions
    if (regularPositions.length > 0) {
      options.push({
        label: "All Positions",
        options: regularPositions,
        isDisabled: true
      });
    }
    
    return options;
  }, [positionData, orgData, editingPosition]);

  // Reset form when editing position changes
  useEffect(() => {
    setPositionName(editingPosition?.position_name || '');
    
    // Set selected position if editing
    if (editingPosition) {
      const flatOptions = positionOptions.flatMap(group => group.options);
      const foundPosition = flatOptions.find((pos: any) => 
        pos.label === editingPosition.position_name || pos.value === editingPosition.id
      );
      setSelectedPosition(foundPosition || null);
    } else {
      setSelectedPosition(null);
    }
  }, [editingPosition, positionOptions]);

  // Update selected position when position data changes (e.g., after editing description)
  useEffect(() => {
    if (selectedPosition) {
      const flatOptions = positionOptions.flatMap(group => group.options);
      const updatedPosition = flatOptions.find((pos: any) => pos.value === selectedPosition.value);
      if (updatedPosition && updatedPosition.description !== selectedPosition.description) {
        setSelectedPosition(updatedPosition);
      }
    }
  }, [positionData]);

  const handleAddPosition = () => {
    setIsAddPositionModalOpen(true);
  };

  const handlePositionCreated = () => {
    // Refresh positions list to get the updated data with new creation dates
    refetchPositions();
  };

  const handleEditDescription = () => {
    if (selectedPosition?.id) {
      setIsEditModalOpen({ id: selectedPosition.id, open: true });
    }
  };

  const handleEditModalClose = () => {
    // Refetch positions to get updated description
    refetchPositions();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPosition) {
      setIsLoading(true);
      try {
        // Description is now managed in the Position model, so we pass empty string
        onSave(selectedPosition.label, '', selectedPosition.value);
        setPositionName('');
        setSelectedPosition(null);
        onClose();
      } catch (error) {
        toast.custom(() => <CustomToast message='Failed to save position' type='error' />, {
          duration: 7000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={onClose}>
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
                <Dialog.Panel className='relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all sm:my-8 w-[500px]'>
                  <div className='flex bg-savoy-blue p-2 items-center rounded-t-lg'>
                    <h3 className='flex-1 text-white ml-2 font-semibold'>
                      {editingPosition ? 'Edit Position' : 'Select Position'}
                    </h3>
                    <XCircleIcon className='w-8 h-8 text-white cursor-pointer' onClick={onClose} />
                  </div>
                  <form onSubmit={handleSubmit}>      
                    <div className='px-4 pt-4 pb-6'>
                      <div className='flex items-center justify-between'>
                        <label htmlFor='position' className='block text-sm font-medium leading-6 text-gray-900'>
                          Position<span className='text-red-600'> *</span>
                        </label>
                        <button
                          type='button'
                          onClick={handleAddPosition}
                          className='text-sm text-savoy-blue hover:text-blue-700 font-medium'
                        >
                          + Add New Position
                        </button>
                      </div>
                      <div className='mt-2'>
                        <Select
                          className='text-sm'
                          classNamePrefix='select'
                          options={positionOptions}
                          value={selectedPosition}
                          onChange={(val) => setSelectedPosition(val)}
                          components={{
                            DropdownIndicator: () => (
                              <div className='pointer-events-none px-2'>
                                <SelectChevronDown />
                              </div>
                            ),
                            IndicatorSeparator: () => null,
                          }}
                          isClearable={false}
                          noOptionsMessage={() => 'No positions available'}
                          placeholder='Select a position...'
                          formatGroupLabel={(group) => (
                            <div className="text-xs font-semibold text-gray-500 py-1">
                              {group.label}
                            </div>
                          )}
                        />
                      </div>
                      
                      {/* Display Position Description */}
                      {selectedPosition && (
                        <div className='mt-4'>
                          <label className='block text-sm font-medium leading-6 text-gray-900 mb-2'>
                            Position Description
                          </label>
                          {selectedPosition.description ? (
                            <div 
                              className="ql-editor text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto cursor-pointer hover:border-savoy-blue transition-colors"
                              dangerouslySetInnerHTML={{ __html: selectedPosition.description }}
                              onClick={handleEditDescription}
                              title="Click to edit description"
                            />
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <p className="text-sm text-gray-500 mb-4">
                                No description available
                              </p>
                              <button
                                type="button"
                                onClick={handleEditDescription}
                                className="inline-flex items-center px-4 py-2 bg-savoy-blue text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Click here to edit
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className='flex justify-center w-full px-4 space-x-8 pt-4 pb-7'>
                      <span className='mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
                        <button
                          type='button'
                          ref={cancelButtonRef}
                          className='inline-flex justify-center drop-shadow-xl w-full rounded-md border border-blue-600 px-20 py-2 bg-white text-base leading-6 font-bold text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                          onClick={onClose}
                          disabled={isLoading}
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
                        {!isLoading && (editingPosition ? 'Update' : 'Assign')}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>

        {/* Position Creation Modal */}
        {isAddPositionModalOpen && (
        <CreateModal
          module='position'
          isOpen={isAddPositionModalOpen}
          setIsOpen={setIsAddPositionModalOpen}
          refetch={handlePositionCreated}
        />
        )}

        {/* Position Edit Modal */}
        {isEditModalOpen && (
          <EditModal
            module='position'
            refetch={handleEditModalClose}
            isOpen={isEditModalOpen}
            setIsOpen={setIsEditModalOpen}
          />
        )}
        </Dialog>
      </Transition.Root>
    </>
  );
};

