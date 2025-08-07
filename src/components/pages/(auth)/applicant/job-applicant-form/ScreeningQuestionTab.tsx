'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import CustomToast from '@/components/CustomToast';
import { CheckIcon } from '@heroicons/react/24/solid';

function ScreeningQuestionTab({
  register,
  watch,
  setValue,
  handleSubmit,
  setCurrentTab,
  jobPostingData,
  nextTab,
}: {
  register: any;
  watch: any;
  setValue: any;
  handleSubmit: any;
  setCurrentTab: any;
  jobPostingData: any;
  nextTab: number;
}) {
  const [screeningQuestions, setScreeningQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (jobPostingData?.screening_questions) {
      setScreeningQuestions(jobPostingData.screening_questions);
      
      // Initialize form values for each question
      jobPostingData.screening_questions.forEach((question: any, index: number) => {
        setValue(`screeningAnswers.${index}.questionId`, question.id);
        setValue(`screeningAnswers.${index}.question`, question.question);
        setValue(`screeningAnswers.${index}.responseType`, question.responseType);
      });
    }
  }, [jobPostingData, setValue]);

  const onSubmit = handleSubmit((data: any) => {
    // Validate that all questions are answered
    let hasError = false;
    
    if (screeningQuestions.length > 0) {
      screeningQuestions.forEach((_, index) => {
        const answer = data.screeningAnswers?.[index]?.answer;
        if (!answer && answer !== false) {
          toast.custom(() => <CustomToast message='Please answer all screening questions' type='error' />, {
            duration: 7000,
          });
          hasError = true;
          return;
        }
      });
    }
    
    if (hasError) return;
    
    // If all questions are answered, proceed to next tab
    setCurrentTab(nextTab);
  });

  const renderQuestionInput = (question: any, index: number) => {
    switch (question.responseType) {
      case 'Yes / No':
        return (
          <div className="flex items-center space-x-6 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                id={`yes-${index}`}
                value="Yes"
                {...register(`screeningAnswers.${index}.answer`)}
                className="mr-2"
              />
              <label htmlFor={`yes-${index}`} className="text-sm">Yes</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id={`no-${index}`}
                value="No"
                {...register(`screeningAnswers.${index}.answer`)}
                className="mr-2"
              />
              <label htmlFor={`no-${index}`} className="text-sm">No</label>
            </div>
          </div>
        );
      case 'Text':
        return (
          <div className="mt-2">
            <textarea
              {...register(`screeningAnswers.${index}.answer`)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
              rows={3}
            />
          </div>
        );
      case 'Multiple Choice':
        return (
          <div className="mt-2 space-y-2">
            {question.options && question.options.map((option: string, optionIndex: number) => (
              <div key={optionIndex} className="flex items-center">
                <input
                  type="checkbox"
                  id={`option-${index}-${optionIndex}`}
                  value={option}
                  {...register(`screeningAnswers.${index}.answer`)}
                  className="mr-2"
                />
                <label htmlFor={`option-${index}-${optionIndex}`} className="text-sm">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case 'Number':
        return (
          <div className="mt-2">
            <input
              type="number"
              {...register(`screeningAnswers.${index}.answer`)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        );
      default:
        return (
          <div className="mt-2">
            <input
              type="text"
              {...register(`screeningAnswers.${index}.answer`)}
              className="rounded-md w-full border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:black sm:text-sm sm:leading-6"
            />
          </div>
        );
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h5 className="text-xl font-semibold">Screening Questions</h5>
      <p className="text-sm text-gray-600 mt-2 mb-6">
        Please answer the following questions related to this job position.
      </p>

      {screeningQuestions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No screening questions for this job posting.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {screeningQuestions.map((question, index) => (
            <div key={question.id || index} className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="flex-grow">
                  <div className="flex items-center">
                    <h6 className="text-sm font-medium text-gray-900">{question.question}</h6>
                    {question.mustHave && (
                      <span className="ml-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        Must-have
                      </span>
                    )}
                  </div>
                  {renderQuestionInput(question, index)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="md:flex justify-between mt-10 md:mt-16 lg:mt-28 md:mb-5">
        <button
          type="button"
          className="rounded-md w-full md:w-auto bg-white px-14 py-2.5 text-sm font-semibold text-savoy-blue border border-savoy-blue shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => setCurrentTab(1)}
        >
          BACK
        </button>
        <button
          type="submit"
          className="rounded-md w-full my-4 md:my-0 md:w-auto bg-savoy-blue px-14 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          NEXT
        </button>
      </div>
    </form>
  );
}

export default ScreeningQuestionTab;