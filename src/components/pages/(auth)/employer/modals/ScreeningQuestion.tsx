import React from 'react';

interface ScreeningQuestionProps {
  question: string;
  idealAnswer: string;
  degree?: string;
  mustHave: boolean;
  recommended?: boolean;
  onRemove: () => void;
  onToggleMustHave: () => void;
  editable: boolean;
  onEdit: () => void;
}

const ScreeningQuestion: React.FC<ScreeningQuestionProps> = ({
  question,
  idealAnswer,
  degree,
  mustHave,
  recommended,
  onRemove,
  onToggleMustHave,
  editable,
  onEdit,
}) => {
  return (
    <div className="bg-white border rounded-md p-4 mb-4 relative">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 text-base">{question}</span>
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
        <span className="text-gray-500 text-sm">Ideal answer:</span> <span className="text-gray-900 text-sm font-medium">{idealAnswer}</span>
      </div>
      <div className="flex items-center mt-3 gap-2 justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={mustHave}
            onChange={onToggleMustHave}
            id="mustHaveCheckbox"
            className="w-4 h-4"
          />
          <label htmlFor="mustHaveCheckbox" className="text-sm text-gray-700 font-medium">Must–have qualification</label>
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