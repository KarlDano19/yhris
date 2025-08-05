import React, { useState, useEffect } from 'react';

interface CustomScreeningFormProps {
  onCancel: () => void;
  onSave: (question: {
    question: string;
    responseType: string;
    idealAnswer: string;
    mustHave: boolean;
    id: number;
  }) => void;
  editMode?: boolean;
  initialData?: {
    id: number;
    question: string;
    responseType: string;
    idealAnswer: string;
    mustHave: boolean;
  };
}

const CustomScreeningForm: React.FC<CustomScreeningFormProps> = ({
  onCancel,
  onSave,
  editMode = false,
  initialData,
}) => {
  const [question, setQuestion] = useState('');
  const [responseType, setResponseType] = useState('Yes / No');
  const [idealAnswer, setIdealAnswer] = useState('Yes');
  const [mustHave, setMustHave] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 200;

  useEffect(() => {
    if (editMode && initialData) {
      setQuestion(initialData.question);
      setResponseType(initialData.responseType);
      setIdealAnswer(initialData.idealAnswer);
      setMustHave(initialData.mustHave);
      setCharCount(initialData.question.length);
    }
  }, [editMode, initialData]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setQuestion(value);
      setCharCount(value.length);
    }
  };

  const handleSave = () => {
    if (!question.trim()) return;
    
    onSave({
      question: question.trim(),
      responseType,
      idealAnswer,
      mustHave,
      id: initialData?.id || Date.now(),
    });
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Write a custom screening question.</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="mb-4 text-sm text-gray-600 flex items-start">
        <span className="text-blue-500 mr-2">ⓘ</span>
        Help keep LinkedIn respectful and professional. Learn about our
        <button type="button" className="text-blue-600 ml-1 hover:underline">
          custom question guidelines
        </button>.
      </div>
      
      <div className="mb-4">
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
          Question<span className="text-red-600">*</span>
        </label>
        <textarea
          id="question"
          value={question}
          onChange={handleQuestionChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {charCount}/{maxChars}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="responseType" className="block text-sm font-medium text-gray-700 mb-1">
            Response type:
          </label>
          <select
            id="responseType"
            value={responseType}
            onChange={(e) => setResponseType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Yes / No">Yes / No</option>
            <option value="Text">Text</option>
            <option value="Multiple Choice">Multiple Choice</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="idealAnswer" className="block text-sm font-medium text-gray-700 mb-1">
            Ideal answer:
          </label>
          <select
            id="idealAnswer"
            value={idealAnswer}
            onChange={(e) => setIdealAnswer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={responseType !== 'Yes / No'}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={mustHave}
            onChange={(e) => setMustHave(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-sm text-gray-700">Must–have qualification</span>
        </label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-savoy-blue rounded-md hover:opacity-90"
          disabled={!question.trim()}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CustomScreeningForm; 