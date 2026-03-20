'use client';

import { useState } from 'react';

import Link from 'next/link';

import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/solid';

import toast from 'react-hot-toast';

import DeleteIcon from '@/svg/DeleteIcon';
import EditIcon from '@/svg/EditIcon';

import CustomToast from '@/components/CustomToast';

import PhaseModal, { T_ChecklistPhase } from './PhaseModal';
import useGetPhases from './hooks/useGetPhases';
import useCreatePhase from './hooks/useCreatePhase';
import useUpdatePhase from './hooks/useUpdatePhase';
import useDeletePhase from './hooks/useDeletePhase';

const Content = () => {
  const { data: phasesData, isLoading } = useGetPhases();

  const createPhase = useCreatePhase();
  const updatePhase = useUpdatePhase();
  const deletePhase = useDeletePhase();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<T_ChecklistPhase | null>(null);

  const openAdd = () => {
    setEditingPhase(null);
    setIsModalOpen(true);
  };

  const openEdit = (phase: T_ChecklistPhase) => {
    setEditingPhase(phase);
    setIsModalOpen(true);
  };

  const handleSave = (data: any) => {
    if (data.id !== undefined) {
      updatePhase.mutate(data, {
        onSuccess: () => {
          toast.custom(<CustomToast type='success' message='Phase updated successfully.' />);
          setIsModalOpen(false);
        },
        onError: () => toast.custom(<CustomToast type='error' message='Failed to update phase.' />),
      });
    } else {
      createPhase.mutate({ name: data.name, description: data.description, checklists: data.checklists }, {
        onSuccess: () => {
          toast.custom(<CustomToast type='success' message='Phase added successfully.' />);
          setIsModalOpen(false);
        },
        onError: () => toast.custom(<CustomToast type='error' message='Failed to create phase.' />),
      });
    }
  };

  const handleDelete = (id: number) => {
    deletePhase.mutate(id, {
      onSuccess: () => toast.custom(<CustomToast type='success' message='Phase deleted.' />),
      onError: () => toast.custom(<CustomToast type='error' message='Failed to delete phase.' />),
    });
  };

  const phases = phasesData || [];
  const totalItems = phases.reduce((sum, p) => sum + p.checklists.length, 0);

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex p-4'>
          <Link
            href='/admin/employer-onboarding'
            className='flex-none flex gap-3 items-center hover:bg-gray-200 px-2 py-1 rounded'
          >
            <ArrowLeftIcon className='h-5 w-5' />
            <h4>Back</h4>
          </Link>
        </div>

        <div className='px-2 md:px-8 lg:px-4'>
          {/* Page header */}
          <div className='flex items-start justify-between mb-6'>
            <div>
              <h1 className='text-xl font-bold text-indigo-dye'>Checklist Management</h1>
              <p className='text-sm text-gray-500 mt-1'>
                Configure onboarding phases and checklist items.
              </p>
            </div>
            <button
              type='button'
              onClick={openAdd}
              disabled={isLoading}
              className='flex items-center gap-2 bg-savoy-blue text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50'
            >
              <PlusIcon className='w-4 h-4' />
              Add Phase
            </button>
          </div>

          {/* Summary strip */}
          <div className='flex gap-6 mb-6 text-sm text-gray-500'>
            <span><span className='font-semibold text-gray-800'>{phases.length}</span> phases</span>
            <span><span className='font-semibold text-gray-800'>{totalItems}</span> total checklist items</span>
          </div>

          {/* Table */}
          <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
            {isLoading ? (
              <div className='text-center py-16 text-gray-400 text-sm'>Loading phases...</div>
            ) : phases.length === 0 ? (
              <div className='text-center py-16 text-gray-400 text-sm'>
                No phases yet. Click "Add Phase" to create one.
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200 text-sm'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='w-10 px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                        #
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                        Phase Name
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                        Description
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                        Items
                      </th>
                      <th className='px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {phases.map((phase, idx) => (
                      <tr key={phase.id} className='hover:bg-gray-50'>
                        {/* Order */}
                        <td className='px-3 py-4 text-center font-semibold text-gray-500'>
                          {idx + 1}
                        </td>

                        {/* Phase Name */}
                        <td className='px-4 py-4'>
                          <p className='font-semibold text-gray-800'>{phase.name}</p>
                        </td>

                        {/* Description */}
                        <td className='px-4 py-4 text-gray-500 max-w-xs'>
                          <p className='truncate'>{phase.description || '—'}</p>
                        </td>

                        {/* Items count */}
                        <td className='px-4 py-4'>
                          <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700'>
                            {phase.checklists.length} item{phase.checklists.length !== 1 ? 's' : ''}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className='px-4 py-4'>
                          <div className='flex items-center justify-center gap-2'>
                            <button
                              type='button'
                              onClick={() => openEdit(phase)}
                              className='p-1.5 rounded-lg hover:bg-blue-50'
                              title='Edit phase'
                            >
                              <EditIcon />
                            </button>
                            <button
                              type='button'
                              onClick={() => handleDelete(phase.id)}
                              className='p-1.5 rounded-lg hover:bg-red-50'
                              title='Delete phase'
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className='text-xs text-gray-400 mt-3'>
            Total phases: {phases.length} · Total items: {totalItems}
          </p>
        </div>
      </div>

      <PhaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        phase={editingPhase}
        onSave={handleSave}
      />
    </>
  );
};

export default Content;
