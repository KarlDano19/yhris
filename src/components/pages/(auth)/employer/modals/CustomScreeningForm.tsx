  import React, { useState, useEffect } from 'react';

  interface CustomScreeningFormProps {
    onCancel: () => void;
    onSave: (question: {
      question: string;
      responseType: string;
      idealAnswer: string | string[];
      mustHave: boolean;
      showToCandidates: boolean;
      id: number;
      options?: string[]; // For multiple choice questions
    }) => void;
    editMode?: boolean;
    initialData?: {
      id: number;
      question: string;
      responseType: string;
      idealAnswer: string | string[];
      mustHave: boolean;
      showToCandidates: boolean;
      options?: string[];
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
    const [idealAnswer, setIdealAnswer] = useState<string | string[]>('Yes');
    const [mustHave, setMustHave] = useState(false);
    const [showToCandidates, setShowToCandidates] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [options, setOptions] = useState<string[]>(['']);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const maxChars = 200;

    useEffect(() => {
      if (editMode && initialData) {

        setQuestion(initialData.question);
        setResponseType(initialData.responseType);
        setIdealAnswer(initialData.idealAnswer);
        setMustHave(initialData.mustHave);
        // Ensure showToCandidates is properly set, defaulting to true if not explicitly set to false
        setShowToCandidates(initialData.showToCandidates !== false);
        setCharCount(initialData.question.length);
        if (initialData.options) {
          setOptions(initialData.options);
        }
        if (Array.isArray(initialData.idealAnswer)) {
          setSelectedOptions(initialData.idealAnswer);
        }
      } else if (!editMode) {
        // Reset to defaults when not in edit mode
        setQuestion('');
        setResponseType('Yes / No');
        setIdealAnswer('Yes');
        setMustHave(false);
        setShowToCandidates(false);
        setCharCount(0);
        setOptions(['']);
        setSelectedOptions([]);
      }
    }, [editMode, initialData]);

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length <= maxChars) {
        setQuestion(value);
        setCharCount(value.length);
      }
    };

    const handleResponseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newResponseType = e.target.value;
      setResponseType(newResponseType);
      
      // Reset ideal answer based on response type
      if (newResponseType === 'Text') {
        setIdealAnswer('');
      } else if (newResponseType === 'Multiple Choice') {
        setIdealAnswer([]);
        setSelectedOptions([]);
      } else {
        setIdealAnswer('Yes');
      }
    };

    const handleOptionChange = (index: number, value: string) => {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
    };

    const addOption = () => {
      setOptions([...options, '']);
    };

    const removeOption = (index: number) => {
      if (options.length > 1) {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
        
        // Remove from selected options if it was selected
        const removedOption = options[index];
        setSelectedOptions(prev => prev.filter(option => option !== removedOption));
      }
    };

    const handleOptionSelection = (option: string) => {
      setSelectedOptions(prev => {
        if (prev.includes(option)) {
          return prev.filter(o => o !== option);
        } else {
          return [...prev, option];
        }
      });
    };

    const handleSave = () => {
      if (!question.trim()) return;
      
      let finalIdealAnswer: string | string[];
      
      if (responseType === 'Text') {
        finalIdealAnswer = '';
      } else if (responseType === 'Multiple Choice') {
        finalIdealAnswer = selectedOptions;
      } else {
        finalIdealAnswer = idealAnswer as string;
      }
      
      const questionData = {
        question: question.trim(),
        responseType,
        idealAnswer: finalIdealAnswer,
        mustHave,
        showToCandidates,
        id: initialData?.id || Date.now(),
        options: responseType === 'Multiple Choice' ? options.filter(opt => opt.trim()) : undefined,
      };
      
      onSave(questionData);
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
          Help keep Yahshua HRIS respectful and professional. 
          <a
            href="/post-job/screening-question-guideline"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 ml-1 hover:underline"
          >
            Read our custom question guidelines
          </a>.
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
              onChange={handleResponseTypeChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Yes / No">Yes / No</option>
              <option value="Text">Text</option>
              <option value="Multiple Choice">Multiple Choice</option>
            </select>
          </div>
          
          {responseType === 'Yes / No' && (
            <div>
              <label htmlFor="idealAnswer" className="block text-sm font-medium text-gray-700 mb-1">
                Ideal answer:
              </label>
              <select
                id="idealAnswer"
                value={idealAnswer as string}
                onChange={(e) => setIdealAnswer(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          )}
        </div>

        {/* Multiple Choice Options */}
        {responseType === 'Multiple Choice' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options<span className="text-red-600">*</span>
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionSelection(option)}
                  className="w-4 h-4 text-blue-600"
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  disabled={options.length === 1}
                  className="text-red-500 hover:text-red-700 disabled:text-gray-300"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Option
            </button>
            
            {selectedOptions.length > 0 && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selected ideal answers:
                </label>
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.map((option, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
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
          <label className="inline-flex items-center ml-6">
            <input
              type="checkbox"
              checked={showToCandidates}
              onChange={(e) => setShowToCandidates(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Show question to candidates</span>
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
            disabled={!question.trim() || (responseType === 'Multiple Choice' && options.filter(opt => opt.trim()).length < 2)}
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  export default CustomScreeningForm; 