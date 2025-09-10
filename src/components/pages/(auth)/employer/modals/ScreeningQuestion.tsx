import React from 'react';

interface ScreeningQuestionProps {
  question: string;
  idealAnswer: string | string[];
  degree?: string;
  mustHave: boolean;
  showToCandidates: boolean;
  recommended?: boolean;
  onRemove: () => void;
  onToggleMustHave: () => void;
  onToggleShowToCandidates: () => void;
  editable: boolean;
  onEdit: () => void;
  responseType?: string;
  options?: string[];
}

const ScreeningQuestion: React.FC<ScreeningQuestionProps> = ({
  question,
  idealAnswer,
  degree,
  mustHave,
  showToCandidates,
  recommended,
  onRemove,
  onToggleMustHave,
  onToggleShowToCandidates,
  editable,
  onEdit,
  responseType = 'Yes / No',
  options,
}) => {
  const renderIdealAnswer = () => {
    if (responseType === 'Text') {
      return <span className="text-gray-500 text-sm italic">No ideal answer required</span>;
    } else if (responseType === 'Multiple Choice' && Array.isArray(idealAnswer)) {
      if (idealAnswer.length === 0) {
        return <span className="text-gray-500 text-sm italic">No ideal answers selected</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {idealAnswer.map((answer, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium"
            >
              {answer}
            </span>
          ))}
        </div>
      );
    } else {
      // Color code Yes/No answers
      const answerColor = idealAnswer === 'Yes' ? 'text-green-600' : 'text-red-600';
      return <span className={`text-sm font-medium ${answerColor}`}>{idealAnswer as string}</span>;
    }
  };

  const renderOptions = () => {
    if (responseType === 'Multiple Choice' && options && options.length > 0) {
      return (
        <div className="mt-2">
          <span className="text-gray-500 text-sm">Options: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {options.map((option, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded ${
                  Array.isArray(idealAnswer) && idealAnswer.includes(option)
                    ? 'bg-green-100 text-green-800 font-medium'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {option}
              </span>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border rounded-md p-4 mb-4 relative">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 text-base">{question}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {responseType}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {editable && (
            <button onClick={onEdit} className="text-savoy-blue hover:underline text-sm font-medium">Edit</button>
          )}
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 text-xl ml-2">×</button>
        </div>
      </div>
      {degree && (
        <div className="mt-2">
          <label className="text-sm text-gray-500 mr-2">Degree*</label>
          <input
            type="text"
            value={degree}
            className="border rounded px-2 py-1 text-sm"
            readOnly
          />
        </div>
      )}
      <div className="mt-2 text-sm">
        <span className="text-gray-500 text-sm">Ideal answer:</span> {renderIdealAnswer()}
      </div>
      {renderOptions()}
      <div className="flex items-center mt-3 gap-2 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={mustHave}
              onChange={onToggleMustHave}
              id="mustHaveCheckbox"
              className="w-4 h-4"
            />
            <label className="text-sm text-gray-700 font-medium">Must–have qualification</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showToCandidates}
              onChange={onToggleShowToCandidates}
              id="showToCandidatesCheckbox"
              className="w-4 h-4"
            />
            <label className={`text-sm font-medium ${showToCandidates ? 'text-green-600' : 'text-red-600'}`}>
              Show to candidates
            </label>
          </div>
        </div>
        {recommended && (
          <div>
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded">Recommended</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreeningQuestion;