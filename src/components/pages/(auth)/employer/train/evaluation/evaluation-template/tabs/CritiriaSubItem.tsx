'use client';

import { useEffect, useState } from 'react';

import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useFieldArray } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';

import DeleteIconNoBorder from '@/svg/DeleteIconNoBorder';
import MinusIcon from '@/svg/MinusIcon';
import PlusIcon from '@/svg/PlusIcon';
import DuplicateIcon from '@/svg/DuplicateIcon';
import MoveIcon from '@/svg/MoveIcon';
import AddCircleIcon from '@/svg/AddCircleIcon';
import DeleteCriteriaModal from '../modals/DeleteCriteriaModal';

function CritiriaSubItem({ control, sectionIndex, setReorder, register, watch, setValue }: any) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `evaluation_criterion.${sectionIndex}.criterion`,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setReorder(`child-${sectionIndex}`, (from: any, to: any) => {
      move(from, to);
    });
  }, [sectionIndex, setReorder, move]);

  const addCriteria = () => {
    append({ title: '', max_score: 1, is_disable_comment: true });
  };

  const copyCriteria = (criteria: any) => {
    append(criteria);
  };

  const removeCriteria = (index: number) => {
    if (fields.length === 1) return;
    remove(index);
  };

  const getSubItemStyle = (isDragging: boolean, draggableStyle: any) => {
    const newStyle = {
      ...draggableStyle,
      top: 'auto !important',
      left: 'auto !important',
    };
    return newStyle;
  };

  const handleOpenModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedIndex !== null && fields.length > 1) {
      remove(selectedIndex);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <DeleteCriteriaModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onConfirm={handleConfirm} />
      <Droppable droppableId={`child-${sectionIndex}`} type='childContainer'>
        {(providedOther: any) => (
          <div {...providedOther.droppableProps} ref={providedOther.innerRef}>
            <div
              className='absolute mt-[1.5rem] right-[2rem] flex items-center h-fit border rounded-xl border-[#ACB9CB] p-2 space-y-2 cursor-pointer'
              data-tooltip-id='add-criteria-tooltip'
              data-tooltip-content='Add criteria'
              data-tooltip-place='left'
              onClick={() => addCriteria()}
            >
              <AddCircleIcon />
            </div>
            <Tooltip id='add-criteria-tooltip' style={{ fontSize: '10px' }} />
            {(fields || []).map((item: any, index: number) => {
              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(providedOther: any, snapshotOther: any) => (
                    <div
                      ref={providedOther.innerRef}
                      {...providedOther.draggableProps}
                      style={getSubItemStyle(snapshotOther.isDragging, providedOther.draggableProps.style)}
                    >
                      <div className='min-w-full flex py-2 sm:px-6 lg:px-8 space-y-4 space-x-4'>
                        <div className='py-4' {...providedOther.dragHandleProps}>
                          <MoveIcon />
                        </div>
                        <div className='sm:col-span-4 w-full border rounded-xl border-[#ACB9CB] py-6 px-4 bg-white'>
                          <input
                            type='text'
                            placeholder='Enter criteria...'
                            className='bg-transparent block w-full border-0 py-1.5 px-3 text-gray-900 border-b-2 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                            defaultValue={item.title}
                            {...register(`evaluation_criterion[${sectionIndex}].criterion[${index}].title`)}
                          />
                          <div className='flex flex-row px-2 py-4 space-x-8'>
                            <label className='text-slate-700 mt-5 text-sm'>How many points is this criteria?</label>
                            <div className='flex gap-4 items-center mt-4 text-center whitespace-nowrap text-slate-500'>
                              <div
                                className='hover:cursor-pointer p-2'
                                onClick={() => {
                                  const currentMaxScore = parseInt(watch(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`));
                                  if (currentMaxScore > 0) {
                                    setValue(
                                      `evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`,
                                      currentMaxScore - 1
                                    );
                                  }
                                }}
                              >
                                <MinusIcon />
                              </div>
                              <input
                                id='max-score'
                                type='number'
                                min="0"
                                className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-transparent justify-center items-start self-stretch p-2 rounded-md border border-solid border-slate-400 w-[4rem] text-center'
                                defaultValue={item.max_score}
                                {...register(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`)}
                                onChange={e => {
                                  const value = parseInt(e.target.value);
                                  if (value < 0) {
                                    setValue(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`, 0);
                                  } else {
                                    setValue(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`, value);
                                  }
                                }}
                              />
                              <div
                                className='hover:cursor-pointer p-2'
                                onClick={() => {
                                  const currentMaxScore = parseInt(watch(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`));
                                  setValue(
                                    `evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`,
                                    currentMaxScore + 1
                                  );
                                }}
                              >
                                <PlusIcon />
                              </div>
                            </div>
                          </div>
                          <hr />
                          <div className='flex pt-4 justify-between'>
                            <div className='flex space-x-4 mt-1 ml-4'>
                              <div className='relative inline-block align-middle transition duration-200 ease-in'>
                                <input
                                  id={`toggle-${index}`}
                                  type='checkbox'
                                  name={`toggle-${index}`}
                                  {...register(
                                    `evaluation_criterion[${sectionIndex}].criterion[${index}].is_disable_comment`
                                  )}
                                />
                              </div>
                              <label className='text-slate-700 text-sm'>Disable comment for this criteria</label>
                            </div>
                            <div className='flex space-x-4'>
                              <div 
                                className='cursor-pointer'
                                data-tooltip-id='duplicate-criteria-tooltip'
                                data-tooltip-content='Duplicate criteria'
                                data-tooltip-place='top' 
                                onClick={() => copyCriteria(item)}
                              >
                                <DuplicateIcon />
                                <Tooltip id='duplicate-criteria-tooltip' style={{ fontSize: '10px', }} />
                              </div>
                              <div 
                                className='cursor-pointer'
                                data-tooltip-id='delete-criteria-tooltip'
                                data-tooltip-content='Delete criteria'
                                data-tooltip-place='top'  
                                // onClick={() => removeCriteria(index)}
                                onClick={() => handleOpenModal(index)}
                              >
                                <DeleteIconNoBorder />
                                <Tooltip id='delete-criteria-tooltip' style={{ fontSize: '10px', }} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='w-[3rem]'></div>
                      </div>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {providedOther.placeholder}
          </div>
        )}
      </Droppable>
    </>
  );
}

export default CritiriaSubItem;
