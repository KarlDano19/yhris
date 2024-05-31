'use client';

import { useRef, useCallback } from 'react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useFieldArray } from 'react-hook-form';
import CritiriaSubItem from './CritiriaSubItem';

import AddCircleIcon from '@/svg/AddCircleIcon';
import DeleteIconNoBorder from '@/svg/DeleteIconNoBorder';
import MoveIcon from '@/svg/MoveIcon';

function EvaluationCriterionTab({
  control,
  register,
  watch,
  setValue,
  handleSubmit,
  setSelectedTab,
}: {
  control: any;
  register: any;
  watch: any;
  setValue: any;
  handleSubmit: any;
  setSelectedTab: any;
}) {
  const childrenRef = useRef<any>({});
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'evaluation_criterion',
  });

  const onSubmit = handleSubmit(() => {
    setSelectedTab(4);
  });

  const addSection = () => {
    append({
      criterion: [
        {
          title: '',
          max_score: 1,
          is_disable_comment: true,
        },
      ],
    });
  };

  const removeSection = (index: number) => {
    if (fields.length === 1) return;
    remove(index);
  };

  const reorder = (result: any) => {
    if (!result?.destination) return;
    const { source, destination, type } = result;
    const sourceIndex = source.index;
    const destIndex = destination.index;

    if (type === 'parentContainer') {
      move(sourceIndex, destIndex);
    } else if (type === 'childContainer' && source.droppableId) {
      const reorderChild = childrenRef.current[source.droppableId];
      if (reorderChild) {
        reorderChild(sourceIndex, destIndex);
      }
    }
  };

  const setReorder = useCallback(
    (index: any, reorderCallback: any) => {
      childrenRef.current[index] = reorderCallback;
    },
    [childrenRef]
  );

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => {
    const newStyle = {
      ...draggableStyle,
      background: isDragging ? '#fafafa' : '',
      top: 'auto !important',
      left: 'auto !important',
    };
    return newStyle;
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-6'>
        <div className='px-2 md:px-8 lg:px-4'>
          <div className='mt-8 flow-root'>
            <div className='mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <DragDropContext onDragEnd={reorder}>
                <Droppable droppableId='parent' type='parentContainer'>
                  {(provided: any) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {(fields || []).map((item: any, index: any) => {
                        return (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided: any, snapshot: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className='relative border-2 rounded-md mb-4 pb-3'
                                style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                              >
                                <div className='min-w-full flex py-2 sm:px-6 lg:px-8 space-y-6 space-x-4'>
                                  <div {...provided.dragHandleProps} className='pt-6'>
                                    <MoveIcon />
                                  </div>
                                  <div className='sm:col-span-4 mt-2 w-full border rounded-xl border-[#ACB9CB] py-6 px-4'>
                                    <input
                                      type='text'
                                      placeholder='Enter Section Title...'
                                      className='bg-transparent block w-full border-0 py-1.5 px-3 text-gray-900 border-b-2 placeholder:text-gray-400 sm:text-sm sm:leading-6 mb-6'
                                      defaultValue={item.section_title}
                                      {...register(`evaluation_criterion[${index}].section_title`)}
                                    />
                                    <input
                                      type='text'
                                      placeholder='Enter Section Description...'
                                      className='bg-transparent block w-full border-0 py-1.5 px-3 text-gray-900 border-b-2 placeholder:text-gray-400 sm:text-sm sm:leading-6 mb-4'
                                      defaultValue={item.section_description}
                                      {...register(`evaluation_criterion[${index}].section_description`)}
                                    />
                                  </div>
                                  <div className='flex flex-col'>
                                    <div
                                      className='flex items-center h-fit border rounded-xl border-[#ACB9CB] p-2 space-y-2 mb-2 cursor-pointer'
                                      onClick={() => addSection()}
                                    >
                                      <AddCircleIcon />
                                    </div>
                                    <div
                                      className='flex items-center h-fit border rounded-xl border-[#ACB9CB] p-2 space-y-2 mb-2 cursor-pointer'
                                      onClick={() => removeSection(index)}
                                    >
                                      <DeleteIconNoBorder />
                                    </div>
                                  </div>
                                </div>
                                <CritiriaSubItem
                                  control={control}
                                  sectionIndex={index}
                                  setReorder={setReorder}
                                  register={register}
                                  watch={watch}
                                  setValue={setValue}
                                />
                                {provided.placeholder}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className='flex justify-between py-4 px-4'>
        <button
          type='button'
          className='w-auto rounded-md bg-white border border-savoy-blue px-14 py-2.5 text-sm font-semibold text-savoy-blue shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          onClick={() => setSelectedTab(2)}
        >
          Back
        </button>
        <button
          type='submit'
          className='w-auto rounded-md bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default EvaluationCriterionTab;
