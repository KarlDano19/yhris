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
      <div id="document-page-12" className="mb-6">
        <h1 className="text-base font-bold text-gray-900 mb-4 text-center">
          ANNEX A: WORKPLACE POLICY AND PROGRAM ON PROMOTING WORKERS HEALTH AND ENSURING PREVENTION AND CONTROL OF HEALTH-RELATED ISSUES AND ILLNESS
        </h1>

        {data.annex_a_message && (
          <div 
            className="ql-editor !p-0 text-sm text-gray-700"
            dangerouslySetInnerHTML={{ __html: data.annex_a_message }}
          />
        )}
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
