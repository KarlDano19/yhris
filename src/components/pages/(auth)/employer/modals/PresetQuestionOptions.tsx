import React from 'react';

interface PresetOption {
  id: string;
  label: string;
  selected?: boolean;
}

interface PresetQuestionOptionsProps {
  onSelectOption: (option: string) => void;
  selectedOptions: string[];
}

// Predefined questions for preset options
export const PRESET_QUESTIONS = {
  'background-check': {
    question: 'Do you consent to a background check?',
    idealAnswer: 'Yes',
    responseType: 'Yes / No',
  },
  'drivers-license': {
    question: 'Do you have a valid driver\'s license?',
    idealAnswer: 'Yes',
    responseType: 'Yes / No',
  },
  'drug-test': {
    question: 'Are you willing to take a drug test?',
    idealAnswer: 'Yes',
    responseType: 'Yes / No',
  },
  'education': {
    question: 'Have you completed the following level of education: Bachelor\'s Degree?',
    idealAnswer: 'Yes',
    responseType: 'Yes / No',
  },
  'expertise': {
    question: 'Do you have expertise with the required skills for this position?',
    idealAnswer: 'Yes',
    responseType: 'Yes / No',
  },
  'industry': {
    question: 'Do you have prior experience in this industry?',
    idealAnswer: 'Yes',
    responseType: 'Yes / No',
  },
  'language': {
    question: 'Are you fluent in English both written and verbal?',
    idealAnswer: 'Yes',
    responseType: 'Yes / No',
  },
  'location': {
    question: 'Are you located in or willing to relocate to the job location?',
    idealAnswer: 'Yes',
    responseType: 'Yes / No',
  },

  'urgent-hiring': {
    question: 'Are you available to start within the next two weeks if selected?',
    idealAnswer: 'Yes',
    responseType: 'Yes / No',
  },
  'visa-status': {
    question: 'Do you have the legal right to work in this country?',
    idealAnswer: 'Yes',
    responseType: 'Yes / No',
  }
};

const PresetQuestionOptions: React.FC<PresetQuestionOptionsProps> = ({ onSelectOption, selectedOptions }) => {
  const presetOptions: PresetOption[] = [
    { id: 'background-check', label: 'Background Check' },
    { id: 'drivers-license', label: 'Driver\'s License' },
    { id: 'drug-test', label: 'Drug Test' },
    { id: 'education', label: 'Education' },
    { id: 'expertise', label: 'Expertise with Skill' },
    { id: 'industry', label: 'Industry Experience' },
    { id: 'language', label: 'Language' },
    { id: 'location', label: 'Location' },
    { id: 'urgent-hiring', label: 'Urgent Hiring Need' },
    { id: 'visa-status', label: 'Visa Status' },
    { id: 'custom-question', label: 'Custom Question' },

  ];

  // Check if any custom questions are selected
  const hasCustomQuestions = selectedOptions.some(option => option.startsWith('custom-question'));

  return (
    <div className="mt-4">
      <p className="text-sm text-red-600 mb-3 font-medium">* At least 3 screening questions are required</p>
      <div className="flex flex-wrap gap-2">
        {presetOptions.map((option) => {
          const isSelected = option.id === 'custom-question' 
            ? hasCustomQuestions 
            : selectedOptions.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectOption(option.id)}
              className={`flex items-center px-3 py-2 text-sm border rounded-full ${
                isSelected 
                  ? 'bg-savoy-blue text-white border-blue-600 font-semibold' 
                  : option.id === 'custom-question'
                    ? 'bg-gray-100 text-gray-600 border-dashed border-gray-600 font-semibold'
                    : 'bg-blue-100 text-blue-600 border border-transparent font-semibold'
              }`}
            >
              {isSelected && (
                <span className="mr-1 text-white">✓</span>
              )}
              {!isSelected && (
                <span className="mr-1">+</span>
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PresetQuestionOptions; 