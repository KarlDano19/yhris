'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

import DeleteIcon from '@/svg/DeleteIcon';
import EditIcon from '@/svg/EditIcon';
import EyePassword from '@/svg/EyePassword';
import MoveIcon from '@/svg/MoveIcon';

import CustomToast from '@/components/CustomToast';

import PhaseModal, { T_ChecklistPhase } from '../modal/PhaseModal';
import useGetPhases from './hooks/useGetPhases';
import useCreatePhase from './hooks/useCreatePhase';
import useUpdatePhase from './hooks/useUpdatePhase';
import useDeletePhase from './hooks/useDeletePhase';
import useReorderPhases from './hooks/useReorderPhases';

const Content = () => {
  const { data: phasesData, isLoading } = useGetPhases();

  const createPhase = useCreatePhase();
  const updatePhase = useUpdatePhase();
  const deletePhase = useDeletePhase();
  const reorderPhases = useReorderPhases();

  const [phases, setPhases] = useState<T_ChecklistPhase[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<T_ChecklistPhase | null>(null);

  useEffect(() => {
    if (phasesData) setPhases(phasesData);
  }, [phasesData]);

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

  const handleToggleVisibility = (phase: T_ChecklistPhase) => {
    updatePhase.mutate(
      { ...phase, is_visible: !phase.is_visible },
      {
        onSuccess: () =>
          toast.custom(
            <CustomToast
              type='success'
              message={phase.is_visible ? 'Phase hidden.' : 'Phase is now visible.'}
            />
          ),
        onError: () =>
          toast.custom(<CustomToast type='error' message='Failed to update phase visibility.' />),
      }
    );
  };

  const onDragEnd = (result: any) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const reordered = [...phases];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Assign sequential order values and optimistically update local state
    const updated = reordered.map((p, idx) => ({ ...p, order: idx + 1 }));
    setPhases(updated);

    reorderPhases.mutate(
      updated.map((p) => ({ id: p.id, order: p.order })),
      {
        onError: () => {
          // Rollback on error
          if (phasesData) setPhases(phasesData);
          toast.custom(<CustomToast type='error' message='Failed to save new phase order.' />);
        },
      }
    );
  };

  const totalItems = phases.reduce((sum, p) => sum + p.checklists.length, 0);

  return (
    <>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8'>
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
                      <th className='w-8 px-3 py-3' />
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
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId='phases'>
                      {(provided) => (
                        <tbody
                          className='divide-y divide-gray-100'
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {phases.map((phase, idx) => (
                            <Draggable key={phase.id} draggableId={String(phase.id)} index={idx}>
                              {(dragProvided) => (
                                <tr
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  className={`hover:bg-gray-50 ${!phase.is_visible ? 'opacity-50' : ''}`}
                                >
                                  {/* Drag handle */}
                                  <td className='px-3 py-4 text-center text-gray-400'>
                                    <span
                                      {...dragProvided.dragHandleProps}
                                      className='cursor-grab hover:text-gray-600 flex justify-center'
                                      title='Drag to reorder'
                                    >
                                      <MoveIcon />
                                    </span>
                                  </td>

                                  {/* Phase number */}
                                  <td className='px-3 py-4 text-center font-semibold text-gray-500'>
                                    {phase.phase_number ?? '—'}
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
                                        onClick={() => handleToggleVisibility(phase)}
                                        className='rounded-lg hover:opacity-80'
                                        title={phase.is_visible ? 'Hide phase' : 'Show phase'}
                                      >
                                        <EyePassword visible={phase.is_visible} maskId={`eye-phase-${phase.id}`} />
                                      </button>
                                      <button
                                        type='button'
                                        onClick={() => openEdit(phase)}
                                        className='rounded-lg hover:opacity-80'
                                        title='Edit phase'
                                      >
                                        <EditIcon />
                                      </button>
                                      <button
                                        type='button'
                                        onClick={() => handleDelete(phase.id)}
                                        className='rounded-lg hover:opacity-80'
                                        title='Delete phase'
                                      >
                                        <DeleteIcon />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </tbody>
                      )}
                    </Droppable>
                  </DragDropContext>
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
