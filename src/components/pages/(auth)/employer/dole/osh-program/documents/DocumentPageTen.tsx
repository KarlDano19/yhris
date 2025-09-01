import React from 'react';

import { T_OshProgram } from '@/types/osh-program';

interface DocumentPageTenProps {
  data: T_OshProgram;
}

const DocumentPageTen: React.FC<DocumentPageTenProps> = ({ data }) => {
  return (
    <>
      {/* Top Section - Previous Section Headers */}
      <div id="document-page-10" className="mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          16.0 Compliance with Reportorial Government Requirements (refer to item 9.0)
        </h2>
        <h2 className="text-base font-bold text-gray-900 mb-2">
          17.0 Control and management of hazards.
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          Refer to accomplished HIRAC
        </p>
      </div>

      {/* Main Section: 18.0 Prohibited Acts and Penalties/sanctions */}
      <div className="mb-6 flex-1">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          18.0 Prohibited Acts and Penalties/sanctions for violations on OSH
        </h2>

        {/* Prohibited Acts and Penalties Content */}
        {data.prohibited_acts_and_penalties_message && (
          <div className="mb-6">
            <div 
              className="ql-editor !p-0 text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: data.prohibited_acts_and_penalties_message }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentPageTen;
