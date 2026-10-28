import { Dispatch, useState } from 'react';

import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import Select from 'react-select';

import ModalLayout from '@/components/ModalLayout';
import CustomToast from '@/components/CustomToast';
import CustomDatePicker from '@/components/CustomDatePicker';
import DeleteModal, { DeleteModalData } from '@/components/DeleteModal';

import useUpdateApplicantOrient from '../hooks/useUpdateApplicantOrient';

import { MagnifyingGlassIcon, PlusIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { XMarkIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

import EditIcon from '@/svg/EditIcon';
import DeleteIcon from '@/svg/DeleteIcon';
import CheckIconWithBorder from '@/svg/CheckIconWithBorder';
import CloseIconWithBorder from '@/svg/CloseIconWithBorder';
import SelectChevronDown from '@/svg/SelectChevronDown';
import EyePassword from '@/svg/EyePassword';

type T_ChecklistItem = {
  id: string;
  requirement: string;
  status: 'completed' | 'pending' | 'n_a';
  date_completed: string | null;
  remarks: string;
  is_default: boolean;
  updated_by?: number | null;
  updated_by_name?: string | null;
  updated_at?: string | null;
  document_url?: string | null;
};

type T_EditDraft = {
  status: 'completed' | 'pending' | 'n_a';
  date_completed: string | null;
  remarks: string;
};

const STATUS_OPTIONS: { value: T_EditDraft['status']; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'n_a', label: 'N/A' },
];

const buildChecklistSummary = (items: T_ChecklistItem[]) => ({
  completed: items.filter((item) => item.status === 'completed').length,
  pending: items.filter((item) => item.status === 'pending').length,
  n_a: items.filter((item) => item.status === 'n_a').length,
  total: items.length,
});

const statusBadge = (status: string) => {
  if (status === 'completed') {
    return <span className='rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-medium'>Completed</span>;
  }
  if (status === 'n_a') {
    return <span className='rounded-full bg-gray-100 text-gray-500 px-3 py-1 text-xs font-medium'>N/A</span>;
  }
  return <span className='rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-xs font-medium'>Pending</span>;
};

export default function Checklist201Modal({
  selectedOrientId,
  orientItems,
  setOrientItems,
  isOpen,
  setIsOpen,
}: {
  selectedOrientId: string;
  orientItems: any[];
  setOrientItems: any;
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  const [search, setSearch] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newRequirementName, setNewRequirementName] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<T_EditDraft>({ status: 'pending', date_completed: null, remarks: '' });
  const [deleteModalData, setDeleteModalData] = useState<DeleteModalData | null>(null);
  const [viewingRemarksItem, setViewingRemarksItem] = useState<T_ChecklistItem | null>(null);

  const { mutate, isLoading } = useUpdateApplicantOrient();

  const selectedItem = orientItems.find((item: any) => item.id === selectedOrientId);
  const checklistItems: T_ChecklistItem[] = selectedItem?.checklist_items || [];
  const summary = buildChecklistSummary(checklistItems);
  const completionPercent = summary.total ? Math.round((summary.completed / summary.total) * 100) : 0;

  const handleClose = () => {
    setEditingItemId(null);
    setIsAddFormOpen(false);
    setNewRequirementName('');
    setSearch('');
    setIsOpen(false);
  };

  const persistChecklist = (updatedItems: T_ChecklistItem[], successMessage: string) => {
    const itemIndex = orientItems.findIndex((item: any) => item.id === selectedOrientId);
    if (itemIndex === -1) return;

    mutate(
      { id: selectedOrientId, actionType: 'update_checklist', checklist_items: updatedItems },
      {
        onSuccess: () => {
          const orientItemsCopy = JSON.parse(JSON.stringify(orientItems));
          orientItemsCopy[itemIndex].checklist_items = updatedItems;
          orientItemsCopy[itemIndex].checklist_summary = buildChecklistSummary(updatedItems);
          setOrientItems(orientItemsCopy);
          toast.custom(() => <CustomToast message={successMessage} type='success' />, { duration: 4000 });
        },
        onError: (err: any) => {
          toast.custom(() => <CustomToast message={err} type='error' />, { duration: 6000 });
        },
      }
    );
  };

  const startEditing = (item: T_ChecklistItem) => {
    setEditingItemId(item.id);
    setEditDraft({ status: item.status, date_completed: item.date_completed, remarks: item.remarks || '' });
  };

  const cancelEditing = () => {
    setEditingItemId(null);
  };

  const saveEditing = () => {
    const updatedItems = checklistItems.map((item) =>
      item.id === editingItemId
        ? { ...item, status: editDraft.status, date_completed: editDraft.date_completed, remarks: editDraft.remarks }
        : item
    );
    persistChecklist(updatedItems, 'Requirement updated successfully.');
    setEditingItemId(null);
  };

  const handleAddRequirement = () => {
    const trimmed = newRequirementName.trim();
    if (!trimmed) return;

    const isDuplicate = checklistItems.some(
      (item) => item.requirement.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      toast.custom(() => <CustomToast message='This requirement is already on the checklist.' type='error' />, { duration: 5000 });
      return;
    }

    const newItem: T_ChecklistItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      requirement: trimmed,
      status: 'pending',
      date_completed: null,
      remarks: '',
      is_default: false,
    };
    persistChecklist([...checklistItems, newItem], 'Requirement added successfully.');
    setNewRequirementName('');
    setIsAddFormOpen(false);
  };

  const handleDeleteConfirmed = () => {
    if (!deleteModalData?.id) return;
    const updatedItems = checklistItems.filter((item) => item.id !== deleteModalData.id);
    persistChecklist(updatedItems, 'Requirement removed successfully.');
    setDeleteModalData(null);
  };

  const matchesSearch = (item: T_ChecklistItem) => item.requirement.toLowerCase().includes(search.toLowerCase());
  const defaultItems = checklistItems.filter((item) => item.is_default && matchesSearch(item));
  const additionalItems = checklistItems.filter((item) => !item.is_default && matchesSearch(item));

  const renderRow = (item: T_ChecklistItem, displayIndex: number) => {
    const isEditing = editingItemId === item.id;

    return (
      <tr key={item.id}>
        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>{displayIndex}</td>
        <td className='px-3 py-4 text-sm text-gray-900 text-left'>
          <div className='flex items-center gap-1.5'>
            <span>{item.requirement}</span>
            {item.document_url && (
              <button
                type='button'
                onClick={() => window.open(item.document_url as string, '_blank', 'noopener,noreferrer')}
                className='flex-shrink-0 hover:opacity-75'
                data-tooltip-id='checklist-action-tooltip'
                data-tooltip-content='View submitted file'
                data-tooltip-place='top'
              >
                <EyePassword visible size={24} borderColor='#355FD0' strokeColor='#355FD0' maskId={`checklist-doc-${item.id}`} />
              </button>
            )}
          </div>
        </td>
        <td className='whitespace-nowrap px-3 py-4 text-sm'>
          {isEditing ? (
            <div className='w-28 mx-auto text-left'>
              <Select
                className='text-xs'
                classNamePrefix='select'
                options={STATUS_OPTIONS}
                value={STATUS_OPTIONS.find((option) => option.value === editDraft.status)}
                onChange={(selected) => setEditDraft({ ...editDraft, status: (selected?.value || 'pending') })}
                components={{
                  DropdownIndicator: () => (
                    <div className='pointer-events-none px-1'>
                      <SelectChevronDown />
                    </div>
                  ),
                  IndicatorSeparator: () => null,
                }}
                isClearable={false}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  menu: (base) => ({ ...base, zIndex: 9999, fontSize: '0.75rem' }),
                  control: (base) => ({ ...base, minHeight: '32px', fontSize: '0.75rem' }),
                  valueContainer: (base) => ({ ...base, padding: '0 6px' }),
                  singleValue: (base) => ({ ...base, fontSize: '0.75rem' }),
                  option: (base) => ({ ...base, fontSize: '0.75rem' }),
                }}
              />
            </div>
          ) : (
            statusBadge(item.status)
          )}
        </td>
        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
          {isEditing ? (
            <CustomDatePicker
              id={`checklist-date-${item.id}`}
              placeholder='mm/dd/yyyy'
              className='block w-36 rounded-md py-1.5 pl-3 pr-9 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-sm'
              selected={editDraft.date_completed ? new Date(editDraft.date_completed) : ''}
              pickerOnChange={(date: Date | null) =>
                setEditDraft({ ...editDraft, date_completed: date ? date.toLocaleDateString('en-CA') : null })
              }
              inputOnChange={() => {}}
            />
          ) : (
            item.date_completed || '—'
          )}
        </td>
        <td className='px-3 py-4 text-sm text-gray-500 text-left'>
          {isEditing ? (
            <input
              type='text'
              value={editDraft.remarks}
              onChange={(e) => setEditDraft({ ...editDraft, remarks: e.target.value })}
              className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-sm'
              placeholder='Remarks...'
            />
          ) : (
            <>
              <div className='flex items-center gap-1.5'>
                <span className='truncate max-w-[140px] inline-block align-middle'>{item.remarks || '—'}</span>
                {item.remarks && (
                  <button
                    type='button'
                    onClick={() => setViewingRemarksItem(item)}
                    className='text-gray-400 hover:text-savoy-blue flex-shrink-0'
                    data-tooltip-id='checklist-action-tooltip'
                    data-tooltip-content='Expand remarks'
                    data-tooltip-place='top'
                  >
                    <ArrowsPointingOutIcon className='w-4 h-4' />
                  </button>
                )}
              </div>
              {item.updated_by_name && (
                item.updated_by == null ? (
                  <span className='inline-flex items-center gap-1 mt-1 rounded-full bg-blue-50 text-blue-600 px-2 py-0.5 text-[11px] font-medium'>
                    <CheckCircleIcon className='w-3 h-3' /> Auto-verified
                  </span>
                ) : (
                  <p className='text-[11px] text-gray-400 mt-0.5 truncate max-w-[160px]'>Updated by {item.updated_by_name}</p>
                )
              )}
            </>
          )}
        </td>
        <td className='whitespace-nowrap px-3 py-4 text-sm'>
          <div className='flex gap-3 items-center justify-center'>
            {isEditing ? (
              <>
                <button
                  type='button'
                  onClick={saveEditing}
                  disabled={isLoading}
                  className='disabled:opacity-50 disabled:cursor-not-allowed'
                  data-tooltip-id='checklist-action-tooltip'
                  data-tooltip-content='Save changes'
                  data-tooltip-place='top'
                >
                  <CheckIconWithBorder />
                </button>
                <button
                  type='button'
                  onClick={cancelEditing}
                  disabled={isLoading}
                  className='disabled:opacity-50 disabled:cursor-not-allowed'
                  data-tooltip-id='checklist-action-tooltip'
                  data-tooltip-content='Cancel'
                  data-tooltip-place='top'
                >
                  <CloseIconWithBorder />
                </button>
              </>
            ) : (
              <>
                <button
                  type='button'
                  onClick={() => startEditing(item)}
                  disabled={isLoading}
                  className='disabled:opacity-50 disabled:cursor-not-allowed'
                  data-tooltip-id='checklist-action-tooltip'
                  data-tooltip-content='Edit requirement'
                  data-tooltip-place='top'
                >
                  <EditIcon />
                </button>
                <button
                  type='button'
                  onClick={() => setDeleteModalData({ open: true, id: item.id })}
                  disabled={isLoading}
                  className='disabled:opacity-50 disabled:cursor-not-allowed'
                  data-tooltip-id='checklist-action-tooltip'
                  data-tooltip-content='Delete requirement'
                  data-tooltip-place='top'
                >
                  <DeleteIcon />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <ModalLayout isOpen={isOpen} handleClose={handleClose} title='201 Checklist Monitoring' maxWidth='max-w-5xl'>
        <div className='px-6 pt-6 pb-2'>
          <p className='text-sm text-gray-500 -mt-2 mb-4'>
            Track and monitor the completion of 201 requirements for newly onboarded employees.
          </p>

          <div className='flex flex-col lg:flex-row lg:items-center gap-4 justify-between'>
            <div className='flex items-center gap-4'>
              <div
                className='relative w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0'
                style={{ background: `conic-gradient(#22c55e ${completionPercent}%, #e5e7eb ${completionPercent}% 100%)` }}
              >
                <div className='absolute inset-1.5 bg-white rounded-full flex items-center justify-center'>
                  <span className='text-xs font-bold text-gray-700'>{summary.completed}/{summary.total}</span>
                </div>
              </div>
              <div>
                <p className='font-semibold text-indigo-dye'>
                  {selectedItem?.firstname} {selectedItem?.lastname}
                </p>
                <div className='flex gap-3 text-xs text-gray-500 mt-1'>
                  <span className='flex items-center gap-1'><span className='w-2 h-2 rounded-full bg-green-500 inline-block' /> Completed {summary.completed}</span>
                  <span className='flex items-center gap-1'><span className='w-2 h-2 rounded-full bg-yellow-400 inline-block' /> Pending {summary.pending}</span>
                  <span className='flex items-center gap-1'><span className='w-2 h-2 rounded-full bg-gray-300 inline-block' /> N/A {summary.n_a}</span>
                </div>
              </div>
            </div>

            <div className='flex gap-2 items-center'>
              <div className='relative'>
                <input
                  type='text'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Search requirement...'
                  className='block w-56 rounded-md border-0 py-1.5 px-3 pr-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm'
                />
                <MagnifyingGlassIcon className='w-4 h-4 text-gray-400 absolute right-2.5 top-2.5' />
              </div>
              <button
                type='button'
                onClick={() => setIsAddFormOpen(true)}
                disabled={isLoading}
                className='inline-flex items-center gap-1 rounded-md bg-savoy-blue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
              >
              Add Requirement
              </button>
            </div>
          </div>
        </div>

        <div className='px-6 pb-2 max-h-[50vh] overflow-y-auto'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-300 text-center'>
              <thead>
                <tr>
                  <th scope='col' className='px-3 py-3 text-xs font-semibold text-gray-900'>#</th>
                  <th scope='col' className='px-3 py-3 text-xs font-semibold text-gray-900 text-left'>Requirement</th>
                  <th scope='col' className='px-3 py-3 text-xs font-semibold text-gray-900'>Status</th>
                  <th scope='col' className='px-3 py-3 text-xs font-semibold text-gray-900'>Date Completed</th>
                  <th scope='col' className='px-3 py-3 text-xs font-semibold text-gray-900 text-left'>Remarks</th>
                  <th scope='col' className='px-3 py-3 text-xs font-semibold text-gray-900'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {defaultItems.map((item, index) => renderRow(item, index + 1))}

                {additionalItems.length > 0 && (
                  <tr>
                    <td colSpan={6} className='bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-500'>
                      Additional Requirements (Added by HR)
                    </td>
                  </tr>
                )}
                {additionalItems.map((item, index) => renderRow(item, index + 1))}

                {defaultItems.length === 0 && additionalItems.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <h4 className='text-center text-gray-300 text-sm my-6'>No requirements match your search.</h4>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isAddFormOpen && (
          <div className='mx-6 mb-2 flex gap-2 items-center bg-gray-50 rounded-md p-3'>
            <input
              type='text'
              autoFocus
              value={newRequirementName}
              onChange={(e) => setNewRequirementName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddRequirement();
              }}
              placeholder='New requirement name...'
              className='flex-1 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm'
            />
            <button
              type='button'
              onClick={handleAddRequirement}
              className='rounded-md bg-savoy-blue px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90'
              disabled={isLoading}
            >
              Add
            </button>
            <button
              type='button'
              onClick={() => {
                setIsAddFormOpen(false);
                setNewRequirementName('');
              }}
              className='text-gray-400 hover:text-gray-600'
              data-tooltip-id='checklist-action-tooltip'
              data-tooltip-content='Cancel'
              data-tooltip-place='top'
            >
              <XMarkIcon className='w-5 h-5' />
            </button>
          </div>
        )}

        <div className='mx-6 mb-4 rounded-md bg-blue-50 px-4 py-3 text-xs text-blue-700'>
          The 201 checklist helps HR ensure all required documents and requirements are completed before the employee&apos;s deployment.
        </div>

        <div className='flex justify-center pb-6'>
          <button
            type='button'
            onClick={handleClose}
            className='rounded-md border border-blue-600 px-10 py-2 bg-white text-sm font-bold text-gray-700 hover:text-gray-500'
          >
            Close
          </button>
        </div>
      </ModalLayout>

      {deleteModalData?.open && (
        <DeleteModal
          isOpen={deleteModalData}
          setIsOpen={setDeleteModalData}
          onConfirm={handleDeleteConfirmed}
          isLoading={isLoading}
          customText='this requirement'
        />
      )}

      {viewingRemarksItem && (
        <ModalLayout
          isOpen={!!viewingRemarksItem}
          handleClose={() => setViewingRemarksItem(null)}
          title='Remarks'
          maxWidth='max-w-md'
        >
          <div className='px-6 py-6'>
            <p className='text-sm font-semibold text-gray-900 mb-2'>{viewingRemarksItem.requirement}</p>
            <p className='text-sm text-gray-700 whitespace-pre-wrap break-words'>{viewingRemarksItem.remarks}</p>
            {viewingRemarksItem.updated_by_name && (
              <p className='text-xs text-gray-400 mt-4'>Updated by {viewingRemarksItem.updated_by_name}</p>
            )}
          </div>
          <div className='flex justify-center pb-6'>
            <button
              type='button'
              onClick={() => setViewingRemarksItem(null)}
              className='rounded-md border border-blue-600 px-10 py-2 bg-white text-sm font-bold text-gray-700 hover:text-gray-500'
            >
              Close
            </button>
          </div>
        </ModalLayout>
      )}

      <Tooltip id='checklist-action-tooltip' />
    </>
  );
}
