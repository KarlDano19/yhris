'use client';

import React, { useEffect, useRef, useState } from 'react';

import toast from 'react-hot-toast';

import ModalLayout from '@/components/ModalLayout';
import CustomToast from '@/components/CustomToast';

import { PlusIcon, PaperClipIcon } from '@heroicons/react/24/outline';

import DeleteIcon from '@/svg/DeleteIcon';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

import useGetStageTasks from '../[id]/hooks/useGetStageTasks';
import useCreateStageTask from '../[id]/hooks/useCreateStageTask';
import useUpdateStageTask from '../[id]/hooks/useUpdateStageTask';
import useDeleteStageTask from '../[id]/hooks/useDeleteStageTask';
import useUploadStageTaskAttachment from '../[id]/hooks/useUploadStageTaskAttachment';

type Props = {
  separationId: string | number;
  stage: string;
  title?: string;
  onTasksChange?: (hasAny: boolean, allComplete: boolean) => void;
};

const StageTaskChecklist = ({ separationId, stage, title = 'Task Checklist', onTasksChange }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const { data: tasks = [], isLoading } = useGetStageTasks(separationId, stage);
  const { mutate: createTask, isLoading: isCreating } = useCreateStageTask(separationId, stage);
  const { mutate: updateTask } = useUpdateStageTask(separationId, stage);
  const { mutate: deleteTask } = useDeleteStageTask(separationId, stage);
  const { mutate: uploadAttachment } = useUploadStageTaskAttachment(separationId, stage);

  // Notify parent when task state changes
  useEffect(() => {
    if (!tasks) return;
    const hasAny = tasks.length > 0;
    const allComplete = hasAny && tasks.every((t: any) => t.is_checked);
    onTasksChange?.(hasAny, allComplete);
  }, [tasks]);

  useEffect(() => {
    if (isModalOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isModalOpen]);

  const handleOpenModal = () => { setInput(''); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setInput(''); };

  const handleFileChange = (taskId: number, file: File) => {
    uploadAttachment(
      { separationId, taskId, attachment: file },
      { onError: (err: any) => toast.custom(() => <CustomToast message={err.message} type='error' />, { duration: 4000 }) }
    );
  };

  const handleAddTask = () => {
    const label = input.trim();
    if (!label) return;
    createTask(
      { separationId, stage, label },
      {
        onSuccess: () => handleCloseModal(),
        onError: (err: any) => toast.custom(() => <CustomToast message={err.message} type='error' />, { duration: 4000 }),
      }
    );
  };

  const handleToggle = (taskId: number, currentChecked: boolean) => {
    updateTask(
      { separationId, taskId, is_checked: !currentChecked },
      { onError: (err: any) => toast.custom(() => <CustomToast message={err.message} type='error' />, { duration: 4000 }) }
    );
  };

  const handleDelete = (taskId: number) => {
    deleteTask(
      { separationId, taskId },
      { onError: (err: any) => toast.custom(() => <CustomToast message={err.message} type='error' />, { duration: 4000 }) }
    );
  };

  const completed = tasks.filter((t: any) => t.is_checked).length;

  return (
    <>
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
        <div className='flex items-center justify-between mb-3'>
          <div>
            <h3 className='text-sm font-semibold text-gray-900'>{title}</h3>
            {tasks.length > 0 && (
              <p className='text-xs text-gray-400 mt-0.5'>{completed} of {tasks.length} completed</p>
            )}
          </div>
          <button
            onClick={handleOpenModal}
            className='flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors'
          >
            <PlusIcon className='h-3.5 w-3.5' />
            ADD TASK
          </button>
        </div>

        {tasks.length > 0 && (
          <div className='w-full bg-gray-200 rounded-full h-1 mb-4'>
            <div
              className='h-1 rounded-full bg-green-500 transition-all duration-300'
              style={{ width: `${(completed / tasks.length) * 100}%` }}
            />
          </div>
        )}

        {isLoading ? (
          <p className='text-sm text-gray-400 text-center py-4'>Loading tasks...</p>
        ) : (
          <div className='space-y-2'>
            {tasks.map((task: any) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${task.is_checked ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200'}`}
              >
                <button onClick={() => handleToggle(task.id, task.is_checked)} className='flex-shrink-0'>
                  {task.is_checked ? (
                    <CheckCircleIcon className='h-5 w-5 text-green-500' />
                  ) : (
                    <div className='w-5 h-5 rounded border-2 border-gray-300 hover:border-green-400 transition-colors' />
                  )}
                </button>
                <span className={`flex-1 text-sm ${task.is_checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task.label}
                </span>
                {task.attachment ? (
                  <a
                    href={task.attachment}
                    target='_blank'
                    rel='noreferrer'
                    className='flex-shrink-0 text-xs text-blue-600 underline hover:text-blue-800'
                    title='View attachment'
                  >
                    View file
                  </a>
                ) : (
                  <>
                    <input
                      type='file'
                      className='hidden'
                      ref={(el) => { fileInputRefs.current[task.id] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileChange(task.id, file);
                        e.target.value = '';
                      }}
                    />
                    <button
                      onClick={() => fileInputRefs.current[task.id]?.click()}
                      className='flex-shrink-0 p-1 text-gray-300 hover:text-blue-400 transition-colors rounded'
                      title='Upload file'
                    >
                      <PaperClipIcon className='h-4 w-4' />
                    </button>
                  </>
                )}
                {!task.is_checked && (
                  <button
                    onClick={() => handleDelete(task.id)}
                    className='flex-shrink-0 p-1 text-gray-300 hover:text-red-400 transition-colors rounded'
                  >
                    <DeleteIcon />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {!isLoading && tasks.length === 0 && (
          <p className='text-sm text-gray-400 text-center py-4'>No tasks yet. Click + ADD TASK to get started.</p>
        )}
      </div>

      <ModalLayout isOpen={isModalOpen} handleClose={handleCloseModal} title='Add Task'>
        <div className='p-6 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Task Name <span className='text-red-500'>*</span>
            </label>
            <input
              ref={inputRef}
              type='text'
              value={input}
              placeholder='Enter task name...'
              className='w-full rounded-md border border-gray-300 py-2 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTask();
                if (e.key === 'Escape') handleCloseModal();
              }}
            />
          </div>
        </div>

        <div className='flex justify-end gap-3 px-6 py-4 border-t border-gray-100'>
          <button
            onClick={handleCloseModal}
            className='px-4 py-2 text-sm font-semibold text-[#355FD0] border border-[#355FD0] rounded-lg hover:bg-blue-50 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleAddTask}
            disabled={!input.trim() || isCreating}
            className='px-4 py-2 text-sm font-semibold text-white bg-[#355FD0] rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isCreating ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </ModalLayout>
    </>
  );
};

export default StageTaskChecklist;
