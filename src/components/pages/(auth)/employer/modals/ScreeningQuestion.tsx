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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{question}</span>
          {recommended && (
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">Recommended</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {editable && (
            <button onClick={onEdit} className="text-savoy-blue hover:underline text-xs font-medium">Edit</button>
          )}
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 text-lg ml-2">×</button>
        </div>
      </div>
      {degree && (
        <div className="mt-2">
          <label className="text-xs text-gray-500 mr-2">Degree*</label>
          <input
            type="text"
            value={degree}
            className="border rounded px-2 py-1 text-sm"
            readOnly
          />
        </div>
      )}
      <div className="mt-2 text-sm">
        <span className="text-gray-500">Ideal answer:</span> <span className="text-gray-900">{idealAnswer}</span>
      </div>
      <div className="flex items-center mt-2 gap-2">
        <input
          type="checkbox"
          checked={mustHave}
          onChange={onToggleMustHave}
          id="mustHaveCheckbox"
        />
        <label htmlFor="mustHaveCheckbox" className="text-sm text-gray-700">Must–have qualification</label>
      </div>
    </div>
  );
};

export default ScreeningQuestion; 