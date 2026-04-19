'use client';

import { Fragment, useEffect, useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { PlusIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { EyeIcon } from '@heroicons/react/24/outline';

import DeleteIconNoBorder from '@/svg/DeleteIconNoBorder';
import MoveIcon from '@/svg/MoveIcon';

import PreviewPhaseModal from './PreviewPhaseModal';

export type T_ChecklistItem = {
  id: number;
  name: string;
  description: string;
  video_url: string;
};

export type T_ChecklistPhase = {
  id: number;
  name: string;
  description: string;
  checklists: T_ChecklistItem[];
  order: number;
  is_visible: boolean;
  phase_number: number | null;
};

type PhaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  phase: T_ChecklistPhase | null;
  onSave: (phase: Omit<T_ChecklistPhase, 'id'> & { id?: number }) => void;
  isLoading?: boolean;
};

const BLANK_ITEM: Omit<T_ChecklistItem, 'id'> = {
  name: '',
  description: '',
  video_url: '',
};

const TABS = [
  { step: 1, label: 'Phase Info' },
  { step: 2, label: 'Checklist Items' },
  { step: 3, label: 'Preview' },
];


const PhaseModal = ({ isOpen, onClose, phase, onSave, isLoading = false }: PhaseModalProps) => {
  const [activeTab, setActiveTab] = useState(1);
  const [previewItem, setPreviewItem] = useState<T_ChecklistItem | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<T_ChecklistItem[]>([]);
  const [nextItemId, setNextItemId] = useState(1000);

  useEffect(() => {
    setActiveTab(1);
    if (phase) {
      setName(phase.name);
      setDescription(phase.description);
      setItems(phase.checklists.map((i) => ({ ...i })));
    } else {
      setName('');
      setDescription('');
      setItems([]);
    }
  }, [phase, isOpen]);

  const addItem = () => {
    setItems((prev) => [...prev, { ...BLANK_ITEM, id: nextItemId }]);
    setNextItemId((n) => n + 1);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = <K extends keyof T_ChecklistItem>(id: number, key: K, value: T_ChecklistItem[K]) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [key]: value } : i)));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = [...items];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setItems(reordered);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      ...(phase ? { id: phase.id } : {}),
      name: name.trim(),
      description: description.trim(),
      checklists: items,
    });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-30' onClose={onClose}>
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
          <div className='flex min-h-full items-center justify-center p-4'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:scale-95'
            >
              <Dialog.Panel className='relative w-full max-w-3xl bg-white rounded-lg shadow-xl overflow-hidden'>
                {/* Header */}
                <div className='flex items-center gap-4 bg-savoy-blue p-3'>
                  <h3 className='flex-1 text-white font-semibold ml-2'>
                    {phase ? 'Edit Phase' : 'Add New Phase'}
                  </h3>
                  <XCircleIcon
                    className='w-8 h-8 text-white cursor-pointer flex-shrink-0'
                    onClick={onClose}
                  />
                </div>

                {/* Stepper */}
                <div className='flex items-center px-6 pt-5 pb-2'>
                  {TABS.map((tab, idx) => (
                    <Fragment key={tab.step}>
                      <div className='flex flex-col items-center'>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                            activeTab === tab.step
                              ? 'bg-savoy-blue border-savoy-blue text-white'
                              : activeTab > tab.step
                              ? 'bg-savoy-blue border-savoy-blue text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}
                        >
                          {tab.step}
                        </div>
                        <span
                          className={`mt-1 text-sm font-medium ${
                            activeTab >= tab.step ? 'text-savoy-blue' : 'text-gray-400'
                          }`}
                        >
                          {tab.label}
                        </span>
                      </div>
                      {idx < TABS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${
                            activeTab > tab.step ? 'bg-savoy-blue' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </Fragment>
                  ))}
                </div>

                {/* Body */}
                <div className='p-6 max-h-[72vh] overflow-y-auto space-y-5'>
                  {/* Tab 1: Phase Name & Description */}
                  {activeTab === 1 && (
                    <>
                      <div>
                        <label className='block text-base font-medium text-gray-700 mb-1'>
                          Phase Name <span className='text-red-500'>*</span>
                        </label>
                        <input
                          type='text'
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder='e.g. Account Setup'
                          className='w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-savoy-blue'
                        />
                      </div>

                      <div>
                        <label className='block text-base font-medium text-gray-700 mb-1'>
                          Phase Description
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder='Brief description of this phase'
                          rows={3}
                          className='w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-savoy-blue'
                        />
                      </div>
                    </>
                  )}

                  {/* Tab 2: Checklist Items */}
                  {activeTab === 2 && (
                    <div>
                      <div className='flex items-center justify-between mb-3'>
                        <label className='text-base font-medium text-gray-700'>
                          Checklist Items ({items.length})
                        </label>
                        <button
                          type='button'
                          onClick={addItem}
                          className='flex items-center gap-1 text-xs text-savoy-blue hover:underline font-medium'
                        >
                          <PlusIcon className='w-4 h-4' />
                          Add Item
                        </button>
                      </div>

                      {items.length === 0 && (
                        <p className='text-xs text-gray-400 text-center py-4 border border-dashed border-gray-300 rounded-lg'>
                          No items yet. Click "Add Item" to start.
                        </p>
                      )}

                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId='checklist-items'>
                          {(provided) => (
                            <div
                              className='space-y-3'
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {items.map((item, idx) => (
                                <Draggable key={item.id} draggableId={String(item.id)} index={idx}>
                                  {(dragProvided) => (
                                    <div
                                      ref={dragProvided.innerRef}
                                      {...dragProvided.draggableProps}
                                      className='border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3'
                                    >
                                      <div className='flex items-center justify-between mb-1'>
                                        <div className='flex items-center gap-2'>
                                          <span
                                            {...dragProvided.dragHandleProps}
                                            className='cursor-grab text-gray-400 hover:text-gray-600'
                                            title='Drag to reorder'
                                          >
                                            <MoveIcon />
                                          </span>
                                          <span className='text-sm font-semibold text-gray-500 uppercase tracking-wide'>
                                            Item {idx + 1}
                                          </span>
                                        </div>
                                        <button
                                          type='button'
                                          onClick={() => removeItem(item.id)}
                                          className='rounded hover:bg-red-100 text-red-500'
                                          title='Remove item'
                                        >
                                          <DeleteIconNoBorder />
                                        </button>
                                      </div>

                                      {/* Name */}
                                      <div>
                                        <label className='block text-sm font-medium text-gray-600 mb-1'>
                                          Name <span className='text-red-500'>*</span>
                                        </label>
                                        <input
                                          type='text'
                                          value={item.name}
                                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                          placeholder='e.g. Accept Invitation & Create Admin Account'
                                          className='w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-savoy-blue'
                                        />
                                      </div>

                                      {/* Description */}
                                      <div>
                                        <label className='block text-sm font-medium text-gray-600 mb-1'>
                                          Description
                                        </label>
                                        <input
                                          type='text'
                                          value={item.description}
                                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                          placeholder='Brief description of this task'
                                          className='w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-savoy-blue'
                                        />
                                      </div>

                                      {/* Video URL */}
                                      <div>
                                        <label className='block text-sm font-medium text-gray-600 mb-1'>
                                          Video URL
                                        </label>
                                        <input
                                          type='text'
                                          value={item.video_url}
                                          onChange={(e) => updateItem(item.id, 'video_url', e.target.value)}
                                          placeholder='https://youtube.com/...'
                                          className='w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-savoy-blue'
                                        />
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  )}

                  {/* Tab 3: Preview */}
                  {activeTab === 3 && (
                    <div className='space-y-4'>
                      <div className='bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-1'>
                        <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Phase Name</p>
                        <p className='text-sm font-semibold text-gray-800'>{name || '—'}</p>
                        {description && (
                          <>
                            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mt-2'>
                              Description
                            </p>
                            <p className='text-sm text-gray-700 break-words'>{description}</p>
                          </>
                        )}
                      </div>

                      <div>
                        <p className='text-sm font-medium text-gray-700 mb-2'>
                          Checklist Items ({items.length})
                        </p>
                        {items.length === 0 ? (
                          <p className='text-xs text-gray-400 text-center py-4 border border-dashed border-gray-300 rounded-lg'>
                            No checklist items added.
                          </p>
                        ) : (
                          <div className='space-y-2'>
                            {items.map((item, idx) => (
                              <div
                                key={item.id}
                                className='border border-gray-200 rounded-lg p-3 bg-gray-50'
                              >
                                <div className='flex items-start justify-between gap-2'>
                                  <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-medium text-gray-800 truncate'>
                                      {idx + 1}. {item.name || <span className='italic text-gray-400'>Untitled</span>}
                                    </p>
                                    {item.description && (
                                      <p className='text-xs text-gray-500 mt-0.5 break-words'>{item.description}</p>
                                    )}
                                  </div>
                                  <button
                                    type='button'
                                    onClick={() => setPreviewItem(item)}
                                    className='flex-shrink-0 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-savoy-blue'
                                    title='Preview item'
                                  >
                                    <EyeIcon className='w-4 h-4' />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className='flex items-center justify-between gap-3 p-4 border-t border-gray-200'>
                  <div>
                    {activeTab > 1 && (
                      <button
                        type='button'
                        onClick={() => setActiveTab((t) => t - 1)}
                        className='border border-savoy-blue rounded-lg py-2 px-5 text-savoy-blue text-sm font-semibold hover:bg-savoy-blue/10'
                      >
                        Back
                      </button>
                    )}
                  </div>

                  <div className='flex items-center gap-3'>
                    {activeTab < 3 ? (
                      <button
                        type='button'
                        onClick={() => setActiveTab((t) => t + 1)}
                        disabled={activeTab === 1 && !name.trim()}
                        className='bg-savoy-blue text-white rounded-lg py-2 px-6 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type='button'
                        onClick={handleSave}
                        disabled={isLoading || !name.trim()}
                        className='bg-savoy-blue text-white rounded-lg py-2 px-6 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        {isLoading ? 'Saving...' : phase ? 'Save Changes' : 'Add Phase'}
                      </button>
                    )}
                  </div>
                </div>
                <PreviewPhaseModal
                  previewItem={previewItem}
                  onClose={() => setPreviewItem(null)}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PhaseModal;
