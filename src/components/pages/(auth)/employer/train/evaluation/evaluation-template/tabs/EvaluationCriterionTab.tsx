'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useFieldArray } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

import CritiriaSubItem from './CritiriaSubItem';
import CustomToast from '@/components/CustomToast';

import AddCircleIcon from '@/svg/AddCircleIcon';
import DeleteIconNoBorder from '@/svg/DeleteIconNoBorder';
import MoveIcon from '@/svg/MoveIcon';
import DeleteSectionModal from '../modals/DeleteSectionModal';

function EvaluationCriterionTab({
  control,
  register,
  watch,
  setValue,
  handleSubmit,
  setSelectedTab,
  getValues,
}: {
  control: any;
  register: any;
  watch: any;
  setValue: any;
  handleSubmit: any;
  setSelectedTab: any;
  getValues: any;
}) {
  // ============================================================================
  // REFS AND STATE
  // ============================================================================
  const childrenRef = useRef<any>({});
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'evaluation_criterion',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentScoreSum, setCurrentScoreSum] = useState(0);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const totalScore = watch('total_score') || 0;
  const isScoreExceeded = currentScoreSum > totalScore;
  const remainingScore = totalScore - currentScoreSum;

  // ============================================================================
  // SCORE CALCULATION FUNCTIONS
  // ============================================================================
  
  /**
   * Main score calculation function - gets all scores from form state
   */
  const calculateScoreSum = useCallback(() => {
    const formValues = getValues();
    let total = 0;
    
    if (formValues.evaluation_criterion && Array.isArray(formValues.evaluation_criterion)) {
      formValues.evaluation_criterion.forEach((section: any) => {
        if (section.criterion && Array.isArray(section.criterion)) {
          section.criterion.forEach((criterion: any) => {
            const score = parseInt(criterion.max_score) || 0;
            total += score;
          });
        }
      });
    }
    
    setCurrentScoreSum(total);
  }, [getValues]);

  /**
   * Aggressive score recalculation with forced re-renders
   */
  const forceScoreRecalculation = useCallback(() => {
    calculateScoreSum();
    
    // Force multiple re-renders to ensure UI updates
    setTimeout(() => {
      calculateScoreSum();
    }, 0);
    setTimeout(() => {
      calculateScoreSum();
    }, 10);
  }, [calculateScoreSum]);

  // ============================================================================
  // FORM INITIALIZATION
  // ============================================================================
  
  /**
   * Initialize form structure and initial score calculation
   */
  useEffect(() => {
    const formValues = getValues();
    
    if (!formValues.evaluation_criterion || !Array.isArray(formValues.evaluation_criterion)) {
      return;
    }
    
    // Initialize if empty
    if (formValues.evaluation_criterion.length === 0) {
      setValue('evaluation_criterion', [
        {
          criterion: [
            {
              title: '',
              max_score: 1,
              is_disable_comment: true,
            },
          ],
        },
      ]);
    }
    
    // Force initial score calculation
    setTimeout(() => {
      forceScoreRecalculation();
    }, 100);
  }, [getValues, setValue, forceScoreRecalculation]);

  // ============================================================================
  // SCORE CALCULATION TRIGGERS
  // ============================================================================
  
  /**
   * Watch for form changes and recalculate scores
   */
  useEffect(() => {
    const subscription = watch((value: any, { name }: { name?: string }) => {
      if (name && name.startsWith('evaluation_criterion')) {
        // Force immediate recalculation on any form change
        forceScoreRecalculation();
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, forceScoreRecalculation]);

  /**
   * Recalculate when fields array changes (adding/removing sections/criteria)
   */
  useEffect(() => {
    forceScoreRecalculation();
  }, [fields, forceScoreRecalculation]);

  /**
   * Background score calculation every 100ms for reliability
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      forceScoreRecalculation();
    }, 100);
    
    return () => clearInterval(intervalId);
  }, [forceScoreRecalculation]);

  // ============================================================================
  // SECTION MANAGEMENT FUNCTIONS
  // ============================================================================
  
  /**
   * Add a new section with default criterion
   */
  const addSection = () => {
    if (currentScoreSum >= totalScore) {
      toast.custom(() => <CustomToast message={`Cannot add more sections. Total score limit (${totalScore}) has been reached.`} type='error' />, { duration: 4000 });
      return;
    }
    
    const newSectionIndex = fields.length;
    append({
      criterion: [
        {
          title: '',
          max_score: 1,
          is_disable_comment: true,
        },
      ],
    });
    
    // Ensure the new section is properly registered
    setTimeout(() => {
      setValue(`evaluation_criterion[${newSectionIndex}].criterion[0].max_score`, 1);
      setValue(`evaluation_criterion[${newSectionIndex}].criterion[0].title`, '');
      setValue(`evaluation_criterion[${newSectionIndex}].criterion[0].is_disable_comment`, true);
      
      forceScoreRecalculation();
      
      if (sectionRefs.current[newSectionIndex]) {
        sectionRefs.current[newSectionIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // ============================================================================
  // MODAL MANAGEMENT FUNCTIONS
  // ============================================================================
  
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

  // ============================================================================
  // DRAG AND DROP FUNCTIONS
  // ============================================================================
  
  /**
   * Handle reordering of sections
   */
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
    return {
      ...draggableStyle,
      background: isDragging ? '#fafafa' : '',
      top: 'auto !important',
      left: 'auto !important',
    };
  };

  // ============================================================================
  // FORM SUBMISSION
  // ============================================================================
  
  const onSubmit = handleSubmit(() => {
    if (isScoreExceeded) {
      toast.custom(() => <CustomToast message={`Cannot proceed: Total score exceeded! Current sum: ${currentScoreSum}, Total allowed: ${totalScore}. Please adjust individual criterion scores.`} type='error' />, { duration: 4000 });
      return;
    }
    setSelectedTab(4);
  });

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <form onSubmit={onSubmit}>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-6'>
        <div className='px-2 md:px-8 lg:px-4'>
          <div className='mt-8 flow-root'>
            <div className='mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <DeleteSectionModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onConfirm={handleConfirm} />
              <DragDropContext onDragEnd={reorder}>
                <Droppable droppableId='parent' type='parentContainer'>
                  {(provided: any) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {fields && fields.length > 0 && (fields || []).map((item: any, index: any) => {
                        return (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided: any, snapshot: any) => (
                              <div
                                ref={(el) => {
                                  provided.innerRef(el);
                                  sectionRefs.current[index] = el;
                                }}
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
                                      className={`flex items-center h-fit border rounded-xl p-2 space-y-2 mb-2 ${
                                        currentScoreSum >= totalScore 
                                          ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                                          : 'border-[#ACB9CB] cursor-pointer'
                                      }`}
                                      data-tooltip-id='add-section-tooltip'
                                      data-tooltip-content={
                                        currentScoreSum >= totalScore 
                                          ? 'Cannot add more sections. Total score limit reached.' 
                                          : 'Add section'
                                      }
                                      data-tooltip-place='left'
                                      onClick={() => currentScoreSum < totalScore && addSection()}
                                    >
                                      <div className={currentScoreSum >= totalScore ? 'text-gray-400' : ''}>
                                        <AddCircleIcon />
                                      </div>
                                    </div>
                                    <Tooltip id='add-section-tooltip' style={{ fontSize: '10px' }} />
                                    <div
                                      className='flex items-center h-fit border rounded-xl border-[#ACB9CB] p-2 space-y-2 mb-2 cursor-pointer'
                                      data-tooltip-id='delete-section-tooltip'
                                      data-tooltip-content='Delete section'
                                      data-tooltip-place='left'
                                      onClick={() => handleOpenModal(index)}
                                    >
                                      <DeleteIconNoBorder />
                                    </div>
                                    <Tooltip id='delete-section-tooltip' style={{ fontSize: '10px' }} />
                                  </div>
                                </div>
                                <CritiriaSubItem
                                  control={control}
                                  sectionIndex={index}
                                  setReorder={setReorder}
                                  register={register}
                                  watch={watch}
                                  setValue={setValue}
                                  totalScore={totalScore}
                                  currentScoreSum={currentScoreSum}
                                  onScoreChange={calculateScoreSum}
                                  forceScoreRecalculation={forceScoreRecalculation}
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
          
          {/* Score Summary Display */}
          <div className='mt-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <span className='text-sm font-medium text-gray-700'>Total Score Allowed:</span>
                <span className='text-lg font-bold text-blue-600'>{totalScore}</span>
              </div>
              <div className='flex items-center space-x-4'>
                <span className='text-sm font-medium text-gray-700'>Current Sum:</span>
                <span className={`text-lg font-bold ${isScoreExceeded ? 'text-red-600' : 'text-green-600'}`}>
                  {currentScoreSum}
                </span>
              </div>
              <div className='flex items-center space-x-4'>
                <span className='text-sm font-medium text-gray-700'>Remaining:</span>
                <span className={`text-lg font-bold ${remainingScore < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {remainingScore < 0 ? 'Exceeded' : remainingScore}
                </span>
              </div>
            </div>
            
            {isScoreExceeded && (
              <div className='mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm'>
                ⚠️ Total score exceeded! Please reduce individual criterion scores to stay within the limit.
              </div>
            )}
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
          disabled={isScoreExceeded}
          className={`w-auto rounded-md px-14 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            isScoreExceeded
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-savoy-blue text-white hover:bg-indigo-300'
          }`}
        >
          Next
        </button>
      </div>
    </form>
  );
}

export default EvaluationCriterionTab;
