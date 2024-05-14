'use client';

import { useEffect } from 'react';

import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useFieldArray, useFormContext } from 'react-hook-form';

import IOSToggleButton from '@/components/buttons/IosToggleButton';
import DeleteIconNoBorder from '@/svg/DeleteIconNoBorder';
import MinusIcon from '@/svg/MinusIcon';
import PlusIcon from '@/svg/PlusIcon';
import DuplicateIcon from '@/svg/DuplicateIcon';
import MoveIcon from '@/svg/MoveIcon';

function SubItem({ control, sectionIndex, setReorder }: any) {
  const { register, setValue } = useFormContext();
  const { fields, append, move } = useFieldArray({
    control,
    name: `evaluation_criterion.${sectionIndex}.criterion`,
  });

  useEffect(() => {
    setReorder(`child-${sectionIndex}`, (from: any, to: any) => {
      move(from, to);
    });
  }, [sectionIndex, setReorder, move]);

  const addCriteria = () => {
    append({ title: '', max_score: 0, is_show_comment: false });
  };

  const getSubItemStyle = (isDragging: boolean, draggableStyle: any) => {
    const newStyle = {
      ...draggableStyle,
      top: 'auto !important',
      left: 'auto !important',
    };
    return newStyle;
  };

  return (
    <Droppable droppableId={`child-${sectionIndex}`} type='childContainer'>
      {(providedOther: any, snapshotOther: any) => (
        <div {...providedOther.droppableProps} ref={providedOther.innerRef}>
          <button className='border rounded-md px-2 py-4' type='button' onClick={() => addCriteria()}>
            Add question
          </button>
          {(fields || []).map((item: any, index: number) => {
            return (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(providedOther: any, snapshotOther: any) => (
                  <div
                    ref={providedOther.innerRef}
                    {...providedOther.draggableProps}
                    style={getSubItemStyle(snapshotOther.isDragging, providedOther.draggableProps.style)}
                  >
                    <div className='min-w-full flex py-2 sm:px-6 lg:px-8 space-y-6 space-x-4'>
                      <div {...providedOther.dragHandleProps} className='pt-6'>
                        <MoveIcon />
                      </div>
                      <div className='sm:col-span-4 mt-2 w-full border rounded-xl border-[#ACB9CB] py-6 px-4'>
                        <input
                          type='text'
                          placeholder='Enter criteria...'
                          className='block w-full border-0 py-1.5 px-3 text-gray-900 border-b-2 placeholder:text-gray-400  sm:text-sm sm:leading-6'
                          defaultValue={item.title}
                          {...register(`evaluation_criterion[${sectionIndex}].criterion[${index}].title`)}
                        />
                        <div className='flex flex-row px-2 py-4 space-x-8'>
                          <label className='text-slate-700 mt-5 text-sm'>How many points is this criteria?</label>
                          <div className='flex gap-4 items-center mt-4 text-center whitespace-nowrap text-slate-500'>
                            <div
                              className='hover:cursor-pointer p-2'
                              onClick={() => {
                                setValue(
                                  `evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`,
                                  (item.max_score -= 1)
                                );
                              }}
                            >
                              <MinusIcon />
                            </div>
                            <input
                              id='max-score'
                              type='number'
                              className='justify-center items-start self-stretch p-2 bg-white rounded-md border border-solid border-slate-400 w-[4rem] text-center'
                              defaultValue={item.max_score}
                              {...register(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`)}
                            />
                            <div
                              className='hover:cursor-pointer p-2'
                              onClick={() => {
                                setValue(
                                  `evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`,
                                  (item.max_score += 1)
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
                            <IOSToggleButton
                              checked={true}
                              onChange={(value) => {
                                setValue(
                                  `evaluation_criterion[${sectionIndex}].criterion[${index}].is_show_comment`,
                                  value
                                );
                              }}
                            />
                            <label className='text-slate-700 text-sm'>Disable comment for this criteria</label>
                          </div>
                          <div className='flex space-x-4'>
                            <DuplicateIcon />
                            <DeleteIconNoBorder />
                          </div>
                        </div>
                      </div>
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
  );
}

export default SubItem;
