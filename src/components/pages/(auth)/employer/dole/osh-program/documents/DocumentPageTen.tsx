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
              className="text-sm text-gray-700 prose prose-sm max-w-none [&>p]:mb-3 [&>ul]:ml-4 [&>ol]:ml-4 [&>li]:mb-1 [&>h1]:text-base [&>h1]:font-semibold [&>h1]:text-gray-900 [&>h1]:mb-2 [&>h2]:text-sm [&>h2]:font-medium [&>h2]:text-gray-900 [&>h2]:mb-2 [&>h3]:text-sm [&>h3]:font-medium [&>h3]:text-gray-900 [&>h3]:mb-1"
              dangerouslySetInnerHTML={{ __html: data.prohibited_acts_and_penalties_message }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentPageTen;
