import { useState, useEffect } from 'react';
import classNames from '@/helpers/classNames';

interface EvaluationResponsesProps {
  evaluationHistoryDetails: any;
}

const EvaluationResponses = ({ evaluationHistoryDetails }: EvaluationResponsesProps) => {
  const [allResponses, setAllResponses] = useState<any[]>([]);

  useEffect(() => {
    if (evaluationHistoryDetails && evaluationHistoryDetails.form_data) {
      // Flatten all responses from all sections
      const responses: any[] = [];
      evaluationHistoryDetails.form_data.forEach((section: any, sectionIndex: number) => {
        section.criterion.forEach((criterionItem: any, criterionIndex: number) => {
          responses.push({
            sectionTitle: section.section_title || 'Section ' + (sectionIndex + 1),
            sectionDescription: section.section_description || '',
            criterionTitle: criterionItem.title,
            score: criterionItem.score,
            maxScore: criterionItem.max_score,
            comment: criterionItem.comment,
            criterionNumber: criterionIndex + 1,
            sectionNumber: sectionIndex + 1,
          });
        });
      });
      setAllResponses(responses);
    }
  }, [evaluationHistoryDetails]);

  const calculatePercentage = (score: number, maxScore: number): number => {
    if (maxScore === 0) return 0;
    return Math.round((score / maxScore) * 100);
  };

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Group responses by section
  const groupedResponses = allResponses.reduce((acc: any, response: any) => {
    const sectionKey = `${response.sectionNumber}-${response.sectionTitle}`;
    if (!acc[sectionKey]) {
      acc[sectionKey] = {
        title: response.sectionTitle,
        description: response.sectionDescription,
        sectionNumber: response.sectionNumber,
        responses: [],
      };
    }
    acc[sectionKey].responses.push(response);
    return acc;
  }, {});

  const sections = Object.values(groupedResponses);

  return (
    <div className='px-4 pb-4'>
      {/* Overall Summary */}
      {evaluationHistoryDetails && (
        <div className='bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200'>
          <h3 className='text-lg font-semibold mb-4 text-gray-900'>Evaluation Summary</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-gray-600'>Employee</p>
              <p className='text-base font-medium text-gray-900'>{evaluationHistoryDetails.employee_name}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Evaluation Date</p>
              <p className='text-base font-medium text-gray-900'>
                {evaluationHistoryDetails.date_of_evaluation
                  ? new Intl.DateTimeFormat('en-US').format(new Date(evaluationHistoryDetails.date_of_evaluation))
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Evaluation Period</p>
              <p className='text-base font-medium text-gray-900'>{evaluationHistoryDetails.evaluation_period || 'N/A'}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Evaluation Form</p>
              <p className='text-base font-medium text-gray-900'>{evaluationHistoryDetails.evaluation_form || 'N/A'}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Overall Score</p>
              <p
                className={classNames(
                  'text-base font-bold',
                  getScoreColor(
                    calculatePercentage(
                      evaluationHistoryDetails.form_total_score || 0,
                      evaluationHistoryDetails.total_score || 1
                    )
                  )
                )}
              >
                {evaluationHistoryDetails.form_total_score || 0} / {evaluationHistoryDetails.total_score || 0}
                <span className='text-sm ml-2'>
                  ({calculatePercentage(evaluationHistoryDetails.form_total_score || 0, evaluationHistoryDetails.total_score || 1)}
                  %)
                </span>
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Passing Score</p>
              <p className='text-base font-medium text-gray-900'>{evaluationHistoryDetails.passing_score || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Responses by Section */}
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold text-gray-900'>Detailed Responses</h3>
        {sections.length > 0 ? (
          sections.map((section: any, sectionIdx: number) => (
            <div key={sectionIdx} className='border border-gray-200 rounded-lg overflow-hidden'>
              <div className='bg-gray-100 px-6 py-4 border-b border-gray-200'>
                <h4 className='text-base font-semibold text-gray-900'>
                  Section {section.sectionNumber}: {section.title}
                </h4>
                {section.description && <p className='text-sm text-gray-600 mt-1'>{section.description}</p>}
              </div>
              <div className='divide-y divide-gray-200'>
                {section.responses.map((response: any, idx: number) => {
                  const percentage = calculatePercentage(response.score, response.maxScore);
                  return (
                    <div key={idx} className='px-6 py-4 hover:bg-gray-50 transition-colors'>
                      <div className='flex justify-between items-start mb-3'>
                        <div className='flex-1'>
                          <p className='text-sm font-medium text-gray-900'>
                            {response.criterionNumber}. {response.criterionTitle}
                          </p>
                        </div>
                        <div className='ml-4 text-right'>
                          <p className={classNames('text-lg font-bold', getScoreColor(percentage))}>
                            {response.score} / {response.maxScore}
                          </p>
                          <p className='text-xs text-gray-500'>{percentage}%</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className='mb-3'>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div
                            className={classNames('h-2 rounded-full transition-all', getProgressBarColor(percentage))}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Comment */}
                      {response.comment && (
                        <div className='mt-2'>
                          <p className='text-xs font-semibold text-gray-700 mb-1'>Comment:</p>
                          <p className='text-sm text-gray-600 bg-white p-3 rounded border border-gray-200'>
                            {response.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className='text-center py-8'>
            <p className='text-gray-500'>No response data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationResponses;
