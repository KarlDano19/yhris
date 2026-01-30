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
  // If decision is "Other", display custom decision instead
  const isOther = decision?.toLowerCase().includes('other');
  const displayText = isOther && customDecision ? customDecision : decision;

  return (
    <div className="border-t pt-4">
      <label className='block text-sm font-medium leading-6 text-gray-900'>
        Investigation Decision
      </label>
      <div className="mt-2 pl-2">
        <span className="text-sm text-gray-600">
          {displayText}
        </span>
        {!isOther && customDecision && customDecision !== decision && (
          <span className="block mt-1 text-sm text-gray-500 italic">
            {customDecision}
          </span>
        )}
      </div>
    </div>
  );
};

export default InvestigationDecisionSection;
