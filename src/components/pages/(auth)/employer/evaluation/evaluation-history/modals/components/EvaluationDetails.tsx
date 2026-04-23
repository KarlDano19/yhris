import { useState, useEffect } from 'react';

interface EvaluationDetailsProps {
  evaluationHistoryDetails: any;
}

const EvaluationDetails = ({ evaluationHistoryDetails }: EvaluationDetailsProps) => {
  const [evaluationForm, setEvaluationForm] = useState<any[]>([]);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [evaluationCriterionIndex, setEvaluationCriterionIndex] = useState(0);

  const convertToRoman = (num: number): string => {
    // Define Roman numerals and their corresponding values
    const romanNumerals: { [key: string]: number } = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };

    let romanNumber = '';

    // Iterate through numerals in descending order
    for (const key in romanNumerals) {
      while (num >= romanNumerals[key]) {
        romanNumber += key;
        num -= romanNumerals[key];
      }
    }

    return romanNumber;
  };

  useEffect(() => {
    if (evaluationHistoryDetails && evaluationHistoryDetails.form_data) {
      setEvaluationForm(evaluationHistoryDetails.form_data);
    }
  }, [evaluationHistoryDetails]);

  return (
    <div>
      {evaluationForm.length > 0 && (
        <>
          <div className='border-2 rounded-lg mx-4 mt-4 mb-12'>
            {evaluationForm[currentFormIndex].section_title && (
              <div className='p-6 border-b-2'>
                <p className='text-[1.2rem] font-semibold'>
                  {convertToRoman(evaluationCriterionIndex + 1)}.{' '}
                  <span dangerouslySetInnerHTML={{ __html: evaluationForm[currentFormIndex].section_title }} />
                </p>
                <p dangerouslySetInnerHTML={{ __html: evaluationForm[currentFormIndex].section_description }} />
              </div>
            )}
            {evaluationForm[currentFormIndex].criterion.map((criterionItem: any, index: number) => (
              <div key={index} className='px-[1.55rem] py-4 border-b-2'>
                <div className='flex justify-between mb-2'>
                  <div>
                    {index + 1}.{' '}
                    <span dangerouslySetInnerHTML={{ __html: criterionItem.title }} />
                  </div>
                  <div>
                    <p className='text-base font-semibold'>Score:</p>
                    {criterionItem.score}
                    <span className='text-base'> / {criterionItem.max_score}</span>
                  </div>
                </div>
                {criterionItem.comment && (
                  <div className='flex justify-between mb-2'>
                    <div>
                      <p className='text-base font-semibold'>Comment:</p>
                      {criterionItem.comment}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className='py-4 px-4 flex justify-between'>
            {currentFormIndex > 0 && (
              <button
                className='bg-savoy-blue text-white px-4 py-2 rounded-md'
                onClick={() => setCurrentFormIndex(currentFormIndex - 1)}
              >
                Back
              </button>
            )}
            <div className='flex-1' />
            {currentFormIndex < evaluationForm.length - 1 && (
              <button
                onClick={() => setCurrentFormIndex(currentFormIndex + 1)}
                className='bg-savoy-blue text-white px-4 py-2 rounded-md'
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EvaluationDetails;
