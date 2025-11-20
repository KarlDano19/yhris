import { useState } from 'react';

import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

import Pagination from '@/components/Pagination';
import QuestionResponseBarChart from '../../charts-and-graphs/QuestionResponseBarChart';

interface PaginationState {
  totalRecords: number;
  totalPages: number;
}

interface DateFilter {
  from: any;
  to: any;
}

interface QuestionsTabProps {
  paginatedQuestions: any[];
  allQuestions: any[];
  pagination: PaginationState;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: any) => void;
  onPageSizeChange: (value: number) => void;
  dateFilter: DateFilter;
  departmentFilter: string[];
  templateResponseDetails: any;
}

const QuestionsTab = ({
  paginatedQuestions,
  allQuestions,
  pagination,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  dateFilter,
  departmentFilter,
  templateResponseDetails,
}: QuestionsTabProps) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleExpandAll = () => {
    const allQuestionIds = allQuestions.map((criterion: any) => 
      `${criterion.sectionId}-${criterion.criterionIndex}`
    );
    if (expandedQuestions.size === allQuestionIds.length) {
      setExpandedQuestions(new Set());
    } else {
      setExpandedQuestions(new Set(allQuestionIds));
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h4 className='text-lg font-semibold text-black'>Evaluation Questions & Employee Scores</h4>
        {allQuestions.length > 0 && (
          <button
            onClick={handleExpandAll}
            className='px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors'
          >
            {expandedQuestions.size === allQuestions.length ? 'Collapse All' : 'Expand All'}
          </button>
        )}
      </div>
      {paginatedQuestions.length > 0 ? (
        <>
          <div className='overflow-y-auto space-y-4'>
            {paginatedQuestions.map((criterion: any, index: number) => {
              const questionId = `${criterion.sectionId}-${criterion.criterionIndex}`;
              const isExpanded = expandedQuestions.has(questionId);
              const globalIndex = (currentPage - 1) * pageSize + index;
              
              return (
                <div key={questionId} className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
                  <button
                    onClick={() => toggleQuestion(questionId)}
                    className='w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left'
                  >
                    <div className='flex-1'>
                      <h5 className='text-sm font-medium text-gray-900 flex items-center gap-2'>
                        {isExpanded ? (
                          <ChevronDownIcon className='w-4 h-4 text-gray-500' />
                        ) : (
                          <ChevronRightIcon className='w-4 h-4 text-gray-500' />
                        )}
                        {globalIndex + 1}. {criterion.title}
                      </h5>
                      {criterion.max_score && (
                        <p className='text-xs text-gray-500 mt-0.5 ml-6'>Max Score: {criterion.max_score}</p>
                      )}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className='px-4 pb-4 pt-2 border-t border-gray-100'>
                      {criterion.employeeScores && criterion.employeeScores.length > 0 ? (
                        <QuestionResponseBarChart 
                          employeeScores={criterion.employeeScores}
                          questionText={criterion.title}
                          maxScore={criterion.max_score}
                        />
                      ) : (
                        <div className='text-center py-6 bg-gray-50 rounded'>
                          <p className='text-sm text-gray-500 italic mb-1'>
                            No scored responses available for this question
                          </p>
                          {(dateFilter.from || dateFilter.to || (departmentFilter && departmentFilter.length > 0)) && (
                            <p className='text-xs text-gray-400'>
                              Try adjusting your filters to see more responses
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Pagination
            pagination={pagination}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            onPageChange={onPageChange}
          />
        </>
      ) : (
        <div className='text-center py-8 bg-gray-50 rounded-lg'>
          <p className='text-sm text-gray-500 italic mb-2'>
            No evaluation questions found
          </p>
          <p className='text-xs text-gray-400'>
            {allQuestions.length === 0
              ? 'This template does not have completed evaluation questions yet.'
              : 'Loading evaluation questions...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionsTab;

