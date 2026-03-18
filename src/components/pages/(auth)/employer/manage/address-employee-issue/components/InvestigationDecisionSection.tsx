import React from 'react';

interface InvestigationDecisionSectionProps {
  decision: string | null;
  customDecision: string | null;
}

/**
 * Custom investigation decision section for Send Decision modal
 * Shows investigation decision with custom decision details
 * If decision is "Other", only display the custom decision
 */
const InvestigationDecisionSection = ({
  decision,
  customDecision,
}: InvestigationDecisionSectionProps) => {
  // Helper function to check if value is valid (not null, undefined, empty, or the string "undefined")
  const isValidValue = (value: string | null | undefined): boolean => {
    return !!value && value.trim() !== '' && value !== 'undefined';
  };

  // If decision is "Other", display custom decision instead
  const isOther = decision?.toLowerCase().includes('other');
  const validCustomDecision = isValidValue(customDecision) ? customDecision : null;
  const displayText = isOther && validCustomDecision ? validCustomDecision : decision;

  return (
    <div className="border-t pt-4">
      <label className='block text-sm font-medium leading-6 text-gray-900'>
        Investigation Decision
      </label>
      <div className="mt-2 pl-2 flex items-start gap-2">
        <span className="text-sm text-gray-600 mt-0.5">•</span>
        <div className="flex-1">
          <span className="text-sm text-gray-600">
            {displayText}
          </span>
          {!isOther && validCustomDecision && validCustomDecision !== decision && (
            <span className="block mt-1 text-sm text-gray-500 italic">
              {validCustomDecision}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestigationDecisionSection;
