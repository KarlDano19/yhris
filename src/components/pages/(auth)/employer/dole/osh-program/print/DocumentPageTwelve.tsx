import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageTwelveProps {
  data: T_OshProgram;
}

const DocumentPageTwelve: React.FC<DocumentPageTwelveProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      {/* Main Content - Annex A Policy */}
      <div className="mb-6">
        <h1 className="text-base font-bold text-gray-900 mb-4 text-center">
          ANNEX A: WORKPLACE POLICY AND PROGRAM ON PROMOTING WORKERS HEALTH AND ENSURING PREVENTION AND CONTROL OF HEALTH-RELATED ISSUES AND ILLNESS
        </h1>

        {/* Company Commitment */}
        <p className="text-sm text-gray-700 mb-4">
          {data.company_name || 'EL FUERTE SECURTY AGENCY'} is committed to promote and ensure a healthy and safe working environment through its various health programs for its employees. We shall conform to the all issuances and laws that guarantee workers health and safety at all times.
        </p>

        {/* Company Programs and Activities */}
        <p className="text-sm text-gray-700 mb-2">
          Worker&apos;s health is maintained through:
        </p>
        <ul className="list-none pl-4 space-y-1 mb-4">
          <li className="text-sm text-gray-700">a) Orientation and education of employees</li>
          <li className="text-sm text-gray-700">b) Access to reliable information on illness and hazards at work</li>
          <li className="text-sm text-gray-700">c) Referral to medical experts for diagnosis and management of illness or health-related concerns</li>
          <li className="text-sm text-gray-700">d) Provision of health-related programs such as proper nutrition and exercise activities.</li>
        </ul>

        {/* Compliance with Government Issuances */}
        <p className="text-sm text-gray-700 mb-4">
          The programs comply with Government issuances on promoting healthy lifestyle, addressing mental health in the workplace, and preventing and controlling substance abuse.
        </p>

        {/* Workers' Rights */}
        <p className="text-sm text-gray-700 mb-2">
          The following workers&apos; rights arising from illness are guaranteed and promoted:
        </p>
        <ul className="list-none pl-4 space-y-1 mb-4">
          <li className="text-sm text-gray-700">a) Confidentiality of information</li>
          <li className="text-sm text-gray-700">b) Non-discrimination including non-termination</li>
          <li className="text-sm text-gray-700">c) Work accommodation following a course of illness</li>
          <li className="text-sm text-gray-700">d) Assistance to compensation</li>
        </ul>

        {/* Policy Purpose */}
        <p className="text-sm text-gray-700 mb-6">
          This policy is formulated for everybody&apos;s information. The company is committed to ensuring workers&apos; health and providing a healthy and safe workplace.
        </p>
      </div>

      {/* Signature Block */}
      <div className="mb-6">
        <div className="flex justify-between items-end">
          <div className="flex-1 mr-8">
            <div className="flex items-center mb-5">
              <span className="text-sm font-medium text-gray-700 mr-2">DATE:</span>
              <div className="border-b border-gray-300 flex-1 pb-1 min-h-[16px text-center">
                {formatDate(data.date_filled) || ''}
              </div>
            </div>
            <div className="border-b border-gray-400 pb-1 mb-2 min-h-[20px] text-center">
              {data.name_of_owner_manager || ''}
            </div>
            <p className="text-sm text-gray-700 text-center">Owner/Manager</p>
          </div>
          <div className="flex-1">
            <div className="border-b border-gray-400 pb-1 mb-2 min-h-[20px] text-center">
              {data.employees_representative || ''}
            </div>
            <p className="text-sm text-gray-700 text-center">Employees&apos; Representative</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentPageTwelve;
