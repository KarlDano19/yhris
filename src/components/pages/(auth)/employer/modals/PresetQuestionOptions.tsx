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
  'hybrid-work': {
    question: 'Are you comfortable with a hybrid work arrangement (some days in office, some remote)?',
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
  'onsite-work': {
    question: 'Are you able to work onsite full-time at our office location?',
    idealAnswer: 'Yes',
    responseType: 'Yes / No',
  },
  'remote-work': {
    question: 'Do you have a suitable remote work setup with reliable internet connection?',
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
    { id: 'custom-question', label: 'Custom Question' },
    { id: 'background-check', label: 'Background Check' },
    { id: 'drivers-license', label: 'Driver\'s License' },
    { id: 'drug-test', label: 'Drug Test' },
    { id: 'education', label: 'Education' },
    { id: 'expertise', label: 'Expertise with Skill' },
    { id: 'hybrid-work', label: 'Hybrid Work' },
    { id: 'industry', label: 'Industry Experience' },
    { id: 'language', label: 'Language' },
    { id: 'location', label: 'Location' },
    { id: 'onsite-work', label: 'Onsite Work' },
    { id: 'remote-work', label: 'Remote Work' },
    { id: 'urgent-hiring', label: 'Urgent Hiring Need' },
    { id: 'visa-status', label: 'Visa Status' },

  ];

  return (
    <div className="mt-4">
      <p className="text-sm text-red-600 mb-3 font-medium">* At least 3 screening questions are required</p>
      <div className="flex flex-wrap gap-2">
        {presetOptions.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectOption(option.id)}
              className={`flex items-center px-3 py-2 text-sm border rounded-full ${
                isSelected 
                  ? 'bg-gray-100 border-gray-400 text-gray-800' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isSelected && (
                <span className="mr-1 text-green-600">✓</span>
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