'use client';

import { useEffect, useState, useRef } from 'react';

import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useFieldArray } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';

import DeleteModal from '@/components/DeleteModal';

import DeleteIconNoBorder from '@/svg/DeleteIconNoBorder';
import MinusIcon from '@/svg/MinusIcon';
import PlusIcon from '@/svg/PlusIcon';
import DuplicateIcon from '@/svg/DuplicateIcon';
import MoveIcon from '@/svg/MoveIcon';
import AddCircleIcon from '@/svg/AddCircleIcon';

function CritiriaSubItem({ 
  control, 
  sectionIndex, 
  setReorder, 
  register, 
  watch, 
  setValue, 
  totalScore, 
  currentScoreSum, 
  onScoreChange, 
  forceScoreRecalculation 
}: any) {
  // ============================================================================
  // REFS AND STATE
  // ============================================================================
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `evaluation_criterion[${sectionIndex}].criterion`,
  });

  const [isModalOpen, setIsModalOpen] = useState<{ open: boolean } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const criteriaRefs = useRef<Array<HTMLDivElement | null>>([]);

  // ============================================================================
  // DRAG AND DROP SETUP
  // ============================================================================
  
  useEffect(() => {
    setReorder(`child-${sectionIndex}`, (from: any, to: any) => {
      move(from, to);
    });
  }, [sectionIndex, setReorder, move]);

  // ============================================================================
  // CRITERIA MANAGEMENT FUNCTIONS
  // ============================================================================
  
  /**
   * Add a new criterion to the current section
   */
  const addCriteria = () => {
    // Check if there's remaining score available
    const currentSum = fields.reduce((sum: number, criterion: any, index: number) => {
      const maxScore = watch(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`) || 0;
      return sum + maxScore;
    }, 0);
    
    if (currentSum >= totalScore) {
      return;
    }
    
    const newIndex = fields.length;
    append({ title: '', max_score: 1, is_disable_comment: true });
    
    // Ensure the new criterion is properly registered in the form
    setTimeout(() => {
      setValue(`evaluation_criterion[${sectionIndex}].criterion[${newIndex}].max_score`, 1);
      setValue(`evaluation_criterion[${sectionIndex}].criterion[${newIndex}].title`, '');
      setValue(`evaluation_criterion[${sectionIndex}].criterion[${newIndex}].is_disable_comment`, true);
      
      // Use the more direct score recalculation for immediate updates
      if (forceScoreRecalculation) {
        forceScoreRecalculation();
      }
      
      // Also trigger the regular score recalculation for consistency
      if (onScoreChange) {
        onScoreChange();
      }
      
      if (criteriaRefs.current[newIndex]) {
        criteriaRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
    
    // Force another recalculation after a longer delay to ensure form state is fully updated
    setTimeout(() => {
      if (forceScoreRecalculation) {
        forceScoreRecalculation();
      }
      if (onScoreChange) {
        onScoreChange();
      }
    }, 150);
  };

  /**
   * Duplicate an existing criterion
   */
  const copyCriteria = (criteria: any, index: number) => {
    // Get the current form values for this specific criteria index
    const currentTitle = watch(`evaluation_criterion[${sectionIndex}].criterion[${index}].title`);
    const currentMaxScore = watch(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`);
    const currentIsDisableComment = watch(`evaluation_criterion[${sectionIndex}].criterion[${index}].is_disable_comment`);
    
    // Create a new criteria object with the current values
    const newCriteria = {
      title: currentTitle || criteria.title,
      max_score: currentMaxScore || criteria.max_score,
      is_disable_comment: currentIsDisableComment !== undefined ? currentIsDisableComment : criteria.is_disable_comment,
    };
    
    append(newCriteria);
    
    setTimeout(() => {
      const lastIndex = fields.length;
      if (criteriaRefs.current[lastIndex]) {
        criteriaRefs.current[lastIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // ============================================================================
  // SCORE MANAGEMENT FUNCTIONS
  // ============================================================================
  
  /**
   * Handle changes to criterion max score
   */
  const handleMaxScoreChange = (index: number, newValue: number | string) => {
    // Handle empty string input (when user is clearing the field)
    if (newValue === '') {
      setValue(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`, '');
      return; // Don't recalculate score for empty input
    }
    
    // Handle numeric input
    const validValue = isNaN(newValue as number) ? 0 : Math.max(0, newValue as number);
    
    // Always update the form value immediately - no conditions
    setValue(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`, validValue);
    
    // Always trigger score recalculation immediately
    if (forceScoreRecalculation) {
      forceScoreRecalculation();
    }
    if (onScoreChange) {
      onScoreChange();
    }
  };

  // ============================================================================
  // MODAL MANAGEMENT FUNCTIONS
  // ============================================================================
  
  const handleOpenModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen({ open: true });
  };

  const handleConfirm = () => {
    if (selectedIndex !== null && fields.length > 1) {
      remove(selectedIndex);
    }
    setIsModalOpen(null);
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  const getSubItemStyle = (isDragging: boolean, draggableStyle: any) => {
    return {
      ...draggableStyle,
      top: 'auto !important',
      left: 'auto !important',
    };
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <>
      {isModalOpen && (
        <DeleteModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          onConfirm={handleConfirm}
          customText="this criteria"
        />
      )}
      {fields && fields.length > 0 && (
        <Droppable droppableId={`child-${sectionIndex}`} type='childContainer'>
          {(providedOther: any) => (
            <div {...providedOther.droppableProps} ref={providedOther.innerRef}>
              {(fields || []).map((item: any, index: number) => {
                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(providedOther: any, snapshotOther: any) => (
                      <div
                        ref={(el) => {
                          // Combine both refs: provided.innerRef for drag-and-drop, criteriaRefs for scrolling
                          providedOther.innerRef(el);
                          criteriaRefs.current[index] = el;
                        }}
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
                                    const currentMaxScore = parseInt(watch(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`)) || 0;
                                    if (currentMaxScore > 0) {
                                      handleMaxScoreChange(index, currentMaxScore - 1);
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
                                  value={watch(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`) ?? ''}
                                  onChange={e => {
                                    const value = e.target.value === '' ? '' : parseInt(e.target.value) || 0;
                                    handleMaxScoreChange(index, value);
                                  }}
                                  onBlur={e => {
                                    // When leaving the field, ensure it has a valid number
                                    const value = parseInt(e.target.value) || 0;
                                    setValue(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`, value);
                                    if (forceScoreRecalculation) {
                                      forceScoreRecalculation();
                                    }
                                  }}
                                />
                                <div
                                  className={`hover:cursor-pointer p-2 ${
                                    currentScoreSum >= totalScore ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  onClick={() => {
                                    if (currentScoreSum >= totalScore) return;
                                    const currentMaxScore = parseInt(watch(`evaluation_criterion[${sectionIndex}].criterion[${index}].max_score`)) || 0;
                                    handleMaxScoreChange(index, currentMaxScore + 1);
                                    if (forceScoreRecalculation) {
                                      forceScoreRecalculation();
                                    }
                                  }}
                                  style={{
                                    pointerEvents: currentScoreSum >= totalScore ? 'none' : 'auto'
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
                                  className={`cursor-pointer ${
                                    currentScoreSum >= totalScore ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  data-tooltip-id={`duplicate-criteria-tooltip-${sectionIndex}-${index}`}
                                  data-tooltip-content={
                                    currentScoreSum >= totalScore 
                                      ? 'Cannot duplicate criteria. Total score limit reached.' 
                                      : 'Duplicate criteria'
                                  }
                                  data-tooltip-place='top' 
                                  onClick={() => currentScoreSum < totalScore && copyCriteria(item, index)}
                                >
                                  <DuplicateIcon />
                                  <Tooltip id={`duplicate-criteria-tooltip-${sectionIndex}-${index}`} style={{ fontSize: '10px', }} />
                                </div>
                                <div 
                                  className='cursor-pointer'
                                  data-tooltip-id={`delete-criteria-tooltip-${sectionIndex}-${index}`}
                                  data-tooltip-content='Delete criteria'
                                  data-tooltip-place='top'  
                                  onClick={() => handleOpenModal(index)}
                                >
                                  <DeleteIconNoBorder />
                                  <Tooltip id={`delete-criteria-tooltip-${sectionIndex}-${index}`} style={{ fontSize: '10px' }} />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='w-[3rem]'></div>
                          {index === fields.length - 1 && (
                            <>
                              <div
                                className={`absolute mt-[1rem] right-[2rem] flex items-center h-fit border rounded-xl p-2 space-y-2 ${
                                  currentScoreSum >= totalScore 
                                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                                    : 'border-[#ACB9CB] cursor-pointer'
                                }`}
                                data-tooltip-id={`add-criteria-tooltip-${sectionIndex}-${index}`}
                                data-tooltip-content={
                                  currentScoreSum >= totalScore 
                                    ? 'Cannot add more criteria. Total score limit reached.' 
                                    : 'Add criteria'
                                }
                                data-tooltip-place='left'
                                onClick={() => currentScoreSum < totalScore && addCriteria()}
                              >
                                <div className={currentScoreSum >= totalScore ? 'text-gray-400' : ''}>
                                  <AddCircleIcon />
                                </div>
                              </div>
                              <Tooltip id={`add-criteria-tooltip-${sectionIndex}-${index}`} style={{ fontSize: '10px' }} />
                            </>
                          )}
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
      )}
    </>
  );
}

export default CritiriaSubItem;
